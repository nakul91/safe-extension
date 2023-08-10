import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { BaseGoerli } from "../../../constants/chains/baseGoerli";
import InputField from "../InputField";
import { getImage } from "../../../utils";

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

  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  const navigate = useNavigate();

  const clearInputs = () => {
    handleAddressInput("toAddress", "");
    setContactInput({
      username: "",
      address: "",
    });
  };

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

  return (
    <>
      <div
        style={{ backgroundColor: "blue" }}
        className={`flex justify-between items-center px-4 py-2 w-105 z-10`}
      >
        <div>
          <p className="text-black text-xs">{"demo wallet"}</p>
          <p className="text-black text-xs">{"wallet address"}</p>
        </div>
        <div className="flex items-center">
          <img className="w-5 h-5 rounded-full" src={BaseGoerli.logo} alt=" " />
          <span className="pl-1 text-white text-sm">{"base"}</span>
        </div>
      </div>
      <div
        className={`relative flex px-4 justify-center items-center border-b border-neutral-50  w-105 bg-white t dark:bg-neutralDark-50 dark:border-neutralDark-300 h-[80px]`}
      >
        <img
          role="presentation"
          src={getImage("arrow_back.svg")}
          //   src={""}
          alt="back"
          className="absolute left-3 top-2/4 -translate-y-1/2 cursor-pointer w-8 h-8"
          onClick={() => {
            navigate("/home");
          }}
        />
        <p className="text-black">SEND</p>
      </div>

      <div
        role="presentation"
        className="flex items-center justify-between bg-grey-500 py-6 px-4 cursor-pointer dark:bg-neutralDark-300"
        onClick={() => {}}
      >
        <div className="flex items-center">
          <img className="w-6 h-6 rounded-full" src={""} alt={""} />
          <p>ETH</p>
        </div>

        <div className="flex items-center ">
          <span className="pr-4 text-base dark:text-textDark-900">
            {"Bal"}:<span className="ml-1">0.1111</span>
          </span>
        </div>
      </div>
      <form
        onSubmit={() => {}}
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
            <div>
              <p className="text-text-300 text-sm">{""}:</p>
            </div>
          </div>
        </div>

        <div className="relative border-b border-b-neutral-50 dark:border-neutralDark-300">
          <img
            src={getImage("divider_icon.svg")}
            className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-6 h-6"
            alt="icon"
          />
        </div>

        <div>
          <div
            className={`flex justify-between items-end mb-8 py-4 relative bg-white px-2`}
          >
            <div className="px-2 w-full relative">
              <InputField
                placeholder={"wallet address"}
                label={
                  <>
                    <div className="flex gap-2">
                      <p className="label2 text-text-500 dark:text-textDark-500">
                        Send to wallet
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
            className={`bg-white left-0 right-0 bottom-0 h-20 dark:bg-neutralDark-50`}
          >
            <button
              className="absolute left-0 right-0 bottom-4 btn-primary mx-4 text-base "
              type="submit"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </>
  );
}