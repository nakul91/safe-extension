import EthereumProvider from "./providers/ethereumProvider";

const ethProvider = new EthereumProvider();

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

let safeEthInjected = false;

if (window && window.ethereum) {
  safeEthInjected = true;
}

if (!safeEthInjected) {
  try {
    Object.defineProperty(window, "ethereum", {
      set() {
        throw new Error("Cannot assign a new value to 'ethereum'.");
      },
      get() {
        return safeEthProvider;
      },
    });
  } catch (e) {
    console.log(e);
  }
} else {
  window.ethereum = safeEthProvider;
}

if (!window.web3) {
  // @ts-ignore
  window.web3 = {
    currentProvider: window.ethereum,
  };
}
