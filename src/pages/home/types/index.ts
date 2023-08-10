import { ReactElement } from "react";
import { ISelectedChain, IWalletController } from "../../../constants";
import { IChainTypes } from "../../../constants/chains";

export interface IPortfolioCardTypes {
  name: string;
  address: string;
  setOpenCardSetting?: (value: boolean) => void;
  handleOpenModal?: () => void;
  handleOpenNetworkSwitch?: () => void;
  handleHover?: (value: boolean) => void;
  totalBalance?: number;
  formData?: THomeWalletFormData;
  typeOf?: string;
  tokenLoading?: boolean;
  showFullAddress?: boolean;
  handleOpenWalletEditSheet?: (walletId: string) => void;
  setOpen?: (value: boolean) => void;
}

export type TTransactionButtonGroupType = {
  isInView?: boolean;
  state?: Partial<ITokenListType>;
};

export type TSelectChainTypes = Pick<IPortfolioCardTypes, "handleOpenNetworkSwitch"> & Partial<THomeWalletFormData>;

export type TPortfolioCardSettingTypes = {
  setOpenCardSetting?: (value: boolean) => void;
  handleChange: (key: string, value: string) => void;
  formData?: THomeWalletFormData;
};

export type THeaderTypes = {
  type?: string;
  title: string;
  className?: string;
  titleClassName?: string;
  logo?: string;
  onClick?: () => void;
  exchangeProviderType?: string;
  handleOpenProvider?: () => void;
  disableProvider?: boolean;
  showProviderSwitch?: boolean;
  showSwitchIcon?: boolean;
  tooltipMessage?:
      | string
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  fromBuy?: boolean;
};

export type TConnectionHeaderTypes = {
  walletName: string;
  walletAddress: string;
  connectionIcon: string | undefined;
  connectionName: string;
  headerColor: string;
};

export type TReceiveWithQRTypes = {
  walletAddress: string;
};

export type TChangeCardColorTypes = {
  colorHex: string;
  checked: boolean;
  type?: string;
  onClick: () => void;
};
export type THomeWalletFormData = {
  id: string;
  balance: number;
  name?: string;
  address: string;
  selectedChain: {
    id?: string;
    name: string;
    address: string;
    logo?: string;
    isTestNet?: boolean;
  };
  walletColor: string;
  logo?: string;
  walletName?: string;
};

export type TFloatingBtnGroupTypes = {
  state?: Partial<ITokenListType>;
  isWalletTokensAvailable?: boolean;
  handleOpenExpandedBtn?: () => void;
};

export type TExpandedBtnGroupTypes = {
  state?: Partial<ITokenListType>;
  expandButtonGroup?: boolean;
  setExpandButtonGroup?: (value: boolean) => void;
  isFullscreen: string | null;
};

export type TActionsTab = {
  state?: Partial<ITokenListType>;
};

export type TSwitchWalletTypes = {
  setOpen: (value: boolean) => void;
  // style: any;
  isFullscreen: string | null;
  formData?: THomeWalletFormData;
  wallets?: Array<IWalletController>;
  handleChangeFormData?: (name: string, color: string) => void;
};

export type TWalletTypes = {
  name: string;
  address: string;
  logo: string;
  chain: string;
  value: string;
};

export type TSwitchNetworkTypes = {
  setNetworkSwitch: (value: boolean) => void;
  networkSwitch: boolean;
  // style: any;
  isFullscreen: string | null;
  from?: string;
  handleAddressInput?: (key: string, value: string) => void;
  possibleIBCChains?: string[];
};

export type TChainListItemTypes = {
  chainData: Partial<ISelectedChain>;
  selectedChain: string | undefined;
  handleSelectNetwork?: (chain: Partial<IChainTypes>) => void;
  from?: string;
  handleSelectAddress?: (key: string, value: string) => void;
};

export type TAboutTokenTypes = {
  setAboutToken: (val: boolean) => void;
  aboutToken: boolean;
  explorerName?: string;
  detail: any;
};

export type TEditWalletDetailType = {
  walletDetail?: IWalletController;
  submitLoader: boolean;
  handleChange: (key: string, value: unknown) => void;
  handleUpdateWallet: (value: string) => void;
  openEditBottomSheet: boolean;
  setOpenEditBottomSheet: (value: boolean) => void;
  handleSelectedWalletChange: (name: string, color: string) => void;
};

export interface ITokenListType {
  contract_name: string;
  contract_ticker_symbol: string;
  contract_decimals: number;
  token_decimals?: number;
  contract_address?: string;
  coin: number;
  type: string;
  balance: string;
  quote: number | string;
  quote_rate: number;
  logo_url?: string;
  quote_rate_24h: number;
  quote_pct_change_24h: number;
  verified?: string;
  token_logo_url?: string;
  token_name?: string;
  token_address?: string;
  token_symbol?: string;
  denom?: string;
  token_price?: string;
  token_website?: string;
  token_trade_volume?: string;
  token_listed_count?: string;
  token_last_activity?: string;
  account_number?: number;
  sequence?: number;
  nonce?: number;
  block_hash?: string;
  block_height?: number;
}

export interface ITokenBalanceResponseType {
  balance: number | undefined;
  quoteRate: number | undefined;
  tokenDetail: ITokenListType | undefined;
}
export interface IIbcNetworkListType {
  name?: string;
  logo?: string;
  address?: string;
}

export interface INFTListType {
  slug: string;
  banner_image_url: string;
  created_date: string;
  image_url: string;
  image_preview_url: string | undefined;
  medium_username: string;
  twitter_username: string;
  name: string;
  nft_data: INFTData[];
  chain: string;
  worth: number;
  safelist_request_status: string;
}

