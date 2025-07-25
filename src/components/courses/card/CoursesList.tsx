import { Skeleton } from 'antd'
import { isEmpty } from 'lodash'
import React from 'react'
import EmptyCourses from '../shared/EmptyCourses'
import { Courses3LevelProps } from 'src/type/courses-3-level/course'
import CourseCard from './CourseCard'

export default function CoursesList({
  courses,
  lastElementRef,
  refetch,
  isFetching,
  isFetchingNextPage,
}: Courses3LevelProps) {
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

  if (isEmpty(courses)) {
    return <EmptyCourses />
  }

  return (
    <>
      {!isEmpty(courses) && (
        <div className="mb-6 grid gap-6 md:grid-cols-2 xl-max:px-4 2xl:grid-cols-3">
          {courses?.map((course, index: number) => (
            <CourseCard
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
