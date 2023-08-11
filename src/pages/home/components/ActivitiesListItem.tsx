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
  console.log("props", props);
  const { item, key } = props;
  const [openActivityDetail, setOpenActivityDetail] = useState(false);
  const [openActivityData, setOpenActivityData] = useState({});
  const [type, setType] = useState(TXN_TYPE.Send);
  const navigate = useNavigate();
  const location = useLocation();
  const onShowActivityDetail = () => {
    setOpenActivityDetail(true);
    setOpenActivityData(props);
  };

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
            <li className="paragraph1 leading-4 dark:text-textDark-900 font-medium pb-2 only:pb-0">Send</li>
            <li className="label2 leading-3.5 text-text-500 dark:text-textDark-700">
              to:<span className="ml-1">{shortenAddress("")}</span>
            </li>
          </ul>
          {type === TXN_TYPE.Receive ? (
            <ul className="text-end">
              <li className="label2 text-end dark:text-textDark-900 line-clamp-2 flex leading-3.5 only:my-auto">
                {/* +
                {received[0].value &&
                  getExponentialFixedNumber(getTokenFormattedNumber(received[0].value, received[0].decimals))}{" "}
                {truncateText(received[0].symbol, TOKEN_LENGTH.SHORT)} */}
              </li>
            </ul>
          ) : type === TXN_TYPE.Send ? (
            <ul className="text-end">
              {/* <li className="flex label2 line-clamp-2 dark:text-textDark-900 leading-3.5 only:my-auto">
                {sent[0].value === "0" ? "" : "-"}
                {sent[0].value &&
                  getExponentialFixedNumber(getTokenFormattedNumber(sent[0].value, sent[0].decimals))}{" "}
                {truncateText(sent[0].symbol, TOKEN_LENGTH.SHORT)}
              </li> */}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ActivitiesListItem;
