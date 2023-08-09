import { BaseGoerli } from "./chains/baseGoerli";

export interface IDerivation {
  path: string;
  name: string;
  basePath: string;
}

export interface IExplorer {
  url: string;
  txPath: string;
  accountPath: string;
  explorerName: string;
}

export interface IInfo {
  url: string;
  rpc: string;
}

export interface IChainTypes {
  index: number;
  id: string;
  name: string;
  alias?: string;
  logo: string;
  coinId: number;
  symbol: string;
  decimals: number;
  blockchain: string;
  derivation: Partial<IDerivation>[];
  curve: string;
  publicKeyType: string;
  chainId: string;
  explorer: Partial<IExplorer>;
  info: Partial<IInfo>;
  hrp?: string;
  isSelected?: boolean;
  prefix?: string;
  bridgeProviders?: Array<string>;
  swapProviders?: Array<string>;
  isCustomEVM?: boolean;
  isTestNet?: boolean;
  denom?: string;
  isCustomCosmos?: boolean;
  gasRates?: {
    average: number;
    high: number;
    low: number;
  };
  bech32Config?: {
    bech32PrefixAccAddr?: string;
    bech32PrefixAccPub?: string;
    bech32PrefixConsAddr?: string;
    bech32PrefixConsPub?: string;
    bech32PrefixValAddr?: string;
    bech32PrefixValPub?: string;
  };
}

export interface IEditChainTypes {
  address: string;
  alias?: string;
  chain: string;
  chainId: string;
  custom: boolean;
  explorer?: string;
  index: number | string;
  isEdited?: boolean;
  logo?: string;
  name: string;
  rpc?: string;
  status: boolean;
  symbol?: string;
  isTestNet?: boolean;
  customType?: string;
}

export const CHAIN_LIST: Array<Partial<IChainTypes>> = [BaseGoerli];
