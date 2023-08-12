import { FC } from "react";

import { useTimeout, useWallet } from "../../../hooks";
import { getImage, getWindowTimeout } from "../../../utils";
import { TDappConnectionApproved } from "../types";
const DappConnectionApproved: FC<TDappConnectionApproved> = ({ icon, name }) => {
  const wallet = useWallet();
  // To be removed when the queuing of request is in place
  const INT_DEFAULT_TIMEOUT = getWindowTimeout(icon);
  const closeComponent = () => wallet.closeWindow.apply(null);
  useTimeout(closeComponent, INT_DEFAULT_TIMEOUT);
  return (
    <div className="relative h-150 flex flex-col items-center">
      <div className="mt-32 flex">
        <img
          src={getImage("favicon.svg")}
          alt="frontier"
          width={72}
          height={72}
          className="mr-8 rounded-full object-cover"
        />

        <img src={getImage("linked.gif")} alt="frontier" width={72} height={36} className="mr-8 dark:hidden" />
        <img
          src={getImage("linked_dark.gif")}
          alt="frontier"
          width={72}
          height={36}
          className="mr-8 hidden dark:block"
        />
        <img
          onError={(e) => {
            e.currentTarget.src = `${getImage("default_token.svg")}`;
            e.currentTarget.onerror = null;
          }}
          src={icon}
          alt={name}
          width={72}
          height={72}
          className="rounded-full object-cover"
        />
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-xxl text-text-900 dark:text-textDark-900 font-light leading-12">Connected</h2>
        <p className="font-normal text-base text-text-900 dark:text-textDark-900 leading-5 opacity-40 mt-2">
          Your wallet is now connected with the site
        </p>
      </div>
    </div>
  );
};

export default DappConnectionApproved;
