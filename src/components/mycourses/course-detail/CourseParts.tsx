import React from 'react'
import Part from './Part'
import PartMiddleTest from './PartFailed'

const CourseParts = ({
  courses,
  class_user_id,
}: {
  courses: any
  class_user_id?: string
}) => {
  return (
    <div className="grid 2xl-min:grid-cols-3 grid-cols-2 gap-6 mb-10">
      {courses?.map((coursePart: any, index: number) => {
        return (
          <div
            key={coursePart?.id}
            className={`item bg-white p-[30px] shadow-sidebar flex flex-col aspect-h-16 h-[412px] justify-between`}
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
              <Part key={index} courses={coursePart} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CourseParts
