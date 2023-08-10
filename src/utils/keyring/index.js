/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import AES from "aes-js";
import { Buffer } from "buffer";
import SHA256 from "crypto-js/sha256";
import { scrypt } from "scrypt-js";

// CPU / memory cost parameter – Must be a power of 2 (e.g. 1024)
const COST_FACTOR = 8192;
// blocksize parameter, which fine-tunes sequential memory read size and performance. (8 is commonly used)
const BLOCK_SIZE_FACTOR = 8;
// Desired key length in bytes (Intended output length in octets of the derived key; a positive integer satisfying dkLen ≤ (232− 1) * hLen.)
const DESIRED_KEY_LENGTH = 32;
// Parallelization parameter
const PARALLELIZATION = 1;

export default class KeyringControllerScrypt {
    constructor() {
        this.keystore = "";
    }

    getEncryptedData() {
        const _data = {
            data: this.keystore,
            encryption: "scrypt",
            message: "success",
            status: 1,
        };
        return _data;
    }

    async encrypt({ password, text, n = COST_FACTOR }) {
        if (typeof text !== "string") {
            return {
                data: {},
                message: "Text needs to be of form string or json serialized",
                status: 1,
            };
        }
        let random = new Uint8Array(32);
        crypto.getRandomValues(random);
        const salt = Buffer.from(random).toString("hex");
        const scryptParams = {
            salt,
            dklen: DESIRED_KEY_LENGTH,
            n,
            r: BLOCK_SIZE_FACTOR,
            p: PARALLELIZATION,
        };

        const bufP = Buffer.from(password);
        const derivedKey = await scrypt(
            bufP,
            Buffer.from(scryptParams.salt, "hex"),
            scryptParams.n,
            scryptParams.r,
            scryptParams.p,
            scryptParams.dklen,
            (error, _, key) => {
                if (error) {
                    return;
                } else if (key) {
                    Buffer.from(key);
                }
            },
        );
        const buf = Buffer.from(text);
        random = new Uint8Array(16);
        crypto.getRandomValues(random);
        const iv = Buffer.from(random);
        const counter = new AES.Counter(0);
        counter.setBytes(iv);
        const aesCtr = new AES.ModeOfOperation.ctr(derivedKey, counter);

        const ciphertext = Buffer.from(aesCtr.encrypt(buf));
        const _derivedKey = Buffer.from(derivedKey.slice(derivedKey.length / 2));
        const mac = this.sha256(Buffer.concat([_derivedKey, ciphertext]));
        this.keystore = JSON.stringify({
            cipher: "aes-128-ctr",
            cipherparams: {
                iv: iv.toString("hex"),
            },
            ciphertext: ciphertext.toString("hex"),
            kdf: "scrypt",
            kdfparams: scryptParams,
            mac: mac.toString("hex"),
        });

        return await new Promise((resolve, reject) => {
            if (this.keystore) {
                const _data = this.getEncryptedData();
                resolve(_data);
            } else {
                reject({
                    data: {},
                    encryption: "scrypt",
                    message: "Error encrypting data",
                    status: 0,
                });
            }
        });
    }

    async decrypt({ password, encryptedJson }) {
        let _encryptedData = "";
        if (!password) {
            return JSON.stringify({
                data: {},
                encryption: "",
                message: "Valid password required!",
                status: 0,
            });
        }
        if (!encryptedJson.data) {
            return JSON.stringify({
                data: {},
                encryption: "",
                message: "Scrypt Params missing",
                status: 0,
            });
        } else {
            try {
                _encryptedData = encryptedJson.data;
            } catch (err) {
                console.log(err, "Error in JSON parse");
            }
        }

        if (!Object.keys(_encryptedData).includes("crypto")) {
            return JSON.stringify({
                data: {},
                encryption: "",
                message: "Required Params required!",
                status: 0,
            });
        }

        let _data = Buffer.from(
            await this.decrypt_helper(password, _encryptedData),
        ).toString();
        return await new Promise((response, reject) => {
            if (_data) {
                response({ data: _data, message: "Successfully Decrypted", status: 1 });
            } else {
                response({ data: _data, message: "Failed Decryption", status: 0 });
            }
        });
    }

    async decrypt_helper(password, encryptedData) {
        const {
            kdfparams,
            cipherparams,
            ciphertext,
            mac: keyStoreMac,
        } = encryptedData.crypto;
        const bufP = Buffer.from(password);

        const derivedKey = await scrypt(
            bufP,
            Buffer.from(kdfparams.salt, "hex"),
            kdfparams.n,
            kdfparams.r,
            kdfparams.p,
            kdfparams.dklen,
            (error, _, key) => {
                if (error) {
                    return;
                } else if (key) {
                    Buffer.from(key);
                }
            },
        );

        const counter = new AES.Counter(0);
        counter.setBytes(Buffer.from(cipherparams.iv, "hex"));
        const aesCtr = new AES.ModeOfOperation.ctr(derivedKey, counter);

        const mac = this.sha256(
            Buffer.concat([
                Buffer.from(derivedKey.slice(derivedKey.length / 2), "hex"),
                Buffer.from(ciphertext, "hex"),
            ]),
        );
        if (!mac.equals(Buffer.from(keyStoreMac, "hex"))) {
            return "";
        }

        return Buffer.from(aesCtr.decrypt(Buffer.from(ciphertext, "hex"))).toString();
    }

    sha256(buf) {
        return Buffer.from(SHA256(buf).words, "hex");
    }
}
