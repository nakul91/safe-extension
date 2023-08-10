import Browser from "webextension-polyfill";
import { jsonRPC } from "./backgroundServices/apiServices";
import { IReq } from "./backgroundServices/controller/provider/providerService";
import { providerService, sessionService, sitePermissionService } from "./backgroundServices/index";
import walletController from "./backgroundServices/walletController";
import { COMMUNICATION_PAGES, EVENTS, getFaviconUrl, PORT_LISTENER, STORE_KEYS } from "./constants";
import eventBus from "./eventBus";
import PortMessage from "./message/portMessage";
import ExtensionPlatform from "./platforms/extension";
import { IBroadcastRequest } from "./script_types";
import { getUrlInfo } from "./utils";
import { Web3AuthModalPack } from "@safe-global/auth-kit";
import { modalConfig, web3AuthConfig, web3AuthOptions } from "../constants/chains/baseGoerli";

async function restoreAppState() {
  await sitePermissionService.init();
  await jsonRPC.init();
}
restoreAppState();
const platform = new ExtensionPlatform(self);

Browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    platform.openExtensionInBrowser();
  }
});

Browser.runtime.onStartup.addListener(async () => {
  await Browser.action.setPopup({ popup: "/popup.html#/" });
});

Browser.action.onClicked.addListener(async () => {
  await Browser.action.setPopup({ popup: "/popup.html#/" });
});

Browser.runtime.onConnect.addListener((port) => {
  if (port.name === PORT_LISTENER.uiListener) {
    const bcgPort = new PortMessage(port);
    bcgPort.listen(async (request: IBroadcastRequest<any>) => {
      console.info("On Connect");
      if (request.sender === COMMUNICATION_PAGES.controller) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return walletController[request?.method].apply(null, request.params);
      }
    });

    const boardcastCallback = (data: any) => {
      bcgPort.request({
        type: EVENTS.broadcast,
        method: data.method,
        params: data.params,
      });
    };

    eventBus.addEventListener(EVENTS.broadcastToUI, boardcastCallback);
    port.onDisconnect.addListener(() => {
      eventBus.removeEventListener(EVENTS.broadcastToUI, boardcastCallback);
    });
    return;
  } else if (port.name === PORT_LISTENER.content) {
    if (!port.sender?.tab) {
      return;
    }
    const pm = new PortMessage(port);
    pm.listen(async (data: IBroadcastRequest<any>) => {
      const sessionId = port.sender?.tab?.id;
      if (sessionId === undefined || !port.sender?.url) {
        return;
      }
      const { favIconUrl, title } = port?.sender?.tab ?? {
        favIconUrl: "",
        title: "",
      };
      const origin = getUrlInfo(port.sender.url).origin;
      const session = sessionService.getOrCreateSession(sessionId, origin, {
        name: title ?? "",
        icon: favIconUrl || getFaviconUrl(origin),
        origin,
      });

      const req: IReq = { data, session };
      req?.session?.setPortMessage(pm);
      return providerService(req);
    });
  }

  port.onDisconnect.addListener(() => {
    console.log("disconnected port");
  });
});

Browser.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === STORE_KEYS.session) {
      walletController.storeOnChange();
    }
  }
});

// Using it for MV3 issue for injecting code
try {
  chrome.scripting
    //@ts-ignore
    .registerContentScripts([
      {
        id: "safe-inject",
        matches: ["http://*/*", "https://*/*"],
        runAt: "document_start",
        world: "MAIN",
        allFrames: true,
      },
    ])
    .catch((err: any) => console.warn("unexpected error", err));
} catch (err) {
  console.error(`failed to register content scripts: ${err}`);
}
