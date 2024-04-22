import Course from './Course'
import { ICourseAll } from 'src/type/courses'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface CoursesProps {
  courses: ICourseAll
  setData: Dispatch<SetStateAction<ICourseAll>>
  setLoading: Dispatch<SetStateAction<boolean>>
}

const CoursesList: React.FC<CoursesProps> = ({
  courses,
  setData,
  setLoading,
}) => {
  return (
    <>
      {courses?.courses?.length > 0 && (
        <div className="grid 2xl-min:grid-cols-3 grid-cols-2 gap-6 mb-6 xl-max:px-6">
          {courses?.courses?.map((course, index: number) => (
            <Course
              key={index}
              course={course}
              index={index}
              setData={setData}
              setLoading={setLoading}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default CoursesList
