import { FC } from "react";
import { useSearchParams } from "react-router-dom";

type TShimmerTypes = {
    type: string;
};

const Shimmer: FC<TShimmerTypes> = (props) => {
    const { type } = props;
    const [searchParams] = useSearchParams();
    const isFullscreen = searchParams.get("fullscreen");
    return (
        <>
            {type === "tokenList" && (
                <>
                    {[...Array(6).keys()].map((item, key) => {
                        return (
                            <div
                                key={key}
                                className="animate-pulse flex justify-between pt-4 mx-4 mb-2 pb-2 border-b border-neutral-50 dark:border-neutralDark-300"
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
            {type === "nftListView" && (
                <>
                    {[...Array(3).keys()].map((key) => {
                        return (
                            <div
                                className=" p-6 border border-neutral-100 dark:border-neutralDark-300 rounded-xl mx-4 my-4 h-48 relative overflow-hidden cursor-pointer"
                                key={key}
                            >
                                <div className="pb-20 z-10 animate-pulse">
                                    <div className="w-3/4 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300 mb-4"></div>
                                    <div className="w-2/4 h-4 rounded bg-neutral-50 dark:bg-neutralDark-300 mb-16"></div>
                                    <div className="w-20 h-4 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
            {type === "activitiesList" && (
                <>
                    {[...Array(1).keys()].map((item, key) => {
                        return (
                            <div
                                key={key}
                                className="animate-pulse flex justify-between mx-4 my-2 pb-2 border-b border-neutral-50 dark:border-neutralDark-300"
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
            {type === "gridView" && (
                <>
                    <div className="flex w-full flex-wrap basis-6/12 items-center justify-evenly">
                        {[...Array(6).keys()].map((key) => {
                            return (
                                <div
                                    key={key}
                                    className="p-4 w-[44%] border border-neutral-100 dark:border-neutralDark-300 rounded-xl h-48 relative overflow-hidden mb-4"
                                >
                                    <div className="pb-20 z-10 animate-pulse">
                                        <div className="absolute bottom-6">
                                            <div className="w-40 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300 mb-3"></div>
                                            <div className="w-32 h-4 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {type === "lockScreenShimmer" && (
                <>
                    <div
                        className={`relative overflow-y-scroll hide-scrollbar extensionWidth animate-pulse ${
                            isFullscreen ? "h-screen" : "h-150"
                        }`}
                    >
                        <div className="flex items-center justify-between pt-2 pb-3 fixed w-[420px] z-10 bg-white px-4 py-6">
                            <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                            <div className="w-30 h-8 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                            <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                        </div>
                        <div className="relative mt-8">
                            <div className={`px-4 pt-9 portfolioCardWrapper`}>
                                <div className="flex flex-col relative portfolioCard">
                                    <div
                                        className={`singlePortfolioCard rounded-xl relative flex flex-col gap-15 bg-neutral-50 dark:bg-neutralDark-300 h-[200px] z-0`}
                                    >
                                        <div className="flex items-start justify-between pl-4 pr-2 pt-4">
                                            <div>
                                                <div className="sub-title text-grey-500/90 pb-2">
                                                    {" "}
                                                    <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                                                </div>
                                                <div className="label3 text-neutral-50/40 flex gap-2">
                                                    <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                                        </div>
                                    </div>
                                    <div
                                        className={` rounded-xl absolute w-[350px] left-2/4 -translate-x-2/4 -z-10 -bottom-[2px] bg-neutral-100 h-[200px]`}
                                    >
                                        <div className="flex items-start justify-between pl-4 pr-2 pt-4">
                                            <div>
                                                <div className="sub-title text-grey-500/90 pb-2">
                                                    {" "}
                                                    <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                                                </div>
                                                <div className="label3 text-neutral-50/40 flex gap-2">
                                                    <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                                        </div>
                                    </div>
                                    <div
                                        className={` rounded-xl absolute w-[330px] left-2/4 -translate-x-2/4 -z-20 -bottom-[20px] bg-neutral-300 h-[200px]`}
                                    >
                                        <div className="flex items-start justify-between pl-4 pr-2 pt-4">
                                            <div>
                                                <div className="sub-title text-grey-500/90 pb-2">
                                                    {" "}
                                                    <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                                                </div>
                                                <div className="label3 text-neutral-50/40 flex gap-2">
                                                    <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>{" "}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ul className="homeTab flex items-center justify-center px-6 top-16 bg-white z-10 w-full mt-10">
                                    <li
                                        role={"presentation"}
                                        className={`homeTabList w-1/3 flex justify-center py-3 label2 border-b-2 cursor-pointer `}
                                    >
                                        <div className="w-20 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                                    </li>
                                    <li
                                        role={"presentation"}
                                        className={`homeTabList w-1/3 flex justify-center py-3 label2 border-b-2 cursor-pointer `}
                                    >
                                        <div className="w-20 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                                    </li>
                                    <li
                                        role={"presentation"}
                                        className={`homeTabList w-1/3 flex justify-center py-3 label2 border-b-2 cursor-pointer `}
                                    >
                                        <div className="w-20 h-6 rounded bg-neutral-50 dark:bg-neutralDark-300"></div>
                                    </li>
                                </ul>
                                <div className="pb-16 pt-4">
                                    {[...Array(5).keys()].map((item, key) => {
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
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {type === "totalStakedAmount" && (
                <div className="h-[110px] flex flex-col justify-between items-start border border-solid border-neutral-50 dark:border-neutralDark-300 rounded-2xl px-3 py-4 bg-white dark:bg-neutralDark-50">
                    <div className="w-full flex justify-between">
                        <div className="leading-4 tracking-tight flex w-25 h-3.5 animate-pulse bg-gray-300 dark:bg-neutralDark-300 rounded mb-1.5" />
                        <div className="leading-4 tracking-tight flex w-25 h-3.5 animate-pulse bg-gray-300 dark:bg-neutralDark-300 rounded mb-1.5" />
                    </div>
                    <div className="mt-3 w-full flex justify-between">
                        <div className="leading-4 tracking-tight flex w-25 h-3.5 animate-pulse bg-gray-300 dark:bg-neutralDark-300 rounded mb-1.5" />
                        <div className="leading-4 tracking-tight flex w-25 h-3.5 animate-pulse bg-gray-300 dark:bg-neutralDark-300 rounded mb-1.5" />
                    </div>
                    <div className="mt-1.5 w-full flex justify-between">
                        <div className="leading-4 tracking-tight flex w-13 h-3.5 animate-pulse bg-gray-300 dark:bg-neutralDark-300 rounded" />
                        <div className="leading-4 tracking-tight flex w-13 h-3.5 animate-pulse bg-gray-300 dark:bg-neutralDark-300 rounded" />
                    </div>
                </div>
            )}
        </>
    );
};

export default Shimmer;
