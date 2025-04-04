import SAPPLabel from '@components/base/Label/SAPPLabel'
import SAPPSelect from '@components/base/select/SAPPSelect'
import { reverseDaysOfWeek } from '@utils/common'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form'
import SappIcon from 'src/common/SappIcon'
import {
  EVENT_REPEAT_LABEL,
  EVENT_REPEAT_TYPES,
  FREQUENCY_UNITS,
  REPEAT_ON,
  REPEAT_ON_MAPPED_PAYLOAD,
} from 'src/constants'
import {
  IEventRepeatFieldValues,
  IRecurringSchedule,
  IRepeatFrequency,
} from 'src/type/my-calendar'
import RepeatFrequency from './RepeatFrequency'
import RepeatOn from './RepeatOn'

dayjs.extend(weekday)
dayjs.extend(localeData)

interface IRepeatTypeOption {
  label: string
  value: (typeof EVENT_REPEAT_TYPES)[keyof typeof EVENT_REPEAT_TYPES]
}

interface IEventRepeatFieldForm {
  repeat_type: (typeof EVENT_REPEAT_TYPES)[keyof typeof EVENT_REPEAT_TYPES]
  repeat_frequency: IRepeatFrequency
  repeat_on: (typeof REPEAT_ON)[number][]
  end_on: Date
}

interface IProps {
  className?: string
  label?: string
  labelClass?: string
  defaultDate: Date
  defaultValue?: IEventRepeatFieldValues
  onChange: (val?: IEventRepeatFieldValues) => void
  required?: boolean
  field?: ControllerRenderProps<any, string>
}

