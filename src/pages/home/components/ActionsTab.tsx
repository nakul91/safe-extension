import { FC } from "react";
import { TActionsTab } from "../types";

const ActionsTab: FC<TActionsTab> = (props) => {
  return (
    <>
      <div className={`flex items-center mx-[22px] justify-between`}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Send</button>
      </div>
    </>
  );
};
export default ActionsTab;
