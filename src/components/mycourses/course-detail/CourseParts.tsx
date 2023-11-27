import React, { useState } from 'react'
import Part from './Part'
import PartFailed from './PartFailed'

interface CoursesPartsProps {
  courseParts: any[]
}

const CourseParts = ({ courseParts }: CoursesPartsProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {courseParts.map((coursePart, index) => (
        <div
          key={index}
          className={`item bg-white p-[30px] shadow-sidebar flex flex-col`}
        >
          {coursePart.pass ? (
            <Part
              key={index}
              name={coursePart.name}
              path={coursePart.path}
              des={coursePart.des}
              progressText={coursePart.progressText}
              progressTimeStatus={coursePart.progressTimeStatus}
              progressIconType={coursePart.progressIconType}
              buttonText={coursePart.buttonText}
              percentage={coursePart.percentage}
              pass={true}
            />
          ) : (
            <PartFailed
              key={index}
              name={coursePart.name}
              path={coursePart.path}
              timeAllow={coursePart.timeAllow}
              attempType={coursePart.attempType}
              buttonText={coursePart.buttonText}
              pass={false}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default CourseParts
