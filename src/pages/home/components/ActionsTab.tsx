import { FC } from "react";
import { TActionsTab } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "../../../ui_components/IconButton";
import { getImage } from "../../../utils";

const ActionsTab: FC<TActionsTab> = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`flex items-center mx-[22px] justify-between`}>

                       <IconButton
                            type="button"
                            className={`flex flex-col items-center label3 outline-0 dark:text-textDark-700 text-text-500`}
                            leftIcon={
                                <img
                                    src={getImage(`action_send.svg`)}
                                    alt={"divider_icon"}
                                    className="w-10 mb-2"
                                />
                            }
                            onClick={() => navigate("/send")}
                        >
                          Send
                        </IconButton>
                        <IconButton
                            type="button"
                            className={`flex flex-col items-center label3 outline-0 dark:text-textDark-700 text-text-500`}
                            leftIcon={
                                <img
                                    src={getImage(`action_recieve.svg`)}
                                    alt={"divider_icon"}
                                    className="w-10 mb-2"
                                />
                            }
                            onClick={() => navigate("/receive")}
                        >
                          Receive
                        </IconButton>
      </div>
    </>
  );
};
export default ActionsTab;
