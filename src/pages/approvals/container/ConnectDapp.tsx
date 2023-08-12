import { useLayoutEffect, useState } from "react";

import { CHAINS_IDS } from "../../../constants";
import { useWallet } from "../../../context/WalletContext";
import { useApproval } from "../../../hooks/useApproval";
import { getCurrencyFormattedNumber, getImage } from "../../../utils";
import { getWalletBalanceApi } from "../../home/apiServices";
import { ApprovalsGroupButtons, ApprovalsHeader, DappConnectionApproved, DappConnectionInfo } from "../components";
import { TConnectDapp } from "../types";

export default function ConnectDapp({ params, chainId }: TConnectDapp) {
  const [, resolveApproval, rejectApproval] = useApproval();
  const wallet = useWallet();
  const [connected, setConnected] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [riskApproved, setRiskApproved] = useState(true);
  const [scanLoader, setScanLoader] = useState(true);
  const [walletDetail, setWalletDetail] = useState({
    address: "",
    walletName: "",
    chainName: "",
    walletColor: "#000",
    chainLogo: "",
    chain: "",
    chainId: "",
  });
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletBalanceShimmer, setWalletBalanceShimmer] = useState(true);

  const initialFetch = async () => {
    const extensionWalletData = await wallet.getSelectedWallet();
    if (extensionWalletData) {
      const { name: walletName, color: walletColor } = extensionWalletData;
      if (chainId && extensionWalletData.selectedChain.chainId !== chainId) {
        const account = extensionWalletData.accounts.find(
          (acc: { chainId: string | undefined }) => acc.chainId === chainId
        );
        if (account) {
          setWalletDetail({
            chainId: account.chainId,
            address: account.address,
            walletName,
            chainName: account.name,
            walletColor,
            chainLogo: account.logo,
            chain: account.chain,
          });
          await setAllBalance(account.chain, account.address);
        }
      } else {
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
        await setAllBalance(chain, address);
      }
    }
  };

  const setAllBalance = async (chain: string, address: string) => {
    const balanceResponse = await getWalletBalanceApi(chain, address);
    getWalletBalanceApi("base-testnet", address).then((res: any) => {
      if (res.error) {
        //handle error here
        return;
      }
      const data = { ...res.data };
      let balance = 0;
      const tokens = data?.items;
      tokens.forEach((_token: { quote: number | string }) => {
        balance = balance + Number(_token.quote);
      });
      const walletTokens = [...tokens];
      setWalletBalance(balance);
      setWalletBalanceShimmer(false);
    });
  };

  useLayoutEffect(() => {
    initialFetch();
  }, []);

  const handleSuccess = async () => {
    await resolveApproval(
      {
        address: walletDetail.chain === CHAINS_IDS.SOLANA ? walletDetail.address : walletDetail.address.toLowerCase(),
      },
      true
    ).then(() => {
      setConnected(true);
    });
  };
  const handleCancel = () => {
    rejectApproval("User rejected the request", true).then(() => {
      wallet?.closeWindow();
    });
  };

  return connected ? (
    <DappConnectionApproved name={params.name} icon={params.icon} />
  ) : (
    <div className="relative flex flex-col h-screen bg-white">
      <ApprovalsHeader {...walletDetail} />
      <>
        <div className="grow relative">
          <div className={` absolute w-full h-[70%] -z-[1]`}></div>
          <div className={`px-4 py-4 pb-4  dark:bg-greyDark-500`}>
            <h1 className=" leading-12 mr-4 heading2">Connect your wallet to this site?</h1>
          </div>
          <div className="w-full px-4">
            <DappConnectionInfo
              chain={walletDetail.chain}
              name={params.name}
              icon={params.icon}
              origin={params.origin}
              walletBalance={String(getCurrencyFormattedNumber(walletBalance, 2))}
              walletBalanceShimmer={walletBalanceShimmer}
              walletName={walletDetail.walletName}
              initialFetch={initialFetch}
            />
          </div>
        </div>
        <div className="px-6 pt-8 pb-4">
          <div className="text-sm text-text-900 dark:text-textDark-900 font-normal leading-4.5 tracking-tight">
            <h3 className="opacity-40">This site will be able to:</h3>

            <p className="opacity-80 flex items-center mt-6">
              <img src={getImage("eye_open_primary.svg")} alt="eye open" className="w-8 h-8" />

              <span className="ml-2">View your wallet balance, address and activities</span>
            </p>

            <p className="opacity-80 flex items-center mt-4">
              <img src={getImage("checkmark_icon_primary.svg")} alt="checkmark" className="w-8 h-8" />
              <span className="ml-2">Request approval for transactions</span>
            </p>
          </div>

          <div className={` mt-20`}>
            <ApprovalsGroupButtons
              leftBtnName={"Deny"}
              rightBtnName={"Confirm"}
              rightOnClick={handleSuccess}
              leftOnClick={handleCancel}
              riskApproved={riskApproved}
              handleChange={() => setRiskApproved(!riskApproved)}
            />
          </div>
        </div>
      </>
    </div>
  );
}
