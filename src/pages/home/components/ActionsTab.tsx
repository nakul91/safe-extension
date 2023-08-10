import { FC } from "react";
import { TActionsTab } from "../types";
import { useLocation, useNavigate } from "react-router-dom";

const ActionsTab: FC<TActionsTab> = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`flex items-center mx-[22px] justify-between`}>
      <button
          onClick={() => navigate("/send")}
          className="bg-blue hover:bg-blue/50 text-black font-bold py-2 px-4 rounded-full"
        >
          Send
        </button>
      </div>
    </>
  );
};
export default ActionsTab;
