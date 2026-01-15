"use client"
import { useCallback, useEffect, useState, useRef } from 'react'

function useCountdownTest(
  minutes: number,
  seconds = 0,
  reset = false,
): [string, (newMinutes: number, newSeconds?: number) => void, number] {
  const [time, setTime] = useState(minutes * 60 + seconds)
  const endTimeRef = useRef<number | null>(null)
  const resetTime = useCallback(
    (newMinutes: number, newSeconds = 0) => {
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
  }, [reset])

  const formatTime = () => {
    const mins = Math.floor(time / 60)
    const secs = time % 60
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`
  }

  return [formatTime(), resetTime, time]
}

export default useCountdownTest
