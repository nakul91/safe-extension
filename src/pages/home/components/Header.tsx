import { FC, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { GlobalContext } from "../../../context/GlobalContext";
import { useWallet } from "../../../context/WalletContext";
import { getImage, localStore } from "../../../utils";
import { APP_REDIRECTION } from "../../../constants";

const Header: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const wallet = useWallet();
  const onLock = async () => {
    let params = location.search;
    if (location.search.includes("tx=") && location.search.includes("chain=")) {
      params = "fullscreen=true";
    }
    navigate({
      pathname: "/",
      search: params,
    });
    localStore.remove(APP_REDIRECTION);
    wallet?.lock();
  };

  return (
    <>
      <div className="pt-2 pb-2 fixed w-[420px] z-20 bg-white px-5">
        <h1 className="heading1 font-bold text-mlg">Safe Base</h1>
      </div>
    </>
  );
};

export default Header;
