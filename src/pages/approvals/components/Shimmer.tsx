import { FC } from "react";

type TShimmerTypes = {
  type: string;
};

const Shimmer: FC<TShimmerTypes> = (props) => {
  const { type } = props;
  return (
    <>
      {type === "SwapInputShimmer" && (
        <>
          {[...Array(1).keys()].map((item, key) => {
            return (
              <div key={key} className={`animate-pulse px-4 flex justify-between items-start py-6`}>
                <div className="pr-4 w-60 relative">
                  <div className="h-8 w-40 rounded bg-neutral-50 dark:bg-neutralDark-300 mb-2"></div>
                  <div className="h-6 w-20 rounded bg-neutral-50 dark:bg-neutralDark-300 mb-2.5"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 cursor-pointer mb-3">
                    <div className="h-6 w-6 rounded-full bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="h-8 w-20 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  </div>
                  <div className="h-6 w-30 text-right rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                </div>
              </div>
            );
          })}
        </>
      )}
      {type === "selectToken" && (
        <>
          {[...Array(6).keys()].map((item, key) => {
            return (
              <div key={key} className="animate-pulse flex justify-between items-center px-4 py-2 mb-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-neutral-50 dark:bg-neutralDark-300"></div>
                  <div>
                    <div className="h-6 w-30 text-right rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="h-5 w-20 text-right rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                </div>
              </div>
            );
          })}
        </>
      )}
      {type === "SwapFractionShimmer" && (
        <>
          {[...Array(1).keys()].map((item, key) => {
            return (
              <div className="flex items-center gap-2 animate-pulse" key={key}>
                <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
              </div>
            );
          })}
        </>
      )}
      {type === "NetworkFeeSelectShimmer" && (
        <>
          {[...Array(1).keys()].map((item, key) => {
            return (
              <div className="flex items-center gap-2 animate-pulse" key={key}>
                <div className="h-6 w-12 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                <div className="h-6 w-12 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                <div className="h-6 w-12 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                <div className="h-6 w-12 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
              </div>
            );
          })}
        </>
      )}
      {type === "SendInputShimmer" && <div className="w-25 h-6 animate-pulse bg-gray-300" />}
      {type === "BridgeToChainShimmer" && <div className="w-25 h-6 animate-pulse bg-gray-300" />}
      {type === "WalletBalance" && (
        <div className="ml-auto leading-4 tracking-tight flex w-25 h-4 animate-pulse bg-gray-300" />
      )}
      {type === "SendInputFractionShimmer" && (
        <>
          {[...Array(1).keys()].map((item, key) => {
            return (
              <div key={key} className={` animate-pulse  py-6 flex justify-between items-start`}>
                <div className="pr-4 w-60 relative">
                  <div className="h-8 w-40 rounded bg-neutral-50 dark:bg-neutralDark-300 mb-2"></div>
                  <div className="h-6 w-20 rounded bg-neutral-50 dark:bg-neutralDark-300 mb-2.5"></div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 cursor-pointer mb-3">
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="h-6 w-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
      {type === "ExchangeBalance" && (
        <>
          <div className="flex w-full">
            {[...Array(1).keys()].map((key) => {
              return (
                <div key={key} className="animate-pulse">
                  <div className="w-36 h-8 rounded bg-neutral-50 dark:bg-neutralDark-300 mt-2"></div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {type === "BridgeTokenList" && (
        <>
          {[...Array(8).keys()].map((item, key) => {
            return (
              <div key={key} className="animate-pulse flex justify-between items-center px-4 py-2 my-4 ">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-neutral-50 dark:bg-neutralDark-300" />
                  <div className="h-5 w-[250px] rounded bg-neutral-50 dark:bg-neutralDark-300" />
                </div>
                <div className="flex justify-center items-center">
                  <div className="h-5 w-[60px] rounded bg-neutral-50 dark:bg-neutralDark-300" />
                </div>
              </div>
            );
          })}
        </>
      )}
      {type === "BridgeNetworkList" && (
        <>
          {[...Array(8).keys()].map((item, key) => {
            return (
              <div key={key} className="animate-pulse flex justify-between items-center px-4 py-2 my-4 ">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-neutral-50 dark:bg-neutralDark-300" />
                  <div className="h-5 w-[250px] rounded bg-neutral-50 dark:bg-neutralDark-300" />
                </div>
              </div>
            );
          })}
        </>
      )}
      {type === "RouteProviders" && (
        <>
          {[...Array(3).keys()].map((item, key) => {
            return (
              <div
                key={key}
                className="animate-pulse flex justify-between mx-4 mb-2 pb-2 border-b border-neutral-50 dark:border-neutralDark-300"
              >
                <div className="flex items-start gap-2 pb-2">
                  <div className="h-10 w-10 rounded-full bg-neutral-50 dark:bg-neutralDark-300" />
                  <div>
                    <div className="w-25 h-5 rounded mb-2 bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="w-10 h-4 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  </div>
                </div>
                <div className="pb-2 flex flex-col items-end">
                  <div className="mb-2 w-30 h-5 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  <div className="w-30 h-4 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                </div>
              </div>
            );
          })}
        </>
      )}
      {type === "RouteProvidersAllLoader" && (
        <>
          {[...Array(1).keys()].map((item, key) => {
            return (
              <div
                key={key}
                className="animate-pulse flex justify-between mb-2 pb-2 border-b border-neutral-50 dark:border-neutralDark-300"
              >
                <div className="flex items-start gap-2 pb-2">
                  <div className="h-10 w-10 rounded-full bg-neutral-50 dark:bg-neutralDark-300" />
                  <div>
                    <div className="w-25 h-5 rounded mb-2 bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="w-10 h-4 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  </div>
                </div>
                <div className="pb-2 flex flex-col items-end">
                  <div className="mb-2 w-30 h-5 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  <div className="w-30 h-4 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                </div>
              </div>
            );
          })}
        </>
      )}
      {type === "SingleRouteProvider" && (
        <>
          {[...Array(1).keys()].map((item, key) => {
            return (
              <div
                key={key}
                className="animate-pulse flex justify-between mx-4 border-neutral-50 dark:border-neutralDark-300"
              >
                <div className="flex items-start gap-2 pb-2">
                  <div className="h-10 w-10 rounded-full bg-neutral-50 dark:bg-neutralDark-300" />
                  <div>
                    <div className="w-25 h-5 rounded mb-2 bg-neutral-50 dark:bg-neutralDark-300"></div>
                    <div className="w-10 h-4 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  </div>
                </div>
                <div className="pb-2 flex flex-col items-end">
                  <div className="mb-2 w-30 h-5 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                  <div className="w-30 h-4 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                </div>
              </div>
            );
          })}
        </>
      )}
      {type === "activeValidator" && (
        <>
          {[...Array(2).keys()].map((item, key) => {
            return (
              <div key={key} className="animate-pulse flex justify-between py-4 my-4 ">
                <div className="flex items-start gap-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutralDark-300" />
                  <div className="flex flex-col justify-between">
                    <div className="h-4 w-[200px] mt-1 rounded bg-neutral-50 dark:bg-neutralDark-300 mb-1.5" />
                    <div className="h-3.5 w-[60px] rounded bg-neutral-50 dark:bg-neutralDark-300" />
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="h-3.5 w-[60px] mt-1 rounded bg-neutral-50 dark:bg-neutralDark-300 mb-1" />
                  <div className="h-3.5 w-[60px] mt-1 rounded bg-neutral-50 dark:bg-neutralDark-300" />
                </div>
              </div>
            );
          })}
        </>
      )}
      {type === "spendLimit" && (
        <>
          <div className="animate-pulse flex justify-between py-4 px-4">
            <div className="h-5 w-[70px] rounded bg-neutral-50 dark:bg-neutralDark-300" />
            <div className="h-5 w-[105px] rounded bg-neutral-50 dark:bg-neutralDark-300" />
          </div>
        </>
      )}
      {type === "iconShimmer" && <div className="w-12 h-12 rounded-full bg-neutral-50 dark:bg-neutralDark-300" />}
      {type === "symbolShimmer" && (
        <div className="leading-4 tracking-tight mb-1 flex w-25 h-3.5 animate-pulse bg-gray-300" />
      )}
      {type === "dappAllowanceShimmer" && (
        <div className="leading-4 tracking-tight flex w-40 h-4 animate-pulse bg-gray-300" />
      )}
    </>
  );
};

export default Shimmer;
