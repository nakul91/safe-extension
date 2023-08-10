import { getAllChains } from "../../store/GlobalStore";
import alertMessage from "./alertMessage";

const switchChainAlert = (chainId: string) => {
    const { CHAIN_LIST } = getAllChains();
    const chain = Object.values(CHAIN_LIST).find((item) => item.chainId === chainId);

    alertMessage({
        timeout: 3000,
        content: `<img style="width: 20px; margin-right: 8px;" />Switched to <span class="rabby-strong" style="margin: 0 8px;">${chain?.name}</span> for the current Dapp`,
    });
};

export default switchChainAlert;
