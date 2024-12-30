import Course from './Course'
import { ICourse } from 'src/type/courses'
import React from 'react'
import NoData from 'src/common/NoData'
import { isEmpty } from 'lodash'
import { Skeleton } from 'antd'

interface CoursesProps {
  courses: ICourse[]
  lastElementRef: (node: HTMLDivElement) => void
  refetch: () => void
  isFetching: boolean
  isFetchingNextPage: boolean
}

const CoursesList: React.FC<CoursesProps> = ({
  courses,
  lastElementRef,
  refetch,
  isFetching,
  isFetchingNextPage,
}) => {
  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="mb-6 grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3 xl-max:px-6">
        {Array(9)
          .fill([])
          .map((_, index) => (
            <div
              className={`item flex w-full flex-col bg-white p-7.5 shadow-sidebar`}
              key={index}
            >
              <div className={`flex min-h-352 flex-col`}>
                <Skeleton />
                <Skeleton.Button className="mt-auto self-end" />
              </div>
            </div>
          ))}
      </div>
    )
  }
  return (
    <>
      {!isEmpty(courses) && (
        <div
          className="mb-6 grid gap-6 md:grid-cols-2 xl-max:px-6 2xl:grid-cols-3"
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
