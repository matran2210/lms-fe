import React, { useState } from 'react'
import Part from './Part'
import PartFailed from './PartFailed'

interface CoursesPartsProps {
  courses: any[]
}

const CourseParts = ({ courses }: CoursesPartsProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {courses.map((coursePart, index) => (
        <div
          key={index}
          className={`item bg-white p-[30px] shadow-sidebar flex flex-col`}
        >
          <Part
            key={index}
            name={coursePart.name}
            des={coursePart.des}
            progressText={coursePart.progressText}
            progressTimeStatus={coursePart.progressTimeStatus}
            progressIconType={coursePart.progressIconType}
            buttonText={coursePart.buttonText}
            percentage={coursePart.percentage}
            pass={true}
          />
        </div>
      ))}
    </div>
  )
}

export default CourseParts
