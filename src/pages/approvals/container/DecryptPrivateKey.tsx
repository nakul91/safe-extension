import { useLayoutEffect, useState } from "react";

import { useWallet } from "../../../context/WalletContext";
import { useApproval } from "../../../hooks/useApproval";
import { getImage, handleCopy, toastFlashMessage } from "../../../utils";
import { ApprovalsGroupButtons, ApprovalsHeader } from "../components";

export default function DecryptPrivateKey({ params }: any) {
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
  const [revealDecryptCode, setRevealDecryptCode] = useState(false);

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

      <div className="grow relative">
        <div className="p-4">
          <h1 className="heading2 leading-6 text-lg mb-3">
            This website requires you to decrypt the following text in order to complete the operation
          </h1>
        </div>
        <div className="bg-neutral-50 dark:bg-neutralDark-50 mx-4 p-3 max-h-64 min-h-[256px] rounded-lg overflow-y-auto hide-scrollbar relative">
          {!revealDecryptCode ? (
            <div className="absolute left-0 top-0 w-full h-[256px] bg-black/80">
              <button
                onClick={() => {
                  setRevealDecryptCode(true);
                }}
                className="btn-secondary border-1 border-primary-700 py-2.5 px-3 text-base absolute left-2/4 top-2/4 -translate-x-1/2 -translate-y-1/2"
                type={"button"}
              >
                Reveal decrypt message
              </button>
            </div>
          ) : (
            <p className={`label3 break-all text-text-500 dark:text-textDark-700 text-sm`}>
              {params?.decryptedCode}
              <img
                role={"presentation"}
                src={getImage("copy_primary.svg")}
                alt=" "
                className="absolute right-3 bottom-3 cursor-pointer"
                onClick={() => handleCopy(params?.decryptedCode)}
              />
            </p>
          )}
        </div>
      </div>

      <div className="px-6 pt-8 pb-4">
        <div className="mt-20">
          <ApprovalsGroupButtons
            leftBtnName={"Deny"}
            rightBtnName={"Confirm"}
            rightOnClick={handleSuccess}
            leftOnClick={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
