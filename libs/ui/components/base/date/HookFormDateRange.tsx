import type { GetProps } from "antd";
import { DatePicker, Skeleton } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Control, Controller } from "react-hook-form";
import SAPPLabel from "../Label/SAPPLabel";
import { IBaseFormFieldProps } from "@lms/core";
import { ErrorMessage, SappIcon } from "../../common";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

interface IProps extends IBaseFormFieldProps {
  defaultValue?: [Date, Date] | null;
  onChange?: RangePickerProps["onChange"];
  placeholder?: [string, string];
  guideline?: Array<string> | undefined;
  showTime?: RangePickerProps["showTime"];
  format?: string;
  inputClassName?: string | undefined;
  suffixIcon?: React.ReactNode;
  allowClear?: boolean;
  disabledDate?: (targetDate: Dayjs) => boolean;
  disabledTime?: (targetDate: Dayjs) => any;
}

const HookFormDateRange = ({
  name,
  control,
  defaultValue,
  onChange,
  placeholder,
  className,
  disabled,
  label,
  labelClass = "text-base block font-medium mb-2",
  skeleton,
  showTime = { format: "HH:mm" },
  format = "DD/MM/YYYY | HH:mm",
  required,
  inputClassName = "h-[50px] w-full rounded-none",
  suffixIcon = <SappIcon icon="input_calendar" />,
  disabledDate,
  disabledTime,
}: IProps) => {
  const formattedDefaultValue = defaultValue
    ? [dayjs(defaultValue[0]), dayjs(defaultValue[1])]
    : null;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={formattedDefaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className="h-full w-full">
          {!skeleton ? (
            <div className={className}>
              {label && (
                <SAPPLabel
                  title={label}
                  required={required}
                  className={labelClass}
                />
              )}
              <DatePicker.RangePicker
                {...field}
                className={inputClassName}
                showTime={showTime}
                format={format}
                value={
                  field.value
                    ? [dayjs(field.value[0]), dayjs(field.value[1])]
                    : null
                }
                onChange={(dates, dateStrings) => {
                  field.onChange(
                    dates ? [dates[0]?.toDate(), dates[1]?.toDate()] : [],
                  );

                  onChange && onChange(dates, dateStrings);
                }}
                suffixIcon={suffixIcon}
                disabled={disabled}
                placeholder={placeholder}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
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
            <Skeleton.Input active className={inputClassName} />
          )}
        </div>
      )}
    />
  );
};

export default HookFormDateRange;
