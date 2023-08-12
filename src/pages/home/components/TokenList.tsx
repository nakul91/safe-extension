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
  returnEthValue,
} from "../../../utils";
import { ITokenListType, TTokenTypes } from "../types";
import { Shimmer } from ".";
import { DEFAULT_EVM_CONTRACT_DECIMALS } from "../../../constants";
import NoState from "../../../ui_components/NoState";

const TokenList: FC<TTokenTypes> = (props) => {
  const { walletBalances, tokenLoading } = props;
  const [tokenList, setTokenList] = useState<Array<any>>([]);
  useEffect(() => {
    const parsedData: Array<any> = JSON.parse(JSON.stringify(walletBalances));
    if (parsedData) {
      setTokenList(
        parsedData.filter(
          (token) => token.type === "cryptocurrency" || token.type === "dust"
        )
      );
    }
  }, [walletBalances]);

  const isExpectedChains = (params: any) => {
    return getCurrencyFormattedNumber(params.quote);
  };

  return (
    <div>
      {tokenLoading ? (
        <Shimmer type="tokenList" />
      ) : tokenList.length === 0 ? (
        <NoState
        className="h-20 w-35 my-6"
        image={
          "no_state.svg" 
        }
        title={"No Token's yet"}
        titleClassName="label2 text-text-500"
    />
      ) : (
        tokenList.map((token, key) => {
          if (!token.contract_name) return;
          return (
            <div
              role={"presentation"}
              className={`flex justify-between p-4 border-b border-neutral-700 dark:border-neutralDark-300 cursor-pointer`}
              key={key}
            >
              <div className="flex items-start gap-2 pb-2">
                <div className="w-10 h-10">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={token.logo_url}
                    alt=" "
                    onError={(e) => {
                      e.currentTarget.src = `${createLogoAvatar(
                        `${token.contract_ticker_symbol}`,
                        "medium"
                      )}`;
                      e.currentTarget.className = "bg-primary-50 rounded-full";
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
                <div>
                 <p className="label1 font-medium leading-6 text-white pb-2 w-[211px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {getTokenValueFormatted(getTokenFormattedNumber(`${token.balance}`, token.contract_decimals))}{" "}
                    {token.contract_ticker_symbol}
                  </p>
                  <p className="label2 text-text-500 dark:text-textDark-700">
                    {getCurrencyFormattedNumber(token.contract_ticker_symbol=="ETH"? returnEthValue(getTokenFormattedNumber(`${token.balance}`, token.contract_decimals)):token.quote_rate)}
                  </p>
                </div>
              </div>
              <div
                className={`pb-2 flex flex-col items-end justify-center" : "justify-between gap-2
                `}
              >
                <p className="label1 font-medium leading-6 text-white dark:text-textDark-700 break-words">
                  {token.quote == 0 ? null : isExpectedChains(token)}
                </p>

                <>
                  {!token.pretty_quote_24h &&
                  !parseInt(token?.pretty_quote_24h?.toString()) &&
                  !token.quote_rate ? null : (
                    <p
                      className={`label2 flex ${
                        isPositiveValue(token.pretty_quote_24h) === true
                          ? "text-secondary-500 dark:text-secondaryDark-700"
                          : "text-error-500 dark:text-errorDark-900"
                      }`}
                    >
                      <img
                        src={getImage(`${getPercentArrowImage(token.pretty_quote_24h)}`)}
                        alt=" "
                        className="pr-0.5"
                      />
                      {getPercentageFormatter(token?.pretty_quote_24h?.replace("$", ""))}
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
