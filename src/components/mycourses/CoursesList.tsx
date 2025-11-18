import ButtonSecondary from '@components/base/button/ButtonSecondary'
import CardCourse from '@components/common/CardCourse/CardCourse'
import Icon, { CourseTimeIcon, GraduationCapIcon } from '@components/icons'
import Tooltip from 'src/common/Tooltip'
import { clearStylesHtml } from '@utils/index'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import React from 'react'
import { useAppSelector } from 'src/redux/hook'
import { ICourse } from 'src/type/courses'
import Course from './Course'
import NoCoursesAvailable from 'src/common/NoCoursesAvailable'

interface CoursesProps {
  courses: ICourse[]
  lastElementRef: (node: HTMLDivElement) => void
  refetch: () => void
  isFetching: boolean
  isFetchingNextPage: boolean
  guideIsActive?: boolean
  isTeacher?: boolean
}

const CoursesList: React.FC<CoursesProps> = ({
  courses,
  lastElementRef,
  refetch,
  isFetching,
  isFetchingNextPage,
  guideIsActive,
  isTeacher = false,
}) => {
  const { status: guideStatus, step: guideStep } = useAppSelector(
    (state) => state.userGuideReducer,
  )
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
                  <div className="h-6 w-3/4 animate-pulse rounded-md bg-skeleton"></div>
                  <div className="h-5 w-1/2 animate-pulse rounded-md bg-skeleton"></div>
                  <div className="h-36 w-full animate-pulse rounded-md bg-skeleton"></div>
                </div>
                {/* Skeleton button */}
                <div className="mt-auto self-end">
                  <div className="h-8 w-24 animate-pulse rounded-md bg-skeleton"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  if (isEmpty(courses) && !guideIsActive) return <NoCoursesAvailable />

  return (
    <>
      {!isEmpty(courses) && !guideIsActive ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {courses?.map((course, index: number) => (
            <Course
              key={index}
              course={course}
              index={index}
              lastElementRef={lastElementRef}
              refetch={refetch}
              isTeacher={isTeacher}
            />
          ))}
        </div>
      ) : (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {guideIsActive && (
            <CardCourse
              title="Certificate in International Financial Reporting"
              classNameTitle="mb-4 line-clamp-2 sm:h-12 md:h-14"
              hideBadge
              classNameCard={clsx('lg:h-[434px] md:h-[390px] h-[312px]', {
                'z-50': guideStatus && guideStep === 6,
              })}
            >
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCapIcon className="h-5 w-5 md:h-[1.25rem] md:w-[1.25rem]" />
                      <div className="text-xs font-semibold text-icon md:text-sm">
                        <Tooltip title="CMA342023" showTooltip={false}>
                          CMA342023
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="mr-1 text-icon">
                        <CourseTimeIcon className="h-5 w-5 md:h-[1.25rem] md:w-[1.25rem]" />
                      </div>
                      <div className="text-xs font-medium text-icon md:text-sm">
                        30
                      </div>
                      <div className="text-gray-500 text-xs font-normal md:text-sm">
                        days left
                      </div>
                    </div>
                  </div>
                  <div className="des my-4 line-clamp-3 text-ellipsis leading-snug md:mb-8 md:mt-6 md:line-clamp-5">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: clearStylesHtml(
                          'An introduction to ethics and its role in the investment profession. We examine the CFA Institute Code of Ethics',
                        ),
                      }}
                      className="text-sm font-normal text-gray-800 md:text-base"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="progress mb-6">
                    <div className="info mb-1.5 flex items-center justify-between">
                      <div className="text flex items-center">
                        <Icon type="like" className="relative text-[#050505]" />
                        <p className="ml-px pl-2 text-sm font-normal text-gray-800">
                          Ready to learn
                        </p>
                      </div>
                      <div className="number">
                        <p className="text-sm font-normal text-[#050505]">0%</p>
                      </div>
                    </div>
                    <div className="progressbar h-[6px] rounded-[100px] bg-gray-200">
                      <div
                        className="progress-percentage h-[6px] rounded-[100px] bg-primary"
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>
                  <div className={clsx('action flex items-center justify-end')}>
                    <ButtonSecondary
                      full
                      size="small"
                      title="Resume"
                      className="w-full md:w-[84px]"
                    />
                  </div>
                </div>
              </div>
            </CardCourse>
          )}
        </div>
      )}
    </>
  )
}

export default CoursesList
