import { Fragment, useLayoutEffect, useRef, useState } from "react";

import { useWallet } from "../../../context/WalletContext";
import { useApproval } from "../../../hooks/useApproval";
import { getImage, handleCopy } from "../../../utils";
import { ApprovalsGroupButtons, ApprovalsHeader, RequestedBy } from "../components";
import { ETHEREUM_REQUESTS } from "../../../scripts/constants";

export default function PrivateSign({ params }: any) {
  const [, resolveApproval, rejectApproval] = useApproval();
  const [riskApproved, setRiskApproved] = useState(false);
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
  const [isScrollable, setIsScrollable] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const bottomElRef = useRef<HTMLDivElement | null>(null);
  const stringifiedObjRegex = /^\{.*\}$/;

  const showCopy =
    params.method === ETHEREUM_REQUESTS.signTypedData ||
    params.method === ETHEREUM_REQUESTS.signTypedDataV1 ||
    params.method === ETHEREUM_REQUESTS.signTypedDataV3 ||
    params.method === ETHEREUM_REQUESTS.signTypedDataV4;

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

  const check = () => {
    const cur = ref.current;
    if (!cur) return;
    const x = cur.scrollHeight;
    const y = cur.clientHeight;
    if (x > y) {
      setIsScrollable(true);
    }
  };

  const onScroll = () => {
    if (ref.current?.scrollTop === 0) {
      setIsScrollable(true);
    } else {
      setIsScrollable(false);
    }
  };

  useLayoutEffect(() => {
    check();
  }, []);

  return (
    <div className="relative flex flex-col h-screen bg-white">
      <ApprovalsHeader {...walletDetail} />

      <div className="relative">
        <div className="px-4 py-4 pb-4">
          <h1 className="leading-12 mr-4 heading2 text-black">Sign Message Consent</h1>
        </div>

        <div className="mx-4">
          <div
            ref={ref}
            className="relative bg-white dark:bg-neutralDark-100 max-h-64 min-h-[256px] rounded-t-lg overflow-y-auto hide-scrollbar border border-solid border-neutral-50 dark:border dark:border-neutralDark-300"
            onScroll={onScroll}
          >
            {showCopy ? (
              <div className={`absolute right-2.5 top-2.5`} onClick={() => handleCopy(JSON.stringify(params))}>
                <img src={getImage(`copy_dark.svg`)} alt="copy" className="default-icon cursor-pointer" />
              </div>
            ) : null}

            {isScrollable ? (
              <div
                className={`absolute right-2.5 bottom-2.5 px-3 py-2.5 rounded-full border border-neutral-50 dark:border dark:border-neutralDark-300`}
                onClick={() => {
                  bottomElRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setIsScrollable(false);
                }}
              >
                <img
                  src={getImage("arrow_back.svg")}
                  alt="copy"
                  className="default-icon cursor-pointer transform -rotate-90 w-4 h-4"
                />
              </div>
            ) : null}
            <p className={`label2 break-all text-black dark:text-textDark-700 text-sm whitespace-pre-line`}>
              <div className="p-4">
              <p className="mb-2.5 text-black">Message:</p>
                <p className="text-black">{params.decodedMessage}</p>
              </div>
            </p>
          </div>
          <div className="rounded-b-lg px-4 py-2.5 border border-t-0 border-neutral-50 dark:border-neutralDark-300">
            <RequestedBy originLogo={params.icon} originName={params.origin} logoStyles="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full px-6 mb-2">
        <ApprovalsGroupButtons
          leftBtnName={"Deny"}
          rightBtnName={"Approve"}
          customCheckboxMargin="mb-3.5"
          rightOnClick={handleSuccess}
          leftOnClick={handleCancel}
          riskApproved={riskApproved}
          handleChange={() => setRiskApproved(!riskApproved)}
        />
      </div>
    </div>
  );
}
