import React, { forwardRef } from 'react'
import { EAttemptStatus } from 'src/constants/attempt'
import Badge from '../Badge/Badge'
import Tooltip from 'src/common/Tooltip'
import { truncateString } from '@utils/index'
import clsx from 'clsx'
import { ANIMATION } from 'src/constants'

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

const CardCourse = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode
    title: string
    attemptStatus?: EAttemptStatus
    footer?: React.ReactNode
    disabledTitle?: boolean
    handleClickTitle?: () => void
    hideBadge?: boolean
    badgeCode?: {
      badge: string
      className: string
    }
    classNameTitle?: string
    classNameCard?: string
  }
>(
  (
    {
      children,
      title,
      attemptStatus,
      footer,
      disabledTitle = false,
      handleClickTitle,
      hideBadge = false,
      badgeCode,
      classNameTitle = 'mb-6 mt-3',
      classNameCard = '',
    },
    ref,
  ) => {
    return (
      <div
        className={clsx(
          'relative rounded-xl bg-white shadow-card md:p-6 lg:p-8',
          classNameCard,
        )}
        ref={ref}
        data-aos={ANIMATION.DATA_AOS}
      >
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
            'line-clamp-2 cursor-pointer text-2xl font-medium',
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
  },
)

CardCourse.displayName = 'CardCourse'
export default CardCourse
