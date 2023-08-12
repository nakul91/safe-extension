import { useSearchParams } from "react-router-dom";
import { getImage } from "../../../utils";
import { FC } from "react";

export interface ILogin {
  handleClick: () => void;
  from: string;
  loading?: boolean;
  showButton?: boolean;
}

export const Login: FC<ILogin> = (props) => {
  const { handleClick, showButton, loading, from } = props;

  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get("fullscreen");
  return (
    <div
      className={`relative overflow-y-scroll hide-scrollbar extensionWidth ${
        isFullscreen ? "h-screen" : "h-150 "
      }`}
    >
      <div className="h-full flex flex-col justify-center items-center">
        <div>
          <p className="heading1 leading-[58px] text-[#3F4145]">Welcome to</p>
          <div className="flex items-center">
            <img src={getImage("safe_logo.svg")}></img>
          </div>
          <p className="font-normal text-[32px] leading-10 text-white">
            The wallet for <br /> everyone{" "}
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2">
            <div className="flex gap-2 justify-center items-center">
              <p className="inline text-[12px] text-white">Powered by: </p>
              <img src={getImage("safe.svg")} alt="" />
              <p className="inline text-[12px] text-white">|</p>
              <img src={getImage("covalent_white.svg")} alt="" className="" />
            </div>
            <div className="flex gap-2 justify-center items-center mt-2">
              <p className="text-[12px] text-white">Built on:</p>
              <img src={getImage("base_logo.svg")} alt="" />
              <p className="text-[12px] font-medium text-white">Base Görli</p>
            </div>
          </div>
          <div
            className={`bg-black absolute left-0 right-0 bottom-16 h-12 dark:bg-neutralDark-50`}
          >
            {showButton ? (
              <p className="absolute left-0 right-0 bottom-4 font-normal text-[24px] leading-10 text-teal-500">
                Continue by clicking extension icon
              </p>
            ) : (
              <button
                className="absolute left-0 right-0 bottom-4 btn-primary mx-4 text-base bg-gradient-to-br from-teal-500 via-teal-600 to-teal-300 first-letter first-letter 
            py-4 px-5  text-black leading-4 tracking-tight font-medium rounded-xl focus:outline-none disabled:opacity-50"
                type="submit"
                onClick={() => {
                  handleClick();
                }}
              >
                {from === "web"
                  ? loading
                    ? "Signing in..."
                    : "Sign In"
                  : "Sign In"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};