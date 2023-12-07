import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import Course from './Course'

interface CoursesProps {
  courses: any
}

const CoursesList: React.FC<CoursesProps> = ({ courses }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {courses?.courses?.map((course: any, index: any) => (
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
