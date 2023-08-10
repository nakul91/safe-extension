import { AES, enc } from "crypto-js";

import {
    ENKRYPT_HANDLER,
    enkryptKey,
    IExtensionData,
    ISelectedChain,
} from "../../constants/index";
import { browserSupported, localStore } from "../../utils/";

interface IApiResponse {
    status: 0 | 1;
    message: string;
    data?: IExtensionData;
}

const BrowserStorageApi = {
    getStorageLocal: (Key: string) => {
        return new Promise<IApiResponse>((resolve) => {
            if (Key) {
                if (browserSupported()) {
                    (async () => {
                        const browser = await import(`webextension-polyfill`);
                        browser.default.storage.local.get([Key]).then((response) => {
                            const _data = { ...response[Key] };
                            if (_data?.WalletController?.length) {
                                const _wallets: any[] = [];
                                _data.WalletController.forEach((wallet: any) => {
                                    const _accounts: ISelectedChain[] = [];
                                    wallet?.accounts?.forEach((account: any) => {
                                        const _addr = account.address;
                                        if (_addr.includes(ENKRYPT_HANDLER)) {
                                            const address = _addr.substring(
                                                0,
                                                _addr.length - 2,
                                            );
                                            const _address = AES.decrypt(
                                                address,
                                                enkryptKey,
                                            ).toString(enc.Utf8);
                                            account.address = _address;
                                        }
                                        _accounts.push(account);
                                    });
                                    if (_accounts.length) {
                                        wallet.accounts = _accounts;
                                    }
                                    if (
                                        wallet?.selectedChain?.address?.includes(
                                            ENKRYPT_HANDLER,
                                        )
                                    ) {
                                        let address = wallet.selectedChain.address;
                                        address = address.substring(
                                            0,
                                            address.length - 2,
                                        );
                                        address = AES.decrypt(
                                            address,
                                            enkryptKey,
                                        ).toString(enc.Utf8);
                                        wallet.selectedChain = {
                                            ...wallet.selectedChain,
                                            address: address,
                                        };
                                    }
                                    _wallets.push(wallet);
                                });
                                _data.WalletController = _wallets;
                            }
                            resolve({
                                status: 1,
                                message: "Fetched!",
                                data: _data,
                            });
                        });
                    })().catch((err) => {
                        console.log(err);
                    });
                } else {
                    const _data = { ...localStore.get(Key) };
                    if (_data?.WalletController?.length) {
                        const _wallets: any[] = [];
                        _data.WalletController.forEach((wallet: any) => {
                            const _accounts: ISelectedChain[] = [];
                            wallet?.accounts?.forEach((account: any) => {
                                const _addr = account.address;
                                if (_addr.includes(ENKRYPT_HANDLER)) {
                                    const address = _addr.substring(0, _addr.length - 2);
                                    const _address = AES.decrypt(
                                        address,
                                        enkryptKey,
                                    ).toString(enc.Utf8);
                                    account.address = _address;
                                }
                                _accounts.push(account);
                            });
                            if (_accounts.length) {
                                wallet.accounts = _accounts;
                            }
                            if (
                                wallet?.selectedChain?.address?.includes(ENKRYPT_HANDLER)
                            ) {
                                let address = wallet.selectedChain.address;
                                address = address.substring(0, address.length - 2);
                                address = AES.decrypt(address, enkryptKey).toString(
                                    enc.Utf8,
                                );
                                wallet.selectedChain = {
                                    ...wallet.selectedChain,
                                    address: address,
                                };
                            }
                            _wallets.push(wallet);
                        });
                        _data.WalletController = _wallets;
                    }
                    resolve({
                        status: 1,
                        message: "Fetched!",
                        data: { ..._data } as IExtensionData,
                    });
                }
            } else {
                resolve({ status: 0, message: "Failed!" });
            }
        });
    },

    setStorageLocal: (Key: string, value: IExtensionData | string) => {
        const _value = value as IExtensionData;
        if (_value?.WalletController?.length) {
            _value.WalletController.forEach((wallet) => {
                const _accounts: ISelectedChain[] = [];
                wallet?.accounts?.forEach((account) => {
                    const _account = { ...account };
                    const _addr = _account.address;
                    if (!_account.address.includes(ENKRYPT_HANDLER)) {
                        _account.address =
                            AES.encrypt(_addr, enkryptKey).toString() + ENKRYPT_HANDLER;
                    }
                    _accounts.push(_account);
                });
                if (_accounts.length) {
                    wallet.accounts = _accounts;
                }
                if (!wallet?.selectedChain?.address?.includes(ENKRYPT_HANDLER)) {
                    let address = wallet.selectedChain.address;
                    address =
                        AES.encrypt(address, enkryptKey).toString() + ENKRYPT_HANDLER;
                    wallet.selectedChain = {
                        ...wallet.selectedChain,
                        address: address,
                    };
                }
            });
        }

        return new Promise((resolve) => {
            if (browserSupported()) {
                (async () => {
                    const browser = await import(`webextension-polyfill`);
                    browser.default.storage.local
                        .set({ [Key]: _value })
                        .then(() => {
                            resolve({ status: 1, message: "Saved!" });
                        })
                        .catch(() => {
                            resolve({ status: 0, message: "Error storing to local !" });
                        });
                })().catch((err) => {
                    console.log(err);
                });
            } else {
                localStore.set(Key, _value);
                resolve({ status: 1, message: "Saved!" });
            }
        });
    },

    clearStorageLocal: () => {
        return new Promise((resolve) => {
            if (browserSupported()) {
                (async () => {
                    const browser = await import(`webextension-polyfill`);
                    browser.default.storage.local
                        .clear()
                        .then(() => {
                            resolve({ status: 1, message: "Cleared Storage!" });
                        })
                        .catch(() => {
                            resolve({ status: 0, message: "Error clearing storage!" });
                        });
                })().catch((err) => {
                    console.log(err);
                });
            } else {
                localStore.clear();
                resolve({ status: 1, message: "Cleared Storage!" });
            }
        });
    },
    removeStorageLocal: (Key: string) => {
        return new Promise((resolve) => {
            if (browserSupported()) {
                (async () => {
                    const browser = await import(`webextension-polyfill`);
                    browser.default.storage.local
                        .remove(Key)
                        .then(() => {
                            resolve({
                                status: 1,
                                message: `Removed key - ${Key}!`,
                                data: {},
                            });
                        })
                        .catch(() => {
                            resolve({
                                status: 0,
                                message: `Key doesn't exist - ${Key}!`,
                                data: {},
                            });
                        });
                })().catch((err) => {
                    console.log(err);
                });
            } else {
                localStore.remove(Key);
                resolve({
                    status: 1,
                    message: `Removed key - ${Key}!`,
                    data: {},
                });
            }
        });
    },
    getStorageSync: (Key: string) => {
        return new Promise((resolve) => {
            if (Key && browserSupported()) {
                (async () => {
                    const browser = await import(`webextension-polyfill`);
                    browser.default.storage.sync.get([Key]).then((response) => {
                        resolve({ status: 1, message: "Fetched!", data: response[Key] });
                    });
                })().catch((err) => {
                    console.log(err);
                });
            } else {
                resolve("");
            }
        });
    },
    setStorageSync: (Key: string, value: Record<string, string | number | boolean>) => {
        return new Promise((resolve) => {
            if (browserSupported()) {
                (async () => {
                    const browser = await import(`webextension-polyfill`);
                    browser.default.storage.sync
                        .set({ [Key]: value })
                        .then(() => {
                            resolve({ status: 1, message: "Saved!" });
                        })
                        .catch(() => {
                            resolve({ status: 0, message: "Error storing to sync !" });
                        });
                })().catch((err) => {
                    console.log(err);
                });
            }
        });
    },
};

export default BrowserStorageApi;
