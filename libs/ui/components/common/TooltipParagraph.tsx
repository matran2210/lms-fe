import React, { useState } from 'react'
import Tooltip from './Tooltip'
import { Typography } from 'antd'
import type { ParagraphProps } from 'antd/es/typography/Paragraph'
const { Paragraph } = Typography

const TooltipParagraph: React.FC<ParagraphProps> = ({
  children,
  ellipsis,
  ...props
}) => {
  const [truncated, setTruncated] = useState(false)
  const isString = typeof children === 'string' || typeof children === 'number'

  const effectiveEllipsis =
    typeof ellipsis === 'object'
      ? { ...ellipsis, onEllipsis: setTruncated }
      : { onEllipsis: setTruncated }

  const paragraph = (
    <Paragraph {...props} ellipsis={effectiveEllipsis} className="!mb-0 text-[#27272a]">
      <>{children}</>
    </Paragraph>
  )

  return truncated && isString ? (
    <Tooltip title={children}>{paragraph}</Tooltip>
  ) : (
    paragraph
  )
}

export default TooltipParagraph
