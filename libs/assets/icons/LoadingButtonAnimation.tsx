import React from "react";
import Lottie from "lottie-react";
import clsx from "clsx";
import { LoadingBtnAnimation } from "../animations-generate";
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
