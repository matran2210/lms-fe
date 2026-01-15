"use client"
import { EmptyCourseProps } from 'src/type/courses-3-level'
import { EmptyCoursesIcon } from '../icons'

export default function EmptyCourses({
  description = 'Nothing here! Get a Short Couse to start learning.',
}: EmptyCourseProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <EmptyCoursesIcon />
      <div className="pt-4 text-gray">{description}</div>
    </div>
  )
}
