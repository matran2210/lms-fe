"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

interface IProps {
  className?: string;
}

const loadLoadingButtonAnimation = () =>
  fetch("/api/lottie/LoadingBtn").then((response) => response.json());

const LoadingButtonAnimation = ({ className }: IProps) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let mounted = true;

    loadLoadingButtonAnimation().then((data) => {
      if (mounted) setAnimationData(data);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!animationData) {
    return (
      <span
        aria-hidden
        className={clsx("before-icon inline-block size-5", className)}
      />
    );
  }

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className={clsx("before-icon inline-block size-5", className)}
    />
  );
};

export default LoadingButtonAnimation;
