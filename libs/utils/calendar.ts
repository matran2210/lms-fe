import dayjs, { Dayjs } from 'dayjs'

export const handleDisableDate = (
  currentDate: string | Date,
  targetDate: Dayjs,
) => {
  return dayjs(currentDate).isAfter(targetDate.endOf('day'))
}

export const handleDisableTime = (targetDate: Dayjs) => {
  if (dayjs().isSame(targetDate, 'day')) {
    const currentHour = dayjs().get('hour')
    const targetHour = targetDate.get('hour')

    if (currentHour === targetHour) {
      const currentMinute = dayjs().get('minute')

      return {
        disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
        disabledMinutes: () =>
          Array.from({ length: currentMinute }, (_, i) => i),
      }
    }

    return {
      disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
    }
  }
}
