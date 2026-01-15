'use client';
import { ArrowDownIcon } from "@lms/assets";
import { Select } from "antd";
import { ButtonSize } from "antd/es/button";
import { DefaultOptionType } from "antd/es/select";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { ErrorMessage, Tooltip } from "../../common";

interface SAPPSelectProps {
  control: Control<any>;
  name: string;
  defaultValue?: any;
  className?: string;
  placeholder?: string;
  options: DefaultOptionType[];
  size?: ButtonSize;
  suffixIcon?: React.ReactNode;
  label?: string;
  required?: boolean;
  labelClass?: string;
  disabled?: boolean;
  isSearchable?: boolean;
  onSearch?: (value: string) => Promise<void> | any;
  isLoading?: boolean;
  onMenuScrollToBottom?: any;
  onChange?: (select: any) => void;
  onDropdownVisibleChange?: ((open: boolean) => void) | undefined;
  heightCustom?: string;
  allowClear?: boolean;
}

const SAPPSelectV2 = ({
  control,
  name,
  defaultValue,
  className,
  placeholder,
  options,
  size,
  suffixIcon = <ArrowDownIcon />,
  label,
  required,
  labelClass,
  onChange,
  disabled,
  isSearchable,
  onSearch,
  isLoading = false,
  onMenuScrollToBottom,
  onChange: onSelectChange,
  onDropdownVisibleChange,
  heightCustom = "h-12",
  allowClear = false,
}: SAPPSelectProps) => {
  const EllipsisTooltip = ({ text }: { text: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOverflow, setIsOverflow] = useState(false);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const checkOverflow = () => {
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;

        const hasOverflow = scrollWidth > clientWidth;
        setIsOverflow(hasOverflow);
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(checkOverflow);
      });
    }, [text]);

    const content = (
      <div className="w-full truncate" ref={ref}>
        {text}
      </div>
    );

    return isOverflow ? (
      <Tooltip title={text} placement="right">
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  const customizedOptions = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        label: <EllipsisTooltip text={option.label as string} />,
      })),
    [options],
  );

  return (
    <>
      <div className="float-label">
        <Controller
          key={name}
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field, fieldState: { error } }) => {
            return (
              <>
                <Select
                  {...field}
                  className={clsx(
                    "custom-select-v2 w-full",
                    heightCustom,
                    className,
                  )}
                  placeholder={placeholder || ""}
                  value={
                    field.value === '' || field.value === null
                      ? undefined
                      : field.value
                  }
                  options={customizedOptions}
                  size={size}
                  suffixIcon={suffixIcon}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    onSelectChange && onSelectChange?.(selectedOption);
                  }}
                  disabled={disabled}
                  showSearch={isSearchable}
                  onSearch={onSearch}
                  loading={isLoading}
                  allowClear={allowClear}
                  onDropdownVisibleChange={onDropdownVisibleChange}
                  onPopupScroll={(e) => {
                    const { target } = e;
                    if (
                      Math.ceil((target as HTMLElement).scrollTop) +
                        Math.ceil((target as HTMLElement).offsetHeight) ===
                      Math.ceil((target as HTMLElement).scrollHeight)
                    ) {
                      if (onMenuScrollToBottom) {
                        onMenuScrollToBottom(e);
                      }
                    }
                  }}
                />
                {label && (
                  <label className="textfield-label as-label">
                    <span className={clsx({ required }, "")}>{label}</span>
                  </label>
                )}
                <ErrorMessage>{error?.message}</ErrorMessage>
              </>
            );
          }}
        />
      </div>
    </>
  );
};

export default SAPPSelectV2;
