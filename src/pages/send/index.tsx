import { useNavigate } from "react-router-dom";
import { BaseGoerli } from "../../constants/chains/baseGoerli";
import InputField from "./InputField";
import { ChangeEvent, useState } from "react";

export default function Send() {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  };
  const [inputText, setInputText] = useState("");

  const navigate = useNavigate();
  return (
    <>
      <div
        style={{ backgroundColor: "blue" }}
        className={`flex justify-between items-center px-4 py-2 fixed top-0 w-105 z-10`}
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
        className={`flex px-4 justify-center items-center border-b border-neutral-50 fixed w-105 bg-white top-13 z-10 dark:bg-neutralDark-50 dark:border-neutralDark-300`}
      >
        <img
          role="presentation"
          src={BaseGoerli.logo}
          alt="back"
          className="absolute left-3 top-2/4 -translate-y-1/2 cursor-pointer"
          onClick={() => {
            navigate("/home");
          }}
        />
        <p className="text-black">SEND</p>
      </div>
      <div className="flex justify-between items-baseline">
        <div className="pr-4">
          <InputField
            name="amount"
            type="number"
            value={0}
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
          <p className="text-text-300 text-sm">{"actions.useText"}:</p>
        </div>
      </div>
    </>
  );
}