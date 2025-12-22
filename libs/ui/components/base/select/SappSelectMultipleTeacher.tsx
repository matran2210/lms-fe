import clsx from "clsx";
import React, { memo, ReactNode, useCallback, useMemo } from "react";
import { Control, Controller } from "react-hook-form";
import Select, {
  components,
  MultiValue,
  ValueContainerProps,
  GroupBase,
} from "react-select";
import { ErrorMessage } from "../../common";

export interface SelectOption {
  label: string;
  value: string;
  isDisabled?: boolean;
}

interface IProps {
  name: string;
  control: Control<any>;
  required?: boolean;
  className?: string;
  options?: SelectOption[];
  children?: ReactNode;
  placeholder?: string;
  onChange?: (select: SelectOption[]) => void;
  isDisabled?: boolean;
  defaultValue?: string[];
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
  maxShownValues?: number;
}

const CustomValueContainer = ({
  maxShownValues,
  ...props
}: ValueContainerProps<SelectOption, true, GroupBase<SelectOption>> & {
  maxShownValues: number;
}) => {
  const { children, getValue, hasValue } = props;
  const count = getValue().length;

  if (!maxShownValues || !hasValue || count <= maxShownValues) {
    return (
      <components.ValueContainer {...props}>
        {children}
      </components.ValueContainer>
    );
  }

  const childrenArray = React.Children.toArray(children);
  const input = childrenArray[childrenArray.length - 1];

  return (
    <components.ValueContainer {...props}>
      <div className="flex items-center w-full overflow-hidden">
        <span className="whitespace-nowrap bg-[#2a353c] px-2 py-0.5 rounded text-sm font-medium mr-2 border text-white">
          {count} mục đã chọn
        </span>
        {input}
      </div>
    </components.ValueContainer>
  );
};

const SappSelectMultipleTeacher = (props: IProps) => {
  const {
    // ... giải nén các props như cũ ...
    maxShownValues = 2,
    placeholder,
    name,
  } = props;

  const CustomComponents = useMemo(
    () => ({
      ValueContainer: (p: any) => (
        <CustomValueContainer {...p} maxShownValues={maxShownValues} />
      ),
      // Bỏ IndicatorSeparator cho sạch giao diện
      IndicatorSeparator: () => null,
    }),
    [maxShownValues],
  );

  return (
    <>
      <Controller
        name={name}
        control={props.control}
        render={({
          field: { onChange: formChange, onBlur: formBlur, value, ref },
          fieldState: { error },
        }) => {
          const selectedOptions =
            props.options?.filter((opt) => (value || []).includes(opt.value)) ||
            [];

          return (
            <>
              <Select<SelectOption, true>
                ref={ref}
                isMulti
                options={props.options}
                value={selectedOptions}
                components={CustomComponents}
                className={clsx("select-custom-wrapper", props.className)}
                classNamePrefix="select"
                styles={{
                  valueContainer: (base) => ({
                    ...base,
                    flexWrap: "nowrap",
                    padding: "2px 8px",
                    minHeight: "38px",
                  }),
                  input: (base) => ({
                    ...base,
                    margin: 0,
                    padding: 0,
                    "& input": {
                      font: "inherit",
                    },
                  }),
                  placeholder: (base) => ({
                    ...base,
                    whiteSpace: "nowrap",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? "#2a353c"
                      : "transparent",
                    color: state.isFocused ? "#f8b830" : "",
                  }),
                  control: (base, state) => ({
                    ...base,
                    borderRadius: "6px",
                    borderColor: state.isFocused ? "#f8b830" : "",
                    // boxShadow: state.isFocused ? "0 0 0 0.5px #f8b830" : "none",
                    boxShadow: "none",
                    outline: "none",
                    "&:hover": {
                      borderColor: "#f8b830",
                    },
                  }),
                }}
                // ... các props khác giữ nguyên ...
                onChange={(selected) => {
                  const ids = (selected as MultiValue<SelectOption>).map(
                    (item) => item.value,
                  );
                  formChange(ids);
                  props.onChange?.(selected as SelectOption[]);
                }}
                onBlur={() => {
                  formBlur();
                  props.onBlur?.();
                }}
              />
              <ErrorMessage>{error?.message}</ErrorMessage>
            </>
          );
        }}
      />
    </>
  );
};

export default memo(SappSelectMultipleTeacher);
