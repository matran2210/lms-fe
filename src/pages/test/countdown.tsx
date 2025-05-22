import useCountdown from '@components/auth/Countdown'
import { formatTime } from '@components/common/timer'
import {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
} from 'react'

const CountDown = forwardRef(
  ({ remainTime, onTimeOut }: any, ref: ForwardedRef<any>) => {
    const time = useCountdown(remainTime)
    useImperativeHandle(ref, () => ({
      handleGetTime() {
        return time?.[2]
      },
    }))
    useEffect(() => {
      if (time?.[2] === 0) {
        onTimeOut && onTimeOut()
      }
    }, [time[2]])
    return (
      <div className="flex justify-center text-xl font-medium tracking-[2px] text-bw-1">
        {formatTime(time[2])}
      </div>
    )
  },
)
CountDown.displayName = 'CountDown'
export default memo(CountDown)
