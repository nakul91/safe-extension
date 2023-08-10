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
        image: getImage( "front_logo.svg"),
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
            {/* {chainConfig.showBech32Address() ? (
                <div className="flex pt-2.5">
                    <IconButton
                        type="button"
                        className={`${
                            addressId === 0
                                ? "btn-primary border border-primary-700 hover:border-primary-900"
                                : " text-gray-500 bg-white border border-gray-300"
                        } text-sm py-2 px-1.5 rounded-l-full w-12`}
                        onClick={() => {
                            if (addressId === 1) {
                                handleUpdateAddress(addressType);
                                setAddressId(0);
                            }
                        }}
                    >
                        {walletAddress.startsWith("0x")
                            ? HEX_ADDR
                            : capitalizeFirstLetter(chainConfig.getChainHrp())}
                    </IconButton>
                    <IconButton
                        type="button"
                        className={`${
                            addressId === 1
                                ? "btn-primary border border-primary-700 hover:border-primary-900"
                                : " text-gray-500 bg-white border border-gray-300"
                        } text-sm py-2 px-1.5 rounded-r-full w-12`}
                        onClick={() => {
                            if (addressId === 0) {
                                handleUpdateAddress(addressType);
                                setAddressId(1);
                            }
                        }}
                    >
                        {walletAddress.startsWith("0x")
                            ? capitalizeFirstLetter(chainConfig.getChainHrp())
                            : HEX_ADDR}
                    </IconButton>
                </div>
            ) : null} */}
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
