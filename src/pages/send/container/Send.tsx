import { useNavigate, useSearchParams } from "react-router-dom";
import { ChangeEvent, useState, useContext } from "react";
import { BaseGoerli, web3AuthConfig, web3AuthOptions, modalConfig } from "../../../constants/chains/baseGoerli";
import InputField from "../InputField";
import AccountAbstraction from "@safe-global/account-abstraction-kit-poc";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import ReactTyped from "react-typed";
import { MetaTransactionData, MetaTransactionOptions, OperationType } from "@safe-global/safe-core-sdk-types";
import { getImage, getTokenFormattedNumber, getTokenValueFormatted, shortenAddress } from "../../../utils";
import SelectToken, { TSelectedTokenType } from "../../home/components/SelectToken";
import { GlobalContext } from "../../../context/GlobalContext";
import { ethers } from "ethers";
import { getRelayTransactionStatus } from "../../home/apiServices";
import { parseEther } from "ethers/lib/utils";
import { useWallet } from "../../../hooks";
import { Web3AuthModalPack } from "@safe-global/auth-kit";

export default function Send() {
  const [inputText, setInputText] = useState("");
  const wallet = useWallet();
  const [sendFormData, setSendFormData] = useState({
    amount: "",
    toAddress: "",
    memo: "",
  });
  const [contactInputs, setContactInput] = useState({
    username: "",
    address: "",
  });
  const [explorerUrl, setExplorerUrl] = useState("");
  const {
    state: { tokensList },
  } = useContext(GlobalContext);

  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  const [selectToken, setSelectToken] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TSelectedTokenType>(tokensList[0]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [isSucceed, setIsSucceed] = useState(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get("fullscreen");
  const [loadingText, setLoadingText] = useState("");

  const clearInputs = () => {
    handleAddressInput("toAddress", "");
    setContactInput({
      username: "",
      address: "",
    });
  };

  const {
    state: { safeAddress, provider },
    dispatch,
  } = useContext(GlobalContext);

  const handleAddressInput = (key: string, value: string) => {
    setSendFormData((inputValues) => ({
      ...inputValues,
      [key]: value,
    }));
    if (sendFormData?.toAddress) {
      setSendFormData((inputValues) => ({
        ...inputValues,
        [key]: value,
      }));
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setSendFormData((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const SendRelay = async () => {
    setTransactionLoading(true);
    setLoadingText("Transaction processing...");
    const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
    await web3AuthModalPack.init({
      options: web3AuthOptions,
      adapters: undefined,
      modalConfig,
    });
    try {
      const safeProvider = new ethers.providers.Web3Provider(web3AuthModalPack.getProvider()!);
      const prvKey = await safeProvider?.send("private_key", []);
      const ethersProvider = new ethers.providers.JsonRpcProvider(BaseGoerli.info.rpc);
      const relayPack = new GelatoRelayPack("qbec0fcMKxOAXM0qyxL6cDMX_aaJUmSPPAJUIEg17kU_");
      const fromEthProvider = new ethers.providers.JsonRpcProvider(BaseGoerli.info.rpc);
      const fromSigner = new ethers.Wallet(prvKey, ethersProvider);
      const safeAccountAbstraction = new AccountAbstraction(fromSigner);
      await safeAccountAbstraction.init({ relayPack });
      const safeTransactionData: MetaTransactionData = {
        to: sendFormData.toAddress,
        data: "0x",
        value: parseEther(sendFormData.amount).toString(),
        operation: OperationType.Call,
      };
      const options: MetaTransactionOptions = {
        gasLimit: "100000",
        isSponsored: true,
      };
      //Relay the transaction using Account Abstraction
      const gelatoTaskId = await safeAccountAbstraction.relayTransaction([safeTransactionData], options);
      if (gelatoTaskId) {
        setLoadingText("Transaction Submitted");
        handleTransactionStatus(gelatoTaskId);
      }
    } catch (e: any) {
      setLoadingText("Transaction Failed");
      console.log(e, "e");
    }
  };

  const handleTransactionStatus = (hash: string) => {
    setLoadingText("Verifying Transaction Status...");
    const intervalInMilliseconds = 2000;
    const interval = setInterval(() => {
      getRelayTransactionStatus(hash)
        .then((res: any) => {
          if (res) {
            console.log(res, "res");
            const task = res.data.task;
            if (task) {
              if (task.taskState === "ExecSuccess") {
                setExplorerUrl(`https://goerli.basescan.org/tx/${task.transactionHash}`);
                setLoadingText("Success! Transaction Processed");
                setIsSucceed(true);
                if (interval !== null) {
                  clearInterval(interval);
                }
              }
            } else {
              setIsSucceed(false);
              setLoadingText("Transaction Failed");
              if (interval !== null) {
                clearInterval(interval);
              }
            }
          }
        })
        .catch((e) => {
          setIsSucceed(false);
          console.log(e, "e");
          if (interval !== null) {
            clearInterval(interval);
          }
        });
    }, intervalInMilliseconds);
  };

  return (
    <>
      <div
        className={`relative overflow-y-scroll hide-scrollbar extensionWidth overflow-x-hidden ${
          isFullscreen ? "h-screen" : "h-150"
        }`}
      >
        {transactionLoading ? (
          <div>
            <div className="mt-[110px] text-center">
              {isSucceed ? (
                <img width={114} height={114} className="mx-auto" src={getImage("green_circle_check.svg")} alt="" />
              ) : (
                <div className="flex items-center justify-center">
                  <div className="spinnerLoader"></div>
                </div>
              )}
              {isSucceed ? (
                <p className="text-white text-[24px] mt-10">{loadingText}</p>
              ) : (
                <ReactTyped
                  className="text-white text-[24px] mt-10"
                  strings={[loadingText]}
                  typeSpeed={30}
                  loop={isSucceed ? false : true}
                />
              )}
              {/* <p className="heading1 text-white mt-5">{loadingText}</p> */}
              <p className="text-text-300 label2 mx-12 mt-2">{""}</p>
              <div className="absolute w-full mx-auto px-4 bottom-4">
                {explorerUrl && (
                  <>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`${isFullscreen === "true" ? "/home?fullscreen=true" : "/home"}`);
                      }}
                    >
                      <p className="text-text-300 label2 text-[16px] mx-12 my-2">{"<- Go Back"}</p>
                    </div>
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={`${explorerUrl}`}
                      className="label1 text-white mb-9 flex justify-center items-center cursor-pointer"
                    >
                      {"View in Base Scan"}
                      <span className="ml-2">
                        <img width={16} height={16} src={getImage("open_outside.svg")} alt="" />
                      </span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{ backgroundColor: "black" }}
              className={`flex justify-between items-center px-4 py-2 w-105 z-10`}
            >
              <div>
                <p className="text-white text-xs">{"Your Wallet"}</p>
                <p className="text-white text-xs">{shortenAddress(safeAddress)}</p>
              </div>
              <div className="flex items-center">
                <img className="w-5 h-5 rounded-full" src={BaseGoerli.logo} alt=" " />
                <span className="pl-1 text-white text-sm">{"base"}</span>
              </div>
            </div>
            <div
              className={`relative bg-[#252629] flex px-4 justify-center items-center border-b border-neutral-700  w-105 t h-[60px]`}
            >
              <img
                role="presentation"
                src={getImage("arrow_back.svg")}
                //   src={""}
                alt="back"
                className="absolute left-3 top-2/4 -translate-y-1/2 cursor-pointer w-8 h-8"
                onClick={() => {
                  navigate("/");
                }}
              />
              <p className="text-white text-[20px] leading-5">SEND</p>
            </div>

            <div
              role="presentation"
              className="flex items-center justify-between py-6 px-4 cursor-pointer dark:bg-neutralDark-300"
              onClick={() => {
                setSelectToken(true);
              }}
            >
              <div className="flex items-center gap-3">
                <img className="w-6 h-6 rounded-full" src={selectedToken?.logo_url} alt={""} />
                <p className="text-white text-[20px] leading-5">{selectedToken?.contract_ticker_symbol}</p>
              </div>

              <div className="flex items-center ">
                <span className="pr-4 text-base dark:text-textDark-900">
                  {"Bal"}:
                  <span className="ml-1 text-white text-[20px] leading-5">
                    {getTokenValueFormatted(
                      getTokenFormattedNumber(`${selectedToken?.balance}`, Number(selectedToken?.contract_decimals))
                    )}
                  </span>
                </span>
              </div>
            </div>
            <div className="mb-11">
              <div className="flex justify-between items-baseline">
                <div className="px-2">
                  <InputField
                    name="amount"
                    type="decimals"
                    value={sendFormData.amount}
                    placeholder="0.00"
                    min="0"
                    step="any"
                    onChange={handleInputChange}
                    className="text-xxl"
                    noMargin={true}
                  />
                </div>
              </div>
            </div>

            <div className="relative border-b border-b-neutral-700 dark:border-neutralDark-300">
              <img
                src={getImage("divider_icon.svg")}
                className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-9 h-9 z-[1]"
                alt="icon"
              />
            </div>

            <div>
              <div className={`flex justify-between items-end mb-8 py-4 relative px-2`}>
                <div className="px-2 w-full relative">
                  <InputField
                    placeholder={"wallet address"}
                    label={
                      <>
                        <div className="flex gap-2">
                          <p className="label2 text-white dark:text-textDark-500">To</p>
                        </div>
                      </>
                    }
                    name="toAddress"
                    value={sendFormData.toAddress}
                    onChange={handleInputChange}
                    noMargin={true}
                    className={`pt-2 pb-2 pr-[80px] ${sendFormData.toAddress ? "pr-[36px]" : "pr-[80px]"}`}
                  />
                </div>
              </div>
            </div>
            {!showInsufficientBalance && (
              <div
                className={`bg-black left-0 right-0 bottom-0 h-20 
               ${isFullscreen ? "absolute" : "sticky"} ${
                  sendFormData.amount && sendFormData.toAddress ? "opacity-100" : "opacity-50"
                }`}
              >
                <button
                  className="absolute left-0 right-0 bottom-4 btn-primary mx-4 text-base bg-gradient-to-br from-teal-500 via-teal-600 to-teal-300"
                  // type="submit"
                  onClick={() => {
                    SendRelay();
                  }}
                  disabled={sendFormData.amount && sendFormData.toAddress ? false : true}
                >
                  Submit
                </button>
              </div>
            )}
            <SelectToken
              selectToken={selectToken}
              setSelectToken={setSelectToken}
              setSelectedToken={setSelectedToken}
            />
          </div>
        )}
      </div>
    </>
  );
}
