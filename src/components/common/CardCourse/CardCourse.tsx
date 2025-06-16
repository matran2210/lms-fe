import React from 'react'
import { EAttemptStatus } from 'src/constants/attempt'
import Badge from '../Badge/Badge'
import Tooltip from 'src/common/Tooltip'
import { truncateString } from '@utils/index'
import clsx from 'clsx'

const mappingBadgeFromStatus: Partial<
  Record<EAttemptStatus, { badge: string; className: string }>
> = {
  [EAttemptStatus.IN_PROGRESS]: {
    badge: 'In Progress',
    className: 'bg-warning-50 text-warning',
  },
  [EAttemptStatus.SUBMITTED]: {
    badge: 'Finished',
    className: 'bg-success-50 text-success',
  },
}

const CardCourse = ({
  children,
  title,
  attemptStatus,
  footer,
  ref,
  disabledTitle = false,
  handleClickTitle,
  hideBadge = false,
  badgeCode,
  classNameTitle = 'mb-6 mt-3',
}: {
  children: React.ReactNode
  title: string
  attemptStatus?: EAttemptStatus
  footer?: React.ReactNode
  ref?: React.RefObject<HTMLDivElement>
  disabledTitle?: boolean
  handleClickTitle?: () => void
  hideBadge?: boolean
  badgeCode: {
    badge: string
    className: string
  }
  classNameTitle?: string
}) => {
  return (
    <div className="rounded-xl bg-white p-8 shadow-card" ref={ref}>
      {!hideBadge && (
        <Badge
          {...(attemptStatus
            ? mappingBadgeFromStatus[attemptStatus]!
            : badgeCode
              ? badgeCode
              : {
                  badge: 'Take your Test',
                  className: 'bg-info-50 text-info',
                })}
        />
      )}
      <h2
        className={clsx(
          classNameTitle,
          'line-clamp-2 h-16 cursor-pointer text-2xl font-medium',
          {
            'text-gray-300': disabledTitle,
            'text-gray-800': !disabledTitle,
          },
        )}
        onClick={handleClickTitle}
      >
        <Tooltip title={title} showTooltip={(title as string)?.length > 60}>
          {truncateString(title, 60)}
        </Tooltip>
      </h2>
      {children}
      {/* card footer */}
      {footer}
      {/* card footer */}
    </div>
  )
}

export default CardCourse