export interface INFTData {
  [x: string]: any;
  id: string;
  image_url: string;
  name: string;
  decimals: string;
  collection_name: string;
  floor: number;
  floor_price_change: string;
  last_price: number;
  last_price_change: string;
  image_preview_url?: string;
}

export interface IActivitiesListTypes {
  setIsTxnLoadingError: (value: boolean) => void;
  selectedChain: string;
  selectedAddress: string;
  pageSize: number;
  tokenContractAddress?: string;
  isTokenDetailsActivity?: boolean;
  setActiveTab?: (val: string) => void;
}

export interface INFTListViewTypes {
  collection?: INFTListType[];
}
export interface IHomeTabTypes {
  walletBalances?: ITokenListType[];
  tokenLoading?: boolean;
  fetchNFTCollections: (query: any) => void | undefined;
  getWalletBalance?: (value: boolean) => void;
  loader: boolean;
}
export interface INFTsListPropsType {
  fetchNFTCollections: (query: any) => void | undefined;
  loader: boolean;
}

export type TTokenTypes = Pick<IHomeTabTypes, "walletBalances" | "tokenLoading" | "getWalletBalance">;

export interface INFTsGridviewType {
  nfts?: INFTData[];
  loader: boolean;
}

export interface ISent {
  name: string;
  symbol: string;
  token_id: string;
  decimals: number;
  value: string;
  quote_rate: number;
  logo_url: string;
  from: string;
  to: string;
}
export interface IReceived {
  name: string;
  symbol: string;
  token_id: string;
  decimals: number;
  value: string;
  logo_url: string;
  from: string;
  to: string;
  quote_rate?: number;
}
export interface ITransactionType {
  id: string;
  from: string;
  to: string;
  fee: string;
  date: number;
  status: string;
  type: string;
  block: number;
  value: string;
  nonce: number;
  native_token_decimals: number;
  description: string;
  sent: ISent[];
  received: IReceived[];
  others: any[];
  openSheetOnLoad?: boolean;
  queryParamsData?: any;
  setQueryParamsData?: (val: any) => void;
  isDialogOpen?: boolean;
  openTxBottomSheet?: boolean;
  setOpenTxBottomSheet?: (val: boolean) => void;
}

export type TTransactionDetailType = {
  openActivityDetail: boolean;
  setOpenActivityDetail: (val: boolean) => void;
  details: any;
};
export interface ITransactionListType {
  transactions: ITransactionType[];
}

export interface IGroupTransactionsType {
  date: string;
  activities: ITransactionType[];
}
export interface ITokenDetailPage {
  detail: any;
  state: any;
  chartDetail: any;
  chartLoader?: boolean;
  chartError?: boolean;
  statisticalDetail: any;
  updateTimePeriod?: (val: number) => void;
}

export interface IGraphDetailTypes {
  chartDetail: any;
  changedPrice?: number;
}
export interface INFTCollectionQueryType {
  address?: string;
  chain?: string;
}
export interface ITokenDetailQueryType {
  chain: string;
  token: string;
  range: number;
}
export interface ITokenStatisticDetailQueryType {
  address: string;
  contractAddress: string;
}

export interface IFcmParams {
  fcmToken: string;
  deviceId: string;
  walletIds?: string[];
}

export interface IStakingQuery {
  address: string;
  chain: string;
}

export interface ITotalStakeValues {
  total_staked_quote: string;
  total_unstaked_quote: string;
  total_rewards_quote: string;
}

export interface IIndividualStakeValue {
  stake_balance: string;
  unstake_balance: string;
  rewards_balance: string;
  total_staked_quote: string;
  total_unstaked_quote: string;
  total_rewards_quote: string;
  denom: string;
}

export interface IReward {
  denom: String;
  amount: string;
  decimals: number;
  quote: string;
  ticker_symbol: string;
  logo_url: string;
  quote_rate: string;
}

export interface IStakeBalance {
  denom: string;
  amount: string;
  decimals: number;
  quote_rate: string;
  quote: string;
  ticker_symbol: string;
  logo_url: string;
}

export interface IDelegationInfo {
  delegator_address: string;
  validator_address: string;
  shares: string;
}

export interface IValidatorDetails {
  operator_address: string;
  consensus_pubkey: string;
  jailed: boolean;
  status: string;
  tokens: string;
  delegator_shares: string;
  description: {
    moniker: string;
    identity: string;
    website: string;
    security_contact: string;
    details: string;
  };
  unbonding_height: string;
  unbonding_time: string;
  commission: {
    commission_rates: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
    update_time: string;
  };
  min_self_delegation: string;
  voting_power: string;
  apr: string;
  image_url: string;
}

export interface IDelegation {
  delegation: IDelegationInfo;
  balance: IStakeBalance;
  validator_details: IValidatorDetails;
  rewards_details: {
    validator_address: string;
    reward: IReward[];
  };
}

export interface IUnboundDelegation
  extends Pick<IDelegation, "balance" | "validator_details" | "delegation" | "rewards_details"> {
  validator_address: string;
  entries: Array<{
    balance: string;
    completion_time: string;
    creation_height: string;
    initial_balance: string;
  }>;
}

export interface ICosmosDelagations {
  net_stake_values: ITotalStakeValues;
  individual_stake_values: IIndividualStakeValue[];
  delegations: IDelegation[];
  unbound_delegations: Array<IUnboundDelegation>;
  apr: number;
}
