import { Fragment } from "react";
import { ETHEREUM_REQUESTS } from "../../../scripts/constants";
import { capitalizeFirstLetter, getImage, shortenAddress } from "../../../utils";

type TSignMessageType =
  | ETHEREUM_REQUESTS.signTypedData
  | ETHEREUM_REQUESTS.signTypedDataV1
  | ETHEREUM_REQUESTS.signTypedDataV3
  | ETHEREUM_REQUESTS.signTypedDataV4;

type TSignMessageRequest = {
  messageType: TSignMessageType;
  data: any;
  isSiweRequest?: boolean;
};

type TSignTypedMessage = {
  data: any;
  messageType: TSignMessageType;
  containerStyle?: string;
};

type TRenderNodeValue = {
  value: unknown;
  primaryType?: string;
  isValidAddress: (address: string) => boolean;
};

export default function SignMessageRequest(props: TSignMessageRequest) {
  const { data, messageType, isSiweRequest } = props;

  if (isSiweRequest) {
    return <SiweSignRequest data={data} />;
  }

  return <SignTypedMessage data={data} messageType={messageType} />;
}

function SignTypedMessage(props: TSignTypedMessage) {
  const { data, messageType, containerStyle } = props;
  const { primaryType, ...messageData } = data;
  const isValidAddress = (address: string) => {
    return /^(0x)?[0-9a-fA-F]{40}$/.test(address);
  };
  if (
    messageType === ETHEREUM_REQUESTS.signTypedData ||
    (messageType === ETHEREUM_REQUESTS.signTypedDataV4 && primaryType === "Permit")
  ) {
    return (
      <Fragment>
        {Object.entries(messageData).map(([key, value]: [any, any], i) => {
          return (
            <div
              key={`${key}-${i}`}
              className={`leading-5 border-b border-neutral-50 dark:border-neutralDark-300 p-4 ${
                typeof value !== "object" ? "flex flex-col" : ""
              } ${containerStyle ? containerStyle : ""}
                    `}
            >
              <RenderNodeKey label={key} className="label2 font-medium text-text-500 dark:text-textDark-700 mb-2" />

              {isValidAddress(value) ? (
                <p className="label1 leading-6 font-medium text-primary-700 dark:text-primaryDark-700">
                  {shortenAddress(value)}
                </p>
              ) : (
                <p className="label1 leading-6 font-medium">{value}</p>
              )}
            </div>
          );
        })}
      </Fragment>
    );
  }

  return (
    <>
      <div className={`${containerStyle ? containerStyle : "p-4"}`}>
        {primaryType ? (
          <p className="label2 font-medium leading-[14px] text-text-500 dark:text-textDark-700 mb-3">{primaryType}</p>
        ) : null}
        {Object.entries(messageData).map(([key, value]: [any, any], i) => {
          return (
            <div
              key={`${key}-${i}`}
              className={`leading-5 ${typeof value !== "object" ? "flex items-baseline" : ""} ${
                containerStyle ? containerStyle : ""
              }
                    `}
            >
              <RenderNodeKey
                label={key}
                className="label2 font-medium text-text-500 dark:text-textDark-700 mb-3 inline-block"
              />

              {typeof value === "object" ? (
                <SignTypedMessage data={value} messageType={messageType} containerStyle="ml-2" />
              ) : (
                <RenderNodeValue value={value} primaryType={primaryType} isValidAddress={isValidAddress} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

const RenderNodeKey = (props: { label: string; className: string }) => {
  return <p className={props.className}>{capitalizeFirstLetter(props.label)}:</p>;
};

const RenderNodeValue = (props: TRenderNodeValue) => {
  const { value, primaryType, isValidAddress } = props;
  return (
    <p className="inline-flex mb-3 max-w-[260px] label2 font-medium leading-[14px]">
      {typeof value === "string" && value.startsWith("0x") && isValidAddress(value) ? (
        <p className="flex items-center ml-2 text-primary-700">
          <span className="mr-1">{shortenAddress(value)} </span>

          <img
            src={getImage("info_icon_bordered.svg")}
            alt="info_icon"
            className="cursor-pointer w-[12.8px] h-[12.8px]"
          />
        </p>
      ) : (
        <p className="ml-2">{value as string}</p>
      )}
    </p>
  );
};

function SiweSignRequest(props: any) {
  const { data } = props;
  return (
    <Fragment>
      {Object.entries(data).map(([key, value]: [any, any]) => {
        return (
          <div className="flex flex-col mb-2 last:mb-0 border-b border-neutral-50 dark:border-neutralDark-300 p-4">
            {key !== "siweResources" ? (
              <p className="label2 text-text-300 dark:text-textDark-700 mb-2">{capitalizeFirstLetter(key)}: </p>
            ) : null}
            <p className="label1 leading-6 max-w-[270px]">{value}</p>
          </div>
        );
      })}
    </Fragment>
  );
}
