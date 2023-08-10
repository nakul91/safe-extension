import browser from "webextension-polyfill";

import { browserSupported } from "../utils";
import ExtensionData from "../utils/datahandler";
import { checkOnBoardingComplete } from "./utils";

document.addEventListener("DOMContentLoaded", async () => {
  // checkOnBoardingComplete();
  if (browserSupported()) {
    browser.runtime.sendMessage({ popupOpen: true }).then(() => {
      const _extensionData = new ExtensionData();
      _extensionData.setDefaultData();
    });
  }
});
