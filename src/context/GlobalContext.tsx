import { createContext, Dispatch, ReactNode, useReducer } from "react";

import { IChainTypes } from "../constants/chains";
import { saveStore } from "../store/GlobalStore";

export enum ACTIONS {
  CLEAR_TOAST = "CLEAR_TOAST",
  SHOW_TOAST = "SHOW_TOAST",
  HIDE_TOAST = "HIDE_TOAST",
  SET_SAFE_ADDRESS = "SET_SAFE_ADDRESS",
  SET_AUTH_MODALPACK = "SET_AUTH_MODALPACK",
  SET_TOKENS_LIST = "SET_TOKENS_LIST",
}

export type TInitialStateType = {
  toastLists: Array<TToastType> | [];
  safeAddress: string;
  web3AuthModalPack: any;
  tokensList: Array<ITokenListType> | [];
};


export interface ITokenListType {
  contract_name: string;
  contract_ticker_symbol: string;
  contract_decimals: number;
  token_decimals?: number;
  contract_address?: string;
  coin: number;
  type: string;
  balance: string;
  quote: number | string;
  quote_rate: number;
  logo_url?: string;
  quote_rate_24h: number;
  quote_pct_change_24h: number;
  verified?: string;
  token_logo_url?: string;
  token_name?: string;
  token_address?: string;
  token_symbol?: string;
  denom?: string;
  token_price?: string;
  token_website?: string;
  token_trade_volume?: string;
  token_listed_count?: string;
  token_last_activity?: string;
  account_number?: number;
  sequence?: number;
  nonce?: number;
  block_hash?: string;
  block_height?: number;
}

export type TActionType = {
  type: string;
  payload: unknown;
};

type TToastType = {
  message: string;
  toastType: string;
};

interface IProps {
  children?: ReactNode;
}

const initialState: TInitialStateType = {
  toastLists: [],
  safeAddress: "",
  web3AuthModalPack: undefined,
};

export type TGlobalContextType = {
  state: TInitialStateType;
  dispatch: Dispatch<TActionType>;
};

export const GlobalContext = createContext<TGlobalContextType>({
  state: initialState,
  dispatch: () => null,
});

function reducer(state: TInitialStateType, action: TActionType) {
  switch (action.type) {
    case ACTIONS.SHOW_TOAST: {
      const payload = action.payload as TToastType;
      if (payload.toastType === "error") {
        if (state.toastLists.filter((toast: TToastType) => toast.toastType === "error").length < 1) {
          return {
            ...state,
            toastLists: [
              ...state.toastLists,
              ...[
                {
                  message: payload.message,
                  toastType: payload.toastType,
                },
              ],
            ],
          };
        } else {
          return state;
        }
      } else {
        return {
          ...state,
          toastLists: [...state.toastLists, ...[{ message: payload.message, toastType: payload.toastType }]],
        };
      }
    }
    case ACTIONS.CLEAR_TOAST:
      return {
        ...state,
        toastLists: [],
      };
    case ACTIONS.HIDE_TOAST:
      if (state.toastLists) {
        return {
          ...state,
          toastLists: [],
        };
      } else {
        return { ...state };
      }
    case ACTIONS.SET_SAFE_ADDRESS:
      return {
        ...state,
        safeAddress: action.payload as string,
      };
    case ACTIONS.SET_AUTH_MODALPACK:
      return {
        ...state,
        web3AuthModalPack: action.payload as any,
      };
    default:
      return state;
  }
}

const GlobalContextProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  saveStore({ state, dispatch });
  return <GlobalContext.Provider value={{ state, dispatch }}>{children}</GlobalContext.Provider>;
};
export default GlobalContextProvider;
