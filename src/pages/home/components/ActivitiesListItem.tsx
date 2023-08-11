import qs from "query-string";
import { FC, useEffect, useMemo, useState } from "react";
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
  const { item, key, fromAddress } = props;
  const [type, setType] = useState(TXN_TYPE.Send);
  const onShowActivityDetail = () => {
    window.open(`https://goerli.basescan.org/tx/${item.tx_hash}`);
  };

  useMemo(() => {
    if (item && fromAddress) {
      if (item.fromAddress == fromAddress) {
        setType(TXN_TYPE.Send);
      } else if (item.fromAddress != fromAddress) {
        setType(TXN_TYPE.Receive);
      } else {
        setType(TXN_TYPE.Smart_Contract);
      }
    }
  }, [item, fromAddress]);

  return (
    <>
      <div
        role="presentation"
        onClick={onShowActivityDetail}
        className="flex items-center cursor-pointer hover:bg-background-50 p-4"
        key={key}
      >
        <div className="grow w-fit flex relative justify-between items-center">
          <ul className="pl-3">
            <li className="paragraph1 leading-4 dark:text-textDark-900 font-medium pb-2 only:pb-0 capitalize">
              {type}
            </li>
            <li className="label2 leading-3.5 text-text-500 dark:text-textDark-700">
              {type === TXN_TYPE.Send ? "to" : "from"}:
              <span className="ml-1">
                {shortenAddress(type === TXN_TYPE.Send ? item.to_address : item.from_address)}
              </span>
            </li>
          </ul>
          <ul className="text-end">
            <li className="label2 text-end dark:text-textDark-900 line-clamp-2 flex leading-3.5 only:my-auto">
              {item.value &&
                getExponentialFixedNumber(
                  getTokenFormattedNumber(item.value, item?.gas_metadata?.contract_decimals)
                )}{" "}
              {truncateText(item?.gas_metadata?.contract_ticker_symbol, TOKEN_LENGTH.SHORT)}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ActivitiesListItem;
