import { EventEmitter } from "events";
import browser from "webextension-polyfill";

const event = new EventEmitter();
browser.windows.onFocusChanged.addListener((winId) => {
    event.emit("windowFocusChange", winId);
});

browser.windows.onRemoved.addListener((winId) => {
    event.emit("windowRemoved", winId);
});

const BROWSER_HEADER = 80;
const WINDOW_SIZE = {
    width: 420,
    height: 660,
};

const createFullScreenWindow = ({ ...rest }): Promise<browser.Windows.Window> => {
    return new Promise((resolve) => {
        browser.windows
            .create({
                focused: true,
                type: "popup",
                ...rest,
                width: undefined,
                height: undefined,
                left: undefined,
                top: undefined,
                state: "fullscreen",
            })
            .then((win) => {
                resolve(win);
            });
    });
};

export const create = async ({ ...rest }): Promise<number> => {
    let {
        top: cTop,
        left: cLeft,
        width,
    } = await browser.windows.getCurrent({
        windowTypes: ["normal"],
    } as browser.Windows.GetInfo);
    cTop = cTop ?? 0;
    cLeft = cLeft ?? 0;
    width = width ?? 0;
    const top = cTop ?? 0 + BROWSER_HEADER;
    // const left = cLeft ?? 0 + width ?? 0 - WINDOW_SIZE.width;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const left = cLeft! + width! - WINDOW_SIZE.width - 10;

    const currentWindow = await browser.windows.getCurrent();
    let win: browser.Windows.Window;
    if (currentWindow.state === "fullscreen") {
        // browser.windows.create not pass state to chrome
        win = await createFullScreenWindow({
            ...rest,
        });
    } else {
        win = await browser.windows.create({
            focused: true,
            type: "popup",
            top,
            left,
            ...WINDOW_SIZE,
            ...rest,
        });
    }
    // shim firefox
    if (win.left !== left && currentWindow.state !== "fullscreen") {
        await browser.windows.update(win.id ?? 0, { left, top });
    }

    return win?.id ?? 0;
};

const remove = async (winId: number) => {
    return browser.windows.remove(winId);
};

const openNotification = ({ route = "", ...rest } = {}): Promise<number | undefined> => {
    const url = `popup.html${route && `#${route}`}`;

    return create({ url, ...rest });
};

export default {
    openNotification,
    event,
    remove,
};
