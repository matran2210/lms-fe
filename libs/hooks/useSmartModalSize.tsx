import { Grid } from "antd";
import { useEffect, useState } from "react";

export const useSmartModalSize = () => {
  const screens = Grid.useBreakpoint();
  const [vw, setVw] = useState(window.innerWidth);
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  let baseWidth = 650;
  let baseHeight = 850;

  if (screens.xl) {
    baseWidth = 720;
    baseHeight = 880;
  }

  if (screens.lg) {
    baseWidth = 680;
    baseHeight = 780;
  }

  if (screens.md) {
    baseWidth = 600;
    baseHeight = 680;
  }

  if (screens.sm) {
    baseWidth = Math.min(520, vw * 0.95);
    baseHeight = vh * 0.8;
  }

  const width = Math.min(baseWidth, vw * 0.95);
  const height = Math.min(baseHeight, vh * 0.9);

  return { width, height };
};
