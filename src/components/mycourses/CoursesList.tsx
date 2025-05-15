import SAPPBadge from '@components/base/Badge/SAPPBadge'
import { Skeleton } from 'antd'
import { isEmpty } from 'lodash'
import React from 'react'
import { ICourse } from 'src/type/courses'
import Course from './Course'

interface CoursesProps {
  courses: ICourse[]
  lastElementRef: (node: HTMLDivElement) => void
  refetch: () => void
  isFetching: boolean
  isFetchingNextPage: boolean
  guideIsActive?: boolean
}

const CoursesList: React.FC<CoursesProps> = ({
  courses,
  lastElementRef,
  refetch,
  isFetching,
  isFetchingNextPage,
  guideIsActive,
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
        <div className="mb-6 grid gap-6 md:grid-cols-2 xl-max:px-6 2xl:grid-cols-3">
          {guideIsActive && (
            <div className="flex flex-col rounded-xl bg-white p-8 shadow-sidebar">
              <SAPPBadge label="ACCA" />

              <div className="name-course mb-4 mt-3 text-2xl font-medium text-bw-1">
                Certificate in International Financial Reporting
              </div>

              <div className="flex items-center justify-between">
                <div className="name-class text-medium-sm text-gray-1">
                  Class:
                  <span className="ml-1 font-medium text-bw-1">CMA342023</span>
                </div>
                <div className="time-class mt-1 text-medium-sm text-gray-2">
                  <span>
                    <span className="font-medium text-bw-1">{30}</span>
                    {' days left'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!guideIsActive &&
            courses?.map((course, index: number) => (
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
