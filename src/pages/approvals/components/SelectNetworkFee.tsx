import { FC, useState } from "react";

import { tokenFraction } from "../../../constants";
import { getImage } from "../../../utils";
import { TSelectNetworkFeeType } from "../types";

const SelectNetworkFee: FC<TSelectNetworkFeeType> = ({ style, setNetworkFee }) => {
  const [activeFraction, setActiveFraction] = useState(1);

  return (
    <div style={style} className="absolute w-full bottom-0">
      <div className="bg-black h-150 opacity-75 w-full"></div>
      <div className="bg-white w-full rounded-t-xl absolute bottom-0">
        <div className="flex items-center relative mb-3 py-2 border-b border-neutral-50 dark:border-neutralDark-300">
          <div className="items-center flex px-4">
            <p className="sub-title py-2.5 font-normal"> Network fee</p>
            <img
              role={"presentation"}
              src={getImage("close_grey.svg")}
              alt="logo"
              className="cursor-pointer absolute right-4"
              onClick={() => setNetworkFee?.(false)}
            />
          </div>
        </div>
        <div className="-mt-3 px-5">
          {tokenFraction.map((fee, i) => {
            return (
              <div
                key={fee.id}
                role="presentation"
                onClick={() => setActiveFraction(fee.id)}
                className={`${
                  fee.id === activeFraction ? "text-primary-700" : "text-text-300"
                } py-6 font-light flex text-base justify-between cursor-pointer border-t border-neutral-50 dark:border-neutralDark-300 hover:text-primary-700`}
              >
                <p>{fee.label}</p>
                <p
                  className={`hover:text-primary-700  ${
                    fee.id === activeFraction ? "text-primary-700" : "text-text-300"
                  }`}
                >
                  {fee.value}
                </p>
              </div>
            );
          })}
          <button
            className={"btn-primary text-base w-full mb-5 py-5 mt-10"}
            type={"button"}
            onClick={() => setNetworkFee?.(false)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectNetworkFee;