const EventRepeatField = ({
  className = '',
  label,
  labelClass = '',
  defaultDate,
  defaultValue,
  onChange,
  required,
  field,
}: IProps) => {
  const initDate = useMemo(() => defaultDate || new Date(), [defaultDate])

  const formattedDefaultValue = useMemo(() => {
    // TODO: Add code to add default values
    return null
  }, [defaultValue])

  const repeatTypeOptions = useMemo(() => {
    const weeklyText = initDate.toLocaleDateString('en-US', { weekday: 'long' })
    const monthlyText = initDate.toLocaleDateString('en-US', { day: '2-digit' })
    const annuallyText = initDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
    })

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
      },
      { label: EVENT_REPEAT_LABEL.CUSTOM, value: EVENT_REPEAT_TYPES.CUSTOM },
    ]
  }, [initDate])

  const {
    watch,
    control,
    setValue: setFormValue,
    getValues: getFromValues,
  } = useForm<IEventRepeatFieldForm>({
    defaultValues: formattedDefaultValue || {
      repeat_type: EVENT_REPEAT_TYPES.NO_REPEAT,
      repeat_frequency: { interval: 1, unit: FREQUENCY_UNITS.WEEK },
      repeat_on: [],
      end_on: initDate,
    },
  })

  const mapRepeatOn = (
    data: ((typeof REPEAT_ON)[number] | undefined)[] | undefined,
  ) => {
    if (!data) return []
    return reverseDaysOfWeek(
      initDate,
      data.map((day) => REPEAT_ON_MAPPED_PAYLOAD[day || 'T2']),
    )
  }

  const cleanObject = useCallback((params: Object) => {
    return Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== '' && value !== null,
      ),
    )
  }, [])

  // Handle form change
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value?.repeat_type === EVENT_REPEAT_TYPES.NO_REPEAT) return onChange()

      const getInterval = () => {
        if (value?.repeat_type === EVENT_REPEAT_TYPES.CUSTOM)
          return value?.repeat_frequency?.interval || 1

        return 1
      }
      const getFrequency = () => {
        switch (value?.repeat_type) {
          case EVENT_REPEAT_TYPES.DAILY:
          case EVENT_REPEAT_TYPES.EVERY_WEEKDAY:
            return FREQUENCY_UNITS.DAY
          case EVENT_REPEAT_TYPES.WEEKLY:
            return FREQUENCY_UNITS.WEEK
          case EVENT_REPEAT_TYPES.MONTHLY:
            return FREQUENCY_UNITS.MONTH
          case EVENT_REPEAT_TYPES.ANNUALLY:
            return FREQUENCY_UNITS.YEAR
          default:
            return value?.repeat_frequency?.unit || FREQUENCY_UNITS.WEEK
        }
      }
      const getDayOfWeek = () => {
        if (
          value?.repeat_type === EVENT_REPEAT_TYPES.CUSTOM &&
          value?.repeat_frequency?.unit === FREQUENCY_UNITS.WEEK
        )
          return mapRepeatOn(value?.repeat_on)

        if (value?.repeat_type === EVENT_REPEAT_TYPES.EVERY_WEEKDAY)
          return mapRepeatOn(
            REPEAT_ON.filter((day) => day !== 'T7' && day !== 'CN'),
          )

        if (value?.repeat_type === EVENT_REPEAT_TYPES.WEEKLY)
          return [dayjs(initDate).weekday()]

        return undefined
      }
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
          return [dayjs(initDate).date()]

        return undefined
      }
      const getMonthOfYear = () => {
        if (
          value?.repeat_type === EVENT_REPEAT_TYPES.ANNUALLY ||
          (value?.repeat_type === EVENT_REPEAT_TYPES.CUSTOM &&
            value?.repeat_frequency?.unit === FREQUENCY_UNITS.YEAR)
        )
          return [dayjs(initDate).month() + 1]

        return undefined
      }

      const recurrence_end_date = value?.end_on
        ? dayjs(value?.end_on).endOf('day')
        : initDate

      onChange({
        repeat: value?.repeat_type !== EVENT_REPEAT_TYPES.NO_REPEAT,
        recurring_schedule: cleanObject({
          type: value?.repeat_type,
          interval: getInterval(),
          frequency: getFrequency(),
          recurrence_end_date: recurrence_end_date.toISOString(),
          day_of_week: getDayOfWeek(),
          day_of_month: getDayOfMonth(),
          month_of_year: getMonthOfYear(),
        }) as IRecurringSchedule,
      })
    })

    return () => subscription.unsubscribe()
  }, [watch])

  // Watch form values
  const repeat_type = watch('repeat_type')
  const repeat_frequency = watch('repeat_frequency')

  const is_repeat = repeat_type !== EVENT_REPEAT_TYPES.NO_REPEAT
  const is_custom_repeat = repeat_type === EVENT_REPEAT_TYPES.CUSTOM
  const repeat_on_visible =
    repeat_type === EVENT_REPEAT_TYPES.CUSTOM &&
    repeat_frequency.unit === FREQUENCY_UNITS.WEEK

  return (
    <>
      {label && (
        <SAPPLabel title={label} required={required} className={labelClass} />
      )}

      <div className={`event-repeat ${className}`}>
        <SAPPSelect
          name="repeat_type"
          label="Repeat"
          control={control}
          options={repeatTypeOptions}
          required={required}
          className="h-11.25"
        />
        {is_repeat && (
          <div className="mt-2 grid grid-cols-repeat-label gap-y-6 rounded-lg border border-[#DBDFE9] px-[15px] py-5">
            {is_custom_repeat && (
              <>
                <p className="required flex items-center pr-6">Repeat every</p>
                <RepeatFrequency
                  defaultValue={repeat_frequency}
                  onChange={(data) => setFormValue('repeat_frequency', data)}
                />
              </>
            )}

            {repeat_on_visible && (
              <>
                <p className="required flex items-center pr-6">Repeat on</p>
                <RepeatOn
                  date={initDate}
                  onChange={(data) => setFormValue('repeat_on', data)}
                />
              </>
            )}

            <p className="required flex items-center pr-6">End on</p>
            <Controller
              control={control}
              name="end_on"
              render={({ field }) => (
                <DatePicker
                  format="DD/MM/YYYY"
                  onChange={(newDate) => field.onChange(newDate)}
                  minDate={dayjs(initDate)}
                  maxDate={dayjs(initDate).add(2, 'year')}
                  value={dayjs(field.value)}
                  className="h-11.25 w-full"
                  color="secondary"
                  suffixIcon={<SappIcon icon="input_calendar" />}
                  allowClear={false}
                  required
                />
              )}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default memo(EventRepeatField)
