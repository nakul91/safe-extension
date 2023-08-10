import { lib, mode, pad } from "crypto-js";

export const APP_NAME = "Safe chrome extension wallet";

export const BASE_UNIT = 10e8;
export const EXT_CURRENT_VERSION = "1.0.0";
export const COSMOS_BASE_UNIT = 1e6;
export const DEFAULT_GASLIMIT_EVM = 21000;
export const DEFAULT_EVM_CONTRACT_DECIMALS = 18;

export const DEFAULT_CURVE = "secp256k1";
export const DEFAULT_CHAIN_ID = "ethereum";
export const DEFAULT_CHAIN_ID_NUM = "1";
export const DEFAULT_TIMEOUT = 2000;

export const ENVIRONMENT_TYPE_POPUP = "popup";
export const ENVIRONMENT_TYPE_FULLSCREEN = "fullscreen";
export const ENVIRONMENT_TYPE_BACKGROUND = "background";

export const PLATFORM_BRAVE = "Brave";
export const PLATFORM_CHROME = "Chrome";
export const PLATFORM_EDGE = "Edge";
export const PLATFORM_FIREFOX = "Firefox";
export const PLATFORM_OPERA = "Opera";
export const BLOCKHASH_NOT_FOUND = "Blockhash not found";
export const BLOCKHASHNOTFOUND = "BlockhashNotFound";
export const NONCE_TOO_LOW = "nonce";
export const NOT_ENOUGH_ALLOWANCE = "not enough allowance";
export const NOT_ENOUGH_ALLOWANCE_REGEX = /Not enough \w+ allowance given to TokenTransferProxy\(\w+\)/i;
export const RATE_LIMIT_EXCEEDED = "rate limit exceeded";
export const RATE_LIMIT_EXCEEDED_REGEX = /rate limit exceeded/;
export const TOKEN_TRANSFER_NOT_ALLOWED_REGEX = /token transfer not allowed/i;
export const GWEI = "Gwei";
export const ALCHEMY_KEY = "GVkrt_8cLHv1Yi04m7lqZ2dbteVprcjQ";
export const SOLANA_CONTRACT = "So11111111111111111111111111111111111111112";
export const HEX_ADDR = "Hex";
export const ERROR_TX = "error";
export const RPC_ERROR_MSG = "rpc error: code = NotFound desc = Not Found:";
export const RPC_ERROR_MSG_UNKNOWN = "rpc error: code = Unknown desc = Bad Request:";
export const RPC_ERROR_MSG_INTERNAL = "rpc error: code = Internal desc = Invalid Request:";
export const RPC_ERROR_MSG_INTERNAL_WITHOUT_INVALID_REQUEST = "rpc error: code = Internal desc = ";
export const INVALID_REQUEST = "Invalid Request:";
export const NON_EVM_GASLIMIT = 75000;
export const COSMOS_GASLIMIT = 100000;
export const NON_EVM_GASPRICE = 1000000000;
export const SUBSTRATE_PREFIX = 0;
export const POLKADOT_DEFAULT_CURVE = "sr25519";
export const MIN_VAL = 0.000001;
export const MAXIMUM_PROVIDER_ADDRESSES = 100;
export const ADDRESS_PER_PAGE = 10;
export const FIREBASE_VAPID_KEY =
  "BNogvjueJ7XyuTEb5mZ8eDeGp_-5vNEGGd2PxD15JIggu8WpPSQ5MmpAYjQ1IpilXJnohgxz0rDsnuuwNjQz2I8";
export const ZERO_USD = "$0";
export const debankAccessKey: string | undefined = import.meta.env.VITE_APP_DEBANK_API_KEY;
export const ENKRYPT_HANDLER = "$$";
export const enkryptKey: string = import.meta.env.VITE_APP_BASIC_ENCRYPT_KEY ?? "";
export const ENVIRONMENT_MODE: string = import.meta.env.VITE_APP_ENV ?? "development";
export const PRODUCTION_ENV: string = "production";
export const appIv: string = import.meta.env.VITE_APP_SECRET_IV;
export const DEFAULT_MEMO = "Transfer via Saffe";
export const defiLamaIconUrl = "https://icons.llamao.fi/icons/chains/";

