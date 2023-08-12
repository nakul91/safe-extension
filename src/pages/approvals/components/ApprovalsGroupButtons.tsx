import React, { FC } from "react";

import { TApprovalsGroupButtonsType } from "../types";
import { approveCheckBoxLabel } from "../../../scripts/constants";

const ApprovalsGroupButtons: FC<any> = (props) => {
  const {
    rightBtnName,
    leftBtnName,
    rightOnClick,
    leftOnClick,
    isDisable,
    hideLeftButton = false,
    hideRightButton = false,
    getScanData,
    riskApproved,
    handleChange,
    customCheckboxMargin,
  } = props;

  return (
    <div>
      <div className={`flex flex-row`}>
        {!hideLeftButton && (
          <div className={`w-1/2 pr-3`}>
            <button onClick={leftOnClick} className={`approve-btn-secondary w-full py-5 text-base`} type={"button"}>
              {leftBtnName}
            </button>
          </div>
        )}
        {!hideRightButton && (
          <div className={`w-1/2 pl-3`}>
            <div className={`rounded-large`}>
              <button
                onClick={rightOnClick}
                className={`approve-btn-primary w-full py-5 text-base`}
                type={"button"}
                disabled={isDisable}
              >
                {rightBtnName}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalsGroupButtons;
