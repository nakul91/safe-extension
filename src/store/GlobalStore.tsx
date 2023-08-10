import { CHAIN_LIST as RAW_CHAIN_LIST, IChainTypes } from "../constants/chains";
// import { Dispatch } from "react";
// import { TActionType, TInitialStateType } from "../context/GlobalContext";

let Store: any = null;

export function saveStore(createdStore: {
    // commenting this out to avoid react import #TODO
    // state: TInitialStateType;
    // dispatch: Dispatch<TActionType>;
    state: any;
    dispatch: any;
}) {
    Store = { ...createdStore };
}

export function getStore() {
    return Store;
}

export function clearStore() {
    Store = null;
    return Store;
}

export function getAllChains(editedChains?: Array<Partial<IChainTypes>>) {
    let CHAIN_LIST: Array<Partial<IChainTypes>> = getStore()?.state?.allChains?.length
        ? getStore()?.state?.allChains
        : RAW_CHAIN_LIST;
    if (editedChains?.length) {
        const editedChainsIds = editedChains.length
            ? editedChains.map((nw) => {
                  return nw.chainId;
              })
            : [];
        CHAIN_LIST = CHAIN_LIST.filter(
            (_chain) => !editedChainsIds.includes(_chain.chainId),
        );
        CHAIN_LIST = [...CHAIN_LIST, ...editedChains];
    }
    return { CHAIN_LIST };
}
