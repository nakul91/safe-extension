import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ZERO_USD } from "../../../constants";
import { ACTIONS,GlobalContext } from "../../../context/GlobalContext";
import { getImage, handleCopy, shortenAddress } from "../../../utils";
import { Header, HomeTabs } from "../components";
import { ITokenListType } from "../types";
import { BaseGoerli } from "../../../constants/chains/baseGoerli";
import { getAllTransactionApi, getWalletBalanceApi } from "../apiServices";
import ActionsTab from "../components/ActionsTab";

export default function Home() {
  const [walletBalances, setWalletBalances] = useState<Array<ITokenListType>>([]);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [activitiesLoader, setActivitiesLoader] = useState(true);
  const [activityData, setActivityData] = useState({});
  const [balance, setBalance] = useState(0);
  const {
    state: { safeAddress },
    dispatch,
  } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get("fullscreen");

  useEffect(() => {
    if (safeAddress) {
      getWalletBalanceApi("base-testnet", safeAddress).then((res: any) => {
        if (res.error) {
          //handle error here
          return;
        }
        const data = { ...res.data };
        let balance = 0;
        const tokens = data?.items;
        tokens.forEach((_token: { quote: number | string }) => {
          balance = balance + Number(_token.quote);
        });
        const walletTokens = [...tokens];
        setWalletBalances(walletTokens);
        setTokenLoading(false);
        setBalance(balance);
        dispatch({
          type: ACTIONS.SET_TOKENS_LIST,
          payload: walletTokens,
        });
      });
      getAllTransactionApi("base-testnet", safeAddress, page).then((res: any) => {
        if (res.error) {
          //handle error here
          return;
        }
        const data = { ...res.data };
        setActivityData(data);
        setActivitiesLoader(false);
      });
    }
  }, [safeAddress]);

  return (
    <div
    className={`relative overflow-y-scroll hide-scrollbar extensionWidth${
        isFullscreen ? "h-screen" : "h-150 "
      }`}
    >
      <Header />
      <div className={`relative mt-[68px]`}>
      <div className={`px-4 pt-2 -mt-1 portfolioCardWrapper pb-4`}>
          <div className="flex flex-col relative portfolioCard">
            <AnimatePresence>
            <div className={`rounded-xl px-4 py-4 bg-[#4E32C2]`}>
                <div className="mb-4">
                  <p className="sub-title text-grey-500/90 pb-2">Smart Account</p>
                  <p
                    role={"presentation"}
                    className={`label3 copy-icon-wrapper text-neutral-50/40 dark:text-neutral-50/40 flex gap-2  hover:text-neutral-50 dark:hover:text-neutral-50 cursor-pointer`}
                    onClick={() => {
                      handleCopy(safeAddress);
                    }}
                  >
                    <span>{shortenAddress(safeAddress)}</span>
                    <img
                      src={getImage("copy_grey.svg")}
                      alt="copy"
                      className="default-icon"
                    />
                    <img
                      src={getImage("copy_light_grey.svg")}
                      alt="copy"
                      className="active-icon"
                    />
                    </p>
                </div>
                <div className="flex items-center mt-4">
                  <img
                    src={BaseGoerli.logo}
                    alt=" "
                    className="cursor-pointer rounded-xl mr-1.5 w-5 h-5"
                    onError={(e) => {
                      e.currentTarget.src = `${getImage("default_token.svg")}`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div className="grid grid-cols-2 divide-x items-center">
                    <p className="label3 text-white/[.70] mr-4">{BaseGoerli.name}</p>
                    <p className="label3 text-white/[.70] pl-4">{balance ? `$${balance}` : ZERO_USD}</p>
                  </div>
                </div>
              </div>
            </AnimatePresence>
          </div>
        </div>
        <ActionsTab />
        <HomeTabs
          walletBalances={walletBalances}
          tokenLoading={tokenLoading}
          activityData={activityData}
          activitiesLoader={activitiesLoader}
        />
        <div className="fixed bottom-1 w-full">
          <div className="flex items-center justify-between pl-1">
            <div className="flex gap-2 justify-center items-center">
              <p className="inline text-[12px] text-white">Powered by: </p>
              <img src={getImage("safe.svg")} alt="" />
              <p className="inline text-[12px] text-white">|</p>
              <img src={getImage("covalent_white.svg")} alt="" />
            </div>
            <div className="flex gap-2 justify-center items-center pr-1">
              <p className="text-[12px] text-white">Built on:</p>
              <img src={getImage("base_logo.svg")} alt="" />
              <p className="text-[12px] font-medium text-white">Base Görli</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
