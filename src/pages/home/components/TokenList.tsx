import { FC, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createLogoAvatar,
  getCurrencyFormattedNumber,
  getImage,
  getPercentageFormatter,
  getPercentArrowImage,
  getTokenFormattedNumber,
  getTokenValueFormatted,
  isPositiveValue,
} from "../../../utils";
import { ITokenListType, TTokenTypes } from "../types";
import { Shimmer } from ".";
import { DEFAULT_EVM_CONTRACT_DECIMALS } from "../../../constants";

const TokenList: FC<TTokenTypes> = (props) => {
  const { walletBalances, tokenLoading } = props;
  const [tokenList, setTokenList] = useState<Array<any>>([]);
  useEffect(() => {
    console.log("walletBalances", walletBalances);
    const parsedData: Array<any> = JSON.parse(JSON.stringify(walletBalances));
    setTokenList(parsedData);
  }, [walletBalances]);

  const isExpectedChains = (params: any) => {
    return getCurrencyFormattedNumber(params.quote);
  };

  return (
    <div>
      {tokenLoading ? (
        <Shimmer type="tokenList" />
      ) : (
        tokenList.map((token, key) => {
          if (!token.contract_name) return;
          console.log("token", token);
          return (
            <div
              role={"presentation"}
              className={`flex justify-between p-4 border-b border-neutral-50 dark:border-neutralDark-300 hover:bg-background-50 dark:hover:bg-greyDark-500 
                cursor-pointer
              `}
              key={key}
            >
              <div className="flex items-start gap-2 pb-2">
                <div className="w-10 h-10">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={token.logo_url}
                    alt=" "
                    onError={(e) => {
                      e.currentTarget.src = `${createLogoAvatar(`${token.contract_ticker_symbol}`, "medium")}`;
                      e.currentTarget.className = "bg-primary-50 rounded-full";
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
                <div>
                  <p className="label1 font-medium leading-6 text-text-700 dark:text-textDark-700 pb-2 w-[211px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {getTokenValueFormatted(getTokenFormattedNumber(`${token.balance}`, token.contract_decimals))}{" "}
                    {token.contract_ticker_symbol}
                  </p>
                  <p className="label2 text-text-500 dark:text-textDark-700">
                    {getCurrencyFormattedNumber(token.quote_rate)}
                  </p>
                </div>
              </div>
              <div
                className={`pb-2 flex flex-col items-end justify-center" : "justify-between gap-2
                `}
              >
                <p className="label1 font-medium leading-6 text-text-700 dark:text-textDark-700 break-words">
                  {token.quote == 0 ? null : isExpectedChains(token)}
                </p>

                <>
                  {!token.pretty_quote_24h &&
                  !parseInt(token?.quote_rate_24h?.toString()) &&
                  !token.quote_rate ? null : (
                    <p
                      className={`label2 flex ${
                        isPositiveValue(token.quote_pct_change_24h) === true
                          ? "text-secondary-500 dark:text-secondaryDark-700"
                          : "text-error-500 dark:text-errorDark-900"
                      }`}
                    >
                      <img
                        src={getImage(`${getPercentArrowImage(token.quote_pct_change_24h)}`)}
                        alt=" "
                        className="pr-0.5 dark:hidden"
                      />
                      <img
                        src={getImage(`${getPercentArrowImage(token.quote_pct_change_24h, true)}`)}
                        alt=" "
                        className="pr-0.5 hidden dark:block"
                      />
                      {getPercentageFormatter(token.quote_pct_change_24h)}
                      {
                        <span className="pl-1">
                          {getCurrencyFormattedNumber(
                            (token.quote_rate_24h * Number(token.balance)) /
                              10 ** (token.contract_decimals ?? DEFAULT_EVM_CONTRACT_DECIMALS)
                          )}
                        </span>
                      }
                    </p>
                  )}
                </>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TokenList;
