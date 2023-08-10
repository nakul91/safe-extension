import _ from "lodash";
import _truncate from "lodash/truncate";
import moment from "moment";

import {
  cardColors,
  currencies,
  GENERAL_ERR_MSG,
  IExtensionData,
  INVALID_REQUEST,
  MIN_VAL,
  RPC_ERROR_MSG,
  RPC_ERROR_MSG_INTERNAL,
  RPC_ERROR_MSG_INTERNAL_WITHOUT_INVALID_REQUEST,
  RPC_ERROR_MSG_UNKNOWN,
  SPL_CHAR_PATTERN,
  ZERO_USD,
  ALCHEMY_KEY,
} from "../constants";
import { CHAIN_LIST, IChainTypes } from "../constants/chains";
import { getWallet } from "../store/WalletStore";
import BigNumber from "bignumber.js";

export const getImage = (image: string) => {
  if (!image) {
    return;
  }
  return new URL(`../assets/images/${image}`, import.meta.url).href;
};

export const createLogoAvatar = (text: string, type = "medium", colorHex?: string) => {
  let firstLetter = "";
  if (text.length > 0) {
    firstLetter = text.slice(0, 1).toUpperCase();
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const img = document.createElement("img");
  switch (type) {
    case "large":
      canvas.width = 64;
      canvas.height = 64;
      ctx.font = "32px Inter";
      ctx.fillStyle = colorHex ? colorHex : "#B25622";
      ctx.textAlign = "center";
      ctx.fillText(firstLetter, 32, 42);
      img.src = canvas.toDataURL();
      return img.src;
    case "medium":
      canvas.width = 40;
      canvas.height = 40;
      ctx.font = "20px Inter";
      ctx.fillStyle = colorHex ? colorHex : "#B25622";
      ctx.textAlign = "center";
      ctx.fillText(firstLetter, 20, 27);
      img.src = canvas.toDataURL();
      return img.src;
    case "small":
      canvas.width = 24;
      canvas.height = 24;
      ctx.font = "14px Inter";
      ctx.fillStyle = colorHex ? colorHex : "#B25622";
      ctx.textAlign = "center";
      ctx.fillText(firstLetter, 12, 17);
      img.src = canvas.toDataURL();
      return img.src;
    case "xSmall":
      canvas.width = 16;
      canvas.height = 16;
      ctx.font = "10px Inter";
      ctx.fillStyle = colorHex ? colorHex : "#B25622";
      ctx.textAlign = "center";
      ctx.fillText(firstLetter, 8, 12);
      img.src = canvas.toDataURL();
      return img.src;
    default:
      break;
  }
};

export const shortenAddress = (str?: string, isLengther?: boolean, maxCharsCount = 15) => {
  if (!str) {
    return "";
  }
  if (str && isLengther) {
    return str.substring(0, maxCharsCount) + "..." + str.substring(str.length - maxCharsCount, str.length);
  } else if (str.length > 20) {
    return str.substring(0, 5) + "..." + str.substring(str.length - 4, str.length);
  }
  return str;
};

export const getSignedUsing = (signedUsing = "") => {
  if (signedUsing.length > 0 && signedUsing.includes("-")) {
    return signedUsing.split("-").length > 1 ? signedUsing.split("-")[1] : signedUsing;
  }
  return signedUsing;
};

export function removeDuplicateObjects(array: any): any {
  const uniqueObjects = new Set();
  for (const object of array) {
    uniqueObjects.add(object);
  }
  return Array.from(uniqueObjects);
}

export const getTokenFormattedNumber = (value: string, decimals: number, roundOff = true, fractions = 0) => {
  const _decimals = decimals || 18;
  const _value = parseFloat(value) || 0;
  const _expoValue = Math.pow(10, _decimals);
  let _calculated = _value / _expoValue;
  if (!roundOff) {
    return Number(_calculated);
  }
  let _decimalFixed = fractions;
  if (fractions == 0) {
    _decimalFixed = 2;
    if (_calculated < 100) {
      _decimalFixed = 6;
    }
  }
  const expo = Math.pow(10, _decimalFixed);
  _calculated = Math.floor(_calculated * expo) / expo;
  return Number(_calculated.toFixed(_decimalFixed));
};

export const getTokenValueFormatted = (val: number, fixedDigits = 6, showMinVal = true) => {
  const minVal = MIN_VAL;
  if (val == 0) {
    return "0";
  }
  if (val < minVal && showMinVal) {
    return "<" + minVal;
  } else {
    const expo = Math.pow(10, fixedDigits);
    val = Math.floor(val * expo) / expo;
    return val.toFixed(fixedDigits).replace(/(\.0*|(?<=(\..*))0*)$/, "");
  }
};

export const getNumFormatted = (val: number, dec = 6) => {
  const minVal = MIN_VAL;
  if (val < minVal || val == 0) {
    return "<" + minVal;
  } else {
    const expo = Math.pow(10, dec);
    val = Math.floor(val * expo) / expo;
    return val.toFixed(dec).replace(/(\.0*|(?<=(\..*))0*)$/, "");
  }
};

export const getExponentialFixedNumber = (num: number) => {
  return num.toString().includes("e")
    ? num.toFixed(20).replace(/(\.0*|(?<=(\..*))0*)$/, "")
    : num.toFixed(6).replace(/(\.0*|(?<=(\..*))0*)$/, "");
};

export const getCurrency = (abbreviation: string) => {
  const currency = currencies.find((cur) => cur.abbreviation === abbreviation);
  if (currency) {
    return currency;
  }
  return currencies[0];
};

export const getCurrencyFormattedNumber = (
  val: number | string,
  decimals = 2,
  currency = "USD",
  ignoreSmallVal = false
) => {
  if (typeof val === "string") {
    val = Number(val);
  }
  // let currencyPrefix = "";
  let currencySuffix = "";
  if (val === 0 || !val) {
    return ZERO_USD;
  } else if (val < 0 || val < 1) {
    if (val < 0.01 && !ignoreSmallVal) {
      return "<$0.01";
    }
  } else if (val > 999999999) {
    val = val / 1000000000;
    currencySuffix = "B";
  } else if (val > 999999) {
    val = val / 1000000; // convert to M for number from > 1 million
    currencySuffix = "M";
  }
  // Added to round down the number
  const expo = Math.pow(10, decimals);
  val = Math.floor(val * expo) / expo;
  const _val = val.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: decimals,
    currencyDisplay: "symbol",
  });
  if (!_val.includes("$")) {
    return "$" + _val + currencySuffix;
  }
  if (decimals === 2 && _val.includes(".") && _val.endsWith(".00")) {
    return _val.slice(0, -3) + currencySuffix;
  }
  return _val + currencySuffix;
};

