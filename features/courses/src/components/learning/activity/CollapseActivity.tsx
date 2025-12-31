import { CollapseArrowIcon } from "@lms/assets";
import { useFeature } from "@lms/contexts";
import { EAttemptStatus, GRADE_STATUS, GRADING_METHOD, QuizActivity, Results } from "@lms/core";
import { useSappPaging } from "@lms/hooks";
import { isQuizExpired } from "@lms/utils";
import { Collapse } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import TableListQuizInActivity from "./TableListQuizInActivity";
import ModalActionTest from "./ModalActionTest";

interface CollapseActivityProps {
  resultData: Results;
}

const CollapseActivity = ({ resultData }: CollapseActivityProps) => {
  const { courseApi, router, params, query } = useFeature();
  const [activeKey, setActiveKey] = useState<string | string[]>([]);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);
  const [open, setOpen] = useState<{ status: boolean; data: QuizActivity | null }>({
    status: false,
    data: null
  })

  const handleChange = (key: string | string[]) => {
    setActiveKey(key);
    // Chỉ gọi API khi collapse được mở và chưa có data
    if (Array.isArray(key) && key.includes("activity") && !hasDataLoaded) {
      setHasDataLoaded(true);
    } else if (
      typeof key === "string" &&
      key === "activity" &&
      !hasDataLoaded
    ) {
      setHasDataLoaded(true);
    }
  };
  const openInNewTab = ({ url, isNewTab = true }: { url: string, isNewTab?: boolean }) => {
    if (isNewTab) {
      if (typeof window === "undefined") return;
      window.open(url, "_blank");
    } else {
      router.push(url);
    }
  };

  const handleCheckQuizAttempt = (data: QuizActivity) => {
    let isExpired = false
    if (data?.quiz_timed) {
      isExpired = isQuizExpired(
        new Date(data?.attempts?.[0]?.started_at),
        data?.quiz_timed,
      )
    }

    const isContinueAttempt = data?.attempts?.[0]?.status === EAttemptStatus.IN_PROGRESS
    if (isContinueAttempt && !isExpired) {
      localStorage.setItem(
        'quizAttempt',
        JSON.stringify({
          id: data?.attempts?.[0]?.id,
          number_of_attempts:
            data?.attempts?.[0]?.number_of_attempts,
          is_limited: data?.is_limited,
          quiz_timed: data?.quiz_timed,
          created_at: data?.attempts?.[0]?.started_at,
        }),
      )
    } else {
      localStorage.removeItem('quizAttempt')
    }
  }
  const handleOpenTest = (record: QuizActivity) => {
    handleCheckQuizAttempt(record)
    openInNewTab({
      url: `/test/${record?.id}?class_user_id=${resultData?.class_user_id}`,
      isNewTab: false
    });
  }
  const handleViewActivity = (record: QuizActivity) => {
    if (!record?.id) return;

    const courseId = params?.id || query.courseId as string;
    const quiz = record;
    const attempt = quiz?.attempts?.[0];
    // Logic điều hướng theo yêu cầu:
    // 1. Bài Quiz chấm điểm (tính trọng số) nhưng chấm tự động hoặc bài Quiz không chấm điểm: màn Activity detail
    // 2. Bài Quiz chấm điểm và chấm bằng tay nhưng chưa chấm xong: /quiz/your-answers-detail
    // 3. Bài Quiz chấm điểm và chấm bằng tay đã chấm xong: /quiz/quiz-result

    // Case 1: Quiz không chấm điểm hoặc chấm tự động
    if (!quiz.is_graded || quiz.grading_method === GRADING_METHOD.AUTO) {
      // Điều hướng đến màn Activity detail
      if (record.activity_id) {
        openInNewTab({
          url: `/courses/${courseId}/activity/${record.activity_id}?tabId=${record?.tab_id}`
        }
        );
      } else {
        if (record?.attempts) {
        if (
          record?.attempts?.[0]?.status === EAttemptStatus.IN_PROGRESS
        ) {
          // handleOpenTest(record)
          setOpen({
            status: true,
            data: record
          })
        } else {
          openInNewTab({ url: `/courses/test/test-result/${record?.attempts?.[0]?.id}`, });
        }
      } else {
        handleOpenTest(record)
      }
        // handleOpenTest(record)
      }
      return;
    }

    // Case 2 & 3: Quiz chấm điểm và chấm bằng tay (MANUAL)
    if (quiz.is_graded && quiz.grading_method === GRADING_METHOD.MANUAL) {
      if (
        attempt?.grading_status === GRADE_STATUS.AWAITING_GRADING ||
        attempt?.grading_status === GRADE_STATUS.IN_REVIEW ||
        attempt?.grading_status === GRADE_STATUS.REGRADING
      ) {
        // Case 2: Chưa chấm xong - điều hướng đến your-answers-detail
        openInNewTab({ url: `/courses/quiz/your-answers-detail/${attempt.id}` });
        return;
      }

      if (attempt?.grading_status === GRADE_STATUS.FINISHED_GRADING) {
        // Case 3: Đã chấm xong - điều hướng đến quiz-result
        openInNewTab({ url: `/courses/quiz/quiz-result/${attempt.id}?courseId=${courseId}`, });
        return;
      }

      // Fallback: Nếu chưa có attempt hoặc grading_status không xác định
      if (record.activity_id) {
        openInNewTab({ url: `/courses/${courseId}/activity/${record.activity_id}?tabId=${record?.tab_id}`, });
      } else {
        // handleOpenTest(record)
        if (record?.attempts) {
          if (
            record?.attempts?.[0]?.status === EAttemptStatus.SUBMITTED
          ) {
            if (
              record?.attempts?.[0]?.grading_status ===
              GRADE_STATUS.FINISHED_GRADING
            ) {
              openInNewTab({ url: `/courses/test/test-result/${record?.attempts?.[0]?.id}`, });
            } else {
              openInNewTab({ url: `/courses/test/your-answers-detail/${record?.attempts?.[0]?.id}`, });
            }
          } else if (
            record?.attempts?.[0]?.status ===
            EAttemptStatus.IN_PROGRESS
          ) {
            handleOpenTest(record)
          } else if (
            record?.attempts?.[0]?.status ===
            EAttemptStatus.UN_SUBMITTED
          ) {
            openInNewTab({ url: `/courses/test/test-result/${record?.attempts?.[0]?.id}`, });
          }
        } else {
          handleOpenTest(record)
        }
      }
      return;
    }
  };
  const {
    data: classSectionTest,
    isLoading,
    pagination,
    setPagination,
    handleChangeParams,
  } = useSappPaging({
    uniqueKey: `course-results-${resultData?.id}`, // Unique key cho mỗi section
    queryFn: () => {
      return courseApi?.getCourseResults!(params?.courseId || query.courseId as string, {
        class_id: query.classId as string,
        section_id: resultData?.id,
        page_index: pagination.current,
        page_size: pagination.pageSize,
      });
    },
    params: {
      courseId: params?.courseId || query.courseId,
      classId: query.classId,
      sectionId: resultData?.id,
    },
    enabled: hasDataLoaded, // Chỉ gọi API khi collapse được mở
  });

  // Cập nhật total records nếu API không trả về metadata
  useEffect(() => {
    if (classSectionTest?.data?.data && !pagination.total) {
      setPagination((prev) => ({
        ...prev,
        total: classSectionTest?.data?.data?.length || 0,
      }));
    }
  }, [classSectionTest, pagination.total, setPagination]);
  const getItemsActivity = [
    {
      key: "activity",
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
  ];
  return (
    <>
    <Collapse
      className="rounded-xl bg-white p-0 py-1 shadow-small md:p-2 md:py-3"
      bordered={false}
      expandIconPosition="end"
      activeKey={activeKey}
      onChange={handleChange}
      expandIcon={({ isActive }) => (
        <CollapseArrowIcon
          className={clsx({ "-rotate-180": isActive })}
          selected={isActive}
        />
      )}
      items={getItemsActivity}
    />

      {open.status && open.data && <ModalActionTest
        open={open.status}
        setOpen={(data: boolean) => setOpen({ status: data, data: null })}
        title={resultData?.name}
        data={{...resultData, quiz: open.data}}
        class_user_id={resultData?.class_user_id}
      />}
    </>
    
  );
};

export default CollapseActivity;
