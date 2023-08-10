import { PublicKey } from "@solana/web3.js";
import { ethErrors } from "eth-rpc-errors";

import alertMessage from "../backgroundServices/alertMessage";
import { CHAIN_STATUS, COMMUNICATION_PAGES } from "../constants";

class EthPushEventHandlers {
    provider: any;

    constructor(provider: any) {
        this.provider = provider;
    }

    _emit(event: string, data: any) {
        this.provider.emit(event, data);
    }

    connect = (data: any) => {
        if (typeof data === "string") {
            if (data && this.provider.isPhantom) {
                data = new PublicKey(data);
                this.provider.publicKey = data;
                this.provider.isConnected = true;
            }
        }
        this._emit("connect", data);
    };

    unlock = () => {
        this.provider._isUnlocked = true;
        this.provider._state.isUnlocked = true;
    };

    lock = () => {
        this.provider._isUnlocked = false;
    };

    disconnect = () => {
        this.provider._state.accounts = null;
        this.provider.selectedAddress = null;
        const disconnectError = ethErrors.provider.disconnected();

        this._emit("accountsChanged", []);
        this._emit("disconnect", disconnectError);
        this._emit("close", disconnectError);
    };

    accountsChanged = async (accounts: any) => {
        const isEVM = await this.isEVMChain();
        // const siteConnected = await this.isSiteConnected();
        if (!isEVM) {
            return;
        }
        const siteConnected = await this.isSiteConnected();

        if (siteConnected) {
            if (
                Array.isArray(accounts) &&
                this.provider.allAccounts.join("") !== accounts.join("")
            ) {
                this.provider.allAccounts = accounts;
                this.provider.selectedAddress = accounts[0];
                this._emit("accountsChanged", accounts);
            }
        } else {
            this._emit("accountsChanged", []);
        }
    };

    isSiteConnected = async () => {
        return await this.provider.requestInternalMethods({
            sender: COMMUNICATION_PAGES.internalRequest,
            data: {},
            params: window.location.origin,
            method: "isSiteConnected",
        });
    };

    chainExistInWallet = async (chain: string) => {
        return await this.provider.requestInternalMethods({
            sender: COMMUNICATION_PAGES.internalRequest,
            data: {},
            params: chain,
            method: "chainExistInWallet",
        });
    };

    isEVMChain = async () => {
        return await this.provider.requestInternalMethods({
            sender: COMMUNICATION_PAGES.internalRequest,
            data: {},
            params: {},
            method: "isEvmChain",
        });
    };

    chainChanged = async ({
        chain,
        networkVersion,
    }: {
        chain: string;
        networkVersion: string;
    }) => {
        const isEVM = await this.isEVMChain();
        // const siteConnected = await this.isSiteConnected();
        if (!isEVM) {
            return;
        }
        const chainStatus = await this.chainExistInWallet(chain);
        if (CHAIN_STATUS.DISABLED === chainStatus) {
            alertMessage({
                timeout: 4000,
                content: `This chain is disabled, please enable it!`,
            });
        }
        if (chain !== this.provider.chainId) {
            this.provider.chainId = chain;
            this._emit("chainChanged", chain);
        }
        if (networkVersion !== this.provider.networkVersion) {
            this.provider.networkVersion = networkVersion;
            this._emit("networkChanged", networkVersion);
        }
    };
}

export default EthPushEventHandlers;