export const getEstimatedFormattedTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  let formattedTime = "";
  if (hours > 0) {
    formattedTime += hours + " hr ";
  }
  if (minutes > 0) {
    formattedTime += minutes + " min ";
  }
  if (seconds > 0) {
    formattedTime += seconds + " sec";
  }
  return formattedTime.trim();
};

export const getPercentageFormatter = (val: number) => {
  if (val < 0) {
    val = Math.abs(val);
  }
  const expo = Math.pow(10, 2);
  val = Math.floor(val * expo) / expo;
  const _val = Number(val.toFixed(2));
  return _val + "%";
};

export function isVideo(url: string) {
  return /\.(mp4|mov|3gp|ogg)$/.test(url);
}

export const getAvatarSingleLetter = (name: string) => {
  if (name) {
    return name.substring(0, 1).toUpperCase();
  } else {
    return " ";
  }
};

export const isPositiveValue = (val: number) => {
  return val?.toString().includes("-") ? false : true;
};

export const getPercentArrowImage = (val: number, dark = false) => {
  if (dark) {
    return `${isPositiveValue(val) === true ? "arrow_up_green_dark.svg" : "arrow_down_red_dark.svg"}`;
  } else {
    return `${isPositiveValue(val) === true ? "arrow_up_green.svg" : "arrow_down_red.svg"}`;
  }
};

function generateRandom(min: number, max: number, numberArr: number[]) {
  const _n = Math.floor(Math.random() * max) + min;
  if (numberArr.includes(_n)) {
    generateRandom(min, max, numberArr);
  } else {
    return _n;
  }
}

export function randomNumbers(min: number, max: number, length: number): number[] {
  const n: number[] = [];
  while (n.length < length) {
    const _n = generateRandom(min, max, n);
    if (_n) {
      n.push(_n);
    }
  }
  return n;
}

