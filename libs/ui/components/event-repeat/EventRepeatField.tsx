import { convertLocalWeekDaysToUTC, reverseDaysOfWeek } from "@lms/utils";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import {
  EVENT_REPEAT_LABEL,
  EVENT_REPEAT_TYPES,
  FREQUENCY_UNITS,
  FREQUENCY_UNITS_OBJECT,
  IRecurringScheduleCalendar,
  REPEAT_ON,
  REPEAT_ON_MAPPED_PAYLOAD,
} from "@lms/core";
import { ISelect } from "@lms/core";
import { IEventRepeatFieldValues,
  IRepeatFrequency,IRecurringSchedule, RecurringScheduleType } from "@lms/core";

import RepeatFrequency from "./RepeatFrequency";
import RepeatOn from "./RepeatOn";
import { REPEAT_TYPE } from "@lms/core";
import clsx from "clsx";
import utc from "dayjs/plugin/utc";
import { SappIcon } from "../common";
import { SAPPSelectV2 } from "../base";

const DEFAULT_END_DATE_HOUR_OFFSET = 1;
const MAX_END_DATE_YEAR_RANGE = 2;

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);

interface IRepeatTypeOption {
  label: string;
  value: (typeof EVENT_REPEAT_TYPES)[keyof typeof EVENT_REPEAT_TYPES];
}

interface IEventRepeatFieldForm {
  repeat_type:
    | (typeof EVENT_REPEAT_TYPES)[keyof typeof EVENT_REPEAT_TYPES]
    | ISelect;
  repeat_frequency: IRepeatFrequency;
  repeat_on: (typeof REPEAT_ON)[number][];
  end_on?: Date | string;
  type: string;
}

interface IProps {
  className?: string;
  label?: string;
  labelClass?: string;
  defaultDate: Date;
  defaultValue?: IEventRepeatFieldValues;
  onChange: (val?: IEventRepeatFieldValues) => void;
  required?: boolean;
  field?: ControllerRenderProps<any, string>;
  repeatOption?: ISelect;
  resetRepeat?: boolean;
  setResetRepeat?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  rangeDate?: [Date, Date];
  defaultEndOn?: Date | string;
}

interface BlockLabelTextProps {
  text: React.ReactNode;
  className?: string;
  required?: boolean;
}

const BlockLabelText = ({ text, className, required }: BlockLabelTextProps) => {
  return (
    <p
      className={clsx(
        "flex items-center pr-6 font-medium",
        {
          required,
        },
        className,
      )}
    >
      {text}
    </p>
  );
};

