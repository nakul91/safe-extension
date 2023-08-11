import { createContext, Dispatch, ReactNode, useReducer } from "react";

import { IChainTypes } from "../constants/chains";
import { saveStore } from "../store/GlobalStore";

export enum ACTIONS {
  CLEAR_TOAST = "CLEAR_TOAST",
  SHOW_TOAST = "SHOW_TOAST",
  HIDE_TOAST = "HIDE_TOAST",
  SET_SAFE_ADDRESS = "SET_SAFE_ADDRESS",
  SET_AUTH_MODALPACK = "SET_AUTH_MODALPACK",
}

export type TInitialStateType = {
  toastLists: Array<TToastType> | [];
  safeAddress: string;
  web3AuthModalPack: any;
};

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
        safeAddress: action.payload as any,
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
