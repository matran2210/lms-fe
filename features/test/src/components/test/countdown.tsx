import { useCountdown } from "@lms/feature-auth";
import { formatTimeMinToHhMm } from "@lms/utils";
import {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
} from "react";

const CountDown = forwardRef(
  ({ remainTime, onTimeOut }: any, ref: ForwardedRef<any>) => {
    const time = useCountdown(0, remainTime);
    useImperativeHandle(ref, () => ({
      handleGetTime() {
        return time?.[2];
      },
    }));
    useEffect(() => {
      if (time?.[2] <= 0) {
        onTimeOut && onTimeOut();
      }
    }, [time[2]]);
    return (
      <div className="flex justify-center text-xl font-medium text-gray-800">
        {formatTimeMinToHhMm(time[2])}
      </div>
    );
  },
);
CountDown.displayName = "CountDown";
export default memo(CountDown);
