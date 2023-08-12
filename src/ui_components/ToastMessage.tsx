import { AnimatePresence, motion } from "framer-motion";
import { FC, SyntheticEvent, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { ACTIONS, GlobalContext } from "../context/GlobalContext";
import { getImage } from "../utils";

const ToastMessage: FC = () => {
  const location = useLocation();
  const isFullscreen = new URLSearchParams(location?.search).get("fullscreen");
  const { state, dispatch } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const { toastLists } = state;

  useEffect(() => {
    if (toastLists.length) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [toastLists.length]);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch({
      type: ACTIONS.HIDE_TOAST,
      payload: {},
    });
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && toastLists.length ? (
        <motion.div
          key="toastMessage"
          initial={
            location.pathname.includes("/welcome")
              ? {
                  y: 50,
                  opacity: 0,
                }
              : {
                  y: -50,
                  opacity: 0,
                }
          }
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              type: "tween",
            },
          }}
          exit={
            location.pathname.includes("/welcome")
              ? {
                  y: 50,
                  opacity: 0,
                }
              : {
                  y: -50,
                  opacity: 0,
                }
          }
          className={`absolute top-0 z-[100] w-105 flex justify-between max-h-12 px-4 py-3 items-center 
                    ${
                      toastLists[0]?.toastType === "error"
                        ? "bg-red-500"
                        : "bg-green-500"
                    } ${isFullscreen === "true" ? "m-auto" : ""} ${
            location.pathname.includes("/welcome")
              ? "right-3.5 bottom-5 top-auto"
              : ""
          }`}
        >
          <p className="label2 text-white leading-5">
            {toastLists[0]?.message && toastLists[0]?.message}
          </p>
          <img
            width={18}
            height={18}
            className="cursor-pointer"
            src={getImage("close_icon.svg")}
            role={"presentation"}
            onClick={() => handleClose()}
            alt=" "
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ToastMessage;