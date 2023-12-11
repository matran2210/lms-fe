import React, { useState } from 'react'
import Part from './Part'
import PartMiddleTest from './PartFailed'

interface CoursesPartsProps {
  courses: any[]
}

const CourseParts = ({ courses }: CoursesPartsProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {courses?.map((coursePart, index) => {
        return (
          <div
            key={index}
            className={`item bg-white p-[30px] shadow-sidebar flex flex-col`}
          >
            {coursePart?.course_section_type === 'MID_TERM_TEST' ? (
              <PartMiddleTest
                key={index}
                timeAllow={coursePart.timeAllow}
                attempType={coursePart.attempType}
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
