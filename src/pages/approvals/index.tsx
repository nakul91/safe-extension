import { useEffect, useState } from "react";

import { TExtractFromPromise, useApproval } from "../../hooks/useApproval";
import * as ApprovalComponent from "./container/index";

const Approval = () => {
    const [getApproval] = useApproval();
    type TApproval = Exclude<TExtractFromPromise<ReturnType<typeof getApproval>>, void>;
    const [approval, setApproval] = useState<TApproval | null>(null);

    const init = async () => {
        const approval = await getApproval();
        setApproval(approval);
        if (approval?.data?.origin || approval?.data?.params?.session?.origin) {
            document.title =
                approval?.data?.origin || approval?.data?.params?.session?.origin;
        }
    };

    useEffect(() => {
        init();
    }, []);

    if (!approval) return <></>;
    const { data } = approval;
    const { approvalComponent, params, origin, requestDefer, chainId } = data;

    const CurrentApprovalComponent = ApprovalComponent[approvalComponent] as any;

    return (
        <CurrentApprovalComponent
            params={params}
            origin={origin}
            requestDefer={requestDefer}
            chainId={chainId ?? ""}
        />
    );
};

export default Approval;
