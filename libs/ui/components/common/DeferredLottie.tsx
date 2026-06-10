"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

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

    const scheduleLoad = () => setShouldLoad(true);

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(scheduleLoad, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(scheduleLoad, 0);
    return () => globalThis.clearTimeout(timeoutId);
  }, [active]);

  useEffect(() => {
    if (!shouldLoad || animationData) return;

    let cancelled = false;
    loadAnimationData().then((module) => {
      if (!cancelled) {
        setAnimationData(getAnimationData(module));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [animationData, loadAnimationData, shouldLoad]);

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
