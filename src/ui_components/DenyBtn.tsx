import { FC } from "react";
import { getImage } from "../utils";

const DenyButton: FC = () => {
  return (
    <>
      <div className="flex items-center justify-center">
        <img role="presentation" src={getImage("deny.svg")} alt="approve transaction" className="mr-1 w-4" />
        <p>Deny</p>
      </div>
    </>
  );
};

export default DenyButton;
