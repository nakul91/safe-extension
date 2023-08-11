import { AES, enc } from "crypto-js";

import {
  DEFAULT_EXTENSION_DATA,
  ENKRYPT_HANDLER,
  enkryptKey,
  ERRORS,
  IExtensionData,
  ISelectedChain,
  IWalletController,
  TChangePasswordType,
  TFirstTimeFlow,
} from "../../constants";
import { generateUUID } from "../../utils";
import KeyringControllerScrypt from "../../utils/keyring";
import { browserStorage } from "../webapi";

export class Store {
  // eslint-disable-next-line @typescript-eslint/ban-types
  _state: {};
  extensionFns = {};
  constructor(initState = {}) {
    this._state = initState;
  }

  getState(): any {
    return this._getState();
  }

  putState(newState: any) {
    this._state = newState;
  }

  updateState(partialState: any) {
    if (partialState && typeof partialState === "object") {
      const state = this.getState();
      const newState = { ...state, ...partialState };
      this.putState({ ...newState });
    } else {
      this.putState({ ...partialState });
    }
  }

  deleteState() {
    this._state = {};
  }

  _getState() {
    return this._state;
  }

  setKeyring(password: string) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const response: any = await this.getLocalStore();
      const selectedWallet = await this.getCurrentWallet();
      if (!selectedWallet) {
        throw ERRORS.INVALID_STORE;
      }
      if (Object.keys(response.crypto ?? {}).length !== 0) {
        const scrypt = new KeyringControllerScrypt();
        (async () => {
          const decrypted = await scrypt.decrypt({
            password,
            encryptedJson: { data: { ...response } },
          });
          resolve(decrypted);
        })().catch((err) => {
          console.log(err);
        });
      } else {
        throw ERRORS.INVALID_STORE;
      }
    });
  }

  async getCurrentWallet() {
    const data: any = await this.getLocalStore();
    if (data && data.WalletController) {
      const { WalletController } = data;
      const selectedWallet = WalletController.find((wallet: IWalletController) => wallet.isSelected);
      if (selectedWallet) {
        return selectedWallet;
      }
    }
  }

  parseKeyRing(decrypted: any, selectedWallet: any) {
    try {
      const data = JSON.parse(decrypted.data);
      if (data[selectedWallet.id]) {
        return data[selectedWallet.id];
      }
      throw ERRORS.INVALID_STORE;
    } catch {
      throw ERRORS.INVALID_STORE;
    }
  }

  async getLocalStore(): Promise<IExtensionData> {
    try {
      const data = await browserStorage.get("data");
      const _data = data as IExtensionData;
      if (_data?.WalletController?.length) {
        const _wallets: any[] = [];
        _data.WalletController.forEach((wallet) => {
          const _accounts: ISelectedChain[] = [];
          wallet?.accounts?.forEach((account) => {
            const _addr = account.address;
            if (_addr.includes(ENKRYPT_HANDLER)) {
              const address = _addr.substring(0, _addr.length - 2);
              account.address = this.aes265Decrypt(address);
            }
            _accounts.push(account);
          });
          if (_accounts.length) {
            wallet.accounts = _accounts;
          }
          if (wallet?.selectedChain?.address?.includes(ENKRYPT_HANDLER)) {
            let address = wallet.selectedChain.address;
            address = address.substring(0, address.length - 2);
            address = this.aes265Decrypt(address);
            wallet.selectedChain = {
              ...wallet.selectedChain,
              address: address,
            };
          }
          _wallets.push(wallet);
        });
        _data.WalletController = _wallets;
      }
      return _data;
    } catch {
      throw ERRORS.INVALID_STORE;
    }
  }

  aes256Encrypt(secret: string) {
    return AES.encrypt(secret, enkryptKey).toString();
  }

  aes265Decrypt(encryptedData: string, secret = enkryptKey) {
    return AES.decrypt(encryptedData, secret).toString(enc.Utf8);
  }

  async setLocalStore(data: any) {
    const _data = data as IExtensionData;
    console.log("_data", _data);
    try {
      return await browserStorage.set("data", _data);
    } catch {
      throw ERRORS.INVALID_STORE;
    }
  }

  async setEncryptedData(wallet: any, password: string) {
    if (password) {
      let data = await this.getDecryptedData(password);
      if (data?.data) {
        data = JSON.parse(data.data);
        if (Object.keys(data).length) {
          data = {
            ...data,
            ...wallet,
          };
        } else {
          data = {
            ...wallet,
          };
        }
      } else {
        data = {
          ...wallet,
        };
      }
      await this.addEncryptedData(JSON.stringify(data), password);
      return true;
    }
    throw ERRORS.INVALID_STORE;
  }

  async checkPassword(pass: string) {
    const data = await this.getDecryptedData(pass);
    if (data) {
      return true;
    }
    return false;
  }

  async getDecryptedData(password: string) {
    const encrypted = await this.getLocalStore();
    const scrypt = new KeyringControllerScrypt();
    if (encrypted && Object.keys(encrypted?.crypto ?? {}).length !== 0) {
      const decrypted = await scrypt.decrypt({
        password,
        encryptedJson: { status: 1, data: encrypted },
      });
      return decrypted;
    }
  }

  async addEncryptedData(data: string, password: string) {
    const dataExist = await this.extensionDataExist();
    const scrypt = new KeyringControllerScrypt();
    const encrypted = await scrypt.encrypt({
      password: password,
      text: data,
    });
    if (dataExist.status && dataExist.data) {
      dataExist.data.crypto = JSON.parse(encrypted.data);
      await this.setLocalStore(dataExist.data);
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      _data.WalletController = encrypted.data;
      await this.setLocalStore(_data);
    }
  }

  async extensionDataExist() {
    const data = await this.getLocalStore();
    return { status: 1, data: data };
  }

  async addWalletAddress(walletAddress: Array<IWalletController>) {
    const _dataExist = await this.extensionDataExist();
    if (_dataExist.data) {
      _dataExist.data.WalletController = [...walletAddress];
      await this.setLocalStore(_dataExist.data);
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      _data.WalletController = [...walletAddress];
      await this.setLocalStore(_data);
    }
  }

  async addFcmToken(fcmToken: string) {
    const _dataExist = await this.extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      _dataExist.data.fcmToken = fcmToken;
      _dataExist.data.deviceId = generateUUID();
      await this.setLocalStore(_dataExist.data);
      return {
        fcmToken: fcmToken,
        deviceId: _dataExist.data.deviceId,
      };
    }
  }

  async onboardingCompleted(state: boolean) {
    const _dataExist = await this.extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      _dataExist.data.OnboardingController.completedOnboarding = state;
      await this.setLocalStore(_dataExist.data);
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      _data.OnboardingController.completedOnboarding = state;
      this.setLocalStore(_data);
    }
  }

  async updateAppVersion(version: string) {
    const _dataExist = await this.extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      _dataExist.data.version = version;
      await this.setLocalStore(_dataExist.data);
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      _dataExist.data.version = "";
      this.setLocalStore(_data);
    }
  }

  async updateOverrideWallet(canOverrideWallet: boolean) {
    const _dataExist = await this.extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      _dataExist.data.PreferencesController.canOverrideWallet = canOverrideWallet;
      await this.setLocalStore(_dataExist.data);
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      _data.PreferencesController.canOverrideWallet = canOverrideWallet;
      this.setLocalStore(_data);
    }
  }

  async getData() {
    const _dataExist = await this.extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      return _dataExist.data;
    } else {
      return {} as IExtensionData;
    }
  }

  async setFirstTimeFlow(flow: TFirstTimeFlow) {
    const _dataExist = await this.extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      _dataExist.data.OnboardingController.firstTimeFlowType = flow;
      await this.setLocalStore(_dataExist.data);
      return true;
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      _data.OnboardingController.firstTimeFlowType = flow;
      this.setLocalStore(_data);
      return true;
    }
  }

  async updateSelectedChain(chainId: string) {
    const _dataExist = await this.extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      const updatedWalletController = _dataExist.data.WalletController.map((wall) => {
        if (wall.isSelected) {
          return {
            ...wall,
            selectedChain: wall.accounts.find((account) => account.chainId === chainId) ?? wall.selectedChain,
          };
        } else {
          return wall;
        }
      });
      _dataExist.data.WalletController = updatedWalletController;
      await this.setLocalStore(_dataExist.data);
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      await this.setLocalStore(_data);
    }
  }

  async updatePassword(pwdObj: TChangePasswordType) {
    const { oldPass, newPass } = pwdObj;
    if (oldPass && newPass) {
      const decrypted = await this.getDecryptedData(oldPass);
      try {
        const data = JSON.parse(decrypted?.data ?? "");
        if (decrypted.status && Object.keys(data).length) {
          await this.addEncryptedData(JSON.stringify(data), newPass);
          return {
            status: 1,
            message: "Password updated successfully",
          };
        }
      } catch {
        return {
          status: 0,
          message: "Password not matching",
        };
      }
    }
    return {
      status: 0,
      message: "Missing parameters",
    };
  }

  async setEditedNetworks(editedNetworks: Array<Record<string, any>>) {
    const _dataExist = await this.extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      _dataExist.data.editedNetworks = editedNetworks;
      await this.setLocalStore(_dataExist.data);
    }
  }
}
