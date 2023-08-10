import qs from "query-string";
import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { TOKEN_LENGTH, TXN_TYPE } from "../../../constants";
import {
  getExponentialFixedNumber,
  getImage,
  getTokenFormattedNumber,
  getTransactionTypeName,
  shortenAddress,
  truncateText,
} from "../../../utils";
import { ITransactionType } from "../types";
const ActivitiesListItem: FC<any> = (props) => {
  const {
    type,
    sent,
    received,
    from,
    to,
    id,
    status,
    description,
    setQueryParamsData,
    queryParamsData,
    isDialogOpen,
    openTxBottomSheet,
    setOpenTxBottomSheet,
  } = props;
  const [openActivityDetail, setOpenActivityDetail] = useState(false);
  const [openActivityData, setOpenActivityData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const onShowActivityDetail = () => {
    setOpenActivityDetail(true);
    setOpenActivityData(props);
  };

  const getImageByName = () => {
    if (type === "Send" || type === "Receive") {
      return type?.toLowerCase();
    } else {
      return type;
    }
  };

  return (
    <>
      <div
        role="presentation"
        onClick={onShowActivityDetail}
        className="flex items-center cursor-pointer hover:bg-background-50 dark:hover:bg-greyDark-500 p-4"
      >
        <div className="relative">
          <img
            src={getImage(`txn_icons/${getImageByName()}.svg`)}
            alt={type}
            width={40}
            height={40}
            onError={(e) => {
              e.currentTarget.src = `${getImage("default_token.svg")}`;
              e.currentTarget.onerror = null;
            }}
            className={`${status === "error" ? "border border-red-600 dark:text-errorDark-900 rounded-full" : null} `}
          />
          {status === "error" ? (
            <img
              width={14}
              height={14}
              src={getImage(`red-cancel.svg`)}
              alt="cancelled"
              className="absolute bg-white dark:bg-neutralDark-300 rounded-full left-2/3 top-2/3"
            />
          ) : null}
        </div>
        <div className="grow w-fit flex relative justify-between items-center">
          <ul className="pl-3">
            <li className="paragraph1 leading-4 dark:text-textDark-900 font-medium pb-2 only:pb-0">
              {getTransactionTypeName(type)}
            </li>

            {type === TXN_TYPE.Swap ||
            type === TXN_TYPE.SwapExactTokensForTokens ||
            type === TXN_TYPE.Approved ||
            type === TXN_TYPE.Stake ||
            type === TXN_TYPE.AddLiquidity ||
            type === TXN_TYPE.RemoveLiquidity ||
            type === TXN_TYPE.Lend ? (
              ""
            ) : type === TXN_TYPE.Receive || type === TXN_TYPE.Token_Transferred ? (
              <li className="label2 leading-3.5 text-text-500 dark:text-textDark-700">
                from:<span className="ml-1">{shortenAddress(from)}</span>
              </li>
            ) : type === TXN_TYPE.Send ? (
              <li className="label2 leading-3.5 text-text-500 dark:text-textDark-700">
                to:<span className="ml-1">{shortenAddress(sent[0]?.to || to)}</span>
              </li>
            ) : type === TXN_TYPE.Smart_Contract ? (
              <li className="label2 leading-3.5 text-text-500 dark:text-textDark-700">
                Address:<span className="ml-1">{shortenAddress(to)}</span>
              </li>
            ) : type === TXN_TYPE.Withdraw ? (
              <li className="label2 leading-3.5 text-text-500 dark:text-textDark-700">
                from:<span className="ml-1">{shortenAddress(to)}</span>
              </li>
            ) : (
              <li className="label2 leading-3.5 text-text-500 dark:text-textDark-700">
                to:<span className="ml-1">{shortenAddress(to)}</span>
              </li>
            )}
          </ul>

          {type === TXN_TYPE.Swap || TXN_TYPE.SwapExactTokensForTokens ? (
            <ul className="text-end">
              <li className="label2 dark:text-textDark-900 leading-3.5">
                {received.length > 0 &&
                  received[0].value &&
                  getExponentialFixedNumber(getTokenFormattedNumber(received[0].value, received[0].decimals))}
                <span className={`${received.length > 0 ? "ml-1" : ""}`}>
                  {truncateText(received.length ? received[0].symbol : "", TOKEN_LENGTH.SHORT)}
                </span>
              </li>
              <span className="label2 leading-3.5 text-text-300 dark:text-textDark-700">
                {sent.length > 0 &&
                  sent[0].value &&
                  getExponentialFixedNumber(getTokenFormattedNumber(sent[0].value, sent[0].decimals))}
                <span className={`${sent.length > 0 ? "ml-1" : ""}`}>{sent.length ? sent[0].symbol : ""}</span>
                {status === "error" ? (
                  <>
                    {" • "}
                    <span className="text-red-500 dark:text-errorDark-500 label2">failed</span>
                  </>
                ) : null}
              </span>
            </ul>
          ) : type === TXN_TYPE.Approved ? (
            <ul>
              <li className="line-clamp-2 dark:text-textDark-900 text-end">{description.replace("Approved", "")}</li>
              {status === "error" ? <span className="text-red-500 dark:text-errorDark-900 label2"> failed</span> : null}
            </ul>
          ) : type === TXN_TYPE.Stake ? (
            <ul>
              <li className="line-clamp-2 dark:text-textDark-900 text-end">{description.replace("Staked", "")}</li>
              {status === "error" ? <span className="text-red-500 dark:text-errorDark-500 label2">failed</span> : null}
            </ul>
          ) : type === TXN_TYPE.Receive ? (
            <ul className="text-end">
              <li className="label2 text-end dark:text-textDark-900 line-clamp-2 flex leading-3.5 only:my-auto">
                +
                {received[0].value &&
                  getExponentialFixedNumber(getTokenFormattedNumber(received[0].value, received[0].decimals))}{" "}
                {truncateText(received[0].symbol, TOKEN_LENGTH.SHORT)}
              </li>
            </ul>
          ) : type === TXN_TYPE.Send ? (
            <ul className="text-end">
              <li className="flex label2 line-clamp-2 dark:text-textDark-900 leading-3.5 only:my-auto">
                {sent[0].value === "0" ? "" : "-"}
                {sent[0].value &&
                  getExponentialFixedNumber(getTokenFormattedNumber(sent[0].value, sent[0].decimals))}{" "}
                {truncateText(sent[0].symbol, TOKEN_LENGTH.SHORT)}
              </li>
            </ul>
          ) : status === "error" ? (
            <>
              <span className="text-red-500 dark:text-errorDark-500 relative right-2 bottom-0 label2 leading-3.5">
                failed
              </span>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ActivitiesListItem;
