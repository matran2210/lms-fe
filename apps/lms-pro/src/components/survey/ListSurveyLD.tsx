import {
  ArrowLeft,
  ArrowRightIcon,
  IconBuildingModify,
  PaginationDotIcon,
} from '@lms/assets'
import { ECourseProgram, ISurveyCustom } from '@lms/core'
import { SappModalV3 } from '@lms/ui'
import { onLinkSocial } from '@lms/utils'
import clsx from 'clsx'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CoursesAPI } from 'src/api/courses'
import { Tabs, Tooltip } from 'antd'
import { isEmpty } from 'lodash'

const ListSurveyLD = ({ listSurvey }: { listSurvey?: ISurveyCustom[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
//   const [currentSurvey, setCurrentSurvey] = useState<ISurveyCustom>()
  const currentSurvey = listSurvey?.[currentIndex]
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
    if (!isEmpty(listSurvey)) {
    //   setCurrentSurvey(listSurvey?.[0])
    }
  }, [listSurvey])
  return (
    <>
      {' '}
      {listSurvey && listSurvey?.length > 0 && (
        <div
          className={clsx(
            'learning-act-tab-pagination mb-6 mt-8 flex items-center justify-center gap-4 md:gap-8',
            // {
            //   hidden: focusOnlyQuiz.open || focusOnlyDiscussion,
            // },
          )}
        >
          <Tooltip title="Previous Survey" trigger={['hover']}>
            <button
              className={clsx('tab-pagination', {
                // disabled: !getPreviousTabId(),
              })}
              // disabled={!getPreviousTabId()}
              // onClick={() => {
              //   handleChangeTab(courseId as string, getPreviousTabId() || '')
              //   trackGAEvent('Click Button Previous Tab Activity')
              // }}
              onClick={handlePrev}
            >
              <ArrowLeft />
            </button>
          </Tooltip>
          <div className="flex items-center justify-between gap-3">
            {listSurvey.map((tab, index) => (
              <span
                key={tab.id}
                className={clsx('cursor-pointer text-[#D9D9D9]', {
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
                // disabled: !getNextTabId(),
              })}
              // disabled={!getNextTabId()}
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
