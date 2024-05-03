import React, { useState, useEffect } from 'react'

export const renderer = ({ hours, minutes, seconds }: { hours: number, minutes: number, seconds: number }) => {
  const formatNumber = (num: number) => {
    return num < 10 ? '0' + num : num.toString()
  }

  return (
    <div className="text-bw-1 text-[21px] font-bold w-1/3 justify-center flex font-tech tracking-[2px]">
      {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
    </div>
  )
}

export const useCountdown = (time_ended: number) => {
  const [data, setData] = useState<any>({
    date: Date.now(),
    delay: undefined,
  })
  const wantedDelay = 60000 // 10 ms

  useEffect(() => {
    if (time_ended) {
      const newDelay = time_ended * 60 * 1000
      setData({ date: Date.now(), delay: newDelay })
    }
  }, [time_ended])

  useEffect(() => {
    const getLocalStorageValue = (s: string) => localStorage.getItem(s)

    const savedDate = getLocalStorageValue('end_date')
    if (savedDate != null && !isNaN(savedDate as any)) {
      const currentTime = Date.now()
      const delta = parseInt(savedDate as string, 10) - currentTime

      if (delta > wantedDelay) {
        if ((localStorage.getItem('end_date') as any).length > 0)
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
