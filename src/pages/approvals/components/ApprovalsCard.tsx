import { FC } from "react";

import { TApprovalsCardTypes } from "../types";

const ApprovalsCard: FC<TApprovalsCardTypes> = ({ children, className }) => {
    return (
        <div
            className={`bg-white dark:bg-black border-background-100 dark:border-neutralDark-300 border shadow-sm rounded-xl `}
        >
            <div className={`${className ? className : null}`}>{children}</div>
        </div>
    );
};

export default ApprovalsCard;
