import { EventEmitter } from "events";
import browser from "webextension-polyfill";

const tabEvent = new EventEmitter();

browser.tabs.onUpdated.addListener(
    (tabId: number, changeInfo: browser.Tabs.OnUpdatedChangeInfoType) => {
        if (changeInfo.url) {
            tabEvent.emit("tabUrlChanged", tabId, changeInfo.url);
        }
    },
);

// window close will trigger this event also
browser.tabs.onRemoved.addListener((tabId: number) => {
    tabEvent.emit("tabRemove", tabId);
});

const createTab = async (url: string): Promise<number> => {
    const tab = await browser.tabs.create({
        active: true,
        url,
    });

    return tab?.id ?? 0;
};

const openIndexPage = (route = ""): Promise<number | undefined> => {
    const url = `index.html${route && `#${route}`}`;

    return createTab(url);
};

export default tabEvent;

export { createTab, openIndexPage };