export const coinbaseApiKey = "b2344327-b666-4c20-8dc7-6624aff7e450";
export const moonpayApiKey = "pk_live_i3GEgJrxYqN3WDJwu4c4qb7DXyO74";
export const junoApiKey = "live_th2t6ysuok4xu11gykm2p65e";
export const DUMMY_PRVKEY = "64b1857dcdc1652dbc161189fc4d431265b1ac5a30256204badab0ec14a9cfb3";
export const LIVE_EXTENSION_ID = "kppfdiipphfccemcignhifpjkapfbihd";
export const GENERAL_ERR_MSG = "Something went wrong please try again";
export const SPL_CHAR_PATTERN = /[`#%^()+\=\[\]{}:\\\/~]/;
export const DEMO_INFURA_API_KEY = "9aa3d95b3bc440fa88ea12eaa4456161";
export const HOME_FULLSCREEN_URL = "/home?fullscreen=true";
export const HOME_URL = "/home";
export const APPROVAL_URL = "/approval";
export const APP_STATE = "appState";
export const APP_REDIRECTION = "redirection";
export const abiString =
  '[{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
export const unlimitedAllowance = "79228162514264337593543950335";
export const DEFAULT_MEMO_MESSAGE = "Swap via Safe";

export enum BRIDGE_PROVIDER {
  LIFI = "lifi",
  XY = "xy",
  ROUTER = "router",
  SOCKET = "socket",
  DEBRIDGE = "debridge",
  RANGO = "rango",
}

export enum TOKEN_LENGTH {
  SHORT = 10,
  LONG = 20,
}

export enum CHAR_COUNT {
  TEN = 10,
  TWELVE = 12,
  FIFTEEN = 15,
  TWENTY = 20,
  TWENTY_TWO = 22,
  TWENTY_EIGHT = 28,
  THIRTY_TWO = 32,
  THIRTY_FIVE = 35,
  FORTY = 40,
}

export enum LANGUAGE_CODES {
  ENGLISH = "en-us",
  HINDI = "in-hi",
  CHINESE = "ch-ma",
  VIETNAMESE = "vi-vi",
  TURKISH = "tr-tr",
  RUSSIAN = "rs-rs",
  FRENCH = "fr-ca",
  KOREAN = "kr-kr",
}

export enum BRIDGE_STEPS {
  BRIDGE_FIELDS = 0,
  BRIDGE_REVIEW = 1,
  BRIDGE_PROCESSING = 2,
  BRIDGE_FAILED = 3,
  BRIDGE_SUCCESS = 4,
}

export enum BUY_STEPS {
  BUY_FIELDS = 0,
  BUY_REVIEW = 1,
  BUY_SUCCESS = 2,
}

export enum SCAN_MESSAGE_REQUEST_TYPE {
  SIGN_TYPED_DATA = "SIGN_TYPED_DATA",
  SIGN_MESSAGE = "SIGN_MESSAGE",
}

export enum LOADER_DELAY {
  ZERO = 0,
  ONE = 1000,
  TWO = 2000,
  THREE = 3000,
  FOUR = 4000,
  FIVE = 5000,
  SIX = 6000,
  SEVEN = 7000,
  EIGHT = 8000,
  NINE = 9000,
  TEN = 10000,
  TWENTY = 20000,
  TWENTYFIVE = 25000,
  TWENTYSEVEN = 27000,
  TWENTYEIGHT = 28000,
  THIRTY = 30000,
  THIRTYFIVE = 35000,
}
export const SupportedLanguages: Array<{
  label: string;
  value: TLanguage;
  desc: string;
}> = [
  { label: "English", value: LANGUAGE_CODES.ENGLISH, desc: "English" },
  { label: "हिन्दी", value: LANGUAGE_CODES.HINDI, desc: "Hindi" },
  { label: "中国人", value: LANGUAGE_CODES.CHINESE, desc: "Chinese (Simplified)" },
  { label: "Tiếng Việt", value: LANGUAGE_CODES.VIETNAMESE, desc: "Vietnamese" },
  { label: "Türk", value: LANGUAGE_CODES.TURKISH, desc: "Turkish" },
  { label: "Русский", value: LANGUAGE_CODES.RUSSIAN, desc: "Russian" },
  { label: "Français", value: LANGUAGE_CODES.FRENCH, desc: "French" },
  { label: "한국인", value: LANGUAGE_CODES.KOREAN, desc: "Korean" },
];

type TRegex = {
  [key: string]: RegExp;
};

export interface IAddress {
  address: string;
  lastSelected: number;
  name: string;
  selected_chain: string;
}

export interface IToastType {
  message: string;
  toastType: string;
}
export interface ISelectedChain {
  chain: string | undefined;
  address: string;
  logo: string;
  name: string;
  status: boolean;
  chainId: string;
  alias: string | undefined;
  custom?: boolean;
  isTestNet?: boolean;
  isOnlySupportEIP1559?: boolean;
}

export interface IAccount {
  address: string;
  alias: string;
  chain: string;
  chainId: string;
  custom: boolean;
  explorer: string;
  index: number;
  isEdited: boolean;
  logo: string;
  name: string;
  rpc: string;
  status: boolean;
  symbol: string;
}

export interface IWalletController {
  tokensList: any;
  name: string;
  color: string;
  id: string;
  balance: number;
  currency: string;
  noOfAccounts: number;
  selectedChain: ISelectedChain;
  accounts: Array<ISelectedChain>;
  isSelected?: boolean;
  isHardware?: boolean;
  hardwareType: string;
  path?: string;
  walletMode?: TFirstTimeFlow;
  recentlySelectedChains?: Array<Partial<ISelectedChain>>;
}
export interface IContacts {
  name: string;
  address: string;
}

export interface IWalletDropdown extends IWalletController {
  isChecked: boolean;
}

export type TNetworkInfoType = {
  networkName: string;
  rpcURL: string;
  chainID: string;
  currSymbol: string;
  explorerURL: string;
  originData?: {
    name: string;
    url: string;
    icon: string;
  };
  isLoading?: boolean;
};

export type TThemes = "light" | "dark";

export enum WALLET_MODE {
  IMPORT_PHRASE = "import-phrase",
  IMPORT_PRIVATE = "import-privatekey",
  CREATE = "create",
  CONNECT_LEDGER = "connect-ledger",
  CONNECT_TREZOR = "connect-trezor",
}

export type TFirstTimeFlow =
  | "import-phrase"
  | "import-privatekey"
  | "create"
  | "connect-ledger"
  | "connect-trezor"
  | "";

export type TLanguage = LANGUAGE_CODES;

export type TAutoLockTimer = AUTOLOCK_VALUE;

export interface IExtensionData {
  editedNetworks: Array<any>;
  customNetworks?: Array<any>;
  customTokens?: Record<string, any>;
  OnboardingController: {
    completedOnboarding: boolean;
    firstTimeFlowType: TFirstTimeFlow;
    seedPhraseBackedUp: boolean;
  };
  crypto: Record<string, string>;
  fcmToken: string;
  deviceId: string;
  KeyringController?: Record<string, string>;
  WalletController: Array<IWalletController>;
  PreferencesController: {
    currentLocale: TLanguage;
    identities: {
      [key: string]: IAddress;
    };
    preferences: {
      useNativeCurrencyAsPrimaryCurrency: boolean;
    };
    selectedAddress: string;
    theme: TThemes;
    isDarkTheme: boolean;
    canOverrideWallet: boolean;
    lastTransactionId: string;
    passTicket: string;
  };
  SettingsController: {
    contacts: Array<IContacts>;
    autoLockTimer: TAutoLockTimer;
  };
  recentlySelectedChains?: Array<Partial<ISelectedChain>>;
  isIBCGuideViewed: boolean;
  version: string;
}

export enum TXN_TYPE {
  Send = "send",
  Receive = "receive",
  Smart_Contract = "contract_execution",
  Swap = "swap",
  AddLiquidity = "add_liquidity",
  RemoveLiquidity = "remove_liquidity",
  Lend = "lend",
  Stake = "stake",
  UnStake = "unStake",
  Mint = "Mint",
  Approved = "approve",
  Withdraw = "Withdraw",
  Deposit = "Deposit",
  Token_Transferred = "Token Transferred",
  Multicall = "multicall",
  SwapExactTokensForTokens = "swapExactTokensForTokens",
}

export enum TXN_STATUS {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum EXCHANGE_TYPE {
  ZEROX = "0x",
  LIFI = "lifi",
  DODO = "dodo",
  JUPITER = "jupiter",
  XY = "xy",
  //exchangeTypeKyber = "kyber",
  ONEINCH = "1inch",
  PARASWAP = "paraswap",
  NETSWAP = "netswap",
  ELK = "elk",
  VVS = "vvsfinance",
  ARTHSWAP = "arthswap",
  LUASWAP = "luaswap",
  SOY = "soyfinance",
  DIFUSSION = "diffusion",
  XSWAP = "xswap",
  MESHSWAP = "meshswap",
  QUACKSWAP = "quackswap",
  KLAYSWAP = "klayswap",
  OSMOSISDEX = "osmosisdex",
  ROUTER = "router",
  SOCKET = "socket",
  DEBRIDGE = "debridge",
  RANGO = "rango",
  ZEROSWAP = "zeroswap",
}

export enum CHAINS_ENUMS {
  ETHEREUM = "Ethereum",
  SOLANA = "Solana",
  TEZOS = "Tezos",
  HARMONY = "Harmony",
  ZILLIQA = "Zilliqa",
  MULTIVERSX = "Elrond",
  BINANCE = "Binance",
  KAVA = "Kava",
  ALGORAND = "Algorand",
  COSMOS = "Cosmos",
  IOTEX = "IoTeX",
  NEAR = "Near",
  POLKADOT = "Polkadot",
  APTOS = "Aptos",
  SUI = "Sui",
}

export enum CHAINS_IDS {
  ETHEREUM = "ethereum",
  BSC = "bsc",
  POLYGON = "polygon",
  BASE = "base",
  BASEGOERLI = "base-goerli",
  AVALANCHEC = "avalanche",
  SOLANA = "solana",
  TEZOS = "tezos",
  FANTOM = "fantom",
  SHARDEUM = "shardeum",
  SHARDEUMSPHINX = "shardeum-sphinx",
  ARBITRUM = "arbitrum",
  AURORA = "aurora",
  OPTIMISM = "optimism",
  GNOSIS = "gnosis",
  CELO = "celo",
  MOONRIVER = "moonriver",
  MOONBEAM = "moonbeam",
  METIS = "metis",
  BOBA = "boba",
  EVMOS = "evmos",
  ALGORAND = "algorand",
  HARMONY = "harmony",
  XDC = "xinfin",
  ZILLIQA = "zilliqa",
  BLUZELLE = "bluzelle",
  TOMOCHAIN = "tomochain",
  MULTIVERSX = "elrond",
  BAND = "bandchain",
  EVMOSCOSMOS = "evmos-cosmos",
  PERSISTENCE = "persistence",
  AXELAR = "axelar",
  SOMMELIER = "sommelier",
  CRYPTOORG = "cryptoorgchain",
  BINANCE = "binance",
  KAVA = "kava",
  KLAYTN = "klaytn",
  HECO = "heco",
  IOTEX = "iotex",
  BNB = "bnb",
  NEAR = "near",
  POLKADOT = "polkadot",
  BTTC = "bttc",
  FUSE = "fuse",
  APTOS = "aptos",
  CRONOS = "cronos",
  ASTAR = "astar",
  SUI = "sui",
  SUITESTNET = "sui-testnet",
  SUIDEVNET = "sui-devnet",
  COSMOSHUB = "cosmoshub",
  OSMOSIS = "osmosis",
  LUNACLASSIC = "terra-classic",
  SECRETNETWORK = "secretnetwork",
  ASSETMANTLE = "assetmantle",
  INJECTIVE = "injective",
  EMONEY = "emoney",
  UMEE = "umee",
  JUNO = "juno",
  AGORIC = "agoric",
  SHENTU = "shentu",
  KUJIRA = "kujira",
  CANTO = "canto",
  CRESCENT = "crescent",
  AKASH = "akash",
  REGEN = "regen",
  SIFCHAIN = "sifchain",
  IRISNET = "irisnet",
  RSK = "rsk",
  SENTINEL = "sentinel",
  STRIDE = "stride",
  IMPACTHUB = "impacthub",
  GRAVITYBRIDGE = "gravitybridge",
  BOSTROM = "bostrom",
  STARGAZE = "stargaze",
  ZKEVM = "zkevm",
  ZKSYNC = "zksync",
  LINEA = "linea",
  ZETACHAIN = "zetachain",
  OKBTEST = "okb",
  CUSTOM = "custom_evm",
}

export enum SWAP_STEPS {
  review = "review",
  loader = "loader",
  swap = "swap",
  success = "success",
  failed = "failed",
}

export enum AUTOLOCK_TIMER {
  FIFTEEN_MINS = "15 mins",
  THIRTY_MINS = "30 mins",
  ONE_HOUR = "1 hrs",
  THREE_HOURS = "3 hrs",
  SIX_HOURS = "6 hrs",
}

export enum AUTOLOCK_VALUE {
  FIFTEEN_MINS = 900000,
  THIRTY_MINS = 1800000,
  ONE_HOUR = 3600000,
  THREE_HOURS = 10800000,
  SIX_HOURS = 21600000,
}

export enum SEND_NFTS_STEPS {
  SEND = "SEND",
  REVIEW = "REVIEW",
  LOADER = "LOADER",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export const blowfishScanMessageSupportedChains = [
  CHAINS_IDS.ETHEREUM,
  CHAINS_IDS.POLYGON,
  CHAINS_IDS.ARBITRUM,
  CHAINS_IDS.BSC,
];

export const currencies = [
  {
    currency: "United States Dollar",
    abbreviation: "USD",
    symbol: "&#36;",
    //   icon: usFlag,
  },
  {
    currency: "Euro Member Countries",
    abbreviation: "EUR",
    symbol: "&#8364;",
    //   icon: euroFlag,
  },

  {
    currency: "United Kingdom Pound",
    abbreviation: "GBP",
    symbol: "&#163;",
    //   icon: ukFlag,
  },
];

export const regExpression: TRegex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: /^(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~]*)*(#[\w\\-]*)?(\?.*)?$/,
  password: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
};

export const cardColors = [
  {
    colorId: 1,
    colorName: "dark-grey",
    colorHex: "hsla(0, 0%, 0%, 1)",
  },
  {
    colorId: 2,
    colorName: "orange",
    colorHex: "hsla(25, 89%, 41%, 1)",
  },
  {
    colorId: 3,
    colorName: "purple",
    colorHex: "hsla(244, 53%, 53%, 1)",
  },
  {
    colorId: 4,
    colorName: "green",
    colorHex: "hsla(153, 100%, 34%, 1)",
  },
  {
    colorId: 5,
    colorName: "sky-blue",
    colorHex: "hsla(205, 100%, 47%, 1)",
  },
];

export const getTestNetCardColor = (walletHex: string) => {
  let bg, border, lineColor, hueDeg;
  switch (walletHex) {
    case "hsla(0, 0%, 0%, 1)":
      bg = "#0F001A";
      border = "#AC6ADA";
      lineColor = "rgba(172, 106, 218, 0.1)";
      hueDeg = "225deg";
      break;
    case "hsla(25, 89%, 41%, 1)":
      bg = "#1A1800";
      border = "#CCC100";
      lineColor = "rgba(204, 193, 0, 0.1)";
      hueDeg = "45deg";
      break;
    case "hsla(244, 53%, 53%, 1)":
      bg = "#0F001A";
      border = "#AC6ADA";
      lineColor = "rgba(172, 106, 218, 0.1)";
      hueDeg = "225deg";
      break;
    case "hsla(153, 100%, 34%, 1)":
      bg = "#002101";
      border = "#279C25";
      lineColor = "rgba(39, 156, 37, 0.1)";
      hueDeg = "90deg";
      break;
    case "hsla(205, 100%, 47%, 1)":
      bg = "#001919";
      border = "#00A5A9";
      lineColor = "rgba(0, 165, 169, 0.1)";
      hueDeg = "180deg";
      break;
    default:
      bg = "#1A1800";
      border = "#CCC100";
      lineColor = "rgba(204, 193, 0, 0.1)";
      hueDeg = "45deg";
      break;
  }

  return { bg, border, lineColor, hueDeg };
};

export const DEFAULT_EXTENSION_DATA: IExtensionData = {
  OnboardingController: {
    completedOnboarding: false,
    firstTimeFlowType: "create",
    seedPhraseBackedUp: false,
  },
  crypto: {},
  fcmToken: "",
  deviceId: "",
  WalletController: [],
  PreferencesController: {
    currentLocale: LANGUAGE_CODES.ENGLISH,
    identities: {},
    preferences: {
      useNativeCurrencyAsPrimaryCurrency: true,
    },
    selectedAddress: "",
    theme: "light",
    isDarkTheme: false,
    canOverrideWallet: false,
    lastTransactionId: "",
    passTicket: "",
  },
  SettingsController: {
    contacts: [],
    autoLockTimer: AUTOLOCK_VALUE.FIFTEEN_MINS,
  },
  customNetworks: [],
  editedNetworks: [],
  customTokens: {},
  recentlySelectedChains: [] as Array<Partial<ISelectedChain>>,
  // Setting this to default true since the overlay is not working well. To be removed later
  isIBCGuideViewed: true,
  version: EXT_CURRENT_VERSION,
};

export const AES_256_CONFIG = {
  iv: lib.WordArray.random(128 / 8),
  mode: mode.CBC,
  padding: pad.Pkcs7,
};

export const tokenFraction = [
  {
    id: 0,
    label: "25%",
    value: 0.25,
  },
  {
    id: 2,
    label: "50%",
    value: 0.5,
  },
  {
    id: 3,
    label: "75%",
    value: 0.75,
  },
  {
    id: 4,
    label: "Max",
    value: 1,
  },
];

export const customApprovalFraction = [
  ...tokenFraction.slice(0, 3),
  { id: 4, label: "Default", value: 1 },
  { id: 5, label: "Unlimited", value: 1 },
];

export const dappApprovalFraction = [...tokenFraction.slice(0, 3), { id: 4, label: "Unlimited", value: 1 }];

export const stakingPeriod = [
  { id: 1, label: "1M", value: 1 / 12 },
  { id: 2, label: "1Y", value: 1 },
  { id: 3, label: "3Y", value: 3 },
];

export const nativeFractionValue = 0.9;

export const netWorkFeeSelect = [
  {
    id: 0,
    label: "actions.lowLabel",
    value: 1,
  },
  {
    id: 1,
    label: "actions.averageLabel",
    value: 2,
  },
  {
    id: 2,
    label: "actions.highLabel",
    value: 3,
  },
  {
    id: 3,
    label: "actions.customLabel",
    value: 4,
  },
];

export const selectOptions = [
  {
    id: 1,
    value: "0.1",
  },
  {
    id: 2,
    value: "0.5",
  },
  {
    id: 3,
    value: "1",
  },
  {
    id: 4,
    value: "2",
  },
];

export const timePeriod = [
  {
    id: 0,
    label: "1D",
    value: 1,
  },
  {
    id: 1,
    label: "1W",
    value: 7,
  },
  {
    id: 2,
    label: "2W",
    value: 14,
  },
  {
    id: 3,
    label: "1M",
    value: 30,
  },
  {
    id: 4,
    label: "1Y",
    value: 365,
  },
];

export const LRU_CACHE_OPTION = {
  max: 500,

  // for use with tracking overall storage size
  maxSize: 5000,
  sizeCalculation: () => {
    return 1;
  },

  // for use when you need to clean up something when objects
  // are evicted from the cache
  dispose: () => {
    console.log("dispose called");
  },

  // how long to live in ms
  ttl: 1000 * 60 * 5,

  // return stale items before removing from cache?
  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

export const autoLockTimerOptions: Array<{
  id: number;
  title: string;
  value: TAutoLockTimer;
}> = [
  {
    id: 0,
    title: AUTOLOCK_TIMER.FIFTEEN_MINS,
    value: AUTOLOCK_VALUE.FIFTEEN_MINS,
  },
  {
    id: 1,
    title: AUTOLOCK_TIMER.THIRTY_MINS,
    value: AUTOLOCK_VALUE.THIRTY_MINS,
  },
  {
    id: 2,
    title: AUTOLOCK_TIMER.ONE_HOUR,
    value: AUTOLOCK_VALUE.ONE_HOUR,
  },
  {
    id: 3,
    title: AUTOLOCK_TIMER.THREE_HOURS,
    value: AUTOLOCK_VALUE.THREE_HOURS,
  },
  {
    id: 4,
    title: AUTOLOCK_TIMER.SIX_HOURS,
    value: AUTOLOCK_VALUE.SIX_HOURS,
  },
];

export enum ERRORS {
  INVALID_STORE = "invalid store",
}

export type TChangePasswordType = {
  oldPass: string;
  newPass: string;
};

export interface ICosmosGasRates {
  average: number;
  fast: number;
  fastest: number;
  safe_low: number;
}

export const GAS_LIMIT_HEX = "0x5208";

export const BINANCECONNECT = "BINANCECONNECT";
export const COINBASE = "COINBASE";
export const JUNOPAY = "JUNOPAY";
export const ONMETA = "ONMETA";
export const MOONPAY = "MOONPAY";
export const SIMPLEX = "SIMPLEX";

export const externalProviders = [JUNOPAY, COINBASE, BINANCECONNECT, ONMETA];
