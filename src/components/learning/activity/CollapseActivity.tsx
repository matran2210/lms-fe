import { CollapseArrowIcon } from '@assets/icons'
import { Collapse } from 'antd'
import React, { useState, useEffect } from 'react'
import TableListQuizInActivity from './TableListQuizInActivity'
import { ITestQuizProps } from 'src/type/results'
import clsx from 'clsx'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import useSappPaging from 'src/hooks/useSappPaging'
import { CoursesAPI } from '@pages/api/courses'
import router from 'next/router'

const CollapseActivity = ({
  resultData,
  // handleViewResult,
  // getScore,
  // lastElementRef,
}: any) => {
  // }: ITestQuizProps) => {
  // const { isMobileView } = useTailwindBreakpoint()
  const [activeKey, setActiveKey] = useState<string | string[]>(['activity'])

  // if (!resultData) return null

  const handleChange = (key: string | string[]) => {
    setActiveKey(key)
  }
  // const handleViewActivity = () => {
  //   // handleViewResult(resultData[0])
  // }
  const {
    data: classSectionTest,
    isLoading,
    pagination,
    setPagination,
    handleChangeParams,
  } = useSappPaging({
    uniqueKey: `course-results-${resultData?.id}`, // Unique key cho mỗi section
    queryFn: () => {
      return CoursesAPI.getCourseResults(router.query.courseId as string, {
        class_id: router.query.classId as string,
        section_id: resultData?.id,
        page_index: pagination.current,
        page_size: pagination.pageSize,
      })
    },
    params: {
      courseId: router.query.courseId,
      classId: router.query.classId,
      sectionId: resultData?.id,
    },
  })

  // Cập nhật total records nếu API không trả về metadata
  useEffect(() => {
    if (classSectionTest?.data?.data && !pagination.total) {
      setPagination((prev) => ({
        ...prev,
        total: classSectionTest?.data?.data?.length || 0,
      }))
    }
  }, [classSectionTest, pagination.total, setPagination])
  const getItemsActivity = [
    {
      key: 'activity',
      label: (
        <div className="flex flex-col gap-2">
          <div className="text-base font-semibold leading-[27px] text-gray-800 md:text-lg">
            {resultData?.name}
          </div>
        </div>
      ),
      children: (
        <div className="">
          <TableListQuizInActivity
            data={classSectionTest?.data?.data}
            pagination={pagination}
            setPagination={setPagination}
            handleChangeParams={handleChangeParams}
            loading={isLoading}
            // handleViewActivity={handleViewActivity}
            // getScore={getScore ?? (() => '-')}
          />
        </div>
      ),
    },
  ]
  return (
    <Collapse
      className="bg-white shadow-small"
      // ref={lastElementRef}
      bordered={false}
      expandIconPosition="end"
      activeKey={activeKey}
      onChange={handleChange}
      expandIcon={({ isActive }) => (
        <CollapseArrowIcon
          className={clsx({ '-rotate-180': isActive })}
          selected={isActive}
        />
      )}
      items={getItemsActivity}
      // className={`learning-activity-collapse rounded-xl bg-white p-4 shadow-small md:p-6 hover:${
      //   Array.isArray(activeKey) && activeKey.includes('activity')
      //     ? 'bg-white'
      //     : 'bg-primary-50'
      // }`}
    />
  )
}

export default CollapseActivity
