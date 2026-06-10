import clsx from "clsx";
import DeferredLottie from "../../common/DeferredLottie";

type LoadingButtonAnimationProps = {
  className?: string;
};

const loadLoadingButtonAnimation = () =>
  fetch("/api/lottie/LoadingBtn").then((response) => response.json());

export default function LoadingButtonAnimation({
  className,
}: LoadingButtonAnimationProps) {
  return (
    <DeferredLottie
      active
      loadAnimationData={loadLoadingButtonAnimation}
      loop
      autoplay
      className={clsx("before-icon inline-block size-5", className)}
    />
  );
}
