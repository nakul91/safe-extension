import { globalGetService } from "../../../utils/globalApiServices";

export function getWalletBalanceApi(chainName: string = "base-testnet", address: string) {
  return new Promise((resolve, reject) => {
    // const testAddress = "0x06e70f295B6337c213DDe82D13cc198027687A7B";
    // const testChain = "eth-mainnet";
    globalGetService(`${chainName}/address/${address}/balances_v2/`, { nft: true })
      .then((response) => resolve(response.data))
      .catch((e) => reject(e));
  });
}

export function getAllTransactionApi(chainName: string = "base-testnet", address: string, page: number = 0) {
  return new Promise((resolve, reject) => {
    // const testAddress = "0x06e70f295B6337c213DDe82D13cc198027687A7B";
    // const testChain = "matic-mainnet";
    globalGetService(`${chainName}/address/${address}/transactions_v3/page/${page}/`, {})
      .then((response) => resolve(response.data))
      .catch((e) => reject(e));
  });
}
