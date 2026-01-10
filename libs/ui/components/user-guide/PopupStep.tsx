import Lottie from "lottie-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { decrement, increment, useFeature } from "@lms/contexts";
import { ButtonPrimary, ButtonText } from "../base";
import { motion } from "framer-motion";
import { GuideOffset, GuidePlacement } from "@lms/core";

type Props = {
  content: string;
  index: number;
  total: number;

  targetId: string;
  placement?: GuidePlacement;
  offset?: number;
  customOffset?: GuideOffset;
  titleButtonNext?: string;
  title?: string;
  handleCancel?: () => void;
  imgSrc?: StaticImageData | object;
  imgType?: "static" | "animation";
  isEnd?: boolean;
};

const PopupStep = ({
  content,
  index,
  total,
  targetId,
  placement = "bottom-center",
  offset = 8,
  titleButtonNext,
  handleCancel,
  title,
  imgSrc,
  isEnd,
  imgType = "animation",
  customOffset = { x: 0, y: 0 },
}: Props) => {
  const isCenterPosition = placement === "center";
  const getPopupPosition = (
    targetId: string,
    placement: GuidePlacement,
    baseOffset: number,
    customOffset?: GuideOffset,
  ) => {
    if (isCenterPosition) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const el = document.querySelector(
      `[data-guide-id="${targetId}"]`,
    ) as HTMLElement | null;

    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let pos: { top: number; left: number; transform: string } | null = null;

    switch (placement) {
      // ===== TOP =====
      case "top-left":
        pos = {
          top: rect.top - baseOffset,
          left: rect.left,
          transform: "translate(0, -100%)",
        };
        break;

      case "top-center":
        pos = {
          top: rect.top - baseOffset,
          left: centerX,
          transform: "translate(-50%, -100%)",
        };
        break;

      case "top-right":
        pos = {
          top: rect.top - baseOffset,
          left: rect.right,
          transform: "translate(-100%, -100%)",
        };
        break;

      // ===== BOTTOM =====
      case "bottom-left":
        pos = {
          top: rect.bottom + baseOffset,
          left: rect.left,
          transform: "translate(0, 0)",
        };
        break;

      case "bottom-center":
        pos = {
          top: rect.bottom + baseOffset,
          left: centerX,
          transform: "translate(-50%, 0)",
        };
        break;

      case "bottom-right":
        pos = {
          top: rect.bottom + baseOffset,
          left: rect.right,
          transform: "translate(-100%, 0)",
        };
        break;

      // ===== LEFT =====
      case "left-top":
        pos = {
          top: rect.top,
          left: rect.left - baseOffset,
          transform: "translate(-100%, 0)",
        };
        break;

      case "left-center":
        pos = {
          top: centerY,
          left: rect.left - baseOffset,
          transform: "translate(-100%, -50%)",
        };
        break;

      case "left-bottom":
        pos = {
          top: rect.bottom,
          left: rect.left - baseOffset,
          transform: "translate(-100%, -100%)",
        };
        break;

      // ===== RIGHT =====
      case "right-top":
        pos = {
          top: rect.top,
          left: rect.right + baseOffset,
          transform: "translate(0, 0)",
        };
        break;

      case "right-center":
        pos = {
          top: centerY,
          left: rect.right + baseOffset,
          transform: "translate(0, -50%)",
        };
        break;

      case "right-bottom":
        pos = {
          top: rect.bottom,
          left: rect.right + baseOffset,
          transform: "translate(0, -100%)",
        };
        break;
    }

    if (!pos) return null;

    return {
      ...pos,
      left: pos.left + (customOffset?.x ?? 0),
      top: pos.top + (customOffset?.y ?? 0),
    };
  };

  const {dispatch} = useFeature();
  const confirmDialogRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);

  const nextStep = () => dispatch?.(increment());
  const previousStep = () => dispatch?.(decrement());

  const handleClose = () => {
    if (confirmDialogRef.current) {
      confirmDialogRef.current.classList.add("animate-jump-out");
      confirmDialogRef.current.classList.add("pointer-events-none");
    }
    document.body.style.removeProperty("padding-right");
    document.body.classList.remove("overflow-hidden");
    handleCancel?.();
  };

  const updatePosition = () => {
    const pos = getPopupPosition(targetId, placement, offset, customOffset);
    if (pos) setStyle(pos);
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [targetId, placement]);

  if (!style) return null;

  return (
    <motion.div
      ref={confirmDialogRef}
      layout={isCenterPosition ? undefined : true}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed z-50 sm:w-[315px] w-[315px] rounded-xl bg-white p-4 text-gray-800 shadow-lg"
      style={style}
    >
      <div>
        <div className={imgSrc ? "mb-4" : undefined}>
          {imgType === "static" &&
          imgSrc &&
          typeof imgSrc === "object" &&
          "src" in imgSrc ? (
            <Image
              src={imgSrc as StaticImageData}
              alt={`Tour guide step ${index} - ${title}`}
              className="rounded-lg"
              layout="responsive"
            />
          ) : null}

          {imgType === "animation" && imgSrc && (
            <Lottie animationData={imgSrc} loop />
          )}
        </div>

        <h6 className="mb-3 text-lg font-bold">{title}</h6>
        <span className="text-base font-normal">{content}</span>
        <div
          className={`mt-3 flex items-center ${
            index === 1 ? "justify-end" : "justify-between"
          }`}
        >
          {isEnd ? (
            <ButtonPrimary
              title="Finish"
              size="small"
              onClick={handleClose}
              className="min-w-[84px]"
            />
          ) : (
            <>
              {index !== 1 && (
                <ButtonText
                  title="Previous"
                  size="small"
                  onClick={previousStep}
                />
              )}
              <ButtonPrimary
                title={titleButtonNext || "Next"}
                className="ml-3 min-w-[84px]"
                size="small"
                onClick={index === total ? handleClose : nextStep}
              />
            </>
          )}
        </div>
        <div className="mt-4 flex justify-center gap-1">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`h-[6px] w-[6px] rounded-full ${
                i + 1 === index ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PopupStep;
