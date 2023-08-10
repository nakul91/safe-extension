import { ethErrors, serializeError } from "eth-rpc-errors";
import EventEmitter from "events";
import { getAllChains } from "../../store/GlobalStore";
import { CHANNEL_NAME, COMMUNICATION_PAGES, ETHEREUM_REQUESTS, WALLET_REQUESTS } from "../constants";
import BroadcastChannelMessage from "../message/broadcastChannelMessage";
import DedupePromise from "../page_provider/dedupePromise";
import EthPushEventHandlers from "../page_provider/ethPushEventHandlers";
import ReadyPromise from "../page_provider/readyPromise";

interface IChainTypes {
  index: number;
  id: string;
  name: string;
  alias?: string;
  logo: string;
  coinId: number;
  symbol: string;
  decimals: number;
  blockchain: string;
  curve: string;
  publicKeyType: string;
  chainId: string;
  explorer: any;
  info: any;
  hrp?: string;
  isSelected?: boolean;
  prefix?: string;
  bridgeProviders?: Array<string>;
  swapProviders?: Array<string>;
  isCustomEVM?: boolean;
  isTestNet?: boolean;
  denom?: string;
}

interface IStateProvider {
  accounts: string[] | null;
  isConnected: boolean;
  initialized: boolean;
  isPermanentlyDisconnected: boolean;
}

export interface EIP1193Provider {
  request: (payload: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on(eventName: string, callback: (...args: any[]) => void): void;
}

export interface EIP6963ProviderInfo {
  walletId: string;
  uuid: string;
  name: string;
  icon: string;
}

export interface EIP6963RequestProviderEvent extends Event {
  type: "eip6963:requestProvider";
}

class EthereumProvider extends EventEmitter {
  autoRefreshOnNetworkChange = true;
  isReady = true;
  chainId = "";
  selectedAddress: string | null = null;
  allAccounts: string[] = [];
  networkVersion = "";
  isCoinbaseWallet = false;
  _isReady = false;
  _isConnected = false;
  _initialized = false;
  _isUnlocked = true;
  _cacheRequestsBeforeReady: any[] = [];
  _cacheEventListenersBeforeReady: [string | symbol, () => any][] = [];

  _state: IStateProvider = {
    accounts: null,
    isConnected: false,
    initialized: false,
    isPermanentlyDisconnected: false,
  };

  _metamask = {
    isUnlocked: () => {
      return new Promise((resolve) => {
        resolve(this._isUnlocked);
      });
    },
  };

  private _pushEventHandlers: EthPushEventHandlers;
  private _dedupePromise = new DedupePromise([]);
  private _requestPromise = new ReadyPromise(1);
  private bcm = new BroadcastChannelMessage(CHANNEL_NAME.boradcastChannel);
  isMetaMask: boolean = true;
  chainList: Partial<IChainTypes>[];

  constructor({ maxListeners = 100 } = {}) {
    super();
    this.setMaxListeners(maxListeners);
    this.initialize();
    this._pushEventHandlers = new EthPushEventHandlers(this);
    this.chainList = getAllChains().CHAIN_LIST;
  }

  private _handleBackgroundMessage = ({ event, data }: any) => {
    //@ts-ignore
    if (this?._pushEventHandlers[event]) {
      //@ts-ignore
      return this._pushEventHandlers[event](data);
    }
    this.emit(event, data);
  };

  private initialize = async () => {
    this.bcm.connect().on("message", this._handleBackgroundMessage);
    try {
      const walletDetail: any = await this.requestInternalMethods({
        sender: COMMUNICATION_PAGES.internalRequest,
        data: {},
        params: [],
        method: "getSelectedChain",
      });
      this.isMetaMask = true;
      this.chainId = walletDetail.chain;
      this.allAccounts = walletDetail.accounts;
      this.selectedAddress = walletDetail.accounts ? walletDetail.accounts[0] : "";
      this.networkVersion = walletDetail.networkVersion;
      this._initialized = true;
      this._pushEventHandlers.chainChanged({
        chain: this.chainId,
        networkVersion: this.networkVersion,
      });
      this._pushEventHandlers.accountsChanged(this.allAccounts);
    } catch {
      //
    } finally {
      this._initialized = true;
      this._state.initialized = true;
      this.emit("_initialized");
    }
  };

