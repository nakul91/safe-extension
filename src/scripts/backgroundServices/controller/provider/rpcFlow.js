import base58 from "bs58";
import Web3 from "web3";
import {
  APPROVAL_URL,
  APP_STATE,
  CHAINS_ENUMS,
  CHAINS_IDS,
} from "../../../../constants";
import {
  BROADCAST_REQUEST,
  COSMOS_REQUESTS,
  ETHEREUM_REQUESTS,
  SOLANA_REQUESTS,
  SUI_REQUESTS,
  WALLET_REQUESTS,
} from "../../../constants";
import { notificationService, sessionService, walletController } from "../..";
import { hexToNumber } from "../../../../utils";
import PromiseFlow from "../../promiseFlow";
import ethSigner from "../../signers/ethSigner";
import sitePermissionService from "../../sitePermissionService";
import providerController from "../providerController";
import { isStartsFrom0x, localStore } from "../../../../utils";
import { ethErrors } from "eth-rpc-errors";

const flow = new PromiseFlow();

const DEFAULT_SITE_DATA = {
  origin: "",
  name: "",
  icon: "",
  isSigned: false,
  isTop: false,
  isConnected: true,
  value: "",
  from: "",
  to: "",
  data: "",
};

const popupDimensions = {
  width: 420,
  height: 720,
};

