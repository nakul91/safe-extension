import { getImage } from "../../../utils";

export default function AccessGranted() {
  return (
    <div className="relative h-150 flex flex-col items-center">
      <div className="mt-28 flex">
        <img
          className="bg-green-600 rounded-full p-5"
          width={114}
          height={114}
          src={getImage("approved_white_tick.svg")}
          alt=""
        />
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-xxl text-text-900 dark:text-textDark-900 font-light leading-12">Access Granted</h2>
        <p className="font-normal text-base leading-5 opacity-40 mt-2">
          app/aave.com has been provided access to your ethereum funds
        </p>
      </div>
    </div>
  );
}
