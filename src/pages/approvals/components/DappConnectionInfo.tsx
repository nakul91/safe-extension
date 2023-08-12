import { FC, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { CHAR_COUNT, IWalletController } from "../../../constants";
import { useWallet } from "../../../hooks";
import { WalletControllerClass } from "../../../scripts/backgroundServices/walletController";
import { getImage, truncateText } from "../../../utils";
import ExtensionData from "../../../utils/datahandler";
import { Shimmer } from "./";
import { TConnectionInfoTypes } from "../types";
import WalletSwitch from "./WalletSwitch";

const DappConnectionInfo: FC<TConnectionInfoTypes> = ({
  name,
  chain,
  icon,
  origin,
  walletBalance,
  walletBalanceShimmer,
  walletName,
  initialFetch,
}) => {
  const wallet = useWallet();
  const [wallets, setWallets] = useState<IWalletController[]>([]);
  const [openSwitchWallet, setOpenSwitchWallet] = useState(false);
  const location = useLocation();

  const isFullscreen = useMemo(() => {
    return new URLSearchParams(location?.search).get("fullscreen");
  }, [location?.search]);

  const getAllWallets = async (chain: string) => {
    let _wallets: IWalletController[] = await wallet.getWallets();
    _wallets = _wallets.filter((wal) => wal.accounts.some((acc) => acc.chain === chain && acc.status));
    setWallets(_wallets);
  };
  const handleUpdateWallet = async (selectedWallet: IWalletController) => {
    const _wallets = wallets.map((wal) => {
      return { ...wal, isSelected: wal.id === selectedWallet.id };
    });
    setWallets(_wallets);
    const extensionFns = new ExtensionData();
    await extensionFns.addWalletAddress(_wallets);
    initialFetch();
    setOpenSwitchWallet(false);
  };

  useEffect(() => {
    getAllWallets(chain);
  }, [chain]);

  return (
    <>
      <div className="relative flex flex-col items-center bg-white dark:bg-black shadow-sm shadow-slate-300 rounded-xl">
        <div className="w-full px-4 py-4 flex items-center justify-between gap-3 border-b border-neutral-50 dark:border-neutralDark-300">
          <div className="flex items-center">
            <img
              src={icon}
              alt=""
              onError={(e) => {
                e.currentTarget.src = `${getImage("default_token.svg")}`;
                e.currentTarget.onerror = null;
              }}
              className="w-8 h-8 mr-2 rounded-full object-cover"
            />
          </div>
          <span className="font-normal text-sm text-text-900 dark:text-textDark-900 opacity-40 leading-5 tracking-tight text-right">
            {truncateText(origin.replace(/(^\w+:|^)\/\//, ""), CHAR_COUNT.THIRTY_TWO)}
          </span>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img width={24} height={24} src={getImage("connect_wallet_icon.svg")} alt="connect" />
        </div>
        <div
          className="w-full px-4 py-4 flex items-center 
             border-b border-neutral-50 dark:border-neutralDark-300"
        >
          <img src={getImage("favicon.svg")} alt="" className="w-8 h-8 mr-2" />
          <span
            className="relative text-sm font-medium leading-3.5 text-text-900 dark:text-textDark-900 tracking-tight cursor-pointer pr-6"
            onClick={() => setOpenSwitchWallet(true)}
            onKeyPress={() => setOpenSwitchWallet(true)}
            role="presentation"
          >
            {walletName}{" "}
            <img className="w-4 h-4 absolute right-0 top-0" src={getImage("chevron_down_dark_grey.svg")} alt="icon" />
          </span>
          {walletBalanceShimmer ? (
            <Shimmer type="WalletBalance" />
          ) : (
            <div className="ml-auto font-normal text-sm text-text-900 dark:text-textDark-900 leading-4 tracking-tight flex">
              <span className="opacity-40 mr-1">Bal:</span> <span>{walletBalance}</span>
            </div>
          )}
        </div>
      </div>

      <WalletSwitch
        isFullscreen={isFullscreen}
        wallets={wallets}
        openSwitchWallet={openSwitchWallet}
        setOpenSwitchWallet={setOpenSwitchWallet}
        handleUpdateWallet={handleUpdateWallet}
      />
    </>
  );
};

export default DappConnectionInfo;
