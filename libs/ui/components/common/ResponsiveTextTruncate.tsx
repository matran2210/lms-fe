import useResizeObserver from "@react-hook/resize-observer";
import { TooltipPlacement } from "antd/es/tooltip";
import React, { useEffect, useRef, useState } from "react";
import Tooltip from "./Tooltip";

interface ResponsiveTextTruncateProps {
  text: string;
  isSlash?: boolean;
  isShowTooltip?: boolean;
  maxLength?: number;
  textTooltip?: string;
  placementTooltip?: TooltipPlacement;
}

const ResponsiveTextTruncate: React.FC<ResponsiveTextTruncateProps> = ({
  text,
  isSlash,
  isShowTooltip,
  maxLength,
  textTooltip,
  placementTooltip,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleText, setVisibleText] = useState<string>(text);

  /**
   * Truncates the text to fit within the given width.
   * Adds ellipsis only if the text is truncated.
   * @param text The original text.
   * @param width The maximum width in pixels.
   * @param fontSize The font size in pixels.
   * @returns The truncated text with ellipsis (if needed).
   */
  const truncateText = (
    text: string,
    width: number,
    fontSize: number,
    isSlash: boolean = false,
  ): string => {
    if (!text || width <= 0 || fontSize <= 0) return "";

    const words = text.split(" ");
    let truncatedText = "";

    if (typeof window === "undefined" || typeof document === "undefined") {
      return text;
    }

    const tempElement = document.createElement("span");
    tempElement.style.position = "absolute";
    tempElement.style.visibility = "hidden";
    tempElement.style.fontSize = `${fontSize}px`;
    tempElement.style.whiteSpace = "nowrap";
    tempElement.style.lineHeight = "1";
    tempElement.style.padding = "0";
    tempElement.style.margin = "0";

    document.body.appendChild(tempElement);

    const ellipsisWidth = getEllipsisWidth(fontSize);

    for (const word of words) {
      const testText = truncatedText ? `${truncatedText} ${word}` : word;
      tempElement.textContent = testText;
      const totalWidth = tempElement.offsetWidth + ellipsisWidth;

      if (totalWidth > width) {
        break;
      }

      truncatedText = testText;
    }

    document.body.removeChild(tempElement);

    const finalText = truncatedText.trim();
    if (finalText === text.trim()) return finalText;

    return isSlash ? `${finalText}.../` : `${finalText}...`;
  };

  /**
   * Calculate the approximate width of an ellipsis in pixels.
   * @param fontSize The font size in pixels.
   * @returns The estimated ellipsis width in pixels.
   */
  const getEllipsisWidth = (fontSize: number): number => {
    const tempElement = document.createElement("span");
    tempElement.style.position = "absolute";
    tempElement.style.visibility = "hidden";
    tempElement.style.fontSize = `${fontSize}px`;
    tempElement.style.whiteSpace = "nowrap";
    tempElement.textContent = isSlash ? ".../" : "...";
    document.body.appendChild(tempElement);
    const ellipsisWidth = tempElement.offsetWidth;
    document.body.removeChild(tempElement);
    return ellipsisWidth;
  };

  /**
   * Handles resizing of the container and updates the visible text.
   */
  const handleResize = () => {
    if (containerRef.current) {
      const { offsetWidth } = containerRef.current;
      const fontSize = parseFloat(
        window.getComputedStyle(containerRef.current).fontSize || "14",
      );
      const truncated = truncateText(text, offsetWidth, fontSize);
      setVisibleText(truncated);
    }
  };

  // Attach resize observer
  useResizeObserver(containerRef, handleResize);

  // Ensure text is initially truncated
  useEffect(() => {
    handleResize();
  }, [text]);

  return (
    <div
      ref={containerRef}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis", // Ensure the ellipsis styling is intact
      }}
    >
      {isShowTooltip && textTooltip ? (
        <Tooltip
          title={textTooltip}
          showTooltip={textTooltip?.length > (maxLength ?? 60)}
          placement={placementTooltip}
        >
          {visibleText}
        </Tooltip>
      ) : (
        visibleText
      )}
    </div>
  );
};

export default ResponsiveTextTruncate;
