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

const CollapseActivity = ({ resultData }: any) => {
  const [activeKey, setActiveKey] = useState<string | string[]>(['activity'])

  const handleChange = (key: string | string[]) => {
    setActiveKey(key)
  }
  const handleViewActivity = (record: any) => {
    if (!record?.id) return
    const courseId = router.query.courseId as string
    if (record.attempts.length) {
      router.push(`/courses/test/test-result/${record.attempts[0].id}`)
    } else {
      if (record.activity_id) {
        router.push(`/courses/${courseId}/activity/${record.activity_id}`)
      } else {
        router.push(
          `/test/${resultData?.id}?class_user_id=${resultData?.class_user_id}`,
        )
      }
    }
  }
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
            handleViewActivity={handleViewActivity}
          />
        </div>
      ),
    },
  ]
  return (
    <Collapse
      className="bg-white shadow-small"
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
    />
  )
}

export default CollapseActivity
