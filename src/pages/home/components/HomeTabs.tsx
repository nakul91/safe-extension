import { FC, Fragment, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { GlobalContext } from "../../../context/GlobalContext";
import { getImage } from "../../../utils";
import { ActivitiesList, NFTsList, TokenList } from "../components";
import { IHomeTabTypes } from "../types";
import { BaseGoerli } from "../../../constants/chains/baseGoerli";

interface ITabsType {
  value: number;
  label: string | React.ReactElement;
  name: string;
}

export enum TABS_NAMES {
  TOKENS = "Tokens",
  NFTS = "NFTs",
  STAKING = "Positions",
  ACTIVITIES = "Activities",
}

const HomeTabs: FC<any> = (props) => {
  const { walletBalances, tokenLoading, getWalletBalance } = props;
  const [activeTab, setActiveTab] = useState(TABS_NAMES.TOKENS as string);
  const [tabs, setTabs] = useState<ITabsType[]>();
  const [isLastTxn, setIsLastTxn] = useState(true);
  const [isLastTxnError, setIsLastTxnError] = useState(false);
  const [isTxnLoadingError, setIsTxnLoadingError] = useState(false);
  const [tabState, setTabState] = useState(false);
  const [singleTabState, setSingleTabState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    navigate({
      pathname: `/home/${tabName}`,
      search: location.search,
    });
    if (tabName === TABS_NAMES.TOKENS) {
      getWalletBalance?.(tokenLoading ?? true);
    }
  };

  const {
    state: { safeAddress },
  } = useContext(GlobalContext);

  useEffect(() => {
    if (location?.pathname === "/home/Tokens") {
      setActiveTab(TABS_NAMES.TOKENS);
    } else if (location?.pathname === "/home/NFTs") {
      setActiveTab(TABS_NAMES.NFTS);
    } else if (location?.pathname === "/home/Activities") {
      setActiveTab(TABS_NAMES.ACTIVITIES);
    } else if (location.pathname === "/home/Positions") {
      setActiveTab(TABS_NAMES.STAKING);
    }
  }, [location]);

  useEffect(() => {
    if (activeTab === TABS_NAMES.ACTIVITIES) {
      setIsLastTxn(true);
    }
  }, [activeTab]);

  return (
    <div>
      <ul
        className={`${tabState ? "homeTwoTab" : "homeTab"} flex ${
          singleTabState ? "" : "items-center justify-center sticky"
        } top-14 bg-white dark:bg-neutralDark-300 z-10 w-full`}
      >
        <li
          role={"presentation"}
          className={`justify-center homeTabList w-1/3 flex py-3 label2 border-b-2 cursor-pointer ${
            activeTab === "tokens" && !singleTabState
              ? "text-primary-700 dark:text-primaryDark-700 active"
              : "text-text-500 dark:text-textDark-700"
          }`}
          onClick={() => handleTabChange("tokens")}
          onKeyDown={() => handleTabChange("tokens")}
        >
          Tokens
        </li>
        <li
          role={"presentation"}
          className={`justify-center homeTabList w-1/3 flex py-3 label2 border-b-2 cursor-pointer ${
            activeTab === "tokens" && !singleTabState
              ? "text-primary-700 dark:text-primaryDark-700 active"
              : "text-text-500 dark:text-textDark-700"
          }`}
          onClick={() => handleTabChange("tokens")}
          onKeyDown={() => handleTabChange("tokens")}
        >
          NFTs
        </li>
        <li
          role={"presentation"}
          className={`justify-center homeTabList w-1/3 flex py-3 label2 border-b-2 cursor-pointer ${
            activeTab === "tokens" && !singleTabState
              ? "text-primary-700 dark:text-primaryDark-700 active"
              : "text-text-500 dark:text-textDark-700"
          }`}
          onClick={() => handleTabChange("tokens")}
          onKeyDown={() => handleTabChange("tokens")}
        >
          Activities
        </li>
      </ul>
      {activeTab === TABS_NAMES.TOKENS ? (
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          {!tokenLoading && walletBalances && walletBalances?.length > 0 ? (
            <span className="label2 text-text-500 dark:text-text-500">
              {walletBalances?.length} {walletBalances && walletBalances?.length >= 2 ? "Tokens" : "Token"}
            </span>
          ) : (
            ""
          )}
        </div>
      ) : null}

      <div className="pb-16">
        {activeTab === TABS_NAMES.TOKENS && (
          <TokenList walletBalances={walletBalances} tokenLoading={tokenLoading} getWalletBalance={getWalletBalance} />
        )}
        {activeTab === TABS_NAMES.NFTS && <NFTsList />}
        {activeTab === TABS_NAMES.ACTIVITIES && (
          <ActivitiesList
            setIsTxnLoadingError={setIsTxnLoadingError}
            selectedChain={BaseGoerli.blockchain}
            selectedAddress={safeAddress}
            pageSize={20}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
};

export default HomeTabs;