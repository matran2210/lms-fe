import React from 'react'
import Part from './Part'
import PartMiddleTest from './PartFailed'
import { ANIMATION } from 'src/constants'
import { IMyCourseDetail } from 'src/type/courses'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'

const CourseParts = ({
  courses,
  class_user_id,
  lastElementRef,
}: {
  courses: IMyCourseDetail[] | undefined
  class_user_id?: string
  lastElementRef: (node: HTMLDivElement) => void
}) => {
  return (
    <div
      className={`${
        isEmpty(courses)
          ? 'flex justify-center min-h-[calc(100vh-15rem)] items-center'
          : 'grid 2xl-min:grid-cols-3 grid-cols-2 gap-6 mb-10'
      }`}
    >
      {!isEmpty(courses) ? (
        courses?.map((coursePart, index: number) => {
          return (
            <div
              key={coursePart?.id}
              className={`item bg-white p-[30px] shadow-sidebar flex flex-col aspect-h-16 h-[412px] justify-between`}
              ref={lastElementRef}
              data-aos={ANIMATION.DATA_AOS}
            >
              {['MID_TERM_TEST', 'FINAL_TEST'].includes(
                coursePart?.course_section_type,
              ) ? (
                <PartMiddleTest
                  key={index}
                  coursePart={coursePart}
                  class_user_id={class_user_id}
                />
              ) : (
                <Part key={index} course={coursePart} />
              )}
            </div>
          )
        })
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default CourseParts
