/* eslint-disable @typescript-eslint/ban-ts-comment */
import { underline2Camelcase } from "../../../../utils";
import {
  COMMUNICATION_PAGES,
  ETHEREUM_REQUESTS,
  SOLANA_REQUESTS,
  WALLET_REQUESTS,
  COSMOS_REQUESTS,
  SUI_REQUESTS,
} from "../../../constants";
import { IBroadcastRequest } from "../../../script_types";
import { internalRequest, walletController } from "../..";
import providerController from "../providerController";
import rpcFlow from "./rpcFlow";

export interface IReq {
  data: IBroadcastRequest<any>;
  session: any;
}

const NON_APPROVAL_FLOWS = [
  ETHEREUM_REQUESTS.accounts,
  ETHEREUM_REQUESTS.chainId,
  ETHEREUM_REQUESTS.blockNumber,
  ETHEREUM_REQUESTS.estimateGas,
  ETHEREUM_REQUESTS.getGasPrice,
  ETHEREUM_REQUESTS.call,
  ETHEREUM_REQUESTS.getCode,
  ETHEREUM_REQUESTS.getBalance,
  ETHEREUM_REQUESTS.getBlockByNumber,
  ETHEREUM_REQUESTS.getTransactionCount,
  ETHEREUM_REQUESTS.getTransactionByHash,
  ETHEREUM_REQUESTS.getTransactionReceipt,
  ETHEREUM_REQUESTS.netVersion,
  ETHEREUM_REQUESTS.getLogs,
  ETHEREUM_REQUESTS.ecRecover,
  WALLET_REQUESTS.getPermissions,
  WALLET_REQUESTS.requestPermissions,
  // solana requests
  SOLANA_REQUESTS.getSolAccount,
  SOLANA_REQUESTS.getBalance,
  SOLANA_REQUESTS.getLatestBlockhash,
  SOLANA_REQUESTS.getTransactionCount,
  SOLANA_REQUESTS.disconnectSolAccount,
  // cosmos requests
  COSMOS_REQUESTS.account,
  COSMOS_REQUESTS.disconnectCosAccount,
  // sui requests
  SUI_REQUESTS.getSuiAccount,
  SUI_REQUESTS.disconnectSuiAccount,
];

const APPROVAL_FLOWS = [
  ETHEREUM_REQUESTS.requestAccounts,
  ETHEREUM_REQUESTS.legacyEnable,
  ETHEREUM_REQUESTS.sendTransaction,
  ETHEREUM_REQUESTS.getEncryptionPublicKey,
  ETHEREUM_REQUESTS.decrypt,
  ETHEREUM_REQUESTS.personalSign,
  ETHEREUM_REQUESTS.signTypedData,
  ETHEREUM_REQUESTS.signTypedDataV1,
  ETHEREUM_REQUESTS.signTypedDataV3,
  ETHEREUM_REQUESTS.signTypedDataV4,
  // solana requests
  SOLANA_REQUESTS.signMessage,
  SOLANA_REQUESTS.requestSolAccount,
  SOLANA_REQUESTS.getSolAccount,
  SOLANA_REQUESTS.signAndSendTransaction,
  SOLANA_REQUESTS.signTransaction,
  SOLANA_REQUESTS.signAllTransactions,
  // wallet requests
  WALLET_REQUESTS.switchEthereumChain,
  WALLET_REQUESTS.addEthereumChain,
  WALLET_REQUESTS.addCosmosChain,
  WALLET_REQUESTS.switchChain,
  // cosmos requests
  COSMOS_REQUESTS.requestCosAccount,
  COSMOS_REQUESTS.signAmino,
  COSMOS_REQUESTS.signDirect,
  COSMOS_REQUESTS.sendTx,
  COSMOS_REQUESTS.signArbitrary,
  COSMOS_REQUESTS.verifyArbitrary,
  // sui requests
  SUI_REQUESTS.requestSuiAccount,
  SUI_REQUESTS.signAndExecuteTransactionBlock,
  SUI_REQUESTS.signMessage,
  SUI_REQUESTS.signTransactionBlock,
];

export default (req: IReq): any => {
  if (req.data.sender === COMMUNICATION_PAGES.internalRequest) {
    const {
      data: { method, params },
    } = req;
    // @ts-ignore
    return internalRequest[method]?.call(null, params);
  } else {
    const {
      data: { method, params },
    } = req;

    const checkReq =
      (method as ETHEREUM_REQUESTS) ||
      (method as SOLANA_REQUESTS) ||
      (method as COSMOS_REQUESTS) ||
      (method as SUI_REQUESTS);

    if (!walletController.siteApproved(req.session.origin)) {
      if (
        ![
          ETHEREUM_REQUESTS.requestAccounts,
          ETHEREUM_REQUESTS.accounts,
          ETHEREUM_REQUESTS.chainId,
          ETHEREUM_REQUESTS.netVersion,
          SOLANA_REQUESTS.requestSolAccount,
          SOLANA_REQUESTS.getSolAccount,
          COSMOS_REQUESTS.account,
          COSMOS_REQUESTS.requestCosAccount,
          SUI_REQUESTS.getSuiAccount,
          SUI_REQUESTS.requestSuiAccount,
          WALLET_REQUESTS.addEthereumChain,
          WALLET_REQUESTS.addCosmosChain,
          WALLET_REQUESTS.switchEthereumChain,
          WALLET_REQUESTS.switchChain,
        ]?.includes((method as ETHEREUM_REQUESTS) || SOLANA_REQUESTS || COSMOS_REQUESTS || SUI_REQUESTS)
      ) {
        return [];
      }
    }
    if (NON_APPROVAL_FLOWS.includes(checkReq)) {
      const _method = underline2Camelcase(method);
      let _params = params;

      const {
        session: { origin },
      } = req;
      if (
        [
          ETHEREUM_REQUESTS.accounts,
          SOLANA_REQUESTS.disconnectSolAccount,
          COSMOS_REQUESTS.disconnectCosAccount,
          SUI_REQUESTS.disconnectSuiAccount,
        ]?.includes(method as SOLANA_REQUESTS | ETHEREUM_REQUESTS | COSMOS_REQUESTS | SUI_REQUESTS)
      ) {
        _params = { origin };
      }

      // @ts-ignore
      return providerController[_method]?.call(null, _params);
    } else if (APPROVAL_FLOWS?.includes(checkReq)) {
      return rpcFlow(req);
    } else {
      console.log(method, req, -"not implemented");
    }
  }
};
