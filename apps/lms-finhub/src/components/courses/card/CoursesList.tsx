'use client'
import { isEmpty } from 'lodash'
import EmptyCourses from '../shared/EmptyCourses'
import CourseCard from './CourseCard'
import { Courses3LevelProps } from '@lms/core'

export default function CoursesList({
  courses,
  lastElementRef,
  refetch,
  isFetching,
  isFetchingNextPage,
}: Courses3LevelProps) {
  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="mb-6 grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3 xl-max:px-6">
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="item flex w-full flex-col rounded-xl bg-white p-7.5 shadow-sidebar"
            >
              <div className="flex min-h-[352px] flex-col">
                {/* Skeleton content */}
                <div className="w-full animate-pulse space-y-4">
                  {/* Khối chính */}
                  <div className="h-6 w-3/4 animate-pulse rounded bg-skeleton"></div>
                  <div className="h-5 w-1/2 animate-pulse rounded bg-skeleton"></div>
                  <div className="h-36 w-full animate-pulse rounded bg-skeleton"></div>
                </div>
                {/* Skeleton button */}
                <div className="mt-auto self-end">
                  <div className="h-8 w-24 animate-pulse rounded bg-skeleton"></div>
                </div>
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
        <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