export function generateUUID(): string {
  return crypto.randomUUID().toString();
}

export const capitalizeFirstLetter = (str: string) => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};

export const capitalizeWords = (str: string, lower = false) => {
  return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
};

export const formatDate = (str: string, isWithTime = false) => {
  return moment(str).format(`${isWithTime ? "ddd DD MMM YYYY, HH:mm:ss" : "MMM DD, YYYY"}`);
};

export const formatDateTime = (str: string) => {
  return moment(str).format("MMM DD, YYYY h:mm A");
};

export const getTransactionTime = (timeStamp: number) => {
  return moment.unix(timeStamp).format("hh:mm");
};

export const randomHeightGenerate = (index = 0) => {
  const preDefinedHeights = ["224px", "164px", "264px", "184px", "224px", "164px"];
  if (index >= 5) {
    const remainder = index % 5;
    if (remainder === 0) {
      return "284px";
    }
    const randomIndex = Math.abs(remainder);
    return preDefinedHeights[randomIndex];
  } else {
    return preDefinedHeights[index];
  }
};

export const chartJSGenerateGradient = (
  ctx: any,
  chartArea: any,
  color = { top: "rgba(4, 160, 88, 0.4)", bottom: "rgba(4, 160, 88, 0)" }
) => {
  let width, height, gradient;
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient?.addColorStop(0, color.top);
    gradient?.addColorStop(1, color.bottom);
  }

  return gradient;
};

export const browserSupported = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(window?.isExtension);
};

export const mnemonicToObjConverter = (mnemonic: string) => {
  const mnemonicArr = mnemonic.split(" ");
  const inputPhraseObj: Record<string, string> = {};
  mnemonicArr.forEach((_phrase, key) => {
    inputPhraseObj[String(key)] = _phrase;
  });
  return inputPhraseObj;
};

export const textFileUploadHandler = async (file: File): Promise<{ status: boolean; result: string }> => {
  let response = {
    status: true,
    result: "",
  };
  const fileName = file.name;
  const lastDot = fileName.lastIndexOf(".");
  const ext = fileName.slice(lastDot + 1);
  if (ext !== "txt") {
    return (response = {
      ...response,
      status: false,
    });
  }
  const fileReaderResponse = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (e) => {
      response = {
        ...response,
        result: e?.target?.result as unknown as string,
      };
      resolve(response);
    };
    fileReader.onerror = reject;
  });
  return fileReaderResponse
    .then(() => {
      return response;
    })
    .catch(() => {
      return { ...response, status: false };
    });
};

export const getPassStatus = async (): Promise<boolean> => {
  const wallet = getWallet();
  const unlock = await wallet?.isUnlocked();
  return unlock;
};

export const stringToHex = (val: string) => {
  return "0x" + Number(val).toString(16);
};

export const numberToHex = (val: number | string, append = true) => {
  if (Number.isNaN(val)) {
    return "0x0";
  }
  val = Math.trunc(Number(val)).toString(16);
  if (append) {
    return "0x" + val;
  } else {
    return val;
  }
};
export const hexToNumber = (val: string, divider = 1) => {
  return parseInt(val, 16) / divider;
};

export const getFixedBigNumber = (num: string) => {
  return new BigNumber(num).toFixed();
};

export const truncateText = (text = "", count = 22, separator = " ") => {
  if (text?.length < count) {
    return text;
  } else {
    return _truncate(text, { length: count, separator: separator });
  }
};

export const underline2Camelcase = (str: string) => {
  return str.replace(/_(.)/g, (m, p1) => p1.toUpperCase());
};

export const getClassMethods = (obj: unknown) => {
  return Object.getOwnPropertyNames(obj);
};

export const numHex = (num: number) => {
  return hexFormatter(num.toString(16));
};

export const hexFormatter = (hex: string) => {
  let a = hex;
  if (a.length % 2 > 0) {
    a = "0" + a;
  }
  return a;
};

export const str2bytes = (str: string) => {
  const bytes = new Uint8Array(Math.ceil(str.length / 2));
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(str.substr(i * 2, 2), 16);
  return bytes;
};

