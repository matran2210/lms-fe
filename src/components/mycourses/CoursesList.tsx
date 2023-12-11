import React from 'react'
import Course from './Course'

interface CoursesProps {
  courses: any
}

const CoursesList: React.FC<CoursesProps> = ({ courses }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {courses?.courses?.map((course: any, index: number) => (
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
