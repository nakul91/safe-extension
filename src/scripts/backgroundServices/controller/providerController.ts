import { serializeError } from "eth-rpc-errors";

import { CHAINS_IDS } from "../../../constants";
import { ETHEREUM_REQUESTS } from "../../constants";
import { notification } from "../../webapi";
import { walletController } from "..";
import { jsonRPC } from "../apiServices/";
import { SignTypedDataVersion } from "@metamask/eth-sig-util";

const IMP_RPC_LOGS = [
  ETHEREUM_REQUESTS.sendRawTransaction,
  ETHEREUM_REQUESTS.estimateGas,
  ETHEREUM_REQUESTS.sendTransaction,
  ETHEREUM_REQUESTS.signTypedData,
  ETHEREUM_REQUESTS.signTypedDataV1,
  ETHEREUM_REQUESTS.signTypedDataV3,
  ETHEREUM_REQUESTS.signTypedDataV4,
  ETHEREUM_REQUESTS.getTransactionByHash,
  ETHEREUM_REQUESTS.getTransactionReceipt,
];
class ProviderController {
  generalEthRpc = async (requestType: ETHEREUM_REQUESTS, params: Array<Record<string, string>>) => {
    const response: any = await jsonRPC.request(requestType, params);
    if (response.error) {
      return response;
    }
    return response?.result;
  };

  ethAccounts = async (params: { origin: string }) => {
    if (params.origin && walletController.siteApproved(params.origin)) {
      const {
        selectedChain: { address, chain },
      } = await walletController?.getSelectedWallet();

      return [address.toLowerCase()];
    } else {
      return [];
    }
  };

  walletGetPermissions = () => {
    return [
      {
        parentCapability: "eth_accounts",
      },
    ];
  };
  walletRequestPermissions = () => {
    return [
      {
        parentCapability: "eth_accounts",
      },
    ];
  };

  ethChainId = async () => {
    const chain = (await walletController.getCurrentWallet())?.selectedChain?.chain ?? "";
    const customChains = await walletController.getCustomChains();
    const editedChains = await walletController.getEditedNetworks();
    if (!chain) {
      console.error("Chain Id doesn't exist");
    }
    const chainId = "0x0";
    if (chainId.startsWith("0x0")) {
      return chainId.replace("0x0", "0x");
    }
    return chainId;
  };

  netVersion = async () => {
    const chain = (await walletController.getCurrentWallet())?.selectedChain?.chain ?? "";
    const customChains = await walletController.getCustomChains();
    const editedChains = await walletController.getEditedNetworks();
    if (!chain) {
      console.error("Network Version doesn't exist");
    }
  };
  ethBlockNumber = () => this.generalEthRpc(ETHEREUM_REQUESTS.blockNumber, []);
  ethGetBalance = async (params: Array<Record<string, string>>) =>
    this.generalEthRpc(ETHEREUM_REQUESTS.getBalance, params);
  ethCall = (params: Array<Record<string, string>>) => this.generalEthRpc(ETHEREUM_REQUESTS.call, params);
  ethGetCode = (params: Array<Record<string, string>>) => this.generalEthRpc(ETHEREUM_REQUESTS.getCode, params);
  ethGetTransactionCount = (params: Array<Record<string, string>>) =>
    this.generalEthRpc(ETHEREUM_REQUESTS.getTransactionCount, params);
  ethEstimateGas = (params: Array<Record<string, string>>) => this.generalEthRpc(ETHEREUM_REQUESTS.estimateGas, params);
  ethGasPrice = () => this.generalEthRpc(ETHEREUM_REQUESTS.getGasPrice, []);
  ethGetLogs = (params: Array<Record<string, string>>) => this.generalEthRpc(ETHEREUM_REQUESTS.getLogs, params);
  ethSendTransaction = async (params: Array<Record<string, string>>) => {
    const response: any = await jsonRPC.request(ETHEREUM_REQUESTS.sendTransaction, params);
    return response?.blockHash ?? "";
  };
  ethGetEncryptionPublicKey = (params: Array<Record<string, string>>) => {
    return walletController.getSelectedWalletPublicKey(params);
  };
  ethGetBlockByNumber = (params: Array<Record<string, string>>) =>
    this.generalEthRpc(ETHEREUM_REQUESTS.getBlockByNumber, params);
  ethSendRawTransaction = (params: Array<Record<string, string>>) =>
    this.generalEthRpc(ETHEREUM_REQUESTS.sendRawTransaction, params);
  ethGetTransactionByHash = (params: Array<Record<string, string>>) =>
    this.generalEthRpc(ETHEREUM_REQUESTS.getTransactionByHash, params);
  ethGetTransactionReceipt = (params: Array<Record<string, string>>) =>
    this.generalEthRpc(ETHEREUM_REQUESTS.getTransactionReceipt, params);
  ethDecrypt = (params: Array<Record<string, string>>) => walletController.decrypt(params);
  personalSign = (params: Array<string>) => walletController.personalSign(params);
  personalEcRecover = (params: Array<string>) => walletController.personalEcRecover(params);
  ethSignTypedData = (params: Array<Record<string, string>>) =>
    walletController.signTypedData(params, SignTypedDataVersion.V1);
  ethSignTypedDataV1 = (params: Array<Record<string, string>>) =>
    walletController.signTypedData(params, SignTypedDataVersion.V1);
  ethSignTypedDataV3 = (params: Array<Record<string, string>>) =>
    walletController.signTypedData(params, SignTypedDataVersion.V3);
  ethSignTypedDataV4 = (params: Array<Record<string, string>>) =>
    walletController.signTypedData(params, SignTypedDataVersion.V4);
}

export default new ProviderController();
