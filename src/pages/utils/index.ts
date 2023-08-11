import { Web3AuthModalPack } from "@safe-global/auth-kit";
import { ethers } from "ethers";
import { EthersAdapter, SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";

export const getSafes = async (web3AuthModalPack: Web3AuthModalPack) => {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(web3AuthModalPack.getProvider());
  const signer = provider.getSigner();
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer || provider,
  });
  const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter });
  console.log("adderess",await signer.getAddress());
  const safeAccountConfig: SafeAccountConfig = {
    owners: [await signer.getAddress()],
    threshold: 1,
  };
  const safeSdkOwnerPredicted = await safeFactory.predictSafeAddress(safeAccountConfig);
  return safeSdkOwnerPredicted;
};
