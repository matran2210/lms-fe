import { useCallback, useEffect, useState, useRef } from 'react'

function useCountdown(
  minutes: number,
  seconds: number = 0,
): [string, Function, number] {
  const [time, setTime] = useState(minutes * 60 + seconds)
  const endTimeRef = useRef<number | null>(null)
  const resetTime = useCallback(
    (newMinutes: number, newSeconds: number = 0) => {
      const newTime = newMinutes * 60 + newSeconds
      setTime(newTime)
      endTimeRef.current = Date.now() + newTime * 1000 // Cập nhật thời gian kết thúc
    },
    [],
  )

  useEffect(() => {
    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + time * 1000 // Thiết lập endTime khi khởi tạo
    }

    const updateRemainingTime = () => {
      if (endTimeRef.current) {
        const remainingTime = Math.max(
          Math.floor((endTimeRef.current - Date.now()) / 1000),
          0,
        )
        setTime(remainingTime)

        if (remainingTime === 0) {
          clearInterval(intervalId)
        }
      }
    }

    const intervalId = setInterval(updateRemainingTime, 1000)
    updateRemainingTime() // Cập nhật lần đầu ngay khi vào useEffect

    return () => clearInterval(intervalId)
  }, [])

  const formatTime = () => {
    let mins = Math.floor(time / 60)
    let secs = time % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return [formatTime(), resetTime, time]
}

export default useCountdown
