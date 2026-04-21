import { ArrowLeft, ArrowRightIcon, PaginationDotIcon } from '@lms/assets'
import { ISurveyCustom } from '@lms/core'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Tooltip } from 'antd'

const ListSurveyLD = ({
  listSurvey,
  onSurveyChange,
}: {
  listSurvey?: ISurveyCustom[]
  onSurveyChange: (id?: string) => void
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSurvey = listSurvey?.[currentIndex]
  const isDisabledNext = currentIndex === (listSurvey?.length || 0) - 1
  const isDisabledPrev = currentIndex === 0

  const handleNext = () => {
    if (listSurvey && currentIndex < listSurvey.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  useEffect(() => {
    onSurveyChange(currentSurvey?.id)
  }, [currentSurvey, onSurveyChange])

  return (
    <>
      {listSurvey && listSurvey?.length > 0 && (
        <div className="learning-act-tab-pagination mb-6 mt-8 flex items-center justify-center gap-4 md:gap-8">
          <Tooltip title="Previous Survey" trigger={['hover']}>
            <button
              className={clsx('tab-pagination', {
                disabled: isDisabledPrev,
              })}
              disabled={isDisabledPrev}
              onClick={handlePrev}
            >
              <ArrowLeft />
            </button>
          </Tooltip>
          <div className="flex items-center justify-between gap-3">
            {listSurvey.map((tab, index) => (
              <span
                key={tab.id}
                className={clsx('cursor-pointer text-gray-300', {
                  '!text-primary': tab.id == currentSurvey?.id,
                })}
                onClick={() => setCurrentIndex(index)}
              >
                <PaginationDotIcon className="h-[10px] w-[10px] shrink-0" />
              </span>
            ))}
          </div>
          <Tooltip title="Next Survey" trigger={['hover']}>
            <button
              className={clsx('tab-pagination', {
                disabled: isDisabledNext,
              })}
              disabled={isDisabledNext}
              onClick={handleNext}
            >
              <ArrowRightIcon />
            </button>
          </Tooltip>
        </div>
      )}
      <div className="text-base font-semibold text-gray-800">
        {currentSurvey?.name}
      </div>
    </>
  )
}

export default ListSurveyLD
