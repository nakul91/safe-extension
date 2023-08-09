import { Web3AuthOptions } from "@web3auth/modal";
import { Web3AuthConfig } from "@safe-global/auth-kit";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";

export const BaseGoerli = {
  index: 10,
  id: "base-goerli",
  name: "Base Goerli",
  logo: "",
  coinId: 84531,
  symbol: "ETH",
  chainId: "84531",
  chainIdHex: "0x14a33",
  decimals: 18,
  blockchain: "Ethereum",
  derivation: [
    {
      path: "m/44'/60'/0'/0/0",
      basePath: "m/44'/60'/${index}'/0/0",
    },
  ],
  curve: "secp256k1",
  publicKeyType: "secp256k1Extended",
  explorer: {
    url: "https://goerli.basescan.org/",
    explorerName: "Goerli BaseScan",
    txPath: "/tx/",
    accountPath: "/address/",
  },
  info: {
    url: "https://goerli.base.org/",
    rpc: "https://goerli.base.org",
  },
  bridgeProviders: [],
  swapProviders: [],
  isTestNet: true,
};

export const web3AuthOptions: Web3AuthOptions = {
  clientId: "BMorkEMdVh4ApxK2CmG9shCstqemr-UruBuLGnWEPJvB7yOyJCdeomdS9J3DDwNDPfC1vML84FlxiCiKPl7GiAo",
  web3AuthNetwork: BaseGoerli.isTestNet ? "testnet" : "mainnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: BaseGoerli.chainIdHex,
    rpcTarget: BaseGoerli.info.rpc,
  },
  uiConfig: {
    theme: "dark",
    loginMethodsOrder: ["google", "facebook"],
  },
};

export const modalConfig = {
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: "torus",
    showOnModal: true,
  },
  [WALLET_ADAPTERS.METAMASK]: {
    label: "metamask",
    showOnDesktop: true,
    showOnMobile: false,
  },
};

export const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: "https://safe-transaction-base-testnet.safe.global/",
};

//ts
