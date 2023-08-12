import { FC } from "react";
import { TActionsTab } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "../../../ui_components/IconButton";
import { getImage } from "../../../utils";

const ActionsTab: FC<TActionsTab> = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`flex items-center mx-[22px] justify-center gap-0 mb-3`}>
        <div
          className={`bg-[#29D79F] px-4 py-2 rounded-l-full border border-black flex gap-2 items-center justify-center border-r-0 cursor-pointer`}
          onClick={() => navigate("/send")}
        >
          <img src={getImage("arrow_up.svg")} alt="arrow up" />
          <p className="text-black">Send</p>
        </div>
        <div
          className={`bg-[#29D79F] px-4 py-2 rounded-r-full border border-black flex gap-2 items-center justify-center cursor-pointer`}
          onClick={() => navigate("/receive")}
        >
          <img src={getImage("arrow_down.svg")} alt="arrow down" />
          <p className="text-black">Recieve</p>
        </div>
      </div>
    </>
  );
};
export default ActionsTab;
