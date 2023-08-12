import { DEFAULT_TIMEOUT } from "../../../constants";
import { useTimeout, useWallet } from "../../../hooks";
import { getImage } from "../../../utils";

export default function ConfirmTransactionApproved() {
  const wallet = useWallet();
  const closeComponent = () => wallet.closeWindow.apply(null);
  useTimeout(closeComponent, DEFAULT_TIMEOUT);
  return (
    <div className="absolute -translate-y-1/2 top-1/2 flex flex-col justify-center items-center">
      {/* images */}
      <div className="flex justify-center mb-5">
        <img
          className="bg-green-600 rounded-full p-5"
          width={114}
          height={114}
          src={getImage("approved_white_tick.svg")}
          alt=""
        />
      </div>
      <div className="text-center px-4">
        <p className="heading1">Approved</p>
        <p className="text-base w-11/12 mt-2 m-auto text-text-300 font-normal">
          Your transaction is underway, we'll notify you when it's completed
        </p>
      </div>
    </div>
  );
}
