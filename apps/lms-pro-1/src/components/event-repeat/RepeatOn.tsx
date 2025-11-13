import { Checkbox } from 'antd'
import clsx from 'clsx'
import { memo, useCallback, useEffect, useState } from 'react'
import { REPEAT_ON, REPEAT_ON_MAPPED } from 'src/constants'

interface IProps {
  className?: string
  date: Date
  onChange: (data: (typeof REPEAT_ON)[number][]) => void
  disabled?: boolean
}

const RepeatOn = ({ className = '', date, onChange, disabled }: IProps) => {
  const [repeatOn, setRepeatOn] = useState<(typeof REPEAT_ON)[number][]>([])

  const isCurrentDate = useCallback(
    (day: (typeof REPEAT_ON)[number]) => {
      return REPEAT_ON_MAPPED[date.getDay()] === day
    },
    [date],
  )

  const handleChange = (value: (typeof REPEAT_ON)[number][]) => {
    const currentDay = REPEAT_ON_MAPPED[date.getDay()]
    if (!value.includes(currentDay)) return

    setRepeatOn(value)
    onChange(value)
  }

  useEffect(() => {
    setRepeatOn([REPEAT_ON_MAPPED[date.getDay()]])
    onChange([REPEAT_ON_MAPPED[date.getDay()]])
  }, [date])
  return (
    <div className={className}>
      <Checkbox.Group
        value={repeatOn}
        onChange={handleChange}
        className="gap-[9px]"
      >
        {REPEAT_ON.map((day) => (
          <Checkbox
            key={day}
            value={day}
            className={clsx('relative my-2 block h-6', {
              current: isCurrentDate(day),
            })}
            disabled={disabled}
          >
            <span className="custom-checkbox flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium leading-[14px] tracking-normal">
              {day}
            </span>
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  )
}

export default memo(RepeatOn)
