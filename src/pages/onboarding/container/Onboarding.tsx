window.global ||= window;
import { Web3AuthModalPack } from "@safe-global/auth-kit";
import { ethers } from "ethers";
import { EthersAdapter, SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";
import { modalConfig, web3AuthOptions, web3AuthConfig } from "../../../constants/chains/baseGoerli";
import { useContext, useEffect, useState } from "react";
import { ACTIONS, GlobalContext } from "../../../context/GlobalContext";
import { getSafes } from "../../utils";
import { useWallet } from "../../../context/WalletContext";

export default function Onboarding() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
  const { dispatch } = useContext(GlobalContext);
  const wallet = useWallet();

  const signIn = async () => {
    await web3AuthModalPack.init({ options: web3AuthOptions, adapters: undefined, modalConfig });
    try {
      const authKitSignData = await web3AuthModalPack.signIn();
      if (authKitSignData.eoa && authKitSignData.safes?.length) {
        setLoggedIn(true);
      } else if (authKitSignData.eoa && !authKitSignData.safes?.length) {
        createSafe();
      } else {
        throw new Error("Something went wrong please try again!");
      }
    } catch {
      throw new Error("Something went wrong please try again!");
    }
  };

  const createSafe = async () => {
    const safeSdkOwnerPredicted = await getSafes(web3AuthModalPack);
    setLoggedIn(true);
    dispatch({
      type: ACTIONS.SET_SAFE_ADDRESS,
      payload: safeSdkOwnerPredicted,
    });
    await wallet?.setFirstTimeFlow("create");
    await wallet?.addWalletAddress({ address: safeSdkOwnerPredicted });
  };

  useEffect(() => {
    signIn();
  }, []);

  return <>{isLoggedIn ? <p>Continue by clicking the extension</p> : <p>please wait...</p>}</>;
}
