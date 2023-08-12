import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { EXCHANGE_TYPE } from "../../../constants";
import { getImage } from "../../../utils";
import { TRANSACTION_TYPE } from "../../../utils/wallet/types";
import { THeaderTypes } from "../types";

const ActionHeader: FC<THeaderTypes> = (props) => {
    const {
        type,
        className,
        titleClassName,
        title,
        onClick,
        logo,
        exchangeProviderType,
        handleOpenProvider,
        disableProvider,
        showProviderSwitch,
        showSwitchIcon,
        tooltipMessage,
        fromBuy,
    } = props;
    const navigate = useNavigate();
    return (
        <div
            className={` ${
                className ? className : ""
            } flex px-4 justify-center items-center border-b fixed w-105 z-10 bg-neutralDark-50 border-neutralDark-300`}
        >
            <img
                role="presentation"
                src={getImage("arrow_back.svg")}
                alt="back"
                className="absolute left-3 top-2/4 -translate-y-1/2 cursor-pointer"
                onClick={onClick ? onClick : () => navigate(-1)}
            />
            <p
                className={` ${
                    titleClassName ? titleClassName : ""
                } sub-title py-4 text-textDark-900`}
            >
                {title}
            </p>
            {logo && (
                <span
                    role="presentation"
                    className={`absolute right-3 top-2/4 -translate-y-1/2 flex items-center cursor-pointer ${
                        showProviderSwitch
                            ? "border border-solid border-neutral-50 dark:border-neutralDark-300 rounded-full p-0.5"
                            : ""
                    } ${disableProvider ? "opacity-50" : ""} `}
                    onClick={() => {
                        if (showProviderSwitch && !disableProvider && showSwitchIcon) {
                            handleOpenProvider?.();
                        }
                    }}
                >
                </span>
            )}
        </div>
    );
};

export default ActionHeader;
