import React from 'react'
import Badge from '../Badge/Badge'
import { EAttemptStatus } from 'src/constants/attempt'
import router from 'next/router'
import SappButton from '@components/base/button/SappButton'
import ButtonSecondary from '@components/base/button/ButtonSecondary'

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
}: {
  children: React.ReactNode
  title: string
  attemptStatus?: EAttemptStatus
  footer?: React.ReactNode
}) => {
  return (
    <div className="rounded-xl bg-white p-8 shadow-card">
      <Badge
        {...(attemptStatus
          ? mappingBadgeFromStatus[attemptStatus]!
          : {
              badge: 'Take your Test',
              className: 'bg-info-50 text-info',
            })}
      />
      <h2 className="text-bw-1 mb-6 mt-3 line-clamp-2 text-2xl font-medium">
        {title}
      </h2>
      {children}
      {/* card footer */}
      {footer}
      {/* card footer */}
    </div>
  )
}

export default CardCourse
