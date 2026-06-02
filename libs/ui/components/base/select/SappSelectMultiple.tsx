import { ArrowDownIcon, CloseCircleIcon, CloseIcon } from "@lms/assets";
import { Select } from "antd";
import { ButtonSize } from "antd/es/button";
import { DefaultOptionType } from "antd/es/select";
import clsx from "clsx";
import { FocusEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { ErrorMessage, Tooltip } from "../../common";

interface SAPPSelectMultipleProps {
  control: Control<any>;
  name: string;
  defaultValue?: string[] | number[];
  className?: string;
  classNameWrapper?: string;
  placeholder?: string;
  options: DefaultOptionType[];
  size?: ButtonSize;
  suffixIcon?: React.ReactNode;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  isSearchable?: boolean;
  onSearch?: (value: string) => Promise<void> | void;
  isLoading?: boolean;
  onMenuScrollToBottom?: (e: any) => void;
  onChange?: (value: any[]) => void;
  onDropdownVisibleChange?: (open: boolean) => void;
  heightCustom?: string;
  allowClear?: boolean;
  open?: boolean;
  onFocus?: FocusEventHandler<HTMLElement> | undefined
}

const SAPPSelectMultiple = ({
  control,
  name,
  defaultValue = [],
  className,
  classNameWrapper,
  placeholder,
  options,
  size,
  suffixIcon = <ArrowDownIcon />,
  label,
  required,
  disabled,
  isSearchable,
  onSearch,
  isLoading = false,
  onMenuScrollToBottom,
  onChange,
  onDropdownVisibleChange,
  heightCustom = "h-12",
  allowClear = false,
  open,
  onFocus,
}: SAPPSelectMultipleProps) => {
  return (
    <div className={clsx("float-label", classNameWrapper)}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              mode="multiple"
              {...field}
              value={field.value ?? []}
              options={options}
              className={clsx(
                "custom-select w-full",
                heightCustom,
                className,
              )}
              maxTagCount="responsive"
              maxTagPlaceholder={(omitted) => `Đã chọn ${omitted.length}`}
              placeholder={placeholder}
              size={size}
              suffixIcon={suffixIcon}
              disabled={disabled}
              showSearch={isSearchable}
              onSearch={onSearch}
              loading={isLoading}
              allowClear={allowClear}
              optionFilterProp="title"
              onDropdownVisibleChange={onDropdownVisibleChange}
              onChange={(values) => {
                field.onChange(values ?? []);
                onChange?.(values ?? []);
              }}
              onPopupScroll={(e) => {
                const target = e.target as HTMLElement;
                if (
                  Math.ceil(target.scrollTop + target.offsetHeight) ===
                  Math.ceil(target.scrollHeight)
                ) {
                  onMenuScrollToBottom?.(e);
                }
              }}
              open={open}
              onFocus={onFocus}
            />

            {label && (
              <label className="textfield-label as-label">
                <span className={clsx({ required })}>{label}</span>
              </label>
            )}

            <ErrorMessage>{error?.message}</ErrorMessage>
          </>
        )}
      />
    </div>
  );
};

export default SAPPSelectMultiple;
