import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ZERO_USD } from "../../../constants";
import { GlobalContext } from "../../../context/GlobalContext";
import { getImage, shortenAddress } from "../../../utils";
import { Header, HomeTabs } from "../components";
import { ITokenListType } from "../types";
import { BaseGoerli } from "../../../constants/chains/baseGoerli";

export default function Home() {
  const [walletBalances, setWalletBalances] = useState<Array<ITokenListType>>([]);
  const [tokenLoading, SetTokenLoading] = useState(false);

  const {
    state: { safeAddress },
    dispatch,
  } = useContext(GlobalContext);

  const getWalletBalance = async (tokenLoading: boolean) => {};

  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get("fullscreen");

  return (
    <div
      className={`relative overflow-y-scroll hide-scrollbar extensionWidth bg-white dark:bg-neutralDark-50 ${
        isFullscreen ? "h-screen" : "h-150 "
      }`}
    >
      <Header />
      <div className={`relative mt-16`}>
        <div className={`px-4 pt-2 -mt-1 portfolioCardWrapper dark:bg-neutralDark-300 pb-4`}>
          <div className="flex flex-col relative portfolioCard">
            <AnimatePresence>
              <div
                className={`rounded-xl px-4 py-4 portfolioCardBack`}
                style={{
                  background: "#FF0000",
                }}
              >
                <div className="mb-4">
                  <p className="sub-title text-grey-500/90 pb-2">Smart Account</p>
                  <p className="label3 text-neutral-50/40 flex gap-2">
                    <span>{shortenAddress(safeAddress)}</span>
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
                    <p className="label3 text-white/[.70] pl-4">{ZERO_USD}</p>
                  </div>
                </div>
              </div>
            </AnimatePresence>
          </div>
        </div>
        <HomeTabs walletBalances={walletBalances} tokenLoading={tokenLoading} getWalletBalance={getWalletBalance} />
      </div>
    </div>
  );
}
