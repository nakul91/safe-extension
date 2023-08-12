import React from "react";

import { IWalletController } from "../../../constants";
import { CHAINS_ENUMS } from "../../../constants";
import { ITokenListType } from "../../home/types";

export type TApprovalsHeaderTypes = {
  address: string;
  walletName?: string;
  chainName?: string;
  walletColor?: string;
  chainLogo?: string;
};

export type TApprovalsCardTypes = {
  requestedSite?: string;
  className?: string;
  children?: React.ReactNode;
  icon?: string;
};

export type TApprovalsGroupButtonsType = {
  rightBtnName?: React.ReactNode;
  leftBtnName?: React.ReactNode;
  rightBtnClassName?: string;
  rightOnClick?: () => void;
  leftOnClick?: () => void;
  handleChange?: () => void;
  isDisable?: boolean;
  hideLeftButton?: boolean;
  hideRightButton?: boolean;
  getScanData?: {
    background: string;
    status: string;
  };
  riskApproved?: boolean;
  customCheckboxMargin?: string;
};

export type TSelectNetworkFeeType = {
  // eslint-disable-next-line no-unused-vars
  setNetworkFee?: (value: boolean) => void;
  style?: any;
};

export type TConnectionInfoTypes = {
  name: string;
  origin: string;
  chain: string;
  icon: string;
  walletBalance: string;
  walletBalanceShimmer: boolean;
  walletName: string;
  initialFetch: () => void;
};

export type TConnectDapp = {
  params: {
    origin: string;
    icon: string;
    name: string;
  };
  chainId?: string;
};

type TDappParams = {
  message?: any;
  origin: string;
  icon: string;
  name: string;
  from: string;
  to: string;
  gas: string;
  value: string;
  data?: string;
  chain?: CHAINS_ENUMS;
  isMultipleTransaction: boolean;
  isHardwareWallet: boolean;
  hardwareWalletType: string;
  hardwareWalletData: IWalletController;
  isVersionTx?: boolean;
  gasPrice?: string;
  gasLimit?: string;
};

export type TAccessToken = {
  params: TDappParams;
};

export type TDappConnectionApproved = {
  icon: string;
  name: string;
};

export interface IErrorObj {
  title: string;
  description: string;
  detailMsg?: string;
}

export type TAllowanceFraction = any & {
  label?: string;
  value?: number;
};

export type TSetAddLimit = {
  tokenApprovalFraction: Array<{ label: string; id: number; value: number }>;
  sheetClassName?: string;
  isDappTxn?: boolean;
  defaultAllowanceAmount?: string;
  spender?: string;
  tokenData?: ITokenListType | null;
  addLimit?: boolean;
  handleCloseDialog: () => void;
  params?: TDappParams;
  walletChain: string;
  tokenDecimal: number;
  tokenSelectedAmount?: number;
  prevAllowanceValue?: number;
  tokenInfo?: any | null;
  handleSetSpendingLimit: (data: any, amount: string, isDefaultSelected: boolean) => void;
};

export type TRequestedByTypes = {
  originName: string;
  originLogo: string;
  originUrl?: string;
  logoStyles?: string;
};
