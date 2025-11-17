import { CollapseArrowIcon } from '@assets/icons'
import { Collapse } from 'antd'
import React, { useState, useEffect } from 'react'
import TableListQuizInActivity from './TableListQuizInActivity'
import { Results, QuizActivity } from 'src/type/results'
import clsx from 'clsx'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import useSappPaging from 'src/hooks/useSappPaging'
import { CoursesAPI } from '@pages/api/courses'
import router from 'next/router'
import { GRADE_STATUS, GRADING_METHOD } from '@lms/core'

interface CollapseActivityProps {
  resultData: Results
}

const CollapseActivity = ({ resultData }: CollapseActivityProps) => {
  const [activeKey, setActiveKey] = useState<string | string[]>([])
  const [hasDataLoaded, setHasDataLoaded] = useState(false)

  const handleChange = (key: string | string[]) => {
    setActiveKey(key)
    // Chỉ gọi API khi collapse được mở và chưa có data
    if (Array.isArray(key) && key.includes('activity') && !hasDataLoaded) {
      setHasDataLoaded(true)
    } else if (
      typeof key === 'string' &&
      key === 'activity' &&
      !hasDataLoaded
    ) {
      setHasDataLoaded(true)
    }
  }
  const handleViewActivity = (record: QuizActivity) => {
    if (!record?.id) return

    const courseId = router.query.courseId as string
    const quiz = record
    const attempt = quiz?.attempts?.[0]

    // Logic điều hướng theo yêu cầu:
    // 1. Bài Quiz chấm điểm (tính trọng số) nhưng chấm tự động hoặc bài Quiz không chấm điểm: màn Activity detail
    // 2. Bài Quiz chấm điểm và chấm bằng tay nhưng chưa chấm xong: /quiz/your-answers-detail
    // 3. Bài Quiz chấm điểm và chấm bằng tay đã chấm xong: /quiz/quiz-result

    // Case 1: Quiz không chấm điểm hoặc chấm tự động
    if (!quiz.is_graded || quiz.grading_method === GRADING_METHOD.AUTO) {
      // Điều hướng đến màn Activity detail
      if (record.activity_id) {
        router.push(`/courses/${courseId}/activity/${record.activity_id}`)
      } else {
        router.push(
          `/test/${record?.id}?class_user_id=${resultData?.class_user_id}`,
        )
      }
      return
    }

    // Case 2 & 3: Quiz chấm điểm và chấm bằng tay (MANUAL)
    if (quiz.is_graded && quiz.grading_method === GRADING_METHOD.MANUAL) {
      if (
        attempt?.grading_status === GRADE_STATUS.AWAITING_GRADING ||
        attempt?.grading_status === GRADE_STATUS.IN_REVIEW ||
        attempt?.grading_status === GRADE_STATUS.REGRADING
      ) {
        // Case 2: Chưa chấm xong - điều hướng đến your-answers-detail
        router.push(`/courses/quiz/your-answers-detail/${attempt.id}`)
        return
      }

      if (attempt?.grading_status === GRADE_STATUS.FINISHED_GRADING) {
        // Case 3: Đã chấm xong - điều hướng đến quiz-result
        router.push(
          `/courses/quiz/quiz-result/${attempt.id}?courseId=${courseId}`,
        )
        return
      }

      // Fallback: Nếu chưa có attempt hoặc grading_status không xác định
      if (record.activity_id) {
        router.push(`/courses/${courseId}/activity/${record.activity_id}`)
      } else {
        router.push(
          `/test/${record?.id}?class_user_id=${resultData?.class_user_id}`,
        )
      }
      return
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
    enabled: hasDataLoaded, // Chỉ gọi API khi collapse được mở
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
      className="rounded-xl bg-white p-0 py-1 shadow-small md:p-2 md:py-3"
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
