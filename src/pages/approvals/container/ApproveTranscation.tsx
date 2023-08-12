import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "../../../ui_components/IconButton";
import { getImage, shortenAddress } from "../../../utils";
import { ApprovalsCard, ApprovalsGroupButtons, ApprovalsHeader, SelectNetworkFee } from "../components";

export default function ApproveTranscation() {
  const [networkFee, setNetworkFee] = useState(false);
  const [txDetails, setTxDetails] = useState(false);

  const dataEndRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const selectNetworkFeeStyle = {
    transform: networkFee ? `translateY(0)` : `translateY(-100%)`,
    opacity: networkFee ? 1 : 0,
  };

  const onCLickHandle = () => {
    setTxDetails(!txDetails);
  };

  useEffect(() => {
    if (txDetails && dataEndRef.current) {
      dataEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [txDetails]);

  return (
    <div className="relative flex flex-col h-150">
      <div className="overflow-scroll">
        <div className="mb-20">
          <div className="absolute z-10 top-0 w-full">
            <ApprovalsHeader address="0x92C9c8E6649CB1c6ba04bCd7797Df653d8dD9D0a" />
          </div>
          <div className="bg-black h-12"></div>
          <div className="px-4 relative">
            <div className="bg-gray-100 dark:bg-neutralDark-500 -translate-y-10 h-64 absolute right-0 left-0 -z-10"></div>
            <p className="text-3xl mb-6 font-sans mt-6 font-normal leading-12">Approve transaction?</p>
            <ApprovalsCard requestedSite="app.aave.com">
              <div className="grid">
                <div>
                  <div className="flex px-4 justify-between border-b py-2 pb-3">
                    <div className="flex items-center">
                      <img width={36} height={36} src={getImage("eth_icon.svg")} alt="" />
                      <p className="text-sm ml-2">0.0018 ETH ~ $0.34</p>
                    </div>
                    <div className="p-2 pt-1.5 h-7 mt-1 rounded bg-gray-100  dark:bg-neutralDark-500">
                      <p className="text-text-500 dark:text-textDark-500 text-xs font-sans font-light ">Withdrawal</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 rounded-full p-1.5 h-6 w-6 bg-primary-100">
                      <img src={getImage("arrow_right_red.svg")} alt="" />
                    </div>
                  </div>

                  <div>
                    <div className="flex px-4 items-center py-3 border-b">
                      <img width={36} height={36} src={getImage("logo/avatar_icon.svg")} alt="" />
                      <p className="text-sm ml-2">{shortenAddress("0x92C9c8E6649CB1c6ba04bCd7797Df653d8dD9D0a")}</p>
                    </div>
                  </div>
                </div>
                <div className="py-4 pb-2 pt-5 px-4 flex justify-between">
                  <p className="text-sm text-text-300 dark:text-textDark-300">Network Fees Paid</p>
                  <div className="flex items-center">
                    <p className="text-sm font-sans">0.0002 ETH ~ $0.29</p>
                    <IconButton className={"ml-4"} onClick={() => setNetworkFee(!networkFee)} type={"button"}>
                      {" "}
                      <img src={getImage("options.svg")} alt="" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </ApprovalsCard>
          </div>
        </div>
        <div className="mt-auto mb-20 bg-gray-100 dark:bg-neutralDark-500 w-full">
          <div className="flex py-5 items-center justify-between">
            <div className="flex px-4">
              <img src={getImage("info_icon_gray.svg")} alt="" />
              <p className="ml-1 text-sm text-text-500">Transaction details</p>
            </div>
            <div className="flex px-4 items-center">
              <p className="text-sm font-bold font-sans">0.0002 ETH ~ $0.29</p>
              <img
                role={"presentation"}
                className={`ml-4 cursor-pointer dark:hidden ${txDetails ? "rotate-180" : ""}`}
                onClick={onCLickHandle}
                src={getImage("chevron-down_gray.svg")}
                alt=""
              />
              <img
                role={"presentation"}
                className={`ml-4 cursor-pointer hidden dark:block ${txDetails ? "rotate-180" : ""}`}
                onClick={onCLickHandle}
                src={getImage("chevron_down.svg")}
                alt=""
              />
            </div>
          </div>
          {txDetails ? (
            <div ref={dataEndRef} className="px-4 pb-1">
              <div className="border-t"></div>
              <p className="mb-3 mt-3 text-sm text-text-500 dark:text-textDark-500 ">Data</p>
              <p className=" break-words mb-5 text-sm">
                0x095ea7b3000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000000000000000000000000001
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="absolute px-4 bottom-0 w-full bg-gray-100  dark:bg-neutralDark-500 py-4">
        <ApprovalsGroupButtons
          rightOnClick={() => navigate("/confirm-transcation-approved")}
          rightBtnName={"Confirm"}
          leftBtnName={"Deny"}
        />
      </div>
      <SelectNetworkFee style={selectNetworkFeeStyle} setNetworkFee={setNetworkFee} />
    </div>
  );
}
