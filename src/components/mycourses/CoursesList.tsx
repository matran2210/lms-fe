import Course from './Course'
import { ICourse } from 'src/type/courses'
import React from 'react'
import NoData from 'src/common/NoData'
import { isEmpty } from 'lodash'
import { ANIMATION } from 'src/constants'

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
      {!isEmpty(courses) ? (
        <div
          className="grid 2xl-min:grid-cols-3 grid-cols-2 gap-6 mb-6 xl-max:px-6"
          data-aos={ANIMATION.DATA_AOS}
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
      ) : (
        <NoData />
      )}
    </>
  )
}

export default CoursesList
