import dayjs from 'dayjs'
export const calculateHoursDifference = (
  startTime: string,
  endTime: string,
): number => {
  const fromTime = dayjs(startTime, 'HH:mm')
  const toTime = dayjs(endTime, 'HH:mm')
  const diffInMinutes = toTime.diff(fromTime, 'minute')
  const hours = diffInMinutes / 60
  return Number(hours.toFixed(2))
}
