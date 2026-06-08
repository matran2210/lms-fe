import { AnimationImage } from "@lms/assets/images";
import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  {
    ssr: false,
  },
);

const SappLoading = ({ className }: { className?: string }) => {
  return (
    <div
      className={`fixed z-[9999] block h-full w-full bg-white backdrop-blur-[2000px] ${className ?? ""}`}
    >
      <Player
        src={AnimationImage}
        autoplay
        loop
        className="left-0 top-0 z-[9999] max-h-[90px] max-w-[90px] !bg-white backdrop-blur-[2000px]"
        speed={3}
      />
    </div>
  );
};

export default SappLoading;
