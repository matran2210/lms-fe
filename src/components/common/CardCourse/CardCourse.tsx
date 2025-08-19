import React, { forwardRef } from 'react'
import { EAttemptStatus } from 'src/constants/attempt'
import Badge from '../Badge/Badge'
import Tooltip from 'src/common/Tooltip'
import { truncateString } from '@utils/index'
import clsx from 'clsx'
import { ANIMATION } from 'src/constants'
import { LockClosedIcon } from '@assets/icons'

const mappingBadgeFromStatus: Partial<
  Record<EAttemptStatus, { badge: string; className: string }>
> = {
  [EAttemptStatus.NOT_STARTED]: {
    badge: 'Not started',
    className: 'bg-info-50 text-info',
  },
  [EAttemptStatus.UN_SUBMITTED]: {
    badge: 'Not started',
    className: 'bg-info-50 text-info',
  },
  [EAttemptStatus.IN_PROGRESS]: {
    badge: 'In Progress',
    className: 'bg-warning-50 text-warning',
  },
  [EAttemptStatus.SUBMITTED]: {
    badge: 'Submitted',
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
    hideBadge?: boolean
    badgeCode?: {
      badge: string
      className: string
    }
    classNameTitle?: string
    classNameCard?: string
    isLock?: boolean
  }
>(
  (
    {
      children,
      title,
      attemptStatus,
      footer,
      disabledTitle = false,
      hideBadge = false,
      badgeCode,
      classNameTitle = 'mt-2 mb-4 md:mb-6 md:mt-3',
      classNameCard = '',
      isLock = false,
    },
    ref,
  ) => {
    return (
      <div
        className={clsx(
          'border-transparent relative flex flex-col rounded-xl border border-white bg-white p-4 shadow-card transition-shadow duration-300 hover:border-primary hover:shadow-md md:p-6 lg:rounded-2xl lg:p-8',
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
                    badge: 'Not started',
                    className: 'bg-info-50 text-info',
                  })}
          />
        )}
        <div className={clsx('flex justify-between', classNameTitle)}>
          <h2
            className={clsx('line-clamp-2 text-base font-medium md:text-2xl', {
              'text-gray-300': disabledTitle,
              'text-gray-800': !disabledTitle,
            })}
          >
            <Tooltip title={title} showTooltip={(title as string)?.length > 60}>
              {truncateString(title, 60)}
            </Tooltip>
          </h2>
          {isLock && (
            <div>
              <LockClosedIcon />
            </div>
          )}
        </div>

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
