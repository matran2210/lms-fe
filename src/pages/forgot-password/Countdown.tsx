import { useCallback, useEffect, useState } from 'react'

function useCountdown(
  minutes: number,
  seconds: number = 0,
): [string, Function] {
  const [time, setTime] = useState(minutes * 60 + seconds)

  const resetTime = useCallback(
    (newMinutes: number, newSeconds: number = 0) => {
      setTime(newMinutes * 60 + newSeconds)
    },
    [],
  )

  useEffect(() => {
    if (time <= 0) return

    const countdown = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(countdown)
  }, [time])

  const formatTime = () => {
    let mins = Math.floor(time / 60)
    let secs = time % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  return [formatTime(), resetTime]
}

export default useCountdown
