/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  addHexPrefix,
  arrToBufArr,
  bufferToHex,
  bufferToInt,
  ecrecover,
  ecsign,
  fromRpcSig,
  fromSigned,
  hashPersonalMessage,
  publicToAddress,
  toBuffer,
  ToBufferInputTypes,
  toUnsigned,
} from "@ethereumjs/util";
import { Buffer } from "buffer";
import { keccak256 } from "ethereum-cryptography/keccak";
import { box as naclBox } from "tweetnacl";
import Web3 from "web3";
import { CHAINS_IDS } from "../../../constants";
import { intToHex, isHexString, stripHexPrefix } from "../../../utils";
import { rawEncode, solidityPack } from "../ethereumjsAbiUtils";
import { WalletControllerClass } from "../walletController";

export type TTypedDataV1 = ITypedDataV1Field[];
export interface ITypedDataV1Field {
  name: string;
  type: string;
  value: any;
}

export enum SIGN_TYPED_DATA {
  V1 = "V1",
  V3 = "V3",
  V4 = "V4",
}

export interface IMessageTypeProperty {
  name: string;
  type: string;
}

export interface IMessageTypes {
  EIP712Domain: IMessageTypeProperty[];
  [additionalProperties: string]: IMessageTypeProperty[];
}

export interface ITypedMessage<T extends IMessageTypes> {
  types: T;
  primaryType: keyof T;
  domain: {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: ArrayBuffer;
  };
  message: Record<string, unknown>;
}

export const TYPED_MESSAGE_SCHEMA = {
  type: "object",
  properties: {
    types: {
      type: "object",
      additionalProperties: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            type: { type: "string" },
          },
          required: ["name", "type"],
        },
      },
    },
    primaryType: { type: "string" },
    domain: { type: "object" },
    message: { type: "object" },
  },
  required: ["types", "primaryType", "domain", "message"],
};

interface IEthEncryptedData {
  version: string;
  nonce: string;
  ephemPublicKey: string;
  ciphertext: string;
}

export const decodeBase64 = (s: string) => new Uint8Array(Buffer.from(s, "base64"));
export const encodeBase64 = (arr: ArrayBuffer | SharedArrayBuffer) => Buffer.from(arr).toString("base64");
export const encryptedDataStringToJson = (strData: string) => {
  return JSON.parse(Web3.utils.hexToUtf8(strData));
};
export const naclDecodeHex = (msgHex: string): Uint8Array =>
  decodeBase64(Buffer.from(msgHex, "hex").toString("base64"));
