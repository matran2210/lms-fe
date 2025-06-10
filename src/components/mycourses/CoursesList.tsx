import SAPPBadge from '@components/base/Badge/SAPPBadge'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import { Skeleton } from 'antd'
import { isEmpty } from 'lodash'
import Image from 'next/image'
import React from 'react'
import Alarm from 'src/assets/images/alarm.svg'
import AcademicCap from 'src/assets/images/square-academic-cap.svg'
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
      <div className="mb-6 grid w-full gap-6 max-[1199px]:px-6 md:grid-cols-2 xl:grid-cols-3">
        {Array(9)
          .fill([])
          .map((_, index) => (
            <div
              className={`item flex w-full flex-col bg-white p-[30px] shadow-sidebar`}
              key={index}
            >
              <div className={`flex min-h-[352px] flex-col`}>
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
      {!isEmpty(courses) && !guideIsActive ? (
        <div className="mb-6 grid gap-6 max-[1199px]:px-6 md:grid-cols-2 2xl:grid-cols-3">
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
        <div className=" mb-6 grid gap-6 max-[1199px]:px-6 md:grid-cols-2 2xl:grid-cols-3">
          {guideIsActive && (
            <div className="item flex flex-col rounded-xl bg-white p-8 text-[#1C274C] shadow-sidebar">
              <SAPPBadge label="ACCA" type="info" className="font-bold" />

              <div className="name-course mb-4 mt-3 text-2xl font-medium">
                Certificate in International Financial Reporting
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={AcademicCap}
                    alt="Square Academic Cap"
                    width={21}
                    height={21}
                  />
                  <span className="font-medium ">CMA342023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={Alarm}
                    alt="Square Academic Cap"
                    width={21}
                    height={21}
                  />
                  <span className="font-medium">30 days left</span>
                </div>
              </div>
              <p className="py-8">
                An introduction to ethics and its role in the investment
                profession. We examine the CFA Institute Code of Ethics
              </p>
              <div className="progress mb-6 h-8 text-[#1C274C]">
                <div className="info mb-2 flex items-center justify-between">
                  <div className="text flex items-center">
                    <Icon type={'like'} className={` relative`} />
                    <p className={`font-mediumml-px text-medium-sm pl-2`}>
                      {'Ready to learn'}
                    </p>
                  </div>
                  <div className="number">
                    <p className={`text-medium-sm font-medium `}>0 %</p>
                  </div>
                </div>
                <div className="progressbar h-[6px] bg-[#F1F1F1]">
                  <div
                    className={`progress-percentage h-[6px] w-0 bg-primary`}
                  />
                </div>
              </div>
              <ButtonSecondary title={'Active'} className="ml-auto" />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default CoursesList
