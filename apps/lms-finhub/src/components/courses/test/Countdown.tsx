import { formatTime } from '@components/common/timer'
import { useCountdownTest } from '@lms/hooks'
import {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
} from 'react'
import { CountDownProps } from 'src/type/courses-3-level'

const CountDown = forwardRef(
  ({ remainTime, onTimeOut }: CountDownProps, ref: ForwardedRef<unknown>) => {
    const time = useCountdownTest(remainTime)
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
      <div className="flex justify-center text-lg font-medium leading-7 text-gray-800">
        {formatTime(time[2])}
      </div>
    )
  },
)
CountDown.displayName = 'CountDown'
export default memo(CountDown)
