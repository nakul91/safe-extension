import React, {
    ChangeEvent,
    ClipboardEvent,
    FocusEventHandler,
    KeyboardEvent,
    ReactElement,
    ReactNode,
} from "react";
type TFormControl = /*unresolved*/ any;

export type TPrimaryBtnProps = {
    title?: React.ReactNode;
    className: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    type: "button" | "submit" | "reset" | undefined;
    children?: React.ReactNode;
    loader?: boolean;
};

export type TNoStateProps = {
    image: string;
    title: React.ReactNode | string;
    paragraph?: ReactNode;
    paragraphClassName?: string;
    className?: string;
    titleClassName?: string;
    btnTitle?: React.ReactNode | string;
    onClick?: () => void;
    btnClassName?: string;
};

export type TSecondaryBtnProps = {
    children: React.ReactNode;
    className: string;
    onClick?: () => void;
    disabled?: boolean;
    type: "button" | "submit" | "reset" | undefined;
};

export type TIconButtonProps = {
    children?: React.ReactNode;
    className: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    disabled?: boolean;
    title?: string;
    type: "button" | "submit" | "reset" | undefined;
};

export type TInputFieldProps = {
    type?: string;
    name?: string;
    label?: string | React.ReactElement;
    labelClassName?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
    placeholder?: string | undefined;
    id?: string;
    error?: boolean;
    value?: string | number;
    errorMsg?: string | React.ReactElement;
    isOptionalLabel?: boolean;
    noMargin?: boolean;
    min?: string;
    step?: string;
    autoComplete?: "on" | "off";
    maxLength?: number;
    onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void;
    autofocus?: boolean;
    disabled?: boolean;
};

export type TAvatarIconProps = {
    name: string;
};

export type TProgressProviderTypes = {
    valueStart?: number;
    valueEnd: number;
    children?: any;
    duration: number;
};
export type TCustomCircularProgressBarTypes = {
    progress?: number | undefined;
    delay?: number | undefined;
};

export type TConfirmationDialogProps = {
    openConfirmation: boolean;
    title: React.ReactNode | string;
    descOne?: React.ReactNode | string;
    descTwo?: React.ReactNode | string;
    txData?: { address?: string; chain?: string };
    isTxDialog?: boolean;
    cancelBtnTitle: React.ReactNode | string;
    deleteBtnTitle: React.ReactNode | string;
    handleDelete: () => void;
    handleCancel: () => void;
};

export type TCopyAddressTypes = {
    className?: string;
    address?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    isProtoFont?: boolean;
};

