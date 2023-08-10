import Browser from "webextension-polyfill";

import { PORT_LISTENER } from "./constants";
import BroadcastChannelMessage from "./message/broadcastChannelMessage";
import PortMessage from "./message/portMessage";
import { injectScript } from "./utils/index";
const channelName = "1ffqkwUIr6_Pvd4p_kyRT";

// setContentScriptNamespace();
injectScript(Browser.runtime.getURL("assets/injector.js"));

const _port = new PortMessage();

_port.connect(PORT_LISTENER.content);

const bcm = new BroadcastChannelMessage(channelName).listen((data: any) => {
    return _port.request(data);
});

_port.on("message", (data) => bcm.send("message", data));

document.addEventListener("beforeunload", () => {
    bcm.dispose();
    _port.dispose();
});
