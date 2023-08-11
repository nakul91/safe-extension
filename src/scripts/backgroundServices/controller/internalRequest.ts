import { CHAINS_IDS } from "../../../constants";
import { getBroadcastChainId, hexToNumber, isStartsFrom0x, stringToHex } from "../../../utils";
import { CHAIN_STATUS } from "../../constants";
import { walletController } from "..";

class InternalRequest {
  async getSelectedChain() {
    const {
      selectedChain: { address, chainId },
    } = await walletController.getCurrentWallet();
    const accounts = [address.toLowerCase()];
    const chain = getBroadcastChainId(chainId ?? "");
    const networkVersion = chainId;
    return {
      accounts,
      networkVersion,
      chain,
    };
  }
  async isDefaultWallet() {
    const data = await walletController.getData();
    if (data?.PreferencesController?.canOverrideWallet) {
      return data.PreferencesController.canOverrideWallet;
    }
    return false;
  }
  isSiteConnected(origin: string) {
    return walletController.siteApproved(origin);
  }
  isSiteConnectionEstablished(origin: Array<string>) {
    return walletController.siteConnected(origin[0]);
  }
  async chainExistInWallet(chainIdCheck: string) {
    let chainStatus = CHAIN_STATUS.NOT_EXIST;
    const _chainIdCheck = isStartsFrom0x(chainIdCheck) ? String(hexToNumber(chainIdCheck)) : chainIdCheck;
    const chainAccounts = (await walletController.getCurrentWallet()).accounts;
    chainAccounts.forEach(({ chainId, status }: { chainId: string; status: string }) => {
      const _chainId = isStartsFrom0x(chainId) ? String(hexToNumber(chainId)) : chainId;
      if (_chainId == _chainIdCheck) {
        chainStatus = status ? CHAIN_STATUS.EXIST : CHAIN_STATUS.DISABLED;
      }
    });
    return chainStatus;
  }

  async isEvmChain() {
    const selectedChain = (await walletController.getCurrentWallet()).selectedChain.chain as CHAINS_IDS;
    const customChains = await walletController.getCustomChains();
  }

  async getData() {
    return walletController.getData();
  }

  async getWalletDetails() {
    const result = await walletController.getCurrentWallet();
    return result;
  }

  async getCosmosCustomChains() {
    const result = await walletController.getCustomChains();
    return result;
  }
}

export default new InternalRequest();
