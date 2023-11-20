import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Course {
  name: string
  path: string
  className: string
  time: number
  des: string
  progress: string
  percentage: number
  changeExam: string
  buttonText: string
}

interface CoursesProps {
  courses: Course[]
}

const Courses: React.FC<CoursesProps> = ({ courses }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <div key={index} className="item bg-white">
          <div className="name-course">
            <Link href={`/courses/my-course/${course.path}`}>
              {course.name}
            </Link>
          </div>
          <div className="flex justify-between">
            <div className="name-class">
              Class:
              <span>{course.className}</span>
            </div>
          </div>
          <div className="time-class">
            {course.time}
            {course.time == 0 ? ' day left' : ' days left'}
          </div>
          <div className="des">
            <p>{course.des}</p>
          </div>
          <div className="progressbar"></div>
          <div className="action"></div>
        </div>
      ))}
    </div>
  )
}

export default Courses
