import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useContext, useState } from "react";
import { useLocation } from "react-router-dom";

import { GlobalContext } from "../../../context/GlobalContext";
import {
  createLogoAvatar,
  getEstimatedFormattedTime,
  getExponentialFixedNumber,
  getImage,
  getNumFormatted,
  getTokenFormattedNumber,
  getTokenValueFormatted,
} from "../../../utils";
import { ITokenListType } from "../../home/types";

export enum SELECT_TOKEN {
  SEND_TOKEN = "SEND_TOKEN",
  SWAP_TO = "SWAP_TO",
}

export type TSelectedTokenType = ITokenListType | null;

export type TSearchType = {
  val?: string | undefined;
  list?: ITokenListType[];
  isNewToken?: boolean;
};

export type TSelectTokenTypes = {
  type?: string;
  tokens?: ITokenListType[];
  selectToken?: boolean;
  setSelectToken: (value: boolean) => void;
  setSelectedToken?: (value: TSelectedTokenType) => void;
  setSelectedExchangeToken?: (value: TSelectedTokenType) => void;
  handleChangeToken?: (key: string, value: TSelectedTokenType) => void;
  style?: any;
  handleRouterChange?: (value: any) => void;
  routerList?: any[];
  toTokenData?: TSelectedTokenType;
  fromTokenData?: TSelectedTokenType;
  setSwapProvider?: (val: string) => void;
  handleProviderClick?: (provider: string, toolName: string) => void;
  handleProviderChange?: (provider: string, name: string) => void;
  handleUpdateSlippageValue?: (value: string) => void;
  loader?: boolean;
  fromInput?: any;
  allLoader?: boolean;
};

const SelectToken: FC<TSelectTokenTypes> = (props) => {
  const {
    selectToken,
    setSelectToken,
    setSelectedToken,
    type,
    tokens,
    setSelectedExchangeToken,
  } = props;
  const [search, setSearch] = useState<TSearchType>({
    val: "",
    list: [],
    isNewToken: false,
  });

  const {
    state: { tokensList, safeAddress },
  } = useContext(GlobalContext);

  const location = useLocation();
  const isFullscreen = new URLSearchParams(location?.search).get("fullscreen");
  console.log(tokensList, "tokenlist");
  console.log(safeAddress, "safe");

  const handleTokenSelection = (token: TSelectedTokenType) => {
    if (setSelectedToken) {
      setSelectedToken(token);
    } else if (setSelectedExchangeToken) {
      setSelectedExchangeToken(token);
    }
    setSelectToken(false);

    setTimeout(() => {
      setSearch(() => ({
        val: "",
        list: [],
      }));
    }, 100);
  };

  const handleCloseDialog = () => {
    setSelectToken(false);
    setTimeout(() => {
      setSearch(() => ({
        val: "",
        list: [],
      }));
    }, 100);
  };

  return (
    <>
      <Transition.Root show={selectToken} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={handleCloseDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/[0.6] transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={`pointer-events-none fixed inset-x-0 bottom-0 flex max-w-full top-6 ${
                  isFullscreen === "true" ? "justify-center" : ""
                } justify-center`}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300 "
                  enterFrom="translate-y-full"
                  enterTo="translate-y-0"
                  leave="transform transition ease-in-out duration-300 "
                  leaveFrom="translate-y-0"
                  leaveTo="translate-y-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-105 top-0 bg-black rounded-t-2xl z-20 dark:bg-neutralDark-50">
                    <div className="flex items-center px-4 relative mt-2 mb-5 border-b border-neutral-50 dark:border-neutralDark-300">
                      <div>
                        <img
                          role="presentation"
                          src={getImage("close_grey.svg")}
                          alt="logo"
                          className="cursor-pointer absolute right-4 bottom-[10px]"
                          onClick={handleCloseDialog}
                        />
                      </div>
                      <p className="text-white py-2.5">Select Token</p>
                    </div>
                    <div className="flex justify-between relative pb-2 mx-4 items-center border-b border-neutral-50 dark:border-neutralDark-300">
                      <p className="text-xs uppercase text-text-300">
                        {"TOKEN"}
                      </p>
                      <p className="text-xs uppercase text-text-300">
                        {"BALANCE"}
                      </p>
                    </div>
                    <div className="overflow-auto hide-scrollbar">
                      {tokensList.map((_token) => (
                        <div
                          className="flex justify-between items-center p-4 cursor-pointer"
                          onClick={() => {
                            handleTokenSelection(_token);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={_token.logo_url}
                              alt="logo"
                              className="w-10 h-10 rounded-full"
                            />
                            <p>{_token.contract_ticker_symbol}</p>
                          </div>
                          <div className="flex justify-center items-center">
                          <p className="text-white text-[16px] leading-5">
                              {getTokenValueFormatted(
                                getTokenFormattedNumber(
                                  `${_token.balance}`,
                                  _token.contract_decimals
                                )
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SelectToken;