import { FC } from "react";

import { getImage } from "../utils";
import { TNoStateProps } from "./types";

const NoState: FC<TNoStateProps> = (props) => {
    const {
        image,
        title,
        className,
        titleClassName,
        btnTitle,
        onClick,
        btnClassName,
        paragraph,
        paragraphClassName,
    } = props;
    return (
        <div className="flex flex-col justify-center items-center">
            <img
                src={getImage(`${image}`)}
                alt="no_state"
                className={`h-40 w-35 my-14 object-contain ${className ? className : ""}`}
            />
            <p
                className={`text-center ${
                    titleClassName
                        ? titleClassName
                        : "sub-title text-text-500 dark:text-textDark-700 w-2/3"
                }`}
            >
                {title}
            </p>
            {paragraph && (
                <span className={`text-center paragraph2 ${paragraphClassName}`}>
                    {paragraph}
                </span>
            )}

            {btnTitle && (
                <button onClick={onClick} className={btnClassName} type="button">
                    {btnTitle}
                </button>
            )}
        </div>
    );
};

export default NoState;
