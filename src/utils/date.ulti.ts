export const calculateHoursDifference = (
  startTime: string,
  endTime: string,
): number => {
  function timeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number)
    return hours * 3600 + minutes * 60 + seconds
  }
  const startSeconds = timeToSeconds(startTime)
  const endSeconds = timeToSeconds(endTime)
  let difference = endSeconds - startSeconds
  const hours = difference / 3600
  return Number(hours.toFixed(2))
}
