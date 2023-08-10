import { getAllChains } from "../store/GlobalStore";
import alertMessage from "./backgroundServices/alertMessage";
import { BROADCAST_REQUEST } from "./constants";
import EthereumProvider from "./providers/ethereumProvider";

const ethProvider = new EthereumProvider();

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    ethereum: EthereumProvider;
  }
}

let cacheOtherEthProvider: EthereumProvider | null = null;
const safeEthProvider = new Proxy(ethProvider, {
  deleteProperty: (target, prop) => {
    if (prop === "on") {
      // @ts-ignore
      delete target[prop];
    }
    return true;
  },
  get(obj, key) {
    //@ts-ignore
    return obj[key];
  },
});

const hexToNumber = (val: string, divider = 1) => {
  return parseInt(val, 16) / divider;
};

if (window && window.ethereum) {
  cacheOtherEthProvider = window.ethereum;
}

ethProvider.requestInternalMethods({ method: "isDefaultWallet" }).then((isDefaultWallet) => {
  let finalProvider: EthereumProvider | null = null;
  if ((isDefaultWallet ) || !cacheOtherEthProvider) {
    finalProvider = safeEthProvider;
    try {
      Object.defineProperty(window, "ethereum", {
        set() {
          throw new Error("Cannot assign a new value to 'ethereum'.");
        },
        get() {
          return finalProvider;
        },
      });
    } catch (e) {
      console.log(e);
    }
    if (!window.web3) {
      window.web3 = {
        currentProvider: finalProvider,
      };
    }
  } else {
    finalProvider = cacheOtherEthProvider;
  }
  setBroadCastEth(finalProvider);
});

const setBroadCastEth = (_ethProvider: EthereumProvider | null = null) => {
  if (!_ethProvider) {
    return;
  }
  _ethProvider._isReady = true;
  const { CHAIN_LIST } = getAllChains();
  _ethProvider.on(BROADCAST_REQUEST.chainChanged, async (chain: string) => {
    const isSiteConnected = await ethProvider.isSiteConnectionEstablished();
    for (const chi of CHAIN_LIST) {
      if (chi.chainId === String(hexToNumber(chain)) && isSiteConnected) {
        alertMessage({
          timeout: 2000,
          content: `Switched to <span style="margin:0px 4px;font-weight:600;">${chi?.name}</span> for the current Dapp`,
        });
        return;
      }
    }
  });
  _ethProvider.on(BROADCAST_REQUEST.chainDisabled, async (chain: string) => {
    const isSiteConnected = await ethProvider.isSiteConnectionEstablished();
    for (const chi of CHAIN_LIST) {
      if (chi.chainId === String(hexToNumber(chain)) && isSiteConnected) {
        alertMessage({
          timeout: 2000,
          content: `<span style="margin:0px 4px;font-weight:600;">${chi?.name}</span> disabled for the current wallet. Please enable and try again`,
        });
        return;
      }
    }
  });
};

window.ethereum = {
  ethereum: safeEthProvider,
};

// Moving this under try catch to avoid read only property override issue
// try {
//     Object.defineProperty(window, "ethereum", {
//         set(val) {
//             cacheOtherEthProvider = val;
//         },
//         get() {
//             return cacheOtherEthProvider;
//         },
//     });
// } catch (e) {
//     console.log(e);
// }

if (!window.web3) {
  window.web3 = {
    currentProvider: window.ethereum,
  };
}
