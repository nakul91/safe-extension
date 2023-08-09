import { createContext, useContext } from "react";

import { saveWallet } from "../store/WalletStore";
const WalletContext = createContext();

const WalletProvider = ({ children, wallet }) => {
    saveWallet(wallet);
    return <WalletContext.Provider value={{ wallet }}>{children}</WalletContext.Provider>;
};

const useWallet = () => {
    const { wallet } = useContext(WalletContext);
    return wallet;
};

export { useWallet, WalletProvider };
