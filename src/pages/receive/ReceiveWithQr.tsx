import QRCodeStyling, { Options } from "qr-code-styling";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { HEX_ADDR } from "../../constants";
import IconButton from "../../ui_components/IconButton";
import {  capitalizeFirstLetter,
    getImage,
    handleCopy,
    shortenAddress } from "../../utils";
import { TReceiveWithQRTypes } from "../home/types";
const ReceiveWithQr: FC<TReceiveWithQRTypes> = ({ walletAddress}) => {
  

    const [options] = useState<Options>({
        width: 240,
        height: 240,
        type: "svg",
        image: getImage( "safe_base.png"),
        margin: 5,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "Q",
        },
        dotsOptions: {
            type: "extra-rounded",
            color: "",
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.5,
            margin: 15,
            crossOrigin: "anonymous",
        },
        backgroundOptions: {
            color:  "",
        },
    });
    const ref = useRef<HTMLDivElement | null>(null);
    const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
    const [addressType, setAddressType] = useState(walletAddress);
    const [addressId, setAddressId] = useState(0);
    const handleUpdateAddress = (address: string) => {
        if (address.startsWith("0x")) {
            let hexAddress = address.toLowerCase();
            setAddressType(hexAddress);
        } else {
            let bechAddress = address.toLowerCase();
            setAddressType(bechAddress);
        }
    };

    useEffect(() => {
        if (!qrCode) return;
        qrCode.update({ data: addressType });
    }, [addressType, qrCode, options]);

    useEffect(() => {
        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, [qrCode, ref]);

    return (
        <div className="flex flex-col justify-center items-center pt-[109px] px-4">
            <p className="label2 text-text-500 pt-2">
                {"Scan to receive"}
            </p>
            <div ref={ref} />
            <div className="px-1 text-center">
                <span className="py-2 label2 text-text-500 break-all">{addressType}</span>
            </div>
            <p className="label2 text-text-500 py-2">
                {"Copy Address"}
            </p>
            <div className="flex p-2 w-48 mx-9 rounded border border-dashed border-gray-300">
                <span className="grow self-center text-center dark:text-textDark-900">
                    {shortenAddress(addressType)}
                </span>
                <img
                    role="presentation"
                    src={getImage("copy_dark.svg")}
                    alt=" "
                    className="cursor-pointer"
                    onClick={() => handleCopy(addressType)}
                />
            </div>
        </div>
    );
};

export default ReceiveWithQr;