export const encodeUTF8 = (arr: Uint8Array) => {
  const s = [];
  for (let i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
  return decodeURIComponent(escape(s.join("")));
};

export const parseTypeArray = (type: string) => {
  const tmp = type.match(/(.*)\[(.*?)\]$/u);
  if (tmp) {
    return tmp[2] === "" ? "dynamic" : parseInt(tmp[2], 10);
  }
  return null;
};

export const isArray = (type: any) => {
  return type?.lastIndexOf("]") === type?.length - 1;
};

export const elementaryName = (name: string) => {
  if (name.startsWith("int[")) {
    return `int256${name.slice(3)}`;
  } else if (name === "int") {
    return "int256";
  } else if (name.startsWith("uint[")) {
    return `uint256${name.slice(4)}`;
  } else if (name === "uint") {
    return "uint256";
  } else if (name.startsWith("fixed[")) {
    return `fixed128x128${name.slice(5)}`;
  } else if (name === "fixed") {
    return "fixed128x128";
  } else if (name.startsWith("ufixed[")) {
    return `ufixed128x128${name.slice(6)}`;
  } else if (name === "ufixed") {
    return "ufixed128x128";
  }
  return name;
};

export const isNullish = <T>(value: T): boolean => {
  return value === null || value === undefined;
};
export const legacyToBuffer = (value: ToBufferInputTypes) => {
  return typeof value === "string" && !isHexString(value) ? Buffer.from(value) : toBuffer(value);
};

export const numberToBuffer = (num: number) => {
  const hexVal = num.toString(16);
  const prepend = hexVal.length % 2 ? "0" : "";
  return Buffer.from(prepend + hexVal, "hex");
};

class EthSigner {
  signEthTransaction = async (wallet: WalletControllerClass, params: any) => {
    try {
      const selectedChain = (await wallet.getSelectedWallet())?.selectedChain;
      let chain = selectedChain?.chain ?? "";
      const customChains = await wallet.getCustomChains();
      const editedChains = await wallet.getEditedNetworks();
      const isCustomChain = true;
      if (isCustomChain) {
        chain = CHAINS_IDS.ETHEREUM;
      }
      const key = (await wallet.getKeyRings())[chain].private;
      const jsonRpc = "";
      if (key && jsonRpc) {
        const web3 = new Web3(jsonRpc);
        const web3Wallet = web3.eth.accounts.privateKeyToAccount(key);
        web3.eth.accounts.wallet.add(web3Wallet);
        const { gasPrice, gasLimit, nonce, isApprovalRequired, allowanceData } = params;

        let transaction;

        transaction = {
          to: params.to,
          from: params.from,
          value: addHexPrefix(params.value) ?? "",
          gas: gasLimit,
          gasPrice: Math.round(gasPrice * Math.pow(10, 9)),
          nonce,
          data: isApprovalRequired ? allowanceData : params.data,
          chainId: Number(selectedChain.chainId),
        };

        try {
          const signedTransaction = await web3.eth.accounts.signTransaction(transaction, key);
          return signedTransaction.rawTransaction;
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  encryptionPublicKey = (privateKey: string) => {
    const privateKeyUint8Array = naclDecodeHex(privateKey);
    const encryptionPublicKey = naclBox.keyPair.fromSecretKey(privateKeyUint8Array).publicKey;
    return encodeBase64(encryptionPublicKey);
  };

  naclDecrypt = ({ encryptedData, privateKey }: { encryptedData: IEthEncryptedData; privateKey: string }): string => {
    switch (encryptedData.version) {
      case "x25519-xsalsa20-poly1305": {
        const recieverPrivateKeyUint8Array = naclDecodeHex(privateKey);
        const recieverEncryptionPrivateKey = naclBox.keyPair.fromSecretKey(recieverPrivateKeyUint8Array).secretKey;
        const nonce = decodeBase64(encryptedData.nonce);
        const ciphertext = decodeBase64(encryptedData.ciphertext);
        const ephemPublicKey = decodeBase64(encryptedData.ephemPublicKey);
        const decryptedMessage = naclBox.open(ciphertext, nonce, ephemPublicKey, recieverEncryptionPrivateKey);
        let output;
        try {
          if (decryptedMessage) {
            output = encodeUTF8(decryptedMessage);
            return output;
          } else {
            throw new Error("Decryption failed.");
          }
        } catch (err) {
          throw new Error("Decryption failed.");
        }
      }
      default:
        throw new Error("Encryption type/version not supported.");
    }
  };
  // eth_decrypt
  decrypt = (encryptedDataStr: string, privateKey: string) => {
    const encryptedData = encryptedDataStringToJson(encryptedDataStr);
    return this.naclDecrypt({ encryptedData, privateKey: privateKey });
  };
  // personal_sign
  personalSign({ privateKey, data }: { privateKey: Buffer; data: ToBufferInputTypes }): string {
    if (isNullish(data)) {
      throw new Error("Missing data parameter");
    } else if (isNullish(privateKey)) {
      throw new Error("Missing privateKey parameter");
    }

    const message = legacyToBuffer(data);
    const msgHash = hashPersonalMessage(message);
    const sig = ecsign(msgHash, privateKey);
    const serialized = this.concatSig(toBuffer(sig.v), sig.r, sig.s);
    return serialized;
  }
  // personal_ecRecover
  recoverPersonalSignature({ data, signature }: { data: ToBufferInputTypes; signature: string }): string {
    if (isNullish(data)) {
      throw new Error("Missing data parameter");
    } else if (isNullish(signature)) {
      throw new Error("Missing signature parameter");
    }
    const publicKey = this.getPublicKeyFor(data, signature);
    const sender = publicToAddress(publicKey);
    const senderHex = bufferToHex(sender);
    return senderHex;
  }

  getPublicKeyFor(message: ToBufferInputTypes, signature: string): Buffer {
    const messageHash = hashPersonalMessage(legacyToBuffer(message));
    return this.recoverPublicKey(messageHash, signature);
  }

  recoverPublicKey(messageHash: Buffer, signature: string): Buffer {
    const sigParams = fromRpcSig(signature);
    return ecrecover(messageHash, sigParams.v, sigParams.r, sigParams.s);
  }
  padWithZeroes(hexString: string, targetLength: number): string {
    if (hexString !== "" && !/^[a-f0-9]+$/iu.test(hexString)) {
      throw new Error(`Expected an unprefixed hex string. Received: ${hexString}`);
    }

    if (targetLength < 0) {
      throw new Error(`Expected a non-negative integer target length. Received: ${targetLength}`);
    }

    return String.prototype.padStart.call(hexString, targetLength, "0");
  }

  concatSig(v: Buffer, r: Buffer, s: Buffer): string {
    const rSig = fromSigned(r);
    const sSig = fromSigned(s);
    const vSig = bufferToInt(v);
    const rStr = this.padWithZeroes(toUnsigned(rSig).toString("hex"), 64);
    const sStr = this.padWithZeroes(toUnsigned(sSig).toString("hex"), 64);
    const vStr = stripHexPrefix(intToHex(vSig));
    return addHexPrefix(rStr.concat(sStr, vStr));
  }
  validateVersion(version: SIGN_TYPED_DATA, allowedVersions?: SIGN_TYPED_DATA[]) {
    if (!Object.keys(SIGN_TYPED_DATA).includes(version)) {
      throw new Error(`Invalid version: '${version}'`);
    } else if (allowedVersions && !allowedVersions.includes(version)) {
      throw new Error(`SIGN_TYPED_DATA not allowed: '${version}'. Allowed versions are: ${allowedVersions.join(", ")}`);
    }
  }

  recoverTypedSignature<T extends SIGN_TYPED_DATA, U extends IMessageTypes>({
    data,
    signature,
    version,
  }: {
    data: T extends "V1" ? TTypedDataV1 : ITypedMessage<U>;
    signature: string;
    version: T;
  }): string {
    this.validateVersion(version);
    if (isNullish(data)) {
      throw new Error("Missing data parameter");
    } else if (isNullish(signature)) {
      throw new Error("Missing signature parameter");
    }
    const messageHash =
      version === SIGN_TYPED_DATA.V1
        ? this._typedSignatureHash(data as TTypedDataV1)
        : this.eip712Hash(
            //@ts-ignore
            data as ITypedMessage<T>,
            version as SIGN_TYPED_DATA.V3 | SIGN_TYPED_DATA.V4
          );
    const publicKey = this.recoverPublicKey(messageHash, signature);
    const sender = publicToAddress(publicKey);
    return bufferToHex(sender);
  }

  typedSignatureHash(typedData: ITypedDataV1Field[]): string {
    const hashBuffer = this._typedSignatureHash(typedData);
    return bufferToHex(hashBuffer);
  }
  _typedSignatureHash(typedData: TTypedDataV1): Buffer {
    const error = new Error("Expect argument to be non-empty array");
    if (typeof typedData !== "object" || !("length" in typedData) || !typedData.length) {
      throw error;
    }

    const data = typedData.map(function (e) {
      if (e.type !== "bytes") {
        return e.value;
      }

      return legacyToBuffer(e.value);
    });
    const types = typedData.map(function (e) {
      return e.type;
    });
    const schema = typedData.map(function (e) {
      if (!e.name) {
        throw error;
      }
      return `${e.type} ${e.name}`;
    });

    return arrToBufArr(
      keccak256(
        solidityPack(
          ["bytes32", "bytes32"],
          [
            keccak256(solidityPack(new Array(typedData.length).fill("string"), schema)),
            keccak256(solidityPack(types, data)),
          ]
        )
      )
    );
  }

  eip712Hash<T extends IMessageTypes>(
    typedData: ITypedMessage<T>,
    version: SIGN_TYPED_DATA.V3 | SIGN_TYPED_DATA.V4
  ): Buffer {
    this.validateVersion(version, [SIGN_TYPED_DATA.V3, SIGN_TYPED_DATA.V4]);

    const sanitizedData = this.sanitizeData(typedData);
    const parts = [Buffer.from("1901", "hex")];
    parts.push(this.hashStruct("EIP712Domain", sanitizedData.domain, sanitizedData.types, version));

    if (sanitizedData.primaryType !== "EIP712Domain") {
      parts.push(
        this.hashStruct(
          // TODO: Validate that this is a string, so this type cast can be removed.
          sanitizedData.primaryType as string,
          sanitizedData.message,
          sanitizedData.types,
          version
        )
      );
    }
    return arrToBufArr(keccak256(Buffer.concat(parts)));
  }

  sanitizeData<T extends IMessageTypes>(data: ITypedMessage<T>): ITypedMessage<T> {
    const sanitizedData: Partial<ITypedMessage<T>> = {};
    for (const key in TYPED_MESSAGE_SCHEMA.properties) {
      //@ts-ignore
      if (data[key]) {
        //@ts-ignore
        sanitizedData[key] = data[key];
      }
    }

    if ("types" in sanitizedData) {
      //@ts-ignore
      sanitizedData.types = { EIP712Domain: [], ...sanitizedData.types };
    }
    return sanitizedData as Required<ITypedMessage<T>>;
  }

  // eth_signTypedData
  signTypedData<V extends SIGN_TYPED_DATA, T extends IMessageTypes>({
    privateKey,
    data,
    version,
  }: {
    privateKey: Buffer;
    data: V extends "V1" ? TTypedDataV1 : ITypedMessage<T>;
    version: V;
  }): string {
    this.validateVersion(version);
    if (isNullish(data)) {
      throw new Error("Missing data parameter");
    } else if (isNullish(privateKey)) {
      throw new Error("Missing private key parameter");
    }

    const messageHash =
      version === SIGN_TYPED_DATA.V1
        ? this._typedSignatureHash(data as TTypedDataV1)
        : this.eip712Hash(data as ITypedMessage<T>, version as SIGN_TYPED_DATA.V3 | SIGN_TYPED_DATA.V4);
    const sig = ecsign(messageHash, privateKey);
    return this.concatSig(toBuffer(sig.v), sig.r, sig.s);
  }

  hashStruct(
    primaryType: string,
    data: Record<string, unknown>,
    types: Record<string, IMessageTypeProperty[]>,
    version: SIGN_TYPED_DATA.V3 | SIGN_TYPED_DATA.V4
  ): Buffer {
    this.validateVersion(version, [SIGN_TYPED_DATA.V3, SIGN_TYPED_DATA.V4]);

    return arrToBufArr(keccak256(this.encodeData(primaryType, data, types, version)));
  }

  encodeData(
    primaryType: string,
    data: Record<string, unknown>,
    types: Record<string, IMessageTypeProperty[]>,
    version: SIGN_TYPED_DATA.V3 | SIGN_TYPED_DATA.V4
  ): Buffer {
    this.validateVersion(version, [SIGN_TYPED_DATA.V3, SIGN_TYPED_DATA.V4]);

    const encodedTypes = ["bytes32"];
    const encodedValues: unknown[] = [this.hashType(primaryType, types)];

    for (const field of types[primaryType]) {
      if (version === SIGN_TYPED_DATA.V3 && data[field.name] === undefined) {
        continue;
      }
      const [type, value] = this.encodeField(types, field.name, field.type, data[field.name], version);
      encodedTypes.push(type);
      encodedValues.push(value);
    }

    return rawEncode(encodedTypes, encodedValues);
  }

  hashType(primaryType: string, types: Record<string, IMessageTypeProperty[]>): Buffer {
    const encodedHashType = Buffer.from(this.encodeType(primaryType, types), "utf-8");
    return arrToBufArr(keccak256(encodedHashType));
  }
  encodeType(primaryType: string, types: Record<string, IMessageTypeProperty[]>): string {
    let result = "";
    const unsortedDeps = this.findTypeDependencies(primaryType, types);
    unsortedDeps.delete(primaryType);

    const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
    for (const type of deps) {
      const children = types[type];
      if (!children) {
        throw new Error(`No type definition specified: ${type}`);
      }

      result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
    }

    return result;
  }

  findTypeDependencies(
    primaryType: string,
    types: Record<string, IMessageTypeProperty[]>,
    results: Set<string> = new Set()
  ): Set<string> {
    // @ts-ignore
    [primaryType] = primaryType.match(/^\w*/u);
    if (results.has(primaryType) || types[primaryType] === undefined) {
      return results;
    }

    results.add(primaryType);

    for (const field of types[primaryType]) {
      this.findTypeDependencies(field.type, types, results);
    }
    return results;
  }

  encodeField(
    types: Record<string, IMessageTypeProperty[]>,
    name: string,
    type: string,
    value: any,
    version: SIGN_TYPED_DATA.V3 | SIGN_TYPED_DATA.V4
  ): [type: string, value: any] {
    this.validateVersion(version, [SIGN_TYPED_DATA.V3, SIGN_TYPED_DATA.V4]);

    if (types[type] !== undefined) {
      return [
        "bytes32",
        version === SIGN_TYPED_DATA.V4 && value == null // eslint-disable-line no-eq-null
          ? "0x0000000000000000000000000000000000000000000000000000000000000000"
          : arrToBufArr(keccak256(this.encodeData(type, value, types, version))),
      ];
    }

    if (value === undefined) {
      throw new Error(`missing value for field ${name} of type ${type}`);
    }

    if (type === "bytes") {
      if (typeof value === "number") {
        value = numberToBuffer(value);
      } else if (isHexString(value)) {
        value = numberToBuffer(parseInt(value, 16));
      } else {
        value = Buffer.from(value, "utf8");
      }
      return ["bytes32", arrToBufArr(keccak256(value))];
    }

    if (type === "string") {
      if (typeof value === "number") {
        value = numberToBuffer(value);
      } else {
        value = Buffer.from(value ?? "", "utf8");
      }
      return ["bytes32", arrToBufArr(keccak256(value))];
    }

    if (type.lastIndexOf("]") === type.length - 1) {
      if (version === SIGN_TYPED_DATA.V3) {
        throw new Error("Arrays are unimplemented in encodeData; use V4 extension");
      }
      const parsedType = type.slice(0, type.lastIndexOf("["));
      const typeValuePairs = value.map((item: any) => this.encodeField(types, name, parsedType, item, version));
      return [
        "bytes32",
        arrToBufArr(
          keccak256(
            rawEncode(
              //@ts-ignore
              typeValuePairs.map(([t]) => t),
              //@ts-ignore
              typeValuePairs.map(([, v]) => v)
            )
          )
        ),
      ];
    }

    return [type, value];
  }
}

export default new EthSigner();
