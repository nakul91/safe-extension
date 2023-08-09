import { ReactElement, useEffect } from "react";

import { WalletProvider } from "../context/WalletContext";
import { WalletControllerClass } from "../scripts/backgroundServices/walletController";
import { EVENTS, PORT_LISTENER } from "../scripts/constants";
import eventBus from "../scripts/eventBus";
import PortMessage from "../scripts/message/portMessage";

const portMessageChannel = new PortMessage();

portMessageChannel.connect(PORT_LISTENER.uiListener);

const wallet = new Proxy(
    {},
    {
        get(obj, key) {
            return async function (...params: any) {
                const result = await portMessageChannel.request({
                    sender: "CONTROLLER",
                    method: key,
                    params,
                });
                if (typeof result === "function") {
                    return result();
                }
                return result;
            };
        },
    },
) as WalletControllerClass;

const timeoutPromise = (key: any, params: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(() => {
                window.location.reload();
            });
        }, 9000);
    });
};

portMessageChannel.listen((data: any) => {
    if (data.type === EVENTS.broadcast) {
        eventBus.emit(data.method, data.params);
    }
});

eventBus.addEventListener("broadcastToBackground", (data: any) => {
    portMessageChannel.request({
        type: EVENTS.broadcast,
        method: data.method,
        params: data.data,
    });
});

export const WalletHoc = ({ children }: { children: ReactElement }) => {
    return <WalletProvider wallet={wallet}>{children}</WalletProvider>;
};
