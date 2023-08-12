import Browser from "webextension-polyfill";
import { DEFAULT_EXTENSION_DATA, IExtensionData, TChangePasswordType, TFirstTimeFlow } from "../../constants";
import { EVENTS, EVENTS_METHOD, STORE_KEYS } from "../constants";
import eventBus from "../eventBus";
import { browserStorage } from "../webapi";
import Alarms, { ALARM_EVENT_ENUMS, IAlarm, TTimeoutoptions } from "./alarms";
import { ChromeStoreSession } from "./chromeStoreSession";
import { Store } from "./store";

const TIMEOUT_OPTION = [900000, 1800000, 3600000, 10800000, 21600000];

const INT_DEFAULT_TIMEOUT = 900000;
class StoreService {
  persistStore: Store;
  timeout: NodeJS.Timeout | undefined;
  alarm: typeof Alarms;
  session: Promise<void>;
  chromeStoreSession: ChromeStoreSession;
  constructor() {
    this.persistStore = new Store({
      encrypted: {},
      keyRings: [],
      isUnlocked: false,
    });
    this.alarm = Alarms;
    this.chromeStoreSession = new ChromeStoreSession();
    this.session = this.getPwdFrmSession();
  }

  async getPwdFrmSession() {
    try {
      const data = await this.chromeStoreSession.getStoreSession();
      if (data.access) {
        const salt: Record<string, any> = await Browser.storage.local.get(null);
        if (salt && salt?.[STORE_KEYS.session]) {
          const pwd = this.chromeStoreSession.aesDecrypt({
            encryptedData: data.access,
            salt: salt?.[STORE_KEYS.session],
          });
          this.submitPassword(pwd);
          return;
        }
      }
      this.lock();
    } catch {
      this.lock();
    }
  }

  async submitPassword(password: string) {
    const keyRings: any = await this.persistStore.setKeyring(password);
    let unlocked = false;
    try {
      if (Object.keys(JSON.parse(keyRings.data)).length) {
        unlocked = true;
      } else {
        unlocked = false;
        this.lock();
      }
    } catch (e) {
      unlocked = false;
      this.lock();
    }

    const encrypted = await this.persistStore.getLocalStore();
    this.persistStore.updateState({
      encrypted: encrypted,
      keyRings: keyRings,
      isUnlocked: unlocked,
      password: password,
    });
    this.#chromeStoreSessionAccessUpdate(password);
    this.onSubmit();
  }

  isUnlocked() {
    return this.persistStore.getState().isUnlocked;
  }

  async lock() {
    this.persistStore.updateState({ isUnlocked: false });
    const alarmState = await this.alarm.getAlarm(ALARM_EVENT_ENUMS.TIMEOUT);
    this.clearState(alarmState);
    Browser.storage.local.remove(STORE_KEYS.session);
    await this.chromeStoreSession.clearStoreSession();
  }

  async getKeyRings() {
    const selectedWallet = await this.getCurrentWallet();
    const keyRings = this.persistStore.parseKeyRing(this.persistStore.getState().keyRings, selectedWallet);
    return keyRings;
  }

  getAllKeyRings() {
    return JSON.parse(this.persistStore.getState().keyRings.data);
  }

  getAutoLockTimer() {
    const settingsController = this.persistStore.getState().encrypted.SettingsController;
    if (settingsController && settingsController.autoLockTimer) {
      return settingsController.autoLockTimer;
    }
    return INT_DEFAULT_TIMEOUT;
  }

  resetTimerLock() {
    this.alarm.resetAlarm(ALARM_EVENT_ENUMS.TIMEOUT);
  }

  setAutoTimerLock(timer?: TTimeoutoptions) {
    if (timer) {
      this.alarm.creteAlarm(ALARM_EVENT_ENUMS.TIMEOUT, timer, this.clearState.bind(this));
      const { encrypted } = this.persistStore.getState();
      encrypted.SettingsController.autoLockTimer = timer;
      this.persistStore.updateState({ encrypted });
    } else {
      const settingsController = this.persistStore.getState().encrypted.SettingsController;
      if (settingsController && settingsController.autoLockTimer) {
        if (TIMEOUT_OPTION.includes(settingsController.autoLockTimer)) {
          this.alarm.creteAlarm(
            ALARM_EVENT_ENUMS.TIMEOUT,
            settingsController.autoLockTimer as TTimeoutoptions,
            this.clearState.bind(this)
          );
        } else {
          this.alarm.creteAlarm(ALARM_EVENT_ENUMS.TIMEOUT, INT_DEFAULT_TIMEOUT, this.clearState.bind(this));
        }
      } else {
        this.alarm.creteAlarm(ALARM_EVENT_ENUMS.TIMEOUT, INT_DEFAULT_TIMEOUT, this.clearState.bind(this));
      }
    }
  }

  clearState(alarm: IAlarm) {
    if (alarm?.name === ALARM_EVENT_ENUMS.TIMEOUT) {
      this.chromeStoreSession.clearStoreSession();
      this.persistStore.deleteState();
      this.alarm.clearAllAlarm();
      eventBus.emit(EVENTS.broadcastToUI, {
        method: EVENTS_METHOD.isLocked,
        params: true,
      });
    }
  }

