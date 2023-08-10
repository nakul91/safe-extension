import { Dispatch } from "react";

import { TActionType, TInitialStateType } from "../context/GlobalContext";
import { WalletControllerClass } from "../scripts/backgroundServices/walletController";

let storedWallet: any = null;

export function saveWallet(wallet: WalletControllerClass) {
    storedWallet = wallet;
}

export function getWallet() {
    return storedWallet;
}

export function clearWallet() {
    storedWallet = null;
    return storedWallet;
}
