import React from "react";
import { Control, Controller } from "react-hook-form";
import { ErrorMessage } from "../../common";
import SAPPTextFiled from "./SAPPTextFiled";

interface IProps {
  name: string;
  control: Control<any>;
  defaultValue?: any;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  type?: "number" | "password" | "email" | "text" | "date";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  labelClass?: string;
  onChangeType?: () => void;
  passwordVisible?: boolean;
  showIconPassword?: boolean;
  guideline?: Array<string> | undefined;
  skeleton?: boolean;
  required?: boolean;
  maxLength?: number;
  textSize?: "base" | "sm";
  inputClassName?: string;
  style?: React.CSSProperties;
  placeholderIcon?: React.ReactNode;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const HookFormTextField = ({
  name,
  control,
  defaultValue,
  onChange,
  type,
  placeholder,
  className = "",
  disabled,
  readOnly,
  label,
  labelClass,
  skeleton,
  required,
  maxLength,
  textSize,
  inputClassName,
  style,
  placeholderIcon,
  onBlur,
  onFocus,
}: IProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="h-full w-full">
            {!skeleton ? (
              <div>
                <SAPPTextFiled
                  type={type}
                  textSize={textSize}
                  value={field.value ?? ""}
                  defaultValue={field.value ? undefined : defaultValue}
                  onChange={(value) => {
                    field.onChange(value);
                    onChange && onChange(value);
                  }}
                  className={`${className} ${
                    error
                      ? "border-[#B90E0A] focus:border-[#B90E0A]"
                      : "border-[#DCDDDD] focus:border-[#141414]"
                  }`}
                  placeholder={placeholder}
                  disabled={disabled}
                  label={label}
                  labelClass={labelClass}
                  required={required}
                  maxLength={maxLength}
                  field={field}
                  style={style}
                  isError={!!error?.message}
                  inputClassName={inputClassName}
                  placeholderIcon={placeholderIcon}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  readOnly={readOnly}
                />

                <>
                  {error?.message && (
                    <div>
                      <ErrorMessage>{error?.message ?? ""}</ErrorMessage>
                    </div>
                  )}
                </>
              </div>
            ) : (
              <div className="flex items-center">Loading...</div>
            )}
          </div>
        );
      }}
    />
  );
};

export default HookFormTextField;
