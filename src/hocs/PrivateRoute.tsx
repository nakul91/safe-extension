import {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CHAIN_LIST } from "../constants/chains";
import { Web3AuthModalPack } from "@safe-global/auth-kit";
import { modalConfig, web3AuthConfig, web3AuthOptions } from "../constants/chains/baseGoerli";
import { getSafes } from "../pages/utils";
import { ACTIONS, GlobalContext } from "../context/GlobalContext";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import { Login } from "../pages/login/container/Login";
import { getFromLocalStorage, saveToLocalStorage } from "../utils";

interface IProps {
  children: ReactElement;
  path: string;
}


const PrivateRoute: FC<IProps> = ({ children, path }: IProps) => {
  const wallet = useWallet();
  const navigate = useNavigate();
  const {
    dispatch,
    state: { safeAddress },
  } = useContext(GlobalContext);

  const [loggedInClicked, setLoggedInClicked] = useState(false);
const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    isLoggedIn: false,
    loader: true,
  });

  const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);

  const isUserLoggedIn = async () => {
    await web3AuthModalPack.init({ options: web3AuthOptions, adapters: undefined, modalConfig });
    try {
      const userInfo = await web3AuthModalPack.getUserInfo();
      if (userInfo && userInfo.email) {
        const safeAddress = await getSafes(web3AuthModalPack);
        saveToLocalStorage("safe_address", safeAddress);

        dispatch({
          type: ACTIONS.SET_SAFE_ADDRESS,
          payload: safeAddress,
        });

        dispatch({
          type: ACTIONS.SET_AUTH_MODALPACK,
          payload: web3AuthModalPack,
        });

        setState({
          isLoggedIn: true,
          loader: false,
        });
      } else {
        await web3AuthModalPack.signOut();
        setState({
          isLoggedIn: false,
          loader: false,
        });
      }
    } catch {
      setState({
        isLoggedIn: false,
        loader: false,
      });

    }
  };

  const handleClick = async () => {
    await signIn();
  };

  const signIn = async () => {
    const ExtensionPlatform = await import("../scripts/platforms/extension");
    const platform = new ExtensionPlatform.default();
    // @ts-ignore
    platform.openExtensionInBrowser("/signin", "fullscreen=true");
  };

  useEffect(() => {
    async function initializeSafe() {
      const add = getFromLocalStorage("safe_address");
      if (!add) {
        isUserLoggedIn();
      }
      if (add !== null && !safeAddress) {
        dispatch({
          type: ACTIONS.SET_SAFE_ADDRESS,
          payload: add,
        });
      }
      if (add) {
        console.log("came to provider addition");

        await web3AuthModalPack.init({
          options: web3AuthOptions,
          adapters: undefined,
          modalConfig,
        });
        dispatch({
          type: ACTIONS.SET_PROVIDER,
          payload: web3AuthModalPack.getProvider(),
        });
      }
    }
    initializeSafe();
  }, [path]);

  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get("fullscreen");

  return getFromLocalStorage("safe_address") ? (
    children
  ) : state.loader ? (
    <div
    className={`relative overflow-y-scroll hide-scrollbar extensionWidth flex items-center justify-center ${
      isFullscreen ? "h-screen" : "h-150 "
    }`}
  >
    <div className="spinnerLoader"></div>
    </div>
  ) : state.isLoggedIn ? (
    children
  ) : (
    <>
      <Login handleClick={handleClick} from="extension" />
    </>
  );
};

export default PrivateRoute;
