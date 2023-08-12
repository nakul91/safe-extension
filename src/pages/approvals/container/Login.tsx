import React, { useEffect } from "react";
import { useApproval } from "../../../hooks";
import { useWallet } from "../../../context/WalletContext";

export default function Login() {
    const [, resolveApproval, rejectApproval] = useApproval();
    const wallet = useWallet();
    const closeComponent = () => wallet.closeWindow.apply(null);

    const handleSuccess = async () => {
        await resolveApproval(true, true).then(() => {
            closeComponent();
        });
    };

    useEffect(() => {
        handleSuccess();
    }, []);

    return <></>;
}
