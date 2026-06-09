import clsx from "clsx";
import { LoadingBtnAnimation } from "../animations-generate";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

interface IProps {
  className?: string;
}
const LoadingButtonAnimation = ({ className }: IProps) => {
  return (
    <Lottie
      animationData={LoadingBtnAnimation}
      loop
      autoplay
      className={clsx("before-icon inline-block size-5", className)}
    />
  );
};

export default LoadingButtonAnimation;
