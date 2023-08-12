import React, { FC } from "react";

import { getImage, shortenAddress } from "../../../utils";
import { TApprovalsHeaderTypes } from "../types";
import { BaseGoerli } from "../../../constants/chains/baseGoerli";

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
        <img
          src={getImage("safe_logo.svg")}
          alt="safe-logo"
          className="w-[120px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <img className="w-6 h-6 rounded-full" src={BaseGoerli.logo} alt=" " />
        <p className="text-sm">{"Base"}</p>
      </div>
    </div>
  );
};

export default ApprovalsHeader;
