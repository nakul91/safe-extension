import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState, useContext } from "react";
import { BaseGoerli } from "../../../constants/chains/baseGoerli";
import InputField from "../InputField";
import AccountAbstraction from "@safe-global/account-abstraction-kit-poc";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import {
    MetaTransactionData,
    MetaTransactionOptions,
    OperationType,
} from "@safe-global/safe-core-sdk-types";
import {
    getImage,
    getTokenFormattedNumber,
    getTokenValueFormatted,
    shortenAddress,
  } from "../../../utils";
  import SelectToken, {
    TSelectedTokenType,
  } from "../../home/components/SelectToken";
  import { GlobalContext } from "../../../context/GlobalContext";
import { ethers } from "ethers";
import { getRelayTransactionStatus } from "../../home/apiServices";

export default function Send() {
  const [inputText, setInputText] = useState("");
  const [sendFormData, setSendFormData] = useState({
    amount: "",
    toAddress: "",
    memo: "",
  });
  const [contactInputs, setContactInput] = useState({
    username: "",
    address: "",
  });
  const {
    state: { tokensList },
  } = useContext(GlobalContext);

  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  const [selectToken, setSelectToken] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TSelectedTokenType>(
    tokensList[0]
  );

  const navigate = useNavigate();

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
        //setTransactionLoading(true);
        try {
                const relayPack = new GelatoRelayPack(
                    "qbec0fcMKxOAXM0qyxL6cDMX_aaJUmSPPAJUIEg17kU_",
                );

                const fromEthProvider = new ethers.providers.Web3Provider(provider);
                const fromSigner = await fromEthProvider.getSigner();
                const safeAccountAbstraction = new AccountAbstraction(fromSigner);
                await safeAccountAbstraction.init({ relayPack });

                const safeTransactionData: MetaTransactionData = {
                    to: "0x74d3352e3fd9220615f205d9ba26a026287d5521",
                    data: "0x",
                    value: "0001",
                    operation: OperationType.Call,
                };

                const options: MetaTransactionOptions = {
                    gasLimit: "100000",
                    isSponsored: true,
                };

                const gelatoTaskId = await safeAccountAbstraction.relayTransaction(
                    [safeTransactionData],
                    options,
                );

                console.log("gelatoTaskId ", gelatoTaskId);
                console.log(
                    "gelato Task Link ",
                    "https://relay.gelato.digital/tasks/status/",
                    gelatoTaskId,
                );
                if (gelatoTaskId) {
                    handleTransactionStatus(gelatoTaskId);
                }
        } catch (e: any) {
            //setTransactionLoading(false);
           // const err = serializeError(e);
           // toast.error(err.message);
            console.log(e, "e");
        }
};

const handleTransactionStatus = (hash: string) => {
    const intervalInMilliseconds = 2000;
    const interval = setInterval(() => {
            getRelayTransactionStatus(hash)
                .then((res: any) => {
                    if (res) {
                        console.log(res, "res");
                        const task = res.data.task;
                        if (task) {
                            if (task.taskState === "ExecSuccess") {
                               // router.push(link);
                                if (interval !== null) {
                                    clearInterval(interval);
                                }
                            }
                        } else {
                           // setTransactionLoading(false);
                           // toast.error("Failed to Load Chest. Try Again");
                            if (interval !== null) {
                                clearInterval(interval);
                            }
                        }
                    }
                })
                .catch((e) => {
                    //setTransactionLoading(false);
                   // toast.error(e.message);
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
        style={{ backgroundColor: "blue" }}
        className={`flex justify-between items-center px-4 py-2 w-105 z-10`}
      >
            <div>
          <p className="text-black text-xs">{"Your Wallet"}</p>
          <p className="text-black text-xs">{shortenAddress(safeAddress)}</p>
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
          <img
            className="w-6 h-6 rounded-full"
            src={selectedToken?.logo_url}
            alt={""}
          />
          <p className="text-white text-[20px] leading-5">
            {selectedToken?.contract_ticker_symbol}
          </p>
        </div>

        <div className="flex items-center ">
          <span className="pr-4 text-base dark:text-textDark-900">
          {"Bal"}:
          <span className="ml-1 text-white text-[20px] leading-5">
              {getTokenValueFormatted(
                getTokenFormattedNumber(
                  `${selectedToken?.balance}`,
                  Number(selectedToken?.contract_decimals)
                )
              )}
            </span>
          </span>
        </div>
      </div>
      <form
        onSubmit={() => {SendRelay()}}
        className={`
         "px-4"
         py-4`}
      >
        <div className="mb-11">
          <div className="flex justify-between items-baseline">
            <div className="px-2">
              <InputField
                name="amount"
                type="number"
                value={sendFormData.amount}
                placeholder="0.00"
                min="0"
                step="any"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleInputChange(e);
                  setInputText(e.target.value);
                }}
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
        <div
            className={`flex justify-between items-end mb-8 py-4 relative px-2`}
          >
            <div className="px-2 w-full relative">
              <InputField
                placeholder={"wallet address"}
                label={
                  <>
                    <div className="flex gap-2">
                    <p className="label2 text-white dark:text-textDark-500">
                        to wallet
                      </p>
                    </div>
                  </>
                }
                name="toAddress"
                value={sendFormData.toAddress}
                onChange={handleInputChange}
                noMargin={true}
                className={`pt-2 pb-2 pr-[80px] ${
                  sendFormData.toAddress ? "pr-[36px]" : "pr-[80px]"
                }`}
              />
            </div>
          </div>
        </div>
        {!showInsufficientBalance && (
          <div
            className={`left-0 right-0 bottom-0 h-20 dark:bg-neutralDark-50`}
          >
            <button
              className="absolute left-0 right-0 bottom-4 btn-primary mx-4 text-base bg-gradient-to-br from-teal-500 via-teal-600 to-teal-300"
              type="submit"
            >
              Submit
            </button>
          </div>
        )}
      </form>
      <SelectToken
        selectToken={selectToken}
        setSelectToken={setSelectToken}
        setSelectedToken={setSelectedToken}
      />
    </>
  );
}