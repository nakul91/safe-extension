import { FC, useContext, useEffect, useState } from "react";

import { ZERO_USD } from "../../../constants";
import { GlobalContext } from "../../../context/GlobalContext";
import { getCurrencyFormattedNumber, shortenAddress, truncateText } from "../../../utils";
import { IPortfolioCardTypes } from "../types";

const PortfolioCard: FC<IPortfolioCardTypes> = (props) => {
  const {
    name,
    address,
    setOpenCardSetting,
    handleOpenNetworkSwitch,
    totalBalance,
    formData,
    typeOf,
    tokenLoading,
    showFullAddress,
    handleOpenWalletEditSheet,
    setOpen,
  } = props;

  const {
    state: { safeAddress },
  } = useContext(GlobalContext);

  return (
    <div
      role={"presentation"}
      className={`rounded-xl z-10 relative flex flex-col`}
      onClick={() => (typeOf === "SwitchWallet" ? setOpen?.(false) : null)}
    >
      <div className="flex items-start justify-between pl-4 pr-2 pt-4">
        <div>
          <p className={`sub-title text-grey-500/90 pb-2`}>{name}</p>
        </div>
      </div>
      {typeOf === "SwitchWallet" ? null : (
        <div
          className="absolute bottom-0 h-[100px] cursor-pointer w-full"
          role={"presentation"}
          onClick={() => {
            setOpen?.(true);
          }}
        ></div>
      )}

      <div>
        <p className={`heading1 text-grey-500 pl-4 pb-4}`}>
          {tokenLoading ? (
            <span className="animate-pulse w-24 h-6 rounded bg-neutral-50/30 inline-block"></span>
          ) : totalBalance ? (
            getCurrencyFormattedNumber(totalBalance as unknown as number, totalBalance < 1 ? 4 : 2)
          ) : (
            ZERO_USD
          )}
        </p>
      </div>
    </div>
  );
};

export default PortfolioCard;

const TypingEffect = ({ color }: { color: string }) => {
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fullText = "You are now using the test network.";

    const typeText = () => {
      if (currentIndex === fullText.length) {
        clearInterval(intervalId);
        setTimeout(() => {
          setText("");
          setCurrentIndex(0);
          intervalId = setInterval(typeText, 50);
        }, 5000);
        return;
      }

      const nextCharacter = fullText.charAt(currentIndex);
      setText((prevText) => prevText + nextCharacter);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    let intervalId = setInterval(typeText, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentIndex]);

  return (
    <p style={{ color }}>
      {text}
      <span>▋</span>
    </p>
  );
};
