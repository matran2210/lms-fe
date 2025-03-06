import HookFormSelect from '@components/base/select/HookFormSelect'
import { InputNumber } from 'antd'
import { memo, useEffect, useMemo, useState } from 'react'
import {
  FREQUENCY_UNITS_OBJECT,
  FREQUENCY_OPTIONS,
  FREQUENCY_OPTIONS_PLURAL,
  FREQUENCY_UNITS_LIMIT,
  FREQUENCY_UNITS,
} from 'src/constants'
import { IRepeatFrequency, IRepeatUnitOption } from 'src/type/my-calendar'

interface IProps {
  className?: string | undefined
  defaultValue?: IRepeatFrequency
  onChange: (data: IRepeatFrequency) => void
}

const RepeatFrequency = ({ className, defaultValue, onChange }: IProps) => {
  const [frequency, setFrequency] = useState<IRepeatFrequency>(
    defaultValue || {
      interval: 1,
      unit: FREQUENCY_UNITS.WEEK,
    },
  )

  const unitOptions = useMemo(
    () =>
      frequency.interval > 1 ? FREQUENCY_OPTIONS_PLURAL : FREQUENCY_OPTIONS,
    [frequency.interval],
  )

  const onNumberChange = (interval: number | null) => {
    if (interval === null || interval < FREQUENCY_UNITS_LIMIT.MIN)
      interval = FREQUENCY_UNITS_LIMIT.MIN
    if (interval > FREQUENCY_UNITS_LIMIT.MAX[frequency.unit])
      interval = FREQUENCY_UNITS_LIMIT.MAX[frequency.unit]

    setFrequency((prev) => ({ ...prev, interval }))
  }

  const onUnitChange = (option: IRepeatUnitOption) => {
    const frequencyValue =
      frequency.interval > FREQUENCY_UNITS_LIMIT.MAX[option.value]
        ? FREQUENCY_UNITS_LIMIT.MAX[option.value]
        : frequency.interval

    setFrequency({
      interval: frequencyValue,
      unit: option.value as keyof typeof FREQUENCY_UNITS_OBJECT,
    })
  }

  useEffect(() => {
    onChange(frequency)
  }, [frequency])

  return (
    <div className={`flex flex-row items-center ${className || ''}`}>
      <InputNumber
        min={FREQUENCY_UNITS_LIMIT.MIN}
        max={FREQUENCY_UNITS_LIMIT.MAX[frequency.unit]}
        defaultValue={FREQUENCY_UNITS_LIMIT.MIN}
        value={frequency.interval}
        onChange={onNumberChange}
        className="mr-5 flex h-full min-w-[50px] max-w-[55px] rounded-none shadow-none"
        name="repeat_every"
      />
      <HookFormSelect
        isSearchable={false}
        options={unitOptions}
        value={unitOptions.find((option) => option.value === frequency.unit)}
        onChange={onUnitChange}
        className="rounded-0"
      />
    </div>
  )
}

export default memo(RepeatFrequency)
