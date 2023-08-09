import { TW, WalletCore } from "@trustwallet/wallet-core";

import { EthereumProvider } from "./scripts/page_provider";
declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window {
        WalletCore: WalletCore;
        TW: typeof TW;
        ethereum: EthereumProvider;
        web3: any;
    }
}

declare module "*.json" {
    const value: any;
    export default value;
}
