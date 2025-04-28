import React, { ReactNode } from 'react'
import { Tooltip } from 'antd'
import Link from 'next/link'
import { TooltipPlacement } from 'antd/es/tooltip'

interface IProps {
  title: string
  link?: string | undefined
  placement?: TooltipPlacement | undefined
  max_length?: number
  children?: ReactNode
}

const ProgressTooltip = ({
  title,
  link,
  placement,
  max_length,
  children,
}: IProps) => {
  const isLongTitle = max_length
    ? title?.length > max_length
    : title?.length > 40

  const renderTooltipContent = () => (
    <div className="menu-item fs-7">
      <div className="menu-link p-0 text-gray-600">
        {title}
        {children}
      </div>
    </div>
  )

  return (
    <>
      {isLongTitle ? (
        <Tooltip
          arrow
          title={renderTooltipContent()}
          color="#ffffff"
          placement={placement ?? 'top'}
        >
          <Link href={link ?? ''} passHref>
            <a
              className={`text-gray-800 ${link ? 'text-hover-primary' : ''} sapp-text-truncate-1`}
            >
              {title}
              {children}
            </a>
          </Link>
        </Tooltip>
      ) : (
        <Link href={link ?? ''} passHref>
          <a
            className={`text-gray-800 ${link ? 'text-hover-primary' : ''} sapp-text-truncate-1`}
          >
            {title}
            {children}
          </a>
        </Link>
      )}
    </>
  )
}

export default ProgressTooltip
