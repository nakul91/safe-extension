import { Children, FC } from "react";

import { TIconButtonProps } from "./types/index";

const IconButton: FC<TIconButtonProps> = (props) => {
    const { title, className, onClick, leftIcon, rightIcon, type, disabled, children } =
        props;
    return (
        <button type={type} className={className} onClick={onClick} disabled={disabled}>
            {leftIcon ? leftIcon : null}
            {title || children}
            {rightIcon ? rightIcon : null}
        </button>
    );
};

export default IconButton;
