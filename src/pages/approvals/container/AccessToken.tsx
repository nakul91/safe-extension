/* eslint-disable @typescript-eslint/ban-ts-comment */
import { addHexPrefix } from "@ethereumjs/util";
import { Fragment, ReactNode, useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_CHAIN_ID,
  DEFAULT_GASLIMIT_EVM,
  IWalletController,
  TXN_TYPE,
  dappApprovalFraction,
} from "../../../constants";
import { CHAINS_ENUMS } from "../../../constants";
import { useApproval, useWallet } from "../../../hooks";
import {
  createLogoAvatar,
  getCurrencyFormattedNumber,
  getImage,
  getTokenFormattedNumber,
  handleCopy,
  hexToNumber,
  isStartsFrom0x,
  numberToHex,
  shortenAddress,
  toastFlashMessage,
} from "../../../utils";

import { Shimmer } from "../components";

import { getWalletBalanceApi } from "../../home/apiServices";

import { ApprovalsCard, ApprovalsGroupButtons, ApprovalsHeader, RequestedBy, SelectNetworkFee } from "../components";
import { TAccessToken } from "../types";
import ConfirmTransactionApproved from "./ConfirmTransactionApproved";
import { TransactionDescription } from "@ethersproject/abi";
import { ITokenListType } from "../../home/types";
import ApproveButton from "../../../ui_components/ApproveBtn";
import DenyButton from "../../../ui_components/DenyBtn";

