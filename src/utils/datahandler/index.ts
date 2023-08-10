import {
  DEFAULT_EXTENSION_DATA,
  IContacts,
  IExtensionData,
  ISelectedChain,
  IWalletController,
  TAutoLockTimer,
  TFirstTimeFlow,
  TLanguage,
} from "../../constants";
import KeyringControllerScrypt from "../keyring";
import BrowserStorageApi from "../storage";

const extensionDataExist = async () => {
  const _data = await BrowserStorageApi.getStorageLocal("data");
  return { status: Boolean(_data.status), data: _data.data };
};

export default class ExtensionData {
  async getData() {
    const _dataExist = await extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      return _dataExist.data;
    } else {
      return {} as IExtensionData;
    }
  }

  async setFirstTimeFlow(flow: TFirstTimeFlow) {
    const _dataExist = await extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      _dataExist.data.OnboardingController.firstTimeFlowType = flow;
      await BrowserStorageApi.setStorageLocal("data", _dataExist.data);
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      _data.OnboardingController.firstTimeFlowType = flow;
      this.setDefaultData(_data);
    }
  }


  async setDefaultData(predefinedData = DEFAULT_EXTENSION_DATA) {
    await BrowserStorageApi.setStorageLocal("data", predefinedData);
  }
 
  async updateIsIBCGuideViewed(isIBCGuideViewed: boolean) {
    const _dataExist = await extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      _dataExist.data.isIBCGuideViewed = isIBCGuideViewed;
      await BrowserStorageApi.setStorageLocal("data", _dataExist.data);
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      _data.isIBCGuideViewed = isIBCGuideViewed;
      this.setDefaultData(_data);
    }
  }
  
  async addWalletAddress(walletAddress: Array<IWalletController>) {
    const _dataExist = await extensionDataExist();
    if (_dataExist.status && _dataExist.data) {
      _dataExist.data.WalletController = [...walletAddress];
      await BrowserStorageApi.setStorageLocal("data", _dataExist.data);
    } else {
      const _data = DEFAULT_EXTENSION_DATA;
      _data.WalletController = [...walletAddress];
      this.setDefaultData(_data);
    }
  }

  


 
  

 
 

  

 

  
}
