import browser from "webextension-polyfill";

export default class ExtensionPlatform {
  window: Window;
  constructor(self?: Window) {
    this.window = self ?? window;
  }
  checkForError() {
    const { lastError } = browser.runtime;
    if (!lastError) {
      return undefined;
    }
    // if it quacks like an Error, its an Error
    if (lastError.message) {
      return lastError;
    }
    // repair incomplete error object (eg chromium v77)
    return new Error(lastError.message);
  }

  reload() {
    browser.runtime.reload();
  }

  openTab(options: browser.Tabs.CreateCreatePropertiesType) {
    return new Promise((resolve, reject) => {
      browser.tabs.create(options).then((newTab) => {
        const error = this.checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(newTab);
      });
    });
  }

  openWindow(options: browser.Tabs.CreateCreatePropertiesType) {
    return new Promise((resolve, reject) => {
      browser.windows.create(options).then((newWindow) => {
        const error = this.checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(newWindow);
      });
    });
  }

  focusWindow(windowId: number) {
    return new Promise<void>((resolve, reject) => {
      browser.windows.update(windowId, { focused: true }).then(() => {
        const error = this.checkForError();
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    });
  }

  currentTab() {
    return new Promise((resolve, reject) => {
      browser.tabs.getCurrent().then((tab) => {
        const err = this.checkForError();
        if (err) {
          reject(err);
        } else {
          resolve(tab);
        }
      });
    });
  }

  switchToTab(tabId: number) {
    return new Promise((resolve, reject) => {
      browser.tabs.update(tabId, { highlighted: true }).then((tab) => {
        const err = this.checkForError();
        if (err) {
          reject(err);
        } else {
          resolve(tab);
        }
      });
    });
  }

  closeTab(tabId: number) {
    return new Promise<void>((resolve, reject) => {
      browser.tabs.remove(tabId).then(() => {
        const err = this.checkForError();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  openExtensionInBrowser(route = null, queryString = null, keepWindowOpen = false) {
    let extensionURL = browser.runtime.getURL("popup.html");

    if (route) {
      extensionURL += `#${route}`;
    } else {
      extensionURL += `#/signin?fullscreen=true`;
    }

    if (queryString) {
      extensionURL += `?${queryString}`;
    }

    this.openTab({ url: extensionURL });
    if (!keepWindowOpen) {
      if (this.window) {
        this?.window?.close?.();
      }
    }
  }
}