export const getOnlyMnemonicCode = (str: string) => {
  return str.replace(/[\W_]+/g, " ");
};

export const hasWhiteSpace = (str: string) => str.indexOf(" ") >= 0;

export const isHexString = (value: string) => {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  return true;
};

export const intToHex = (i: number) => {
  const hex = i.toString(16);
  return `0x${hex}`;
};

export const isHexPrefixed = (str: string) => {
  if (typeof str !== "string") {
    throw new Error(
      "[is-hex-prefixed] value must be type 'string', is currently type " +
        typeof str +
        ", while checking isHexPrefixed."
    );
  }

  return str.slice(0, 2) === "0x";
};

export const stripHexPrefix = (str: string) => {
  if (typeof str !== "string") {
    return str;
  }
  return isHexPrefixed(str) ? str.slice(2) : str;
};

export const bufferToHex = (unitArray: Uint8Array | Buffer) => {
  return Buffer.from(unitArray).toString("hex");
};

export const hexToBuffer = (hex: string) => {
  if (!hex.startsWith("0x")) {
    hex = "0x" + hex;
  }
  return Buffer.from(hex, "hex");
};

export const getExtensionName = () => {
  return window.navigator?.userAgentData?.platform ?? "";
};

export const internationalNumtoNormal = (num: string) => {
  const bal = Number(num.replaceAll(",", ""));
  return bal;
};

export const isValidInput = (input: string) => {
  const regex = /(\b)(on\S+)(\s*)=|javascript:|(<\s*)(\/*)script/gim;
  return !regex.test(input);
};

export const isStartsFrom0x = (input: string) => {
  return input.startsWith("0x") ? true : false;
};

export const getBroadcastChainId = (chainId: string | number) => {
  if (typeof chainId === "string") {
    return isStartsFrom0x(String(chainId) ?? "") ? String(hexToNumber(String(chainId) ?? "")) : chainId;
  } else if (typeof chainId === "number") {
    return stringToHex(String(chainId));
  }
  return chainId;
};

export const trimAuthRPCURL = (rpcURL: string) => {
  if (rpcURL) {
    const formattedRPC = rpcURL
      .replace(ALCHEMY_KEY, "")
      .replace(/([^:]\/)\/+/g, "$1")
      .trim();
    return formattedRPC;
  }
  return rpcURL;
};

export const getChainList = (editedNetworks: Partial<IChainTypes>[], customChain: Partial<IChainTypes>[]) => {
  const editedChainsIds = editedNetworks.length
    ? editedNetworks.map((nw) => {
        return nw.chainId;
      })
    : [];
  const chains = CHAIN_LIST.filter((_chain) => !editedChainsIds.includes(_chain.chainId));
  return [...chains, ...(editedNetworks ?? []), ...customChain];
};

export const localStore = {
  get: (Key: string) => {
    try {
      const _data = localStorage?.getItem(Key);
      return _data ? (isValidJsonString(_data) ? JSON.parse(_data) : _data) : "";
    } catch {
      return "";
    }
  },
  set: (Key: string, value: IExtensionData | string) => {
    return localStorage?.setItem(Key, (value && typeof value === "object" ? JSON.stringify(value) : value) as string);
  },
  remove: (Key: string) => {
    const _data = localStorage?.getItem(Key);
    if (_data) return localStorage?.removeItem(Key);
  },
  clear: () => {
    return localStorage?.clear();
  },
};

export const isValidJsonString = (jsonString: string | null) => {
  if (!jsonString) {
    return false;
  }
  try {
    var o = JSON.parse(jsonString);
    if (o && typeof o === "object") {
      return true;
    }
  } catch (e) {}
  return false;
};

// To be removed when the queuing of request is in place
export const getWindowTimeout = (icon: string | null) => {
  if (icon) {
    if (
      icon.includes("layer3.xyz") ||
      icon.includes("debank.com") ||
      icon.includes("zapper.fi") ||
      icon.includes("nansen.ai") ||
      icon.includes("zealy.io") ||
      icon.includes("nested.fi") ||
      icon.includes("dydx") ||
      icon.includes("learnweb3.io") ||
      icon.includes("zkbridge.com") ||
      icon.includes("deso.com") ||
      icon.includes("deso.org")
    ) {
      return 100;
    }
  }
  return 2000;
};
