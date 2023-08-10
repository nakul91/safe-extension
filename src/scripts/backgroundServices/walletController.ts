/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IExtensionData, IWalletController, TChangePasswordType, TFirstTimeFlow } from "../../constants";
import { CHAINS_ENUMS, CHAINS_IDS } from "../../constants";
import { getBroadcastChainId } from "../../utils";
import { IConnectedSite } from "../../utils/wallet/types";
import { BROADCAST_REQUEST } from "../constants";
import { notificationService, sessionService, sitePermissionService, storeService } from ".";
import { TTimeoutoptions } from "./alarms";
import { jsonRPC } from "./apiServices";
import providerController from "./controller/providerController";
import ethSigner, { IMessageTypes, ITypedMessage, TTypedDataV1 } from "./signers/ethSigner";
import { Buffer } from "buffer";
import { signTypedData as metamaskSignTypedData, SignTypedDataVersion } from "@metamask/eth-sig-util";
class WalletController {
  private getPrivateKey = async () => {
    let chain = (await this.getCurrentWallet())?.selectedChain?.chain ?? "";
    const customChains = await this.getCustomChains();
    const editedChains = (await this?.getEditedNetworks()) ?? [];
    const isCustomChain = true;
    if (isCustomChain) {
      chain = CHAINS_IDS.ETHEREUM;
    }
    const privateKey = (await this.getKeyRings())[chain].private;
    return privateKey;
  };
  getApproval = notificationService.getApproval;

  resolveApproval = notificationService.resolveApproval;

  rejectApproval = (err?: string, stay = false, isInternal = false, code?: number) => {
    return notificationService.rejectApproval(err, stay, isInternal, code);
  };

  closeWindow = notificationService.clear;

  getSelectedChain = async () => {
    return (await this.getSelectedWallet())?.selectedChain?.chain ?? "";
  };

  getSelectedWallet = async () => {
    return this.getCurrentWallet();
  };

  setWalletData = async (data: IExtensionData) => {
    this.setStoreWalletData(data);
  };

  submitPassword = (password: string) => {
    jsonRPC.init();
    return storeService.submitPassword(password);
  };

  isUnlocked = (): boolean => {
    return storeService.isUnlocked();
  };

  lock = () => {
    return storeService.lock();
  };

  getKeyRings = () => {
    return storeService.getKeyRings();
  };
  getAllKeyRings() {
    return storeService.getAllKeyRings();
  }

  getCurrentWallet = () => {
    return storeService.getCurrentWallet() as Promise<IWalletController>;
  };

  setStoreWalletData = (data: IExtensionData) => {
    return storeService.setStoreWalletData(data);
  };

  getAutoTimerLock = (timer: TTimeoutoptions) => {
    return storeService.getAutoLockTimer();
  };

  setAutoTimerLock = (timer: TTimeoutoptions) => {
    return storeService.setAutoTimerLock(timer);
  };

  getWallets = () => {
    return storeService.getWallets();
  };

  getCurrentSite = (tabId: number, domain: string): IConnectedSite | null => {
    const { origin, name, icon } = sessionService.getSession(`${tabId}-${domain}`) || {};
    if (!origin) {
      return null;
    }
    const site = sitePermissionService.getSite(origin);
    if (site) {
      return site;
    }
    return {
      origin,
      name: name,
      icon: icon,
      chain: CHAINS_ENUMS.ETHEREUM,
      isConnected: false,
      isSigned: false,
      isTop: false,
    };
  };

  getAllConnectedSites = sitePermissionService.getAllConnectedSites;

  removeConnectedSite = (origin: string) => {
    sessionService.broadcastEvent(BROADCAST_REQUEST.accountsChanged, [], origin);
    sitePermissionService.removeSite(origin);
  };

  siteApproved = (origin: string) => {
    const siteData = sitePermissionService?.getSite(origin);
    return siteData?.origin === origin;
  };

  siteConnected = (origin: string) => {
    if (!origin) {
      return false;
    }
    const siteData = sitePermissionService?.getSite(origin);
    if (siteData?.origin) {
      return siteData?.origin === origin;
    } else {
      return false;
    }
  };

  async addEncryptedData(data: any, pass: string) {
    return await storeService.addEncryptedData(data, pass);
  }

  async addWalletAddress(data: any) {
    return await storeService.addWalletAddress(data);
  }

  async onboardingCompleted(state: boolean) {
    return await storeService.onboardingCompleted(state);
  }

  async updateOverrideWallet(canOverrideWallet: boolean) {
    return await storeService.updateOverrideWallet(canOverrideWallet);
  }

  async setFirstTimeFlow(flow: TFirstTimeFlow) {
    return await storeService.setFirstTimeFlow(flow);
  }

  async setFCMToken(token: string) {
    return await storeService.addFcmToken(token);
  }

  async getData() {
    return await storeService.getData();
  }

  changePassword(pwdObj: TChangePasswordType) {
    return storeService.passUpdate(pwdObj);
  }

  async getSelectedWalletPublicKey(params: Array<Record<string, string>>) {
    try {
      const privateKey = await this.getPrivateKey();
      return ethSigner.encryptionPublicKey(privateKey);
    } catch (err) {
      console.log(err);
    }
  }

  async personalEcRecover(params: Array<string>) {
    const [data, signature, extra = {}] = params;
    return ethSigner.recoverPersonalSignature({ data, signature, ...extra });
  }

  async personalSign(params: Array<string>) {
    try {
      const [data] = params;
      const privateKey = await this.getPrivateKey();
      const signedResult = ethSigner.personalSign({ privateKey, data }) ?? "";
      return signedResult;
    } catch (err) {
      console.log(err);
    }
  }

  async decrypt(params: Array<Record<string, string>>) {
    try {
      const [encryptedData] = params as unknown as Array<string>;
      const privateKey = await this.getPrivateKey();
      return ethSigner.decrypt(encryptedData as string, privateKey);
    } catch (err) {
      console.log(err);
    }
  }

  async signTypedData(params: Array<Record<string, string>>, version: SignTypedDataVersion) {
    try {
      let data: TTypedDataV1 | ITypedMessage<IMessageTypes> = [],
        address = "";
      if (version === SignTypedDataVersion.V1) {
        [data] = params as unknown as Array<TTypedDataV1>;
      } else if (version === SignTypedDataVersion.V3 || version === SignTypedDataVersion.V4) {
        [address, data] = params as unknown as any;

        // @ts-ignore
        data = JSON.parse(data) as unknown as ITypedMessage<IMessageTypes>;
      }
      const privateKey = await this.getPrivateKey();
      const signedData = metamaskSignTypedData({
        privateKey: Buffer.from(privateKey, "hex"),
        // @ts-ignore
        data,
        version,
      });
      return signedData;
    } catch (err) {
      console.log(err);
    }
  }

  async getGasLimit(params: Record<string, string>[]) {
    return providerController.ethEstimateGas(params);
  }

  storeOnChange() {
    return storeService.storeOnChange();
  }

  getCustomChains() {
    return storeService.getCustomChains();
  }

  getCustomTokens(walletId: string, chain: string) {
    return storeService.getCustomTokens(walletId, chain);
  }

  getEditedNetworks() {
    return storeService.getEditedNetworks();
  }

  setEditedNetworks(editedNetworks: Array<Record<string, any>>) {
    return storeService.setEditedNetworks(editedNetworks);
  }

  updateAppVersion(version: string) {
    return storeService.updateAppVersion(version);
  }
}
export { WalletController as WalletControllerClass };
export default new WalletController();