const flowContext = flow
  .use(async (ctx) => {
    let {
      data: { method, params },
      session: { icon, name, origin },
    } = ctx.request;
    ctx.request.requestedApproval = true;
    let pageData = {
      origin,
      name,
      icon,
      chain: CHAINS_ENUMS.ETHEREUM,
      isMultipleTransaction: false,
      isHardwareWallet: false,
      hardwareWalletType: "",
      hardwareWalletData: {},
    };
    if (
      [
        ETHEREUM_REQUESTS.requestAccounts,
        ETHEREUM_REQUESTS.legacyEnable,
      ]?.includes(method)
    ) {
      const currentWallet = await walletController.getCurrentWallet();

      return new Promise((resolve, reject) => {
        if (walletController.siteApproved(origin)) {
          walletController?.getSelectedWallet().then(async (res) => {
            if (res) {
              resolve([currentWallet.selectedChain.address?.toLowerCase()]);
            }
          });
        } else {
          const siteData = { ...DEFAULT_SITE_DATA, origin, name, icon };
          notificationService
            .requestApproval(
              {
                method,
                params: { origin, name, icon },
                approvalComponent: "ConnectDapp",
                chainId: params?.chainId ?? "",
              },
              {
                route: APPROVAL_URL,
                width: 420,
                height: 670,
              }
            )
            .then(async (res) => {
              try {
                sitePermissionService.setSite(siteData);
              } catch (err) {
                console.error(err);
              }
              resolve([currentWallet.selectedChain.address?.toLowerCase()]);
            })
            .catch((err) => {
              console.log("rpc rejection", true);
              reject(err);
            });
        }
      });
    } else if (ETHEREUM_REQUESTS.sendTransaction === method) {
      Object.keys(params[0]).forEach((key) => {
        pageData[key] = params[0][key];
      });

      const currentWalletData = await walletController.getCurrentWallet();

      if (currentWalletData.isHardware) {
        pageData.isHardwareWallet = true;
        pageData.hardwareWalletType = currentWalletData.hardwareType;
        pageData.hardwareWalletData = currentWalletData;
      }

      return new Promise((resolve, reject) => {
        notificationService
          .requestApproval(
            {
              method,
              params: pageData,
              approvalComponent: "AccessToken",
            },
            {
              route: APPROVAL_URL,
              width: 420,
              height: popupDimensions.height,
            }
          )
          .then(
            async ({
              gasPrice,
              gasLimit,
              estTime,
              nonce,
              isSigned,
              signedHash,
              isApprovalRequired,
              allowanceData,
            }) => {
              const { gas, value, from, to, data } = pageData;
              let signedEthHash = "";
              if (isSigned) {
                signedEthHash = signedHash;
              } else {
                signedEthHash = await ethSigner.signEthTransaction(
                  walletController,
                  {
                    gas,
                    value,
                    from,
                    to,
                    data,
                    gasPrice,
                    gasLimit,
                    estTime,
                    nonce,
                    isApprovalRequired,
                    allowanceData,
                  }
                );
              }
              try {
                const rawTransaction =
                  await providerController.ethSendRawTransaction([
                    signedEthHash,
                  ]);
                if (rawTransaction?.error) {
                  throw new Error(rawTransaction?.error);
                } else {
                  resolve(rawTransaction);
                }
              } catch (err) {
                throw new Error(rawTransaction?.error);
              }
            }
          )
          .catch((err) => {
            resolve(err);
          });
      });
    } else if (ETHEREUM_REQUESTS.getEncryptionPublicKey === method) {
      return new Promise((resolve, reject) => {
        notificationService
          .requestApproval(
            {
              method,
              params: { origin, name, icon },
              approvalComponent: "AccessPublicKey",
            },
            {
              route: APPROVAL_URL,
            }
          )
          .then((res) => {
            if (res) {
              const publicKey =
                walletController.getSelectedWalletPublicKey(params);
              resolve(publicKey);
            } else {
              reject("Unable to fetch public key");
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else if (ETHEREUM_REQUESTS.decrypt === method) {
      return new Promise((resolve, reject) => {
        walletController.decrypt(params).then((rs) => {
          notificationService
            .requestApproval(
              {
                method,
                params: {
                  origin,
                  name,
                  icon,
                  decryptedCode: rs,
                },
                approvalComponent: "DecryptPrivateKey",
              },
              {
                route: APPROVAL_URL,
              }
            )
            .then((res) => {
              if (res) {
                resolve(rs);
              } else {
                reject("Unable to fetch public key");
              }
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    } else if (
      [
        ETHEREUM_REQUESTS.personalSign,
        ETHEREUM_REQUESTS.signTypedData,
        ETHEREUM_REQUESTS.signTypedDataV1,
        ETHEREUM_REQUESTS.signTypedDataV3,
        ETHEREUM_REQUESTS.signTypedDataV4,
        SOLANA_REQUESTS.signMessage,
        COSMOS_REQUESTS.signArbitrary,
        SUI_REQUESTS.signMessage,
      ]?.includes(method)
    ) {
      return new Promise((resolve, reject) => {
        let decodedMessage = "";
        if (method === ETHEREUM_REQUESTS.personalSign) {
          const [data] = params;
          try {
            decodedMessage = Web3.utils.hexToUtf8(data);
          } catch (err) {
            decodedMessage = data;
            console.log(err);
          }
        } else if (
          method === ETHEREUM_REQUESTS.signTypedData ||
          method === ETHEREUM_REQUESTS.signTypedDataV1
        ) {
          let [data] = params;
          let mutableData = [...data];
          decodedMessage = Array.isArray(mutableData)
            ? JSON.stringify(
                mutableData.reduce(
                  (acc, { name, value }) => ({
                    ...acc,
                    [name]: value,
                  }),
                  {}
                )
              )
            : data;
          if (decodedMessage == "" || decodedMessage == "{}") {
            for (const pramData of params) {
              try {
                let jsonData = JSON.parse(pramData);
                if (jsonData.message) {
                  jsonData = jsonData.message;
                }
                decodedMessage = JSON.stringify(jsonData);
              } catch (e) {
                console.log(e);
              }
            }
          }
        } else if (method === ETHEREUM_REQUESTS.signTypedDataV3) {
          const [, data] = params;
          decodedMessage = JSON.parse(data);
          if (decodedMessage.types) {
            delete decodedMessage.types;
          }
        } else if (method === ETHEREUM_REQUESTS.signTypedDataV4) {
          const [, data] = params;
          decodedMessage = JSON.parse(data);
          if (decodedMessage.types) {
            delete decodedMessage.types;
          }
        } else if (method === SOLANA_REQUESTS.signMessage) {
          const { message } = params;
          decodedMessage = new TextDecoder().decode(base58.decode(message));
        } else if (method === COSMOS_REQUESTS.signArbitrary) {
          decodedMessage = params?.[0]?.data?.data;
        } else if (method === COSMOS_REQUESTS.verifyArbitrary) {
          decodedMessage = params?.[0]?.data?.message;
        } else if (method === SUI_REQUESTS.signMessage) {
          const { message } = params;
          let msg = "";
          for (const code of Object.values(message)) {
            msg += String.fromCharCode(code);
          }
          decodedMessage = msg;
        }
        notificationService
          .requestApproval(
            {
              method,
              params: {
                origin,
                name,
                icon,
                decodedMessage,
                method,
                scanData:
                  method === ETHEREUM_REQUESTS.personalSign
                    ? params[0]
                    : params[1],
              },
              approvalComponent: "PrivateSign",
            },
            {
              route: APPROVAL_URL,
            }
          )
          .then(async (res) => {
            if (res) {
              let privateMessage;
              if (method === ETHEREUM_REQUESTS.personalSign) {
                privateMessage = providerController.personalSign(params);
              } else if (method === ETHEREUM_REQUESTS.signTypedData) {
                privateMessage = providerController.ethSignTypedData(params);
              } else if (method === ETHEREUM_REQUESTS.signTypedDataV1) {
                privateMessage = providerController.ethSignTypedDataV1(params);
              } else if (method === ETHEREUM_REQUESTS.signTypedDataV3) {
                privateMessage = providerController.ethSignTypedDataV3(params);
              } else if (method === ETHEREUM_REQUESTS.signTypedDataV4) {
                privateMessage = providerController.ethSignTypedDataV4(params);
              } else if (method === SOLANA_REQUESTS.signMessage) {
                privateMessage = solProviderController.signMessage(params);
              } else if (method === COSMOS_REQUESTS.verifyArbitrary) {
                const { signer, message, signature, publicKey, chainId } =
                  params?.[0]?.data;
                const customChains = await walletController.getCustomChains();
                const result = cosmosSigner.verifyArbitrary({
                  signer,
                  message,
                  signature,
                  publicKey,
                  chainId,
                  customChains,
                });
                privateMessage = result;
              } else if (method === SUI_REQUESTS.signMessage) {
                privateMessage = suiSigner.signSuiMessage(
                  walletController,
                  params
                );
              }
              resolve(privateMessage);
            } else {
              reject("Unable to fetch public key");
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else if (
      [
        SOLANA_REQUESTS.signTransaction,
        SOLANA_REQUESTS.signAndSendTransaction,
        SOLANA_REQUESTS.signAllTransactions,
      ]?.includes(method)
    ) {
      Object.keys(params[0]).forEach((key) => {
        pageData[key] = params[0][key];
      });
      pageData.chain = CHAINS_ENUMS.SOLANA;
      if (SOLANA_REQUESTS.signAllTransactions === method) {
        pageData.isMultipleTransaction = true;
      }

      return new Promise((resolve, reject) => {
        notificationService
          .requestApproval(
            {
              method,
              params: pageData,
              approvalComponent: "AccessToken",
            },
            {
              route: APPROVAL_URL,
              width: popupDimensions.width,
              height: popupDimensions.height,
            }
          )
          .then(async () => {
            const { from, message, isVersionTx } = pageData;
            let signedSolHash = "";
            if (method === SOLANA_REQUESTS.signTransaction) {
              signedSolHash = await solSigner.signSolTransaction(
                walletController,
                {
                  message,
                  from,
                  isVersionTx,
                }
              );
            } else if (method === SOLANA_REQUESTS.signAndSendTransaction) {
              signedSolHash = await solSigner.signAndSendTransaction(
                walletController,
                { from, message }
              );
            } else {
              const multipleParams = params.map((prm) => {
                const { from, message } = prm;
                return solSigner.signSolTransaction(walletController, {
                  message,
                  from,
                });
              });
              signedSolHash = await Promise.all(multipleParams);
            }

            resolve(signedSolHash);
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else if (
      [
        SUI_REQUESTS.signTransactionBlock,
        SUI_REQUESTS.signAndExecuteTransactionBlock,
      ]?.includes(method)
    ) {
      pageData.from = params?.account[0]?.address ?? "";
      return new Promise((resolve, reject) => {
        notificationService
          .requestApproval(
            {
              method,
              params: pageData,
              approvalComponent: "AccessToken",
            },
            {
              route: APPROVAL_URL,
              width: popupDimensions.width,
              height: popupDimensions.height,
            }
          )
          .then(async () => {
            let suiResponse;
            if (method === SUI_REQUESTS.signAndExecuteTransactionBlock) {
              suiResponse = await suiSigner.signAndExecuteTransactionBlock(
                walletController,
                {
                  transactionBlock: params.transactionBlock,
                  options: params.options,
                }
              );
            } else {
              suiResponse = await suiSigner.signTransactionBlock(
                walletController,
                {
                  transactionBlock: params.transactionBlock,
                }
              );
            }
            resolve(suiResponse);
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else if (
      [
        COSMOS_REQUESTS.signAmino,
        COSMOS_REQUESTS.signDirect,
        COSMOS_REQUESTS.sendTx,
      ]?.includes(method)
    ) {
      const customChains = await walletController.getCustomChains();
      const currentChain = await walletController.getCurrentSelectedChain(
        customChains
      );
      if (currentChain.chainId !== params[0]?.chainId) {
        const currentWallet = await walletController.getCurrentWallet();
        const acc = currentWallet.accounts.find(
          (acc) => acc.chainId === params[0]?.chainId
        );
        if (acc) {
          walletController.walletSwitchChain({
            chainId: params[0]?.chainId,
            origin: origin,
            address: acc.address,
          });
        }
      }

      if (method === COSMOS_REQUESTS.sendTx) {
        return new Promise(async (resolve, reject) => {
          const result = await cosmosSigner.broadCastTransaction(
            walletController,
            {
              chainId: params[0]?.chainId,
              data: params[0]?.data,
            }
          );
          resolve(result);
        });
      } else {
        if (method === COSMOS_REQUESTS.signAmino) {
          const {
            chainId,
            data: {
              signDoc: { account_number, chain_id, fee, memo, msgs, sequence },
              signOptions,
              signer,
            },
          } = params[0];
          pageData = {
            ...pageData,
            chain: chain_id,
            chainId: chain_id,
            gasFee: fee.gas,
            gasAmount: fee.amount?.[0]?.amount,
            denom: fee.amount?.[0]?.denom,
            value: msgs?.[0]?.value?.token_in
              ? msgs?.[0]?.value?.token_in?.amount / Math.pow(10, 6)
              : msgs?.[0]?.value?.amount?.[0]?.amount / Math.pow(10, 6),
            from: msgs?.[0]?.value?.from_address,
            to: msgs?.[0]?.value?.to_address,
            data: memo,
            accountNumber: account_number,
            sequence: sequence,
            memo: memo,
            msgType: msgs?.[0]?.type,
            msgValue: msgs?.[0]?.value,
            msgs: msgs,
          };

          if (!pageData.from) {
            pageData = {
              ...pageData,
              from: msgs?.[0]?.value?.sender,
              to: msgs?.[0]?.value?.sender,
            };
          }
        } else if (method === COSMOS_REQUESTS.signDirect) {
          const {
            chainId: chain,
            data: {
              accountNumber,
              authInfoBytes,
              bodyBytes,
              chainId,
              signOptions,
            },
          } = params[0];
          pageData = {
            accountNumber,
            chainId,
            authInfoBytes,
            bodyBytes,
            signOptions,
          };
        } else {
          pageData = { ...pageData };
        }
        return new Promise((resolve, reject) => {
          notificationService
            .requestApproval(
              {
                method,
                params: pageData,
                approvalComponent: "AccessToken",
              },
              {
                route: APPROVAL_URL,
                width: popupDimensions.width,
                height: popupDimensions.height,
              }
            )
            .then(async (res) => {
              let signedCosmosHash = "";
              if (method === COSMOS_REQUESTS.signAmino) {
                const {
                  accountNumber,
                  sequence,
                  chainId,
                  denom,
                  gasAmount,
                  gasFee,
                  msgType,
                  msgValue,
                  memo,
                  msgs,
                } = pageData;

                signedCosmosHash = await cosmosSigner.signAmino(
                  walletController,
                  {
                    accountNumber,
                    sequence,
                    chainId,
                    denom,
                    gasAmount,
                    gasFee,
                    msgType,
                    msgValue,
                    memo,
                    msgs,
                    gasLimit: String(res.gasLimit),
                    gasPrice: res.gasPrice,
                  }
                );
                resolve(signedCosmosHash);
              } else {
                const {
                  accountNumber,
                  chainId,
                  authInfoBytes,
                  bodyBytes,
                  signOptions,
                } = pageData;
                signedCosmosHash = await cosmosSigner.signDirect(
                  walletController,
                  {
                    accountNumber,
                    chainId,
                    authInfoBytes,
                    bodyBytes,
                    signOptions,
                  }
                );
                resolve(signedCosmosHash);
              }
            })
            .catch((err) => {
              reject(err);
            });
        });
      }
    } else if (
      [
        WALLET_REQUESTS.addEthereumChain,
        WALLET_REQUESTS.switchEthereumChain,
        WALLET_REQUESTS.switchChain,
        WALLET_REQUESTS.addCosmosChain,
      ]?.includes(method)
    ) {
      return await switchChain({ params, method, origin, name, icon });
    }
  })
  .callback();

export default (request) => {
  const ctx = { request: { ...request, requestedApproval: false } };
  try {
    localStore.remove(APP_STATE);
  } catch (err) {
    console.error(err);
  }
  return flowContext(ctx).finally(() => {
    if (ctx.request.requestedApproval) {
      flow.requestedApproval = false;
    }
  });
};

const switchChain = async ({ params, method, origin, name, icon }) => {
  const customChains = await walletController.getCustomChains();
  const editedChains = await walletController.getEditedNetworks();
  const currentChain = await walletController.getCurrentSelectedChain(
    customChains
  );
  const currentWallet = await walletController.getCurrentWallet();
  return new Promise(async (resolve, reject) => {
    let chainId = params[0].chainId;
    if (typeof chainId === "number") {
      chainId = chainId.toString(16).toLowerCase();
    } else {
      chainId = chainId.toLowerCase();
    }
    const isChainExistinWallet = currentWallet.accounts.find((acc) => {
      const _chainId = isStartsFrom0x(chainId)
        ? String(hexToNumber(chainId))
        : chainId;
      return acc.chainId === _chainId;
    });

    let requestedChain = {};
    const _chainId = isStartsFrom0x(chainId)
      ? String(hexToNumber(chainId))
      : chainId;

    let isRequestedChainEnabled = false;
    let isChainSupported = true;

    if (!isChainExistinWallet) {
      requestedChain = undefined;
      isChainSupported = false;
    }

    if (!requestedChain) {
      isChainSupported = false;
    } else {
      isRequestedChainEnabled = currentWallet.accounts.find(
        (chain) => chain.chainId === _chainId
      ).status;
    }

    if (
      method === WALLET_REQUESTS.addEthereumChain ||
      (method === WALLET_REQUESTS.switchEthereumChain && params[0].isEVM)
    ) {
      const existingEthChain = currentWallet.accounts.find((chain) => true);
      if (!existingEthChain) {
        reject(
          ethErrors.provider.custom({
            code: 4200,
            message: "Method not supported.",
          })
        );
        return;
      }
    }

    if (!isRequestedChainEnabled && requestedChain) {
      sessionService.broadcastEvent(
        BROADCAST_REQUEST.chainDisabled,
        params[0].chainId
      );
      resolve(null);
      return;
    }

    let requestedChainId = "";

    if (requestedChain && requestedChain.id) {
      requestedChainId = requestedChain.id;
    }

    if (isChainSupported && currentChain?.id === requestedChainId) {
      resolve(null);
      return;
    }

    if (!isChainExistinWallet || !requestedChain) {
      requestedChain = params[0];
      notificationService
        .requestApproval(
          {
            method,
            params: {
              origin,
              name,
              icon,
              requestedChain,
              currentChain,
              height: 600,
              isChainSupported,
              isRequestedChainEnabled,
              method,
            },
            approvalComponent: "SwitchNetwork",
          },
          {
            route: APPROVAL_URL,
          }
        )
        .then(async (rs) => {
          if (rs) {
            finalSwitchResolver();
          } else {
            reject(rs);
          }
        })
        .catch((err) => {
          resolve(err);
        });
    } else {
      finalSwitchResolver();
    }

    async function finalSwitchResolver() {
      let _params = { chainId, origin };
      _params.address = (await walletController.getCurrentWallet()).accounts
        .find((wallet) =>
          wallet.chainId === isStartsFrom0x(requestedChain.chainId)
            ? String(hexToNumber(requestedChain.chainId))
            : requestedChain.chainId
        )
        .address.toLowerCase();
      await walletController.walletSwitchChain(_params);
      resolve(null);
    }
  });
};
