import { TW } from "@trustwallet/wallet-core";

import { CHAINS_ENUMS } from "../../constants";

export enum TRANSACTION_TYPE {
    SEND = "SEND",
}

export type TTranx = {
    chainId: string;
    chainIdHex?: string;
    amount: number;
    amountHex?: string;
    amountValue?: number;
    gasLimit: number;
    gasLimitHex?: string;
    gasPrice: number;
    gasPriceValue?: number;
    gasPriceHex?: string;
    contractAddress: string;
    contractDecimals: number;
    nonce: number;
    nonceHex?: string;
    toAddress?: string;
    fromAddress: string;
    coinType: string;
    type: string;
    symbol?: string;
    blockchain?: string;
    isNative?: boolean;
    transactionType:
        | TRANSACTION_TYPE.SEND
    data?: string;
    denom?: string;
    blockHash?: string;
    value?: string;
    splTokenRegistered?: boolean;
    valueHex?: string;
    memo?: string;
    chainName?: string;
    accountNumber?: number;
    sequence?: number;
    dataList?: Array<string>;
    v?: "0x01"; // chain id
    r?: "0x00";
    s?: "0x00";
    path?: string;
    hardwareType?: string;
    algoGenesisHash?: string;
    algoGenesisId?: string;
    algoLastRound?: number;
    algoMinFee?: number;
    txBuff?: Buffer;
    simulateTx?: Boolean;
    nativeDenom?: string;
    authInfoBytes?: string;
    bodyBytes?: string;
    delegatorAddress?: string;
    validatorAddress?: string;
    validatorDstAddress?: string;
    validatorSrcAddress?: string;
    sourceChannel?: string;
    sourcePort?: string;
    timeoutHeight?: {
        revision_height: string;
        revision_number: string;
    };
};

export interface ISigningInput {
    /** SigningInput chainId */
    chainId?: Uint8Array | null;

    /** SigningInput nonce */
    nonce?: Uint8Array | null;

    /** SigningInput gasPrice */
    gasPrice?: Uint8Array | null;

    /** SigningInput gasLimit */
    gasLimit?: Uint8Array | null;

    /** SigningInput maxInclusionFeePerGas */
    maxInclusionFeePerGas?: Uint8Array | null;

    /** SigningInput maxFeePerGas */
    maxFeePerGas?: Uint8Array | null;

    /** SigningInput toAddress */
    toAddress?: string | null;

    /** SigningInput privateKey */
    privateKey?: Uint8Array | null;

    /** SigningInput transaction */
    transaction?: TW.Ethereum.Proto.ITransaction | null;
}

export type TKeyPairType = {
    blockchain: string;
    wallet: any;
};

export interface IConnectedSite {
    origin: string;
    icon: string;
    name: string;
    chain?: CHAINS_ENUMS;
    e?: number;
    isSigned: boolean;
    isTop: boolean;
    order?: number;
    isConnected: boolean;
}
