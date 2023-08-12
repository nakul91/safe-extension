import { FC } from "react";
import { getImage, truncateText } from "../../../utils";
import { CHAR_COUNT } from "../../../constants";
import { TRequestedByTypes } from "../types";

const RequestedBy: FC<TRequestedByTypes> = (props) => {
  const { originLogo, originName, originUrl, logoStyles } = props;
  return (
    <div className="flex items-center justify-between">
      <p className="label2 text-text-300 dark:text-textDark-500 mr-auto">Requested by</p>
      <div className="w-50 flex justify-end items-center relative">
        <img
          onError={(e) => {
            e.currentTarget.src = `${getImage("default_token.svg")}`;
            e.currentTarget.onerror = null;
          }}
          className={`${logoStyles} object-cover rounded-full`}
          src={originLogo}
          alt=""
        />
        <div className="ml-1 break-all flex flex-col items-end">
          <p className="self-start text-sm text-text-900 dark:text-textDark-900">
            {truncateText(originName.replace(/(^\w+:|^)\/\//, ""), CHAR_COUNT.TWENTY_TWO)}{" "}
          </p>
          {originUrl && (
            <p className="text-text-500 dark:text-textDark-500 text-xs font-sans font-light">
              {truncateText(originUrl.replace(/(^\w+:|^)\/\//, ""), CHAR_COUNT.TWENTY_TWO)}{" "}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestedBy;
