import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { IAttempt, ICourseAttemptProps } from 'src/type/courses-3-level'
import { SelectArrow } from '@components/courses/icons'
import { roundNumber } from '@utils/helpers'
import { ClassAPI } from '@pages/api/class'
import { formatTime } from '@components/common/timer'
import { formatNumber } from '@lms/utils'

export default function SectionAttempts({
  class_user_id,
  section,
}: ICourseAttemptProps) {
  const [pageIndex, setPageIndex] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 20
  const [attempts, setAttempts] = useState<IAttempt[]>([])
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(0)

  const hasAttempts = attempts.length > 0
  const selectedAttempt = hasAttempts ? attempts[selectedAttemptIndex] : null

  const fetchResult = async (page: number) => {
    if (class_user_id && section?.quiz?.id && hasMore) {
      try {
        const response = await ClassAPI.getAllResultOfQuiz(
          class_user_id,
          section.quiz.id,
          { page_index: page, page_size: pageSize },
        )

        const newData = response?.data?.data || []

        setAttempts((prev) => [...prev, ...newData])

        if (newData.length < pageSize) {
          setHasMore(false)
        }
      } catch (err) {
        setHasMore(false)
      }
    }
  }

  useEffect(() => {
    fetchResult(1)
  }, [])

  return (
    <div className="flex max-w-[265px] gap-8 border-l border-gray-2 pl-4 md:ml-5 md:justify-between">
      <div className="space-y-2 text-sm leading-5.5 text-bw-15 md:space-y-4 md:text-base md:leading-6">
        <p>Time Spent:</p>
        <p>Latest Result:</p>
        {hasAttempts ? (
          <Select
            value={selectedAttemptIndex}
            onChange={(value) => setSelectedAttemptIndex(value)}
            options={attempts.map((attempt, idx) => ({
              label: `Attempt ${attempt.name}`,
              value: idx,
            }))}
            suffixIcon={<SelectArrow />}
            disabled={!hasAttempts}
            listHeight={150}
            onPopupScroll={(e) => {
              const target = e.target as HTMLElement
              if (
                target.scrollTop + target.offsetHeight >=
                  target.scrollHeight - 10 &&
                hasMore
              ) {
                const nextPage = pageIndex + 1
                setPageIndex(nextPage)
                fetchResult(nextPage)
              }
            }}
          />
        ) : (
          <p>Attempt :</p>
        )}
      </div>
      <div className="space-y-2 text-sm font-medium leading-5.5 text-bw-15 md:space-y-4 md:text-base md:leading-6">
        <p>
          {!!section?.quiz?.attempt?.total_attempt_time
            ? formatTime(section?.quiz?.attempt?.total_attempt_time)
            : '--'}
        </p>
        <p>
          {section?.quiz?.attempt?.score
            ? `${formatNumber(section?.quiz?.attempt?.score)}%`
            : '--'}
        </p>
        <p>
          {hasAttempts ? `${formatNumber(selectedAttempt?.score || 0)}%` : '--'}
        </p>
      </div>
    </div>
  )
}
