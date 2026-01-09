import { MotionProps } from "framer-motion";
import { Placement, placementStartOffsetMap } from "./placement";

export const tooltipMotionByPlacement = (placement: Placement): MotionProps => {
  const { x, y } = placementStartOffsetMap[placement];
  const overshootFactor = -0.15;

  return {
    initial: {
      opacity: 0,
      translateX: x,
      translateY: y,
    },

    animate: {
      opacity: [0, 0.6, 1],
      translateX: [x, x * overshootFactor, 0],
      translateY: [y, y * overshootFactor, 0],
    },

    exit: {
      opacity: 0,
    },

    transition: {
      duration: 0.5,
      times: [0, 0.7, 1],
      ease: [0.68, -0.55, 0.27, 1.55],
    },
  };
};
