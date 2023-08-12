import { useLayoutEffect, useState } from "react";

import { useWallet } from "../../../context/WalletContext";
import { useApproval } from "../../../hooks/useApproval";
import { ApprovalsGroupButtons, ApprovalsHeader } from "../components";

export default function AccessPublicKey({ params }: any) {
  const [, resolveApproval, rejectApproval] = useApproval();
  const wallet = useWallet();
  const closeComponent = () => wallet.closeWindow.apply(null);
  const [walletDetail, setWalletDetail] = useState({
    address: "",
    walletName: "",
    chainName: "",
    walletColor: "#000",
    chainLogo: "",
    chain: "",
    chainId: "",
  });

  const initialFetch = async () => {
    const extensionWalletData = await wallet.getSelectedWallet();
    if (extensionWalletData) {
      const { name: walletName, color: walletColor } = extensionWalletData;
      const { address, name: chainName, logo: chainLogo, chain, chainId } = extensionWalletData.selectedChain;
      setWalletDetail({
        chainId,
        address,
        walletName,
        chainName,
        walletColor,
        chainLogo,
        chain,
      });
    }
  };

  useLayoutEffect(() => {
    initialFetch();
  }, []);

  const handleSuccess = async () => {
    await resolveApproval(true, true).then(() => {
      closeComponent();
    });
  };
  const handleCancel = () => {
    rejectApproval("User rejected the request", true).then(() => {
      closeComponent();
    });
  };

  return (
    <div className="relative flex flex-col h-screen">
      <ApprovalsHeader {...walletDetail} />

      <div className="grow relative mt-4">
        <div className="bg-neutral-50 dark:bg-black mx-4 p-3 rounded-lg flex items-center justify-center gap-3 mb-2">
          <img src={params.icon} alt={params.name} />
          <p className="text-text-900 dark:text-textDark-900">{params.origin}</p>
        </div>
        <div className="p-4">
          <h1 className="heading2 leading-6 text-lg mb-3">This Dapp would like your public encryption key.</h1>
          <h2 className="paragraph2 leading-5 text-sm text-text-500 dark:text-textDark-700">
            By consenting, this Dapp will be able to compose encrypted messages to you.
          </h2>
        </div>
      </div>

      <div className="px-6 pt-8 pb-4">
        <div className="mt-20">
          <ApprovalsGroupButtons
            leftBtnName={"Cancel"}
            rightBtnName={"Confirm"}
            rightOnClick={handleSuccess}
            leftOnClick={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
