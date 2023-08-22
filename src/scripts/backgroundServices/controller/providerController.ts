import { ETHEREUM_REQUESTS } from "../../constants";
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
    if (params.origin) {
      const address = await walletController?.getSelectedWallet();
      return ["0x2282B6bAbee6889735903D0ED651cb3c2b4A21Ba"];
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
    const chainId = "0x14a33";
    return chainId;
  };

  netVersion = async () => {
    return "84531";
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
