import type { GetProps } from "antd";
import { DatePicker, Skeleton } from "antd";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { Control, Controller } from "react-hook-form";
import { ErrorMessage } from "../../common";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

interface IProps {
  name: string;
  control: Control<any>;
  defaultValue?: [Date, Date] | null;
  onChange?: RangePickerProps["onChange"];
  placeholder?: [string, string];
  className?: string;
  disabled?: boolean;
  label?: string;
  labelClass?: string;
  guideline?: Array<string> | undefined;
  skeleton?: boolean;
  showTime?: RangePickerProps["showTime"];
  format?: string;
  required?: boolean;
  inputClassName?: string | undefined;
  suffixIcon?: React.ReactNode;
  allowClear?: boolean;
  disabledDate?: (targetDate: Dayjs) => boolean;
  disabledTime?: (targetDate: Dayjs) => any;
}

const HookFormDateRangeV2 = ({
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
  inputClassName = "",
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
        <>
          {!skeleton ? (
            <div className="float-label">
              <DatePicker.RangePicker
                {...field}
                className={clsx("h-12 w-full font-normal", inputClassName)}
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
              {label && (
                <label className="textfield-label as-label">
                  <span className={clsx({ required }, "")}>{label}</span>
                </label>
              )}
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
        </>
      )}
    />
  );
};

export default HookFormDateRangeV2;
