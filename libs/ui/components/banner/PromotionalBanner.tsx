import Image from "next/image";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useCourseContext } from "@lms/contexts";
import { useTailwindBreakpoint } from "@lms/hooks";
import { CloseIconNote } from "@lms/assets";

const COUNTDOWN_SECONDS = 6 * 60 * 60;
export const linkCdnMktInApp = "https://cdn.sapp.edu.vn/images/fe";
const bannerConfig = {
  desktop: {
    title: "Desktop banner",
    src: `${linkCdnMktInApp}/bg_promotional_banner_desktop.png`,
    width: 1920,
    height: 350,
  },
  mobile: {
    title: "Mobile banner",
    src: `${linkCdnMktInApp}/bg_promotional_banner_mobile.png`,
    width: 343,
    height: 268,
  },
} as const;

// ---------------------------------------------------
// HOOK: Countdown có lưu vào localStorage
// ---------------------------------------------------
const useCountdownLocalStorage = (key: string, seconds: number) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let endTime = localStorage.getItem(key);

    if (!endTime) {
      const newEnd = Date.now() + seconds * 1000;
      localStorage.setItem(key, newEnd.toString());
      endTime = newEnd.toString();
    }

    const END = Number(endTime);

    const tick = () => {
      const diff = Math.max(0, Math.floor((END - Date.now()) / 1000));
      setTimeLeft(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [key, seconds]);

  return timeLeft;
};

// ---------------------------------------------------
// TIME BOX COMPONENT
// ---------------------------------------------------
const TimeBox = ({
  value,
  left,
  isMobileView,
}: {
  value: string;
  left: string;
  isMobileView: boolean;
}) => (
  <div
    className="absolute text-xs font-bold text-white md:text-base xl:text-xl 2xl:text-2xl"
    style={{
      left,
      top: isMobileView ? "38.4%" : "78.4%",
      transform: "translate(-50%, -50%)",
    }}
  >
    {value}
  </div>
);

const PromotionalBanner = () => {
  const { setOpenPopupCTA } = useCourseContext();
  const { isMobileView } = useTailwindBreakpoint();
  const [isShowBanner, setIsShowBanner] = useState(false);

  // Countdown
  const timeLeft = useCountdownLocalStorage(
    "promotional_end_time",
    COUNTDOWN_SECONDS,
  );

  // Banner config
  const config = useMemo(
    () => (isMobileView ? bannerConfig.mobile : bannerConfig.desktop),
    [isMobileView],
  );

  // Validate show banner only first time
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasOpened = localStorage.getItem("openBannerPromotional");
    const isTrialCourse = localStorage.getItem("showPinTrial") === "true";
    if (!hasOpened && isTrialCourse) setIsShowBanner(true);
  }, []);

  const onClose = useCallback(() => {
    setIsShowBanner(false);
    localStorage.setItem("openBannerPromotional", "true");
  }, []);

  const handleUpgrade = () => {
    setOpenPopupCTA({
      lockSection: false,
      ctaUpgrade: true,
      thankYou: false,
      thankYouLater: false,
    });
  };

  if (!isShowBanner) return null;

  // Format time
  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="relative mb-4 lg:mb-0 lg:mt-[10px]">
      <button
        onClick={onClose}
        className="absolute right-2 top-2 z-10 md:right-3"
      >
        <CloseIconNote color="#B6B6B7" />
      </button>

      <div className="relative cursor-pointer" onClick={handleUpgrade}>
        <Image
          src={config.src}
          layout="responsive"
          width={config.width}
          height={config.height}
          alt={config.title}
          priority
          className="rounded-lg"
        />

        <TimeBox
          value={hours}
          left={isMobileView ? "49.5%" : "24.2%"}
          isMobileView={isMobileView}
        />
        <TimeBox
          value={minutes}
          left={isMobileView ? "59%" : "29.2%"}
          isMobileView={isMobileView}
        />
        <TimeBox
          value={seconds}
          left={isMobileView ? "68.3%" : "34.2%"}
          isMobileView={isMobileView}
        />
      </div>
    </div>
  );
};

export default PromotionalBanner;
