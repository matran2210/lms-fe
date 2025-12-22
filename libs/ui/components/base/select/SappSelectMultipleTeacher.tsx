import clsx from "clsx";
import React, { memo, ReactNode, useMemo } from "react";
import { Control, Controller } from "react-hook-form";
import Select, {
  components,
  GroupBase,
  MultiValue,
  ValueContainerProps,
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
  onInputChange: (e: string) => void
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
        <span className="whitespace-nowrap bg-[#404041] px-2 py-0.5 rounded text-sm font-medium mr-2 border text-white">
          {count} mục đã chọn
        </span>
        {input}
      </div>
    </components.ValueContainer>
  );
};

const SappSelectMultipleTeacher = (props: IProps) => {
  const {
    onInputChange,
    maxShownValues = 2,
    onMenuScrollToBottom,
    placeholder,
    onFocus,
    onMenuClose, 
    name,
  } = props;

  const CustomComponents = useMemo(
    () => ({
      ValueContainer: (p: any) => (
        <CustomValueContainer {...p} maxShownValues={maxShownValues} />
      ),
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
                hideSelectedOptions={false}
                isMulti
                options={props.options}
                value={selectedOptions}
                components={CustomComponents}
                onInputChange={onInputChange}
                onMenuScrollToBottom={onMenuScrollToBottom}
                className={clsx("select-single", "select-single-custom", props.className)}
                classNamePrefix="select"
                onFocus={onFocus}
                onMenuClose={onMenuClose}
                onMenuOpen={onFocus}
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
