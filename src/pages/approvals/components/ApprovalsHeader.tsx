import React, { FC } from "react";

import { getImage, shortenAddress } from "../../../utils";
import { TApprovalsHeaderTypes } from "../types";

const ApprovalsHeader: FC<TApprovalsHeaderTypes> = ({
    address,
    walletName,
    chainName,
    walletColor,
    chainLogo,
}) => {
    return (
        <div
            className="flex justify-between items-center h-12 px-6 text-white min-h-[48px]"
            style={{ background: walletColor }}
        >
            <div
                style={{
                    clipPath: "polygon(0 0, 70% 0, 100% 100%, 0% 100%)",
                }}
                className="bg-gray-400 opacity-20 -z-0 w-30 h-12 absolute top left-0"
            ></div>
            <div className="-z-0">
                <p className="text-xs leading-4">{walletName ?? ""}</p>
                <p className="text-xs leading-4">{shortenAddress(address)}</p>
            </div>
            <div className="flex items-center">
                <img
                    className="mr-1.5 rounded-full"
                    height={24}
                    width={24}
                    src={chainLogo ?? getImage("chain_icon.svg")}
                    alt=""
                />
                <p className="text-sm">{chainName ?? ""}</p>
            </div>
        </div>
    );
};

export default ApprovalsHeader;
