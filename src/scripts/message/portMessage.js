import Browser from "webextension-polyfill";

import Message from "./index";
class PortMessage extends Message {
    port = null;
    listenCallback;

    constructor(port) {
        super();
        if (port) {
            this.port = port;
        }
    }

    connect = (name, autoReconnect = true) => {
        this.port = Browser.runtime.connect(undefined, name ? { name } : undefined);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.port.onMessage.addListener(({ _type_, data }) => {
            if (_type_ === `${this._EVENT_PRE}message`) {
                this.emit("message", data);
                return;
            }

            if (_type_ === `${this._EVENT_PRE}response`) {
                this.onResponse(data);
            }
        });
        if (autoReconnect) {
            this.port.onDisconnect.addListener(() => {
                this.connect(name);
            });
        }

        return this;
    };

    listen = (listenCallback) => {
        if (!this.port) return;
        this.listenCallback = listenCallback;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.port.onMessage.addListener(({ _type_, data }) => {
            if (_type_ === `${this._EVENT_PRE}request`) {
                this.onRequest(data);
            }
        });

        return this;
    };

    send = (type, data) => {
        if (!this.port) return;
        try {
            this.port.postMessage({ _type_: `${this._EVENT_PRE}${type}`, data });
        } catch (e) {
            // DO NOTHING BUT CATCH THIS ERROR
        }
    };

    onDisconnect = (connect) => {
        this.port.onDisconnect.addListener(connect);
    };

    dispose = () => {
        this._dispose();
        this.port?.disconnect();
    };
}

export default PortMessage;
