"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Preload lottie-react chunk ngay khi module này được import lần đầu,
// không cần đợi hover → chunk đã sẵn sàng khi người dùng hover
if (typeof window !== "undefined") {
  import("lottie-react");
}

type AnimationData = object;
type AnimationModule = AnimationData | { default: AnimationData };

type DeferredLottieProps = {
  loadAnimationData: () => Promise<AnimationModule>;
  className?: string;
  loop?: boolean | number;
  autoplay?: boolean;
  active?: boolean;
};

const getAnimationData = (module: AnimationModule): AnimationData =>
  "default" in module ? module.default : module;

export default function DeferredLottie({
  loadAnimationData,
  className,
  loop = true,
  autoplay = true,
  active = true,
}: DeferredLottieProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [animationData, setAnimationData] = useState<AnimationData | null>(null);

  useEffect(() => {
    if (!active) return;
    // Gộp setShouldLoad + fetch vào 1 effect, bỏ tầng re-render trung gian
    let cancelled = false;
    loadAnimationData().then((module) => {
      if (!cancelled) {
        setAnimationData(getAnimationData(module));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [active, loadAnimationData]);

  if (!active || !animationData) {
    return <span aria-hidden className={className} />;
  }

  return (
    <Lottie
      animationData={animationData}
      autoplay={autoplay}
      loop={loop}
      className={className}
    />
  );
}
