import { OptionType } from "@lms/core";
import clsx from "clsx";
import { memo, ReactNode, useCallback } from "react";
import { Control, Controller } from "react-hook-form";
import Select, { MultiValue } from "react-select";
import { ErrorMessage } from "../../common";

interface IProps {
  name: string;
  control: Control<any>;
  required?: boolean;
  className?: string;
  options?: Array<{ label: string; value: string; isDisabled?: boolean }>;
  children?: ReactNode;
  placeholder?: string;
  onChange?: (select: OptionType[]) => void;
  isDisabled?: boolean;
  defaultValue?: OptionType[] | null;
  label?: string;
  labelClass?: string;
  isSearchable?: boolean;
  onMenuScrollToBottom?: () => void;
  onFocus?: () => void;
  isClearable?: boolean;
  onMenuClose?: () => void;
  onBlur?: () => void;
  isLoading?: boolean;
  isSelectCustom?: boolean;
  onSearch?: (value?: string) => void;
}

const SappSelectMultipleTeacher = ({
  control,
  name,
  className,
  isDisabled,
  defaultValue = [],
  options,
  placeholder,
  onChange: onSelectChange,
  labelClass = "text-base block font-medium mb-2",
  label,
  required,
  isSearchable = true,
  onMenuScrollToBottom,
  onFocus,
  isClearable = true,
  onMenuClose,
  onBlur,
  isLoading = false,
  isSelectCustom = false,
  onSearch,
}: IProps) => {
  const handleChange = useCallback(
    (selectedOptions: MultiValue<OptionType>) => {
      onSelectChange?.(selectedOptions as OptionType[]);
    },
    [onSelectChange],
  );

  const handleMenuOpen = useCallback(() => {
    onSearch?.();
  }, [onSearch]);

  return (
    <>
      {label && (
        <label className={labelClass}>
          <span className={required ? "required" : ""}>{label}</span>
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              {...field}
              isMulti
              options={options}
              value={field.value || []}
              className={clsx(
                "select-single",
                isSelectCustom && "select-single-custom",
                className,
              )}
              classNamePrefix="select"
              instanceId={`multi-select-${name}`}
              placeholder={placeholder}
              isDisabled={isDisabled}
              isClearable={isClearable}
              isSearchable={isSearchable}
              isLoading={isLoading}
              onChange={(selected) => {
                field.onChange(selected);
                handleChange(selected);
              }}
              onMenuOpen={handleMenuOpen}
              onMenuClose={onMenuClose}
              onMenuScrollToBottom={onMenuScrollToBottom}
              onFocus={onFocus}
              onBlur={onBlur}
              onInputChange={onSearch}
            />
            <ErrorMessage>{error?.message}</ErrorMessage>
          </>
        )}
      />
    </>
  );
};

export default memo(SappSelectMultipleTeacher);