const EventRepeatField = ({
  className = "",
  label,
  labelClass = "",
  defaultDate,
  defaultValue,
  onChange,
  required,
  field,
  repeatOption,
  resetRepeat,
  setResetRepeat,
  disabled,
  rangeDate,
  defaultEndOn,
}: IProps) => {
  const [repeatType, setRepeatType] = useState<RecurringScheduleType>(
    EVENT_REPEAT_TYPES.NO_REPEAT as RecurringScheduleType,
  );

  const initDate = useMemo(() => rangeDate?.[0] || new Date(), [rangeDate]);
  const initEndonDate = useMemo(
    () => defaultEndOn || undefined,
    [defaultEndOn],
  );

  const endOnMinDate = useMemo(
    () =>
      rangeDate?.[1] ||
      dayjs().add(DEFAULT_END_DATE_HOUR_OFFSET, "hour").toDate(),
    [rangeDate],
  );

  const formattedDefaultValue = useMemo(() => {
    // TODO: Add code to add default values
    return {
      repeat_type: repeatOption?.value ?? EVENT_REPEAT_TYPES.NO_REPEAT,
      repeat_frequency: { interval: 1, unit: FREQUENCY_UNITS.WEEK },
      repeat_on: [],
      end_on: defaultEndOn,
    };
  }, [defaultValue]);
  const repeatTypeOptions = useMemo(() => {
    const weeklyText = initDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const monthlyText = initDate.toLocaleDateString("en-US", {
      day: "2-digit",
    });
    const annuallyText = initDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
    });

    return [
      {
        label: EVENT_REPEAT_LABEL.NO_REPEAT,
        value: EVENT_REPEAT_TYPES.NO_REPEAT,
      },
      { label: EVENT_REPEAT_LABEL.DAILY, value: EVENT_REPEAT_TYPES.DAILY },
      { label: `Weekly on ${weeklyText}`, value: EVENT_REPEAT_TYPES.WEEKLY },
      { label: `Monthly on ${monthlyText}`, value: EVENT_REPEAT_TYPES.MONTHLY },
      {
        label: `Annually on ${annuallyText}`,
        value: EVENT_REPEAT_TYPES.ANNUALLY,
      },
      {
        label: EVENT_REPEAT_LABEL.EVERY_WEEKDAY,
        value: EVENT_REPEAT_TYPES.EVERY_WEEKDAY,
        disabled: ["Saturday", "Sunday"].includes(
          dayjs(initDate).format("dddd"),
        ),
      },
      { label: EVENT_REPEAT_LABEL.CUSTOM, value: EVENT_REPEAT_TYPES.CUSTOM },
    ];
  }, [initDate]);

  const {
    watch,
    control,
    setValue: setFormValue,
    getValues: getFormValues,
    reset,
  } = useForm<IEventRepeatFieldForm>({
    defaultValues: formattedDefaultValue || {
      repeat_type: EVENT_REPEAT_TYPES.NO_REPEAT,
      repeat_frequency: { interval: 1, unit: FREQUENCY_UNITS.WEEK },
      repeat_on: [],
    },
  });

  const mapRepeatOn = (
    data: ((typeof REPEAT_ON)[number] | undefined)[] | undefined,
  ) => {
    if (!data) return [];
    const numberDay = data
      .map((day) => REPEAT_ON_MAPPED_PAYLOAD[day || "T2"])
      .sort();

    const convertDay = convertLocalWeekDaysToUTC(initDate, numberDay);
    return reverseDaysOfWeek(initDate, convertDay);
  };

  const cleanObject = useCallback((params: object) => {
    return Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== "" && value !== null,
      ),
    );
  }, []);

  // Handle form change
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value?.repeat_type === EVENT_REPEAT_TYPES.NO_REPEAT)
        return onChange();

      const getInterval = () => {
        if (value?.repeat_type === EVENT_REPEAT_TYPES.CUSTOM)
          return value?.repeat_frequency?.interval || 1;

        return 1;
      };
      const getFrequency = () => {
        switch (value?.repeat_type) {
          case EVENT_REPEAT_TYPES.DAILY:
          case EVENT_REPEAT_TYPES.EVERY_WEEKDAY:
            return FREQUENCY_UNITS.DAY;
          case EVENT_REPEAT_TYPES.WEEKLY:
            return FREQUENCY_UNITS.WEEK;
          case EVENT_REPEAT_TYPES.MONTHLY:
            return FREQUENCY_UNITS.MONTH;
          case EVENT_REPEAT_TYPES.ANNUALLY:
            return FREQUENCY_UNITS.YEAR;
          default:
            return value?.repeat_frequency?.unit || FREQUENCY_UNITS.WEEK;
        }
      };
      const getDayOfWeek = () => {
        if (
          value?.repeat_type === EVENT_REPEAT_TYPES.CUSTOM &&
          value?.repeat_frequency?.unit === FREQUENCY_UNITS.WEEK
        )
          return mapRepeatOn(value?.repeat_on);

        if (value?.repeat_type === EVENT_REPEAT_TYPES.EVERY_WEEKDAY)
          return mapRepeatOn(
            REPEAT_ON.filter((day) => day !== "T7" && day !== "CN"),
          );

        if (value?.repeat_type === EVENT_REPEAT_TYPES.WEEKLY)
          return [dayjs(initDate).utc().weekday()];

        return undefined;
      };
      const getDayOfMonth = () => {
        if (
          value?.repeat_type === EVENT_REPEAT_TYPES.MONTHLY ||
          (value?.repeat_type === EVENT_REPEAT_TYPES.EVERY_WEEKDAY &&
            value?.repeat_frequency?.unit === FREQUENCY_UNITS.MONTH) ||
          value?.repeat_type === EVENT_REPEAT_TYPES.ANNUALLY ||
          (value?.repeat_type === EVENT_REPEAT_TYPES.CUSTOM &&
            (value?.repeat_frequency?.unit === FREQUENCY_UNITS.MONTH ||
              value?.repeat_frequency?.unit === FREQUENCY_UNITS.YEAR))
        )
          return [dayjs(initDate).utc().date()];

        return undefined;
      };
      const getMonthOfYear = () => {
        if (
          value?.repeat_type === EVENT_REPEAT_TYPES.ANNUALLY ||
          (value?.repeat_type === EVENT_REPEAT_TYPES.CUSTOM &&
            value?.repeat_frequency?.unit === FREQUENCY_UNITS.YEAR)
        )
          return [dayjs(initDate).utc().month() + 1];

        return undefined;
      };

      const recurrence_end_date = value?.end_on
        ? dayjs(value?.end_on).endOf("day")
        : initEndonDate;
      onChange({
        repeat: value?.repeat_type !== EVENT_REPEAT_TYPES.NO_REPEAT,
        recurring_schedule: cleanObject({
          type: value?.repeat_type,
          interval: getInterval(),
          frequency: getFrequency(),
          recurrence_end_date: recurrence_end_date,
          day_of_week: getDayOfWeek(),
          day_of_month: getDayOfMonth(),
          month_of_year: getMonthOfYear(),
        }) as IRecurringScheduleCalendar
      }) ;
    });

    return () => subscription.unsubscribe();
  }, [watch, initDate, initEndonDate]);

  useEffect(() => {
    if (resetRepeat && setResetRepeat) {
      reset();
      setResetRepeat(false);
    }
  }, [resetRepeat]);

  useEffect(() => {
    if (rangeDate?.[0] && rangeDate?.[1]) {
      setFormValue("end_on", undefined);
    }
  }, [rangeDate]);

  useEffect(() => {
    setRepeatType(watch("repeat_type") as RecurringScheduleType);
  }, [watch("repeat_type")]);

  // Watch form values
  const repeat_frequency = watch("repeat_frequency");

  const is_repeat = repeatType !== EVENT_REPEAT_TYPES.NO_REPEAT;
  const is_custom_repeat = repeatType === EVENT_REPEAT_TYPES.CUSTOM;
  const repeat_on_visible =
    repeatType === EVENT_REPEAT_TYPES.CUSTOM &&
    repeat_frequency.unit === FREQUENCY_UNITS.WEEK;

  return (
    <>
      <div className={`event-repeat ${className}`}>
        <SAPPSelectV2
          name="repeat_type"
          label="Repeat"
          control={control}
          options={
            repeatOption
              ? [repeatOption, ...repeatTypeOptions]
              : repeatTypeOptions
          }
          required
          defaultValue={EVENT_REPEAT_TYPES.NO_REPEAT}
          disabled={disabled}
        />
        {is_repeat && (
          <div className="mt-2 grid grid-cols-repeat-label gap-y-6 rounded-lg border border-[#DBDFE9] px-[15px] py-5">
            {is_custom_repeat && (
              <>
                <BlockLabelText text="Repeat every" required />
                <RepeatFrequency
                  defaultValue={repeat_frequency}
                  onChange={(data) => setFormValue("repeat_frequency", data)}
                  disabled={disabled}
                />
              </>
            )}

            {repeat_on_visible && (
              <>
                <BlockLabelText text="Repeat on" required />
                <RepeatOn
                  date={initDate}
                  onChange={(data) => setFormValue("repeat_on", data)}
                  disabled={disabled}
                />
              </>
            )}

            <BlockLabelText text="End on" required />
            <Controller
              control={control}
              name="end_on"
              render={({ field }) => (
                <DatePicker
                  format="DD/MM/YYYY"
                  onChange={(newDate) => field.onChange(newDate)}
                  minDate={dayjs(endOnMinDate)}
                  maxDate={dayjs(endOnMinDate).add(
                    MAX_END_DATE_YEAR_RANGE,
                    "year",
                  )}
                  value={field?.value ? dayjs(field.value) : undefined}
                  className="h-[45px] w-full"
                  color="secondary"
                  suffixIcon={<SappIcon icon="input_calendar" />}
                  allowClear={false}
                  required
                  disabled={disabled}
                />
              )}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default memo(EventRepeatField);
