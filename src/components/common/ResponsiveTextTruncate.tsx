import useResizeObserver from '@react-hook/resize-observer'
import { TooltipPlacement } from 'antd/es/tooltip'
import React, { useEffect, useRef, useState } from 'react'
import SappTooltip from 'src/common/SappTooltip'

interface ResponsiveTextTruncateProps {
  text: string
  isSlash?: boolean
  isShowTooltip?: boolean
  maxLength?: number
  textTooltip?: string
  placementTooltip?: TooltipPlacement
}

const ResponsiveTextTruncate: React.FC<ResponsiveTextTruncateProps> = ({
  text,
  isSlash,
  isShowTooltip,
  maxLength,
  textTooltip,
  placementTooltip,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visibleText, setVisibleText] = useState<string>(text)

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
  ): string => {
    const words = text?.split(' ')
    let truncatedText = ''
    const tempElement = document.createElement('span')
    tempElement.style.position = 'absolute'
    tempElement.style.visibility = 'hidden'
    tempElement.style.fontSize = `${fontSize}px`
    tempElement.style.whiteSpace = 'nowrap'
    document.body.appendChild(tempElement)

    const ellipsisWidth = getEllipsisWidth(fontSize)

    for (const word of words) {
      const testText = truncatedText ? `${truncatedText} ${word}` : word
      tempElement.textContent = testText
      if (tempElement.offsetWidth + ellipsisWidth > width) {
        break
      }
      truncatedText = testText
    }

    document.body.removeChild(tempElement)

    // If the text was truncated, add ellipsis
    return truncatedText === text
      ? truncatedText
      : isSlash
        ? `${truncatedText.trim()}.../`
        : `${truncatedText.trim()}...`
  }

  /**
   * Calculate the approximate width of an ellipsis in pixels.
   * @param fontSize The font size in pixels.
   * @returns The estimated ellipsis width in pixels.
   */
  const getEllipsisWidth = (fontSize: number): number => {
    const tempElement = document.createElement('span')
    tempElement.style.position = 'absolute'
    tempElement.style.visibility = 'hidden'
    tempElement.style.fontSize = `${fontSize}px`
    tempElement.style.whiteSpace = 'nowrap'
    tempElement.textContent = isSlash ? '.../' : '...'
    document.body.appendChild(tempElement)
    const ellipsisWidth = tempElement.offsetWidth
    document.body.removeChild(tempElement)
    return ellipsisWidth
  }

  /**
   * Handles resizing of the container and updates the visible text.
   */
  const handleResize = () => {
    if (containerRef.current) {
      const { offsetWidth } = containerRef.current
      const fontSize = parseFloat(
        window.getComputedStyle(containerRef.current).fontSize || '14',
      )
      const truncated = truncateText(text, offsetWidth, fontSize)
      setVisibleText(truncated)
    }
  }

  // Attach resize observer
  useResizeObserver(containerRef, handleResize)

  // Ensure text is initially truncated
  useEffect(() => {
    handleResize()
  }, [text])

  return (
    <div
      ref={containerRef}
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis', // Ensure the ellipsis styling is intact
      }}
    >
      {isShowTooltip && textTooltip ? (
        <SappTooltip
          title={textTooltip}
          showTooltip={textTooltip?.length > (maxLength ?? 60)}
          placement={placementTooltip}
        >
          {visibleText}
        </SappTooltip>
      ) : (
        visibleText
      )}
    </div>
  )
}

export default ResponsiveTextTruncate
