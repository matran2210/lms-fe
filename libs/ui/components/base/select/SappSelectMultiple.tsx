import { ArrowDownIcon } from "@lms/assets";
import { Select } from "antd";
import { ButtonSize } from "antd/es/button";
import { DefaultOptionType } from "antd/es/select";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { ErrorMessage, Tooltip } from "../../common";

interface SAPPSelectMultipleProps {
  control: Control<any>;
  name: string;
  defaultValue?: string[] | number[];
  className?: string;
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
}

const SAPPSelectMultiple = ({
  control,
  name,
  defaultValue = [],
  className,
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
}: SAPPSelectMultipleProps) => {
  /* -------- Tooltip xử lý ellipsis -------- */
  const EllipsisTooltip = ({ text }: { text: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOverflow, setIsOverflow] = useState(false);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const checkOverflow = () => {
        setIsOverflow(el.scrollWidth > el.clientWidth);
      };

      requestAnimationFrame(checkOverflow);
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

  /* -------- Custom label -------- */
  const customizedOptions = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        label: <EllipsisTooltip text={option.label as string} />,
      })),
    [options],
  );

  return (
    <div className="float-label">
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
              options={customizedOptions}
              className={clsx(
                "custom-select-v2 w-full",
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