export default function AccessToken({ params }: TAccessToken) {
  const [, resolveApproval, rejectApproval] = useApproval();
  const wallet = useWallet();
  const [transactionApproved, setTransactionApproved] = useState(false);
  const [networkFee, setNetworkFee] = useState(false);
  const [scanData, setScanData] = useState({
    title: "",
    message: "",
    severity: "",
    detailedMsg: "",
  });
  const [scanLoader, setScanLoader] = useState(true);
  const [tokens, setTokens] = useState<ITokenListType[]>();
  const [riskApproved, setRiskApproved] = useState(false);
  const [txDetails, setTxDetails] = useState(false);
  const [showInsufficientBal, setShowInsufficientBal] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [loader, setLoader] = useState(false);
  const [invalidFeeError, setInvalidFeeError] = useState<ReactNode>("");
  const [gasLimit, setGasLimit] = useState(hexToNumber(""));
  const [approvaLimitValue, SetApprovalLimitValue] = useState<string>("");
  const [selectedDefaultAllowanceAmount, setSelectedDefaultAllowanceAmount] = useState(false);
  const [walletDetail, setWalletDetail] = useState({
    id: "",
    address: "",
    walletName: "",
    chainName: "",
    walletColor: "#000",
    symbol: "",
    chainLogo: "",
    chain: "",
    chainId: "",
    walletMode: "",
    decimals: 0,
    explorerUrl: "",
  });
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletBalanceShimmer, setWalletBalanceShimmer] = useState(true);
  const [txnFeeInfo, setTxnFeeInfo] = useState({
    gasPrice: 0,
    gasLimit: 0,
    estTime: 0,
    nonce: 0,
  });
  const [addLimit, setAddLimit] = useState(false);
  const [approvalTokenData, setApprovalTokenData] = useState<ITokenListType | null>(null);
  let scanApiGas: string;
  const [txnParams, setTxnParams] = useState<TransactionDescription | null>(null);
  const [allowanceData, setAllowanceData] = useState("");
  const [tokenDetail, setTokenDetail] = useState<any>(null);
  const [isFetchingTokenDetail, setIsFetchingTokenDetail] = useState(true);
  const abortController = useRef<AbortController>();
  const selectNetworkFeeStyle = useMemo(() => {
    return {
      transform: networkFee ? `translateY(0)` : `translateY(-100%)`,
      opacity: networkFee ? 1 : 0,
    };
  }, [networkFee]);

  const handleTxDetails = () => {
    if (params.data) {
      setTxDetails(!txDetails);
    }
  };

  const initialFetch = async () => {
    const walletData = (await wallet.getSelectedWallet()) as IWalletController;
  };

  useEffect(() => {
    initialFetch();
  }, [params]);

  const formatDataForHwWalletTx = () => {};

  const handleSuccess = async () => {};
  const handleCancel = () => {
    rejectionHandle("User rejected the request");
  };

  const handleSetLimit = () => {
    setAddLimit(true);
  };

  const handleCloseDialog = () => {
    setAddLimit(false);
  };

  const getValueInDollar = (value: number, quoteRate: number, decimal = 2, isWithoutDollarSymbol = false) => {
    const updatedValue = getCurrencyFormattedNumber(
      value * quoteRate,
      decimal,
      "USD",
      isWithoutDollarSymbol ? true : false
    );
    return isWithoutDollarSymbol ? updatedValue.replace("$", "") : updatedValue;
  };

  const getTokenValue = (value: string, decimals: number) => {
    const formattedValue = getTokenFormattedNumber(value, decimals, true, 6);
    return formattedValue;
  };

  const rejectionHandle = (msg: string) => {
    rejectApproval(msg, true).then(() => {
      wallet?.closeWindow();
    });
  };

  return transactionApproved ? (
    <ConfirmTransactionApproved />
  ) : (
    <div className="relative flex flex-col h-screen">
      <div className="mb-10">
        <div className="absolute z-10 top-0 w-full">
          <ApprovalsHeader
            address={shortenAddress(params.from) ?? ""}
            chainLogo={walletDetail.chainLogo}
            walletColor={walletDetail.walletColor}
            walletName={walletDetail.walletName}
            chainName={walletDetail.chainName}
          />
        </div>
        {scanLoader ? (
          <>
            <img src={getImage("scanner.gif")} className="dark:hidden" alt="scanner" />
            <img src={getImage("scanner_dark.gif")} className="hidden dark:block" alt="scanner" />
          </>
        ) : (
          <div className="px-4 relative mt-[72px]">
            <div
              className={` bg-gray-100 dark:bg-neutralDark-500 -translate-y-10 h-80 absolute right-0 left-0 -z-10`}
            ></div>
            {!txDetails && !params.to ? (
              <>
                <p className="heading2 my-6 leading-12 mt-0 mb-1">Deploy contract</p>
                <p className="paragraph2 leading-5 text-sm text-text-500 dark:text-textDark-500 mb-5">
                  Deploy SmartContract
                </p>
              </>
            ) : null}

            {txnParams?.name === TXN_TYPE.Approved && (
              <div className="bg-white dark:bg-black border-background-100 dark:border-neutralDark-300 border shadow-sm rounded-xl mb-4">
                <div className="flex flex-col">
                  <div className="flex justify-start items-center gap-2 p-2 px-4">
                    {isFetchingTokenDetail ? (
                      <Shimmer type="iconShimmer" />
                    ) : (
                      <>
                        {tokenDetail?.token_logo_url && (
                          <img
                            role="presentation"
                            onError={(e) => {
                              e.currentTarget.src = `${createLogoAvatar(`${tokenDetail?.token_symbol}`, "medium")}`;
                              e.currentTarget.className = "w-12 h-12 mr-2 inline-block bg-primary-50 rounded-full";
                              e.currentTarget.onerror = null;
                            }}
                            src={tokenDetail?.token_logo_url}
                            alt="logo"
                            className="w-12 h-12"
                          />
                        )}
                      </>
                    )}
                    <div className="flex flex-col items-start ml-2">
                      {isFetchingTokenDetail ? (
                        <Shimmer type="symbolShimmer" />
                      ) : (
                        <p className="label1 leading-6 font-medium">{tokenDetail?.token_symbol}</p>
                      )}
                      {walletBalanceShimmer ? (
                        <Shimmer type="WalletBalance" />
                      ) : (
                        <div className="flex">
                          <p className="label2 text-text-300 dark:text-textDark-500 mr-1">
                            Balance
                            <span className="ml-0.5 text-text-900 dark:text-textDark-900">
                              {" "}
                              {getTokenFormattedNumber(
                                approvalTokenData?.balance ?? "",
                                approvalTokenData?.contract_decimals ?? approvalTokenData?.token_decimals ?? 0,
                                true,
                                6
                              )}
                            </span>
                          </p>{" "}
                          ~{" "}
                          <span className="text-text-900 dark:text-textDark-900">
                            {getValueInDollar(
                              getTokenValue(
                                approvalTokenData?.balance ?? "",
                                Number(approvalTokenData?.contract_decimals)
                              ),
                              Number(approvalTokenData?.quote_rate)
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <ApprovalsCard requestedSite={params?.origin}>
              <div className="">
                {txnParams?.name !== TXN_TYPE.Approved ? (
                  <div className="flex items-center px-4 justify-between border-b dark:border-neutralDark-300 py-2 pb-3">
                    <div className="flex items-center">
                      <img
                        onError={(e) => {
                          e.currentTarget.src = `${getImage("default_token.svg")}`;
                          e.currentTarget.onerror = null;
                        }}
                        src={walletDetail.chainLogo ?? getImage("eth_icon.svg")}
                        alt=""
                        className="w-9 h-9 object-cover rounded-full"
                      />
                      {params.value ? (
                        <p className="text-sm ml-2 text-text-900 dark:text-textDark-900 relative">
                          {walletDetail.chainName}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm ml-2 text-text-900 dark:text-textDark-900 relative">
                            {shortenAddress(params.from)}
                          </p>
                          <img
                            src={getImage("copy_icon.svg")}
                            alt="copy"
                            className="cursor-pointer ml-2 w-3.5 h-3.5"
                            onClick={() => handleCopy(params.from)}
                          />
                        </>
                      )}
                    </div>

                    {walletBalanceShimmer ? (
                      <Shimmer type="WalletBalance" />
                    ) : params.value && hexToNumber(params.value) > 0 ? (
                      <div
                        role={"presentation"}
                        className="p-1 rounded relative flex items-center bg-error-100 dark:bg-errorDark-100 border border-solid border-error-100 dark:border-error-300"
                      >
                        <p className="text-error-500 dark:text-errorDark-500 label2">
                          {"-"}
                          {addHexPrefix(params.value)} BASE
                        </p>
                      </div>
                    ) : (
                      <p className="text-text-500 dark:text-textDark-700 text-xs font-sans font-light">
                        Bal: {getCurrencyFormattedNumber(walletBalance)}{" "}
                      </p>
                    )}
                  </div>
                ) : null}
                {params.to && txnParams?.name !== TXN_TYPE.Approved && (
                  <>
                    <div className="relative">
                      <div className="absolute -top-3 left-2/4 h-6 w-6">
                        <img src={getImage("divider_icon.svg")} alt="" />
                      </div>
                    </div>
                    <div>
                      <div className="flex px-4 items-center py-3 border-b dark:border-b-neutralDark-300">
                        <img
                          onError={(e) => {
                            e.currentTarget.src = `${getImage("default_token.svg")}`;
                            e.currentTarget.onerror = null;
                          }}
                          width={36}
                          height={36}
                          src={getImage("logo/avatar_icon.svg")}
                          alt=""
                        />
                        <p className="text-sm ml-2 text-text-900 dark:text-textDark-900 relative ">
                          {shortenAddress(params.to)}
                        </p>
                        <img
                          src={getImage("copy_icon.svg")}
                          alt="copy"
                          className="cursor-pointer ml-2 w-3.5 h-3.5"
                          onClick={() => handleCopy(params.to)}
                        />
                      </div>
                    </div>
                  </>
                )}
                {txnParams?.name === TXN_TYPE.Approved ? (
                  <div className="px-4 py-4 flex items-center">
                    <p className="label2 text-text-300 dark:text-textDark-500 mr-auto">Approve for</p>
                    <div className="ml-auto flex items-center justify-end">
                      <img
                        onError={(e) => {
                          e.currentTarget.src = `${getImage("default_token.svg")}`;
                          e.currentTarget.onerror = null;
                        }}
                        className="w-6 h-6 mr-1"
                        src={getImage("logo/avatar_icon.svg")}
                        alt=""
                      />{" "}
                      <p className="label3">{shortenAddress(txnParams.args[0])}</p>
                      <div className="ml-2.5 flex items-center">
                        <a href={`${walletDetail.explorerUrl}/address/${txnParams.args[0]}`} target="_blank">
                          <img
                            src={getImage("open_outside.svg")}
                            alt="copy"
                            className="mr-0.5 w-3.5 h-3.5 cursor-pointer"
                          />
                        </a>
                        <img
                          src={getImage("copy_icon.svg")}
                          alt="copy"
                          className="cursor-pointer w-3.5 h-3.5"
                          onClick={() => handleCopy(txnParams.args[0])}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="px-4 border-y dark:border-y-neutralDark-300 py-3.5">
                  <RequestedBy
                    originLogo={params.icon}
                    originName={params.name}
                    originUrl={params?.origin}
                    logoStyles="h-9 w-9"
                  />
                </div>
              </div>
            </ApprovalsCard>
          </div>
        )}
      </div>

      {params.data && !showInsufficientBal && (
        <div
          className={` px-4  absolute bottom-0 w-full duration-300 ease-in-out overflow-hidden ${
            params.data ? "bg-gray-100 dark:bg-neutralDark-300" : "bg-white dark:bg-black"
          } ${txDetails ? "h-[310px]" : "h-[128px]"}`}
        >
          <div
            className={`flex py-4 items-center justify-between w-full pb-0 ${params.data ? "cursor-pointer" : ""}`}
            role={"presentation"}
            onClick={handleTxDetails}
          >
            <p className="pr-4 ml-1 text-sm text-text-500 dark:text-textDark-700">Transaction details</p>
            <div className="flex pl-4 items-center justify-end relative">
              {params.data && (
                <>
                  <img
                    className={`absolute top-1/2 -translate-y-1/2 right-0 w-6 h-6 object-cover dark:hidden ${
                      txDetails ? "rotate-180" : ""
                    }`}
                    src={getImage("chevron-down_gray.svg")}
                    alt=""
                  />
                  <img
                    className={`absolute top-1/2 -translate-y-1/2 right-0 w-6 h-6 object-cover hidden dark:block ${
                      txDetails ? "rotate-180" : ""
                    }`}
                    src={getImage("chevron_down.svg")}
                    alt=""
                  />
                </>
              )}
            </div>
          </div>

          {txDetails && (params.data || allowanceData) ? (
            <div className="flex flex-col mt-2 mb-12 ">
              <div className="flex  justify-between pb-2 pr-2">
                <p className="label3 text-text-300 dark:text-textDark-700 text-sm">Data:</p>
                {
                  <div
                    role={"presentation"}
                    className="flex gap-2 items-center justify-center cursor-pointer pl-1"
                    onClick={() => {
                      const data = allowanceData ? allowanceData : params.data;
                      handleCopy(data as string);
                    }}
                  >
                    <img src={getImage("copy_primary.svg")} alt=" " width="14" height="14" className="cursor-pointer" />
                    <p className="label3 text-primary-700 text-sm">Copy</p>
                  </div>
                }
              </div>

              <div className="justify-between pb-4">
                <p
                  className={`label3 py-2 break-all overflow-y-auto hide-scrollbar pb-[160px] font-roboto ${
                    txDetails ? "h-[250px]" : "h-[108px]"
                  }`}
                >
                  {allowanceData ? allowanceData : params.data}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
      <div className="absolute p-4 bottom-0 w-full bg-gray-100 dark:bg-neutralDark-300">
        <ApprovalsGroupButtons
          rightOnClick={handleSuccess}
          leftOnClick={handleCancel}
          isDisable={isDisable}
          rightBtnName={<ApproveButton />}
          leftBtnName={<DenyButton />}
          getScanData={{ background: "", status: scanData.severity }}
          riskApproved={riskApproved}
          handleChange={() => setRiskApproved(!riskApproved)}
        />
      </div>
      {networkFee ? <SelectNetworkFee style={selectNetworkFeeStyle} setNetworkFee={setNetworkFee} /> : null}
    </div>
  );
}
