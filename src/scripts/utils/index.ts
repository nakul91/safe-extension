import Browser, { Tabs } from "webextension-polyfill";
import { browserSupported, str2bytes } from "../../utils";
import ExtensionData from "../../utils/datahandler";
import ExtensionPlatform from "../platforms/extension";
import { WalletControllerClass } from "../backgroundServices/walletController";
import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import nacl from "tweetnacl";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const isChromeUrl = (str: string) => {
  return new RegExp("(?=.*chrome-extension)(?=.*popup)(?=.*welcome)").test(str);
};

export const getCurrentTab = async (): Promise<Tabs.Tab> => {
  const tabs = await Browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
};

let intervalId: number;

export const checkOnBoardingComplete = async () => {
  const browser = (await import(`webextension-polyfill`)).default;
  if (browserSupported()) {
    browser.tabs.query({}).then(async (tabs) => {
      const _tabData = tabs
        .filter(({ url }) => isChromeUrl(url ?? ""))
        .map(({ active, url, id }) => {
          return {
            active,
            url,
            id,
            isChromeUrlOpen: isChromeUrl(url ?? ""),
          };
        });
      const _extensionData = await new ExtensionData().getData();
      if (!_extensionData?.OnboardingController?.completedOnboarding) {
        if (_tabData.length) {
          const _extensionTab = _tabData[_tabData.length - 1];
          if (_extensionTab.isChromeUrlOpen) {
            browser.tabs
              .update(_extensionTab.id, {
                active: true,
                highlighted: true,
              })
              .then((err) => {
                console.log(err, "err");
              });
          }
        } else {
          const platform = new ExtensionPlatform();
          platform.openExtensionInBrowser();
        }
      }
      return "";
    });
  }
  intervalId = window.setInterval(async () => {
    const _extensionData = await new ExtensionData().getData();
    if (_extensionData?.OnboardingController?.completedOnboarding) {
      await browser.action.setPopup({ popup: "/popup.html#/" });
      clearInterval(intervalId);
    }
  }, 500);
};

export const injectScript = (filePath: string) => {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("async", "false");
    scriptTag.src = filePath;
    scriptTag.type = "module";
    scriptTag.id = "safe-inject";
    scriptTag.onload = function () {
      container.removeChild(scriptTag);
    };
    container.insertBefore(scriptTag, container.children[0]);
  } catch (error) {
    console.error("Safe: Provider injection failed.", error);
  }
};

export const getUrlInfo = (url: string) => {
  return new URL(url);
};

export const getBlockNumber = () => {
  // currently use random number as blockNumber to reduce the heavy burdens of server
  return Math.floor(Math.random() * 10000).toString(16);
};

export const signSolMessage = async (wallet: WalletControllerClass, params: any) => {
  try {
    const { private: key, address } = (await wallet.getKeyRings())["solana"];

    const prvDecode = str2bytes(key);
    const pubDecode = base58.decode(address);
    const encoded = new Uint8Array([...prvDecode, ...pubDecode]);

    const keypair = Keypair.fromSecretKey(encoded);
    const signature = nacl.sign.detached(base58.decode(params.message), keypair.secretKey);
    return {
      signature: base58.encode(signature),
      encoded: base58.encode(encoded),
    };
  } catch (err) {
    console.log(err, "err");
  }
};

const styler = {
  base: ["color: #fff", "background-color: #444", "padding: 2px 4px", "border-radius: 2px"],
  solana: ["color: #000", "background-color: #29c5fe"],
  solPush: ["color: #fff", "background-color: #126"],
  eth: ["background-color: #808080 ", "color: #000"],
  ethPush: ["background-color: #000 ", "color: #808080"],
};
export const styleLog = (text: string, extra: "solana" | "eth" | "solPush" | "ethPush") => {
  let style = styler.base.join(";") + ";";
  style += styler[extra].join(";"); // Add any additional styles
  console.log(`%c${text}`, style);
};
