import Course from './Course'
import { ICourse } from 'src/type/courses'
import React from 'react'
import NoData from 'src/common/NoData'
import { isEmpty } from 'lodash'

interface CoursesProps {
  courses: ICourse[]
  // setData: Dispatch<SetStateAction<ICourseAll>>
  // setLoading: Dispatch<SetStateAction<boolean>>
  lastElementRef: (node: HTMLDivElement) => void
  refetch: () => void
}

const CoursesList: React.FC<CoursesProps> = ({
  courses,
  lastElementRef,
  refetch,
}) => {
  return (
    <>
      {!isEmpty(courses) && (
        <div
          className="mb-6 grid grid-cols-2 gap-6 xl-max:px-6 2xl-min:grid-cols-3"
          // data-aos={ANIMATION.DATA_AOS}
        >
          {courses?.map((course, index: number) => (
            <Course
              key={index}
              course={course}
              index={index}
              lastElementRef={lastElementRef}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default CoursesList
