import React, { useState, useEffect } from 'react'

interface ICountdown {
  date: number
  delay: number
}

/**
 * @description render ra coutdown
 */
export const renderer = ({
  hours,
  minutes,
  seconds,
}: {
  hours: number
  minutes: number
  seconds: number
}) => {
  /**
   * @description function này để check nếu time < 10 thì add thêm '0'
   */
  const formatNumber = (num: number) => {
    return num < 10 ? '0' + num : num.toString()
  }

  return (
    <div className="flex w-2/6 justify-center font-tech text-[1.3125rem] font-bold tracking-[0.125rem] text-bw-1">
      {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
    </div>
  )
}

export const useCountdown = (time_ended: number) => {
  /**
   * @description state này lưu data của time hiện tại và time hết hạn
   */
  const [data, setData] = useState<ICountdown>({
    date: Date.now(),
    delay: 0,
  })

  const wantedDelay = 60000 // 10 ms

  /**
   * @description check điều kiện nếu tồn tại time_ended thì tính lại
   */
  useEffect(() => {
    if (time_ended) {
      const newDelay = time_ended * 60 * 1000
      setData({ date: Date.now(), delay: newDelay })
    }
  }, [time_ended])

  /**
   * @description xử lí countdown
   */
  useEffect(() => {
    const getLocalStorageValue = (s: string) => localStorage.getItem(s)

    const savedDate = getLocalStorageValue('end_date') as number | string | null

    if (savedDate != null && !isNaN(Number(savedDate))) {
      const currentTime = Date.now()
      const delta = parseInt(savedDate as string, 10) - currentTime

      if (delta > wantedDelay) {
        if (String(localStorage.getItem('end_date')).length > 0)
          localStorage.removeItem('end_date')
      } else {
        setData({ date: currentTime, delay: delta })
      }
    }
  }, [wantedDelay])

  return {
    data,
    onStart: () => {
      if (localStorage.getItem('end_date') == null)
        localStorage.setItem('end_date', JSON.stringify(data.date + data.delay))
    },
    onComplete: () => {
      if (localStorage.getItem('end_date') != null)
        localStorage.removeItem('end_date')
    },
  }
}