  setStoreWalletData(data: IExtensionData) {
    this.refreshState(data);
    return this.persistStore.setLocalStore(data);
  }

  // to be refactored!!! Refreshing wallets present in the background state
  refreshState(data: IExtensionData) {
    const _data = JSON.parse(this.persistStore.getState().keyRings.data);
    const _walletIds = Object.keys(_data);
    const _walletList = data?.WalletController;
    if (_walletList.length != _walletIds.length) {
      for (const _walletId of _walletIds) {
        const currentIndex = _walletList.findIndex((x) => x.id === _walletId);
        if (currentIndex < 0) {
          delete _data[_walletId];
        }
      }
      const currentState = this.persistStore.getState();
      currentState.keyRings.data = JSON.stringify(_data);
      this.persistStore.putState(currentState);
    }
  }

  getCurrentWallet() {
    return this.persistStore.getCurrentWallet();
  }

  async getWallets() {
    const store: IExtensionData = await this.getStore();
    if (store?.WalletController) {
      return store.WalletController;
    }
    return [];
  }

  onSubmit() {
    this.setAutoTimerLock();
    eventBus.emit(EVENTS.broadcastToUI, {
      method: EVENTS_METHOD.callLogin,
      params: true,
    });
  }

  async getStore() {
    return await this.persistStore.getLocalStore();
  }

  #getPassword() {
    return this.persistStore.getState().password;
  }

  async addEncryptedData(data: any, password?: string) {
    if (this.#getPassword()) {
      await this.persistStore.setEncryptedData(data, this.#getPassword());
      const keyRings = await this.persistStore.setKeyring(this.#getPassword());
      this.persistStore.updateState({
        keyRings: keyRings,
      });
    } else {
      if (password) {
        await this.persistStore.setLocalStore(DEFAULT_EXTENSION_DATA);
        await this.persistStore.setEncryptedData(data, password);
      }
    }
  }

  async addWalletAddress(data: any) {
    return this.persistStore.addWalletAddress(data);
  }

  async onboardingCompleted(state: boolean) {
    return this.persistStore.onboardingCompleted(state);
  }

  async updateOverrideWallet(canOverrideWallet: boolean) {
    return this.persistStore.updateOverrideWallet(canOverrideWallet);
  }

  async setFirstTimeFlow(flow: TFirstTimeFlow) {
    return this.persistStore.setFirstTimeFlow(flow);
  }

  async getData() {
    this.resetTimerLock();
    return await this.persistStore.getData();
  }
  async updateSelectedChain(chainId: string) {
    return this.persistStore.updateSelectedChain(chainId);
  }

  async passUpdate(pwdObj: TChangePasswordType) {
    const res = await this.persistStore.updatePassword(pwdObj);
    if (res.status) {
      this.#chromeStoreUpdateOnPwdChange(pwdObj.newPass);
    }
    return res;
  }

  async addFcmToken(token: string) {
    return await this.persistStore.addFcmToken(token);
  }

  async #chromeStoreSessionAccessUpdate(password: string) {
    const data = await this.chromeStoreSession.getStoreSession();
    if (!data.access) {
      const salt = this.chromeStoreSession.saltGenerator();
      const access = this.chromeStoreSession.aesEncrypt({
        msg: password,
        salt: salt,
      });
      this.chromeStoreSession.setStoreSession({ access: access });
      await browserStorage.set(STORE_KEYS.session, salt);
    }
  }

  async #chromeStoreUpdateOnPwdChange(password: string) {
    const salt = this.chromeStoreSession.saltGenerator();
    const access = this.chromeStoreSession.aesEncrypt({
      msg: password,
      salt: salt,
    });
    this.chromeStoreSession.setStoreSession({ access: access });
    await browserStorage.set(STORE_KEYS.session, salt);
  }

  storeOnChange() {
    this.getPwdFrmSession();
  }

  async getCustomChains() {
    const storeData = await this.getData();
    const customNetworks = storeData?.customNetworks?.length ? storeData?.customNetworks : [];
    return customNetworks;
  }

  async getCustomTokens(walletId: string, chain: string) {
    const storeData = await this.getData();
    const customTokens =
      storeData.customTokens && Object.keys(storeData?.customTokens).length
        ? storeData.customTokens[walletId] && storeData.customTokens[walletId][chain]
          ? storeData.customTokens[walletId][chain]
          : []
        : [];
    return customTokens;
  }

  updateAppVersion(version: string) {
    return this.persistStore.updateAppVersion(version);
  }

  async getEditedNetworks() {
    const storeData = await this.getData();
    const editedNetworks = storeData?.editedNetworks?.length ? storeData?.editedNetworks : [];
    return editedNetworks;
  }

  async setEditedNetworks(editedNetworks: Array<Record<string, any>>) {
    return this.persistStore.setEditedNetworks(editedNetworks);
  }

  async setPvtKey(key: string) {
    this.persistStore.updateState({
      pvtKey: key,
    });
  }

  getPvtKey() {
    return this.persistStore.getState()?.pvtKey;
  }
}

export default new StoreService();
