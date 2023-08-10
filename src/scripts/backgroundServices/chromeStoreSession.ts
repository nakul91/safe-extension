import CryptoJS, { AES, enc } from "crypto-js";
import { Buffer } from "buffer";
import { appIv } from "../../constants";

export class ChromeStoreSession {
    async getStoreSession(): Promise<{
        [key: string]: any;
    }> {
        return chrome.storage.session.get();
    }

    async setStoreSession(items: { [key: string]: any }): Promise<void> {
        const sessions = await this.getStoreSession();
        if (Object.keys(sessions).length) {
            const data = {
                ...sessions,
                ...items,
            };
            return chrome.storage.session.set(data);
        }
        return chrome.storage.session.set(items);
    }

    async clearStoreSession(): Promise<void> {
        chrome.storage.session.clear();
    }

    saltGenerator() {
        let random = new Uint8Array(32);
        crypto.getRandomValues(random);
        const salt = Buffer.from(random).toString("hex");
        return salt;
    }

    aesEncrypt(data: { msg: string; salt: string }) {
        const iv = CryptoJS.enc.Utf8.parse(appIv);
        return AES.encrypt(data.msg, data.salt, { iv: iv }).toString();
    }

    aesDecrypt(data: { encryptedData: string; salt: string }) {
        const iv = CryptoJS.enc.Utf8.parse(appIv);
        return AES.decrypt(data.encryptedData, data.salt, { iv: iv }).toString(enc.Utf8);
    }
}
