import React from 'react'
import Course from './Course'
import { ICourseAll } from 'src/type/courses'

interface CoursesProps {
  courses: ICourseAll
}

const CoursesList: React.FC<CoursesProps> = ({ courses }) => {
  return (
    <div className="grid 2xl-min:grid-cols-3 grid-cols-2 gap-6 mb-6 xl-max:px-6">
      {courses?.courses?.map((course, index: number) => (
        <div
          key={index}
          className={`item bg-white p-[30px] shadow-sidebar flex flex-col`}
        >
          <Course course={course} />
        </div>
      ))}
    </div>
  )
}

export default CoursesList
