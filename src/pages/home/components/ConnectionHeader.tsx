import { FC } from "react";

import { getImage, truncateText } from "../../../utils";
import { shortenAddress } from "../../../utils";
import { TConnectionHeaderTypes } from "../types";

const ConnectionHeader: FC<TConnectionHeaderTypes> = (props) => {
    const { walletName, walletAddress, connectionIcon, connectionName, headerColor } =
        props;

    return (
        <div
            style={{ backgroundColor: headerColor }}
            className={`flex justify-between items-center px-4 py-2 fixed top-0 w-105 z-10`}
        >
            <div>
                <p className="text-white text-xs">{truncateText(walletName, 50)}</p>
                <p className="text-white/50 text-xs">{shortenAddress(walletAddress)}</p>
            </div>
            <div className="flex items-center">
                <img
                    className="w-5 h-5 rounded-full"
                    src={connectionIcon}
                    alt=" "
                    onError={(e) => {
                        e.currentTarget.src = `${getImage("default_token.svg")}`;
                        e.currentTarget.onerror = null;
                    }}
                />
                <span className="pl-1 text-white text-sm">{connectionName}</span>
            </div>
        </div>
    );
};

export default ConnectionHeader;
