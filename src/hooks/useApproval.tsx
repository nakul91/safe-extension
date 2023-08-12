import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useWallet } from "../context/WalletContext";

type TApprovalComponents = typeof import("../pages/approvals/container");
type TApprovalComponent = TApprovalComponents[keyof TApprovalComponents];

export type TExtractFromPromise<T> = T extends Promise<infer U> ? U : T;
export interface IApproval {
    id: number;
    taskId: number | null;
    data: {
        params?: any;
        origin?: string;
        approvalComponent: keyof TApprovalComponents;
        requestDefer?: Promise<any>;
        approvalType?: string;
        chainId?: string;
    };
    winProps: any;
    resolve?(params?: any): void;
    reject?(err: any): void;
}

export const useApproval = () => {
    const wallet = useWallet();
    const navigate = useNavigate();

    const getApproval: () => Promise<IApproval> = wallet.getApproval;

    const resolveApproval = async (data?: any, stay = false, forceReject = false) => {
        const approval = await getApproval();

        if (approval) {
            wallet.resolveApproval(data, forceReject);
        }
        if (stay) {
            return;
        }
        setTimeout(() => {
            navigate("/");
        });
    };

    const rejectApproval = async (
        err: any,
        stay = false,
        isInternal = false,
        code?: number,
    ) => {
        const approval = await getApproval();
        if (approval) {
            await wallet.rejectApproval(err, stay, isInternal, code);
        }
        if (!stay) {
            navigate("/");
        }
    };

    useEffect(() => {
        window.addEventListener("beforeunload", rejectApproval);
        return () => window.removeEventListener("beforeunload", rejectApproval);
    }, []);

    return [getApproval, resolveApproval, rejectApproval] as const;
};
