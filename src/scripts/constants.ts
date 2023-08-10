enum CHANNEL_NAME {
  boradcastChannel = "1ffqkwUIr6_Pvd4p_kyRT",
}

enum COMMUNICATION_PAGES {
  provider = "PROVIDER",
  background = "BACKGROUND",
  content = "CONTENT",
  ui = "UI",
  externalSIte = "EXTERNAL_SITE",
  controller = "CONTROLLER",
  internalRequest = "INTERNAL_REQUEST",
}

enum ETHEREUM_REQUESTS {
  chainId = "eth_chainId",
  requestAccounts = "eth_requestAccounts",
  accounts = "eth_accounts",
  blockNumber = "eth_blockNumber",
  call = "eth_call",
  getCode = "eth_getCode",
  legacyEnable = "enable",
  estimateGas = "eth_estimateGas",
  getBlockByNumber = "eth_getBlockByNumber",
  getGasPrice = "eth_gasPrice",
  sendTransaction = "eth_sendTransaction",
  getTransactionReceipt = "eth_getTransactionReceipt",
  subscribe = "eth_subscribe",
  getBalance = "eth_getBalance",
  getTransactionCount = "eth_getTransactionCount",
  sendRawTransaction = "eth_sendRawTransaction",
  getTransactionByHash = "eth_getTransactionByHash",
  netVersion = "net_version",
  getLogs = "eth_getLogs",
  getEncryptionPublicKey = "eth_getEncryptionPublicKey",
  decrypt = "eth_decrypt",
  personalSign = "personal_sign",
  ecRecover = "personal_ecRecover",
  signTypedData = "eth_signTypedData",
  signTypedDataV1 = "eth_signTypedData_v1",
  signTypedDataV3 = "eth_signTypedData_v3",
  signTypedDataV4 = "eth_signTypedData_v4",
}

enum SOLANA_REQUESTS {
  getBalance = "getBalance",
  signAndSendTransaction = "signAndSendTransaction",
  getTransactionCount = "getTransactionCount",
  getLatestBlockhash = "getLatestBlockhash",
  signTransaction = "signTransaction",
  getSolAccount = "getSolAccount",
  requestSolAccount = "requestSolAccount",
  signAllTransactions = "signAllTransactions",
  signMessage = "signMessage",
  disconnectSolAccount = "disconnectSolAccount",
}

enum COSMOS_REQUESTS {
  account = "account",
  requestCosAccount = "requestCosAccount",
  signDirect = "signDirect",
  signAmino = "signAmino",
  sendTx = "sendTx",
  disconnectCosAccount = "disconnectCosAccount",
  signArbitrary = "signArbitrary",
  verifyArbitrary = "verifyArbitrary",
}

enum SUI_REQUESTS {
  requestSuiAccount = "requestSuiAccount",
  disconnectSuiAccount = "disconnectSuiAccount",
  getSuiAccount = "getSuiAccount",
  signAndExecuteTransactionBlock = "signAndExecuteTransactionBlock",
  signTransactionBlock = "signTransactionBlock",
  signMessage = "suiSignMessage",
}

enum BROADCAST_REQUEST {
  accountsChanged = "accountsChanged",
  chainChanged = "chainChanged",
  connect = "connect",
  disconnect = "disconnect",
  solDisconnect = "solDisconnect",
  cosDisconnect = "cosDisconnect",
  suiDisconnect = "suiDisconnect",
  chainDisabled = "chainDisabled",
}

enum WALLET_REQUESTS {
  switchEthereumChain = "wallet_switchEthereumChain",
  addEthereumChain = "wallet_addEthereumChain",
  getPermissions = "wallet_getPermissions",
  requestPermissions = "wallet_requestPermissions",
  switchChain = "wallet_switchChain",
  addCosmosChain = "wallet_addCosmosChain",
}

enum PORT_LISTENER {
  content = "CONTENT",
  uiListener = "UI_LISTENER",
  keepAlive = "KEEP_ALIVE",
}

enum CHAIN_STATUS {
  DISABLED = "chain_disabled",
  NOT_EXIST = "chain_notExist",
  EXIST = "chain_exist",
}

enum EVENTS {
  broadcastToUI = "broadcastToUI",
  broadcast = "broadcast",
}

enum EVENTS_METHOD {
  isLocked = "isLocked",
  callLogin = "callLogin",
}

export {
  BROADCAST_REQUEST,
  CHAIN_STATUS,
  CHANNEL_NAME,
  COMMUNICATION_PAGES,
  ETHEREUM_REQUESTS,
  EVENTS,
  EVENTS_METHOD,
  PORT_LISTENER,
  SOLANA_REQUESTS,
  WALLET_REQUESTS,
  COSMOS_REQUESTS,
  SUI_REQUESTS,
};

export const getFaviconUrl = (domain: string) => {
  return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${domain}&size=128`;
};

export enum STORE_KEYS {
  session = "session",
}

export const siweInvalidDomainErr = {
  title: "Deceptive site request",
  message: "The site you're attempting to sign into doesn't match the domain in the request. Proceed with caution.",
};

export const siweInvalidAccountMsg =
  "The address in the sign-in request does not match the address of the account you are using to sign in.";

export const approveCheckBoxLabel = "I understand the risk and wish to approve anyway";

export const safeIcon =
  "data:image/png;base64,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";
