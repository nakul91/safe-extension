import { FC, useContext } from "react";
import { useSearchParams } from "react-router-dom";

import { GlobalContext } from "../../../context/GlobalContext";
import ActionHeader from "../../home/components/ActionHeader";
import ConnectionHeader from "../../home/components/ConnectionHeader";
import ReceiveWithQr from "../ReceiveWithQr";

const ReceiveContainer: FC = () => {
    const [searchParams] = useSearchParams();
    const isFullscreen = searchParams.get("fullscreen");
    const {
        state: { safeAddress },
      } = useContext(GlobalContext);
    return (
        <>
            <div
                className={`relative overflow-y-scroll hide-scrollbar extensionWidth ${
                    isFullscreen ? "h-screen" : "h-150"
                }`}
            >
                {/* <ConnectionHeader
                    headerColor={""}
                    walletName={"Base"}
                    walletAddress={"0x74d3352e3fd9220615f205d9ba26a026287d5521"}
                    connectionIcon={""}
                    connectionName={""}
                /> */}
                <ActionHeader title={"Receive"} />
                <ReceiveWithQr
                    walletAddress={safeAddress}
                />
            </div>
        </>
    );
};

export default ReceiveContainer;