  private _requestPromiseCheckVisibility = () => {
    this._requestPromise.check(1);
  };

  isConnected = () => {
    return true;
  };

  enable = () => this.request({ method: "eth_requestAccounts" });
  net_version = () => this.request({ method: "net_version" });

  private _request = async (data: any) => {
    if (!data) {
      throw ethErrors.rpc.invalidRequest();
    }
    this._requestPromiseCheckVisibility();
    return this._requestPromise.call(() => {
      return this.bcm
        .request(data)
        .then((res: any) => {
          if ((data?.method == "eth_requestAccounts" && !res) || res?.code == "4001") {
            throw ethErrors.provider.userRejectedRequest();
          } else if (res?.code == "4092") {
            throw ethErrors.provider.custom({
              code: 4092,
              message: res.message,
            });
          } else if (res?.error) {
            throw ethErrors.provider.custom({
              code: res?.error?.code,
              message: res?.error?.message,
            });
          } else {
            return res;
          }
        })
        .catch((err) => {
          throw serializeError(err);
        });
    });
  };

  request = async (data: any) => {
    if ([ETHEREUM_REQUESTS.requestAccounts, ETHEREUM_REQUESTS.accounts]?.includes(data.method)) {
      const ethereumChainDetails = this.chainList.find(({ id }) => id === "ethereum");

      const isCurrentChainEvmBased = await this.requestInternalMethods({
        sender: COMMUNICATION_PAGES.internalRequest,
        data: {},
        origin: [],
        method: "isEvmChain",
      });

      if (!isCurrentChainEvmBased) {
        await this.request({
          sender: COMMUNICATION_PAGES.provider,
          data: {},
          params: [
            {
              chainId: `0x${Number(ethereumChainDetails?.chainId).toString(16)}`,
              networkVersion: ethereumChainDetails?.chainId,
              isEVM: true,
            },
          ],
          method: WALLET_REQUESTS.switchEthereumChain,
        });
      }
    }

    data.sender = COMMUNICATION_PAGES.provider;
    const _response = this._dedupePromise.call(data.method, () => this._request(data));

    await _response
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
    return _response;
  };

  on = (event: any, handler: any) => {
    return super.on(event, handler);
  };

  requestInternalMethods = (data: any) => {
    data.sender = COMMUNICATION_PAGES.internalRequest;
    return this._dedupePromise.call(data.method, () => this._request(data));
  };

  async isSiteConnectionEstablished() {
    return await this.requestInternalMethods({
      sender: COMMUNICATION_PAGES.internalRequest,
      data: {},
      origin: window?.location?.origin,
      params: [window?.location?.origin],
      method: "isSiteConnectionEstablished",
    });
  }
  sendAsync = (payload: any, callback: any) => {
    if (Array.isArray(payload)) {
      return Promise.all(
        payload.map(
          (item) =>
            new Promise((resolve) => {
              this.sendAsync(item, (_: any, res: any) => {
                resolve(res);
              });
            })
        )
      ).then((result) => callback(null, result));
    }
    const { method, params, ...rest } = payload;
    this.request({ method, params })
      .then((result) => callback(null, { ...rest, method, result }))
      .catch((error) => callback(error, { ...rest, method, error }));
  };

  send = (payload: any, callback?: any) => {
    if (typeof payload === "string" && (!callback || Array.isArray(callback))) {
      return this.request({
        method: payload,
        params: callback,
      }).then((result) => ({
        id: undefined,
        jsonrpc: "2.0",
        result,
      }));
    }

    if (typeof payload === "object" && typeof callback === "function") {
      return this.sendAsync(payload, callback);
    }

    let result;
    switch (payload.method) {
      case "eth_accounts":
        result = this.selectedAddress?.toLowerCase() ? [this.selectedAddress.toLowerCase()] : [];
        break;

      case "eth_coinbase":
        result = this.selectedAddress || null;
        break;

      default:
        throw new Error("sync method doesnt support");
    }

    return {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      result,
    };
  };
}

export default EthereumProvider;
