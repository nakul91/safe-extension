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

interface IProps {
  children: ReactElement;
  path: string;
}


const PrivateRoute: FC<IProps> = ({ children, path }: IProps) => {
  const wallet = useWallet();
  const navigate = useNavigate();
  const { dispatch } = useContext(GlobalContext);

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
        if (web3AuthModalPack?.getProvider()) {
          //@ts-ignore
          const safeProvider = new ethers.providers.Web3Provider(web3AuthModalPack.getProvider());
          const provider = web3AuthModalPack.getProvider() as any;
          const prvKey = await safeProvider?.send("private_key", []);
          wallet?.setPvtKey(prvKey);
        }

        dispatch({
          type: ACTIONS.SET_SAFE_ADDRESS,
          payload: safeAddress,
        });

        const existingData = await wallet.getData();
        if (!existingData?.WalletController?.length) {
          await wallet?.setFirstTimeFlow("create");
          await wallet?.addWalletAddress([{ address: safeAddress }]);
        }

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
      await signIn();

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
    isUserLoggedIn();
  }, [path]);

  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get("fullscreen");

  return state.loader ? (
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
