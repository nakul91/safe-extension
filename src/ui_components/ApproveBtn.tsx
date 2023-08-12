import { FC } from "react";
import { getImage } from "../utils";

const ApproveButton: FC = () => {
  return (
    <>
      <div className="flex items-center justify-center">
        <img
          role="presentation"
          src={getImage("approved_white_tick.svg")}
          alt="approve transaction"
          className="mr-1 w-4"
        />
        <p>Approve</p>
      </div>
    </>
  );
};

export default ApproveButton;
