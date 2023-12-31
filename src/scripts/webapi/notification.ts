import browser from "webextension-polyfill";

import { createTab } from "./tab";

browser.notifications.onClicked.addListener((url: string) => {
  if (url.startsWith("https://")) {
    createTab(url.split("_randomId_")[0]);
  }
});

const create = (url: string | undefined, title: string, message: string, priority = 0) => {
  const randomId = +new Date();
  browser.notifications.create(url && `${url}_randomId_=${randomId}`, {
    type: "basic",
    title,
    iconUrl: "",
    message,
    priority,
  });
};

export default { create };
