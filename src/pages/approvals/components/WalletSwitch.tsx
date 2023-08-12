import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useContext } from "react";

import { IWalletController, TOKEN_LENGTH } from "../../../constants";
import { useSearch } from "../../../hooks";
import { getImage, shortenAddress, toastFlashMessage, truncateText } from "../../../utils";

export type TSwitchNetworkTypes = {
  setOpenSwitchWallet: (value: boolean) => void;
  openSwitchWallet: boolean;
  // style: any;
  handleUpdateWallet: (wallet: IWalletController) => void;
  isFullscreen: string | null;
  wallets: IWalletController[];
};

const WalletSwitch: FC<TSwitchNetworkTypes> = ({
  openSwitchWallet,
  setOpenSwitchWallet,
  handleUpdateWallet,
  isFullscreen,
  wallets,
}) => {
  const { search, setSearch, searchResult, isEmpty, isNotFound } = useSearch(wallets, "name");

  const handleCloseWalletSwitch = () => {
    setOpenSwitchWallet?.(false);
  };

  const handleCopy = (addressId: string) => {
    navigator.clipboard.writeText(addressId);
  };

  return (
    <>
      <Transition.Root show={openSwitchWallet} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={() => handleCloseWalletSwitch()}>
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
                className={`pointer-events-none fixed inset-x-0 bottom-0 flex max-w-full ${
                  isFullscreen === "true" ? "justify-center h-full" : ""
                } justify-center h-full`}
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
                  <Dialog.Panel className="pointer-events-auto w-full">
                    <div className="flex h-full flex-col bg-white shadow-xl rounded-t-2xl dark:bg-neutralDark-50">
                      <div className="flex items-center px-4 relative mt-2 mb-5 border-b border-neutral-50 dark:border-neutralDark-300">
                        <img
                          role={"presentation"}
                          src={getImage("close_grey.svg")}
                          alt="logo"
                          className="cursor-pointer absolute right-4"
                          onClick={() => handleCloseWalletSwitch()}
                        />
                        <p className="sub-title py-2.5">Choose wallet</p>
                      </div>
                      <div className="flex relative mb-4 mx-4 items-center">
                        <input
                          className="p-2 pr-9 w-full rounded placeholder:text-sm border border-neutral-50  dark:border-neutralDark-300 placeholder-neutral-300 focus:outline-none focus:border-primary-300 dark:focus:border-primaryDark-300 dark:bg-neutralDark-50 dark:text-textDark-900"
                          placeholder={"search wallet"}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <img
                          role={"presentation"}
                          src={getImage("search_icon.svg")}
                          alt="search"
                          className="cursor-pointer absolute top-2 right-2"
                        />
                      </div>
                      <div className={`overflow-auto ${isFullscreen === "true" ? "" : "h-120"} pb-16 hide-scrollbar`}>
                        <ul className="mb-4 mx-4">
                          {searchResult?.map((_wallet) => (
                            <li
                              className="mb-3 cursor-pointer"
                              key={_wallet.id}
                              onClick={() => handleUpdateWallet(_wallet)}
                              role="presentation"
                              onKeyPress={() => handleUpdateWallet(_wallet)}
                            >
                              <div
                                className={`pb-15 ${
                                  wallets?.length === 1 ? "singlePortfolioCard" : ""
                                } rounded-xl z-10 relative flex flex-col gap-15`}
                                style={{
                                  background: _wallet.color,
                                }}
                              >
                                <div className="flex items-start justify-between pl-4 pr-2 pt-4">
                                  <div>
                                    <p className="sub-title text-grey-500/90 pb-2">
                                      {truncateText(_wallet.name, TOKEN_LENGTH.LONG)}
                                    </p>
                                    <p className="label3 text-neutral-50/40 flex gap-2">
                                      <span>{shortenAddress(_wallet?.selectedChain.address)}</span>
                                      <img
                                        role={"presentation"}
                                        src={getImage("copy_grey.svg")}
                                        alt=" "
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleCopy(_wallet?.selectedChain.address);
                                        }}
                                      />
                                    </p>
                                  </div>
                                </div>

                                {/* <div>
                                                                    <p className="heading1 text-grey-500 pl-4 pb-4">
                                                                        {_wallet?.balance
                                                                            ? getCurrencyFormattedNumber(
                                                                                  _wallet?.balance as unknown as number,
                                                                                  2,
                                                                              )
                                                                            : ZERO_USD}
                                                                    </p>
                                                                </div> */}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
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

export default WalletSwitch;
