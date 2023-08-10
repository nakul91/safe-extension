import { globalGetService } from "../../../utils/globalApiServices";

export function getWalletBalanceApi(chainId: string = "base-testnet", address: string) {
  return new Promise((resolve, reject) => {
    globalGetService(`${chainId}/address/${address}/balances_v2/`, {})
      .then((response) => resolve(response.data))
      .catch((e) => reject(e));
  });
}
