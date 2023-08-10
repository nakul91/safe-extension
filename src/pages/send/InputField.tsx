import { FC } from "react";
import React, {
  ChangeEvent,
  ClipboardEvent,
  FocusEventHandler,
  KeyboardEvent,
  ReactElement,
  ReactNode,
} from "react";

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

const InputField: FC<TInputFieldProps> = (props) => {
  const {
    label,
    labelClassName,
    type,
    className,
    name,
    id,
    placeholder,
    value,
    onChange,
    onBlur,
    errorMsg,
    isOptionalLabel,
    noMargin,
    min,
    step,
    autoComplete,
    maxLength,
    onKeyPress,
    autofocus,
    disabled,
  } = props;

  return (
    <div
      className={`${noMargin ? "" : "mb-5"} ${errorMsg ? "errorShake" : ""} `}
    >
      {label && (
        <label
          htmlFor={id}
          className={`label1 leading-4 text-text-700 dark:text-textDark-700 ${
            labelClassName ? labelClassName : ""
          }`}
        >
          {label}{" "}
          {isOptionalLabel ? (
            <span className="text-slate-400">(Optional)</span>
          ) : null}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        className={`pl-0 pt-2 pb-1 border-none dark:bg-transparent text-text-900 dark:text-textDark-900 placeholder-text-300 dark:placeholder-textDark-300 text-base rounded-lg block w-full focus:outline-none focus:ring-transparent ${
          className ? className : ""
        }`}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        onBlur={onBlur}
        value={value as string | number}
        min={min}
        step={step}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onKeyPress={onKeyPress}
        autoFocus={autofocus}
        onWheel={() => (document.activeElement as HTMLElement).blur()}
      />
    </div>
  );
};

export default InputField;