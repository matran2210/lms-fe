export const formatTime = (input?: string | number) => {
  if (input === undefined) {
    return ''
  }
  let seconds: number
  if (typeof input === 'string') {
    seconds = Number(input)
    if (isNaN(seconds)) {
      return ''
    }
  } else {
    seconds = input
  }
  const hours = Math.floor(seconds / 3600)
  const remainingSeconds = seconds % 3600
  const minutes = Math.floor(remainingSeconds / 60)
  const finalSeconds = remainingSeconds % 60

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(finalSeconds).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
