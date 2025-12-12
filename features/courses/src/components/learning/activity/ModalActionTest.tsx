import { useFeature } from "@lms/contexts";
import {
    GRADE_STATUS,
    GRADING_METHOD,
    IQuizResultList,
    TEST_TYPE_LABELS
} from "@lms/core";
import { ButtonPrimary, ButtonSecondary, ButtonText } from "@lms/ui";
import { isQuizExpired, trackGAEvent } from "@lms/utils";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { TestPopup } from "../../mycourses";

enum StatusQuizAttempt {
  Passed = "PASSED",
  Failed = "FAILED",
  Unsubmitted = "UN_SUBMITTED",
  Submitted = "SUBMITTED",
}
interface IProps {
  open: boolean;
  setOpen: any;
  title?: string;
  data?: any;
  class_user_id?: string;
}

const ModalActionTest = ({
  open,
  setOpen,
  data,
  class_user_id,
}: IProps) => {
  const {router, courseApi, classApi } = useFeature();
    const attempt = data?.quiz?.attempts?.[0]
  const isSubmitted =
    attempt && attempt?.status === "SUBMITTED";
  const isUnsubmitted =
    attempt && attempt?.status === "UN_SUBMITTED";
  const isContinue =
    // !attempt ||
    attempt && attempt?.status === "IN_PROGRESS";

  const [resultList, setResultList] = useState<IQuizResultList>({
    metadata: {
      page_index: 1,
      page_size: 10,
      total_pages: 0,
      total_records: 0,
    },
    data: [],
  });
  const [selectedResult, setSelectedResult] = useState<{
    label: string;
    value: string;
    ratio_score?: string;
    status: string;
    grading_method?: string;
    created_at?: Date;
    number_of_attempt?: number;
  }>();
  const [remainingTime, setRemainingTime] = useState<number>();
  const remainingTimeLastAttempt = useRef<number | null>(null);
  const [isCallSubmit, setIsCallSubmit] = useState(false)

  const quiz = data?.quiz;
  const isLimited = !!quiz.is_limited;
  const limitCount = quiz.limit_count;
  const currentAttemptNum = attempt?.number_of_attempts;
    const isNoAttempt = data?.quiz?.attempts?.length === 0

  const isNoAttemptOrLimitReached =
    isSubmitted ||
    isUnsubmitted ||
    isNoAttempt ||
    currentAttemptNum === limitCount; // Hiển thị bài chưa làm hoặc đã làm hết số lần cho phép

  const displayTime =
    !!data?.quiz?.quiz_timed &&
    remainingTimeLastAttempt.current !== null &&
    remainingTime !== undefined &&
    remainingTime >= 0
      ? dayjs()
          .startOf("day")
          .add(
            remainingTimeLastAttempt.current >= 0
              ? remainingTimeLastAttempt.current
              : 0,
            "second",
          )
      : "";

  const fetchResult = async (pageIndex: number, pageSize: number) => {
    if (class_user_id && data?.quiz?.id) {
      const response = await classApi.getAllResultOfQuiz(
        class_user_id,
        data?.quiz?.id,
        { page_index: pageIndex ?? 1, page_size: pageSize ?? 10 },
      );
      if (
        response?.data?.data &&
        response?.data?.metadata?.total_records >= 1
      ) {
        const results = response.data.data;
        setResultList((prev: IQuizResultList) => {
          return {
            metadata: response.data.metadata,
            data: [...prev.data, ...results]?.filter(
              (item, index, self) =>
                index === self?.findIndex((t) => t.id === item.id),
            ),
          };
        });

        setSelectedResult({
          label: results?.[0]?.name,
          value: results?.[0]?.id,
          ratio_score: results?.[0]?.ratio_score,
          status: results?.[0]?.status,
          grading_method: results?.[0]?.quiz?.grading_method,
          created_at: new Date(results?.[0]?.created_at),
          number_of_attempt: Number(
            (results?.[0]?.name ?? "").split("/")[0] ?? 0,
          ),
        });
        //check điều kiện xem có được tiếp tục làm bài hay không
        let isExpired = false;
        if (data?.quiz?.quiz_timed) {
          isExpired = isQuizExpired(
            new Date(results?.[0]?.created_at),
            data?.quiz?.quiz_timed,
          );
        }

        const isContinueAttempt = results?.[0]?.status === "IN_PROGRESS";
        if (isContinueAttempt && !isExpired) {
          localStorage.setItem(
            "quizAttempt",
            JSON.stringify({
              id: results?.[0]?.id,
              number_of_attempts: attempt?.number_of_attempts,
              is_limited: data?.is_limited,
              quiz_timed: data?.quiz?.quiz_timed,
              created_at: results?.[0]?.created_at,
            }),
          );
        } else {
          localStorage.removeItem("quizAttempt");
        }
      } else {
        localStorage.removeItem("quizAttempt");
      }
    }
  };

  useEffect(() => {
    if (open && selectedResult) {
      if (data?.quiz?.quiz_timed && selectedResult?.status === "IN_PROGRESS") {
        const calcTime = dayjs(
          dayjs(selectedResult.created_at).add(
            data?.quiz?.quiz_timed,
            "minutes",
          ),
        ).diff(dayjs(), "seconds");

        if (remainingTimeLastAttempt.current === null) {
          remainingTimeLastAttempt.current = calcTime >= 0 ? calcTime : 0;
        }

        const remainingTimeInterval = setInterval(() => {
          if (remainingTimeLastAttempt.current !== null) {
            // Kiểm tra null
            const currentTime = remainingTimeLastAttempt.current;
            setRemainingTime(currentTime >= 0 ? currentTime : 0);
            remainingTimeLastAttempt.current -= 1;
            if (remainingTimeLastAttempt.current <= 0) {
              clearInterval(remainingTimeInterval);
            }
          }
        }, 1000);

        return () => {
          clearInterval(remainingTimeInterval);
        };
      }
    }
  }, [selectedResult]);

  useEffect(() => {
    if (open) {
      fetchResult(1, 10);
    }
  }, [open]);

  const isFinalAttemptTimeout =
    remainingTimeLastAttempt?.current != null &&
    remainingTimeLastAttempt.current <= 0 &&
    currentAttemptNum === limitCount;

  const isTimeOut =
    remainingTimeLastAttempt?.current != null &&
    remainingTimeLastAttempt.current <= 0;

  useEffect(() => {
    if (
      remainingTimeLastAttempt?.current != null &&
      remainingTimeLastAttempt.current <= 0
    ) {
      setIsCallSubmit(true)
    }
  }, [remainingTimeLastAttempt?.current])
  const handleSubmitNow = async (isRedirect = true) => {
    const res = await courseApi.submitAllQuestion(attempt?.id as string);
    if (res?.success && attempt && attempt?.status) {
      attempt.status = "SUBMITTED";
    }
    isRedirect && handleRedirectResult();
  };

  useEffect(() => {
    if (isCallSubmit) {
      handleSubmitNow(false);
    }
  }, [isCallSubmit]);

  const handleCheckStatus = (
    attempt: { status: string; score: number },
    quiz: { is_graded: boolean; required_percent_score: number },
  ) => {
    if (!attempt) return StatusQuizAttempt.Unsubmitted;
    if (attempt?.status === "SUBMITTED") {
      return StatusQuizAttempt.Submitted;
    }
    if (quiz?.is_graded) {
      const status =
        attempt?.score < quiz?.required_percent_score
          ? StatusQuizAttempt.Failed
          : StatusQuizAttempt.Passed;
      return status;
    }
  };

  const can_retake = useMemo(() => {
    if (!attempt) {
      return true;
    }
    if (attempt?.is_graded) {
      return false;
    }
    return true;
  }, [attempt]);

  const status = useMemo(() => {
    if (selectedResult?.value) {
      const result = resultList?.data?.find(
        (item) => item.id === selectedResult?.value,
      );
      if (result) {
        return handleCheckStatus(result, result?.quiz);
      }
    } else {
      return handleCheckStatus(attempt, data?.quiz);
    }
  }, [selectedResult?.value, attempt]);

  const handleStartANewAttempt = async () => {
    //to do: start test
    try {
      router.push({
        pathname: `/test/${data.quiz.id}`,
        query: {
          class_user_id: class_user_id,
        },
      });
      status
        ? () => trackGAEvent("Click Button Retake Modal Test")
        : () => trackGAEvent("Click Button Start Modal Test");
    } catch (err) {}
  };

  const handleFinishTest = async () => {
    localStorage.setItem(
      "quizAttempt",
      JSON.stringify({
        id: selectedResult?.value,
        number_of_attempts: attempt?.number_of_attempts,
          is_limited: isLimited,
        quiz_timed: quiz?.quiz_timed,
        created_at: selectedResult?.created_at,
      }),
    );
    handleStartANewAttempt();
  };

  const isManualGradingAndNotFinishedGrading =
    data?.quiz?.grading_method === GRADING_METHOD.MANUAL &&
    attempt?.grading_status !== GRADE_STATUS.FINISHED_GRADING &&
    attempt &&
    attempt?.status === "SUBMITTED";

  const renderBackButton = () => (
    <ButtonText
      title="Cancel"
      // icon={<BackIcon />}
      size="medium"
      onClick={() => {
        setOpen(false);
        trackGAEvent("Click Button Back to My Course");
      }}
    />
  );

  const renderCustomFooter = () => {
    if (!quiz) return null;

    // Trường hợp: có thể hiển thị nút Start hoặc Retake
    const shouldShowButtonStartOrRetake =
      !(
        selectedResult &&
        selectedResult?.number_of_attempt &&
        selectedResult?.number_of_attempt !== currentAttemptNum
      ) &&
      (!isLimited ||
        (isLimited &&
          !!limitCount &&
          (isNoAttempt ||
            currentAttemptNum < limitCount ||
            (currentAttemptNum === limitCount && !isSubmitted))));

    // Trường hợp: chưa từng làm hoặc đã làm đủ số lượt cho phép

    if (isNoAttemptOrLimitReached) {
      if (!isLimited) {
        // Quiz KHÔNG giới hạn số lượt làm
        if (isNoAttempt) {
          // Chưa từng làm → bắt đầu mới
          return (
            <>
              {shouldShowButtonStartOrRetake && (
                <ButtonPrimary
                  size="medium"
                  title="Start"
                  full
                  onClick={handleStartANewAttempt}
                />
              )}
              {renderBackButton()}
            </>
          );
        }

        if (isContinue) {
          // Có bài đang làm dở → tiếp tục hoặc làm mới
          return (
            <>
              <ButtonPrimary
                size="medium"
                title="Continue"
                full
                onClick={handleFinishTest}
              />
              <ButtonSecondary
                title="Start a new attempt"
                size="medium"
                full
                onClick={handleStartANewAttempt}
              />
              {renderBackButton()}
            </>
          );
        }

        // Đã làm xong → được làm lại
        return (
          <>
            {shouldShowButtonStartOrRetake && (
              <ButtonPrimary
                size="medium"
                title="Retake"
                full
                onClick={handleRetakeNewAttempt}
              />
            )}
            {renderBackButton()}
          </>
        );
      } else {
        // Quiz CÓ giới hạn số lượt làm
        if (isFinalAttemptTimeout) {
          // Lần làm cuối cùng bị hết thời gian → chỉ xem kết quả
          return (
            <ButtonPrimary
              size="medium"
              title="View Result"
              full
              onClick={handleRedirectResult}
            />
          );
        }

        if (isNoAttempt || isSubmitted || isUnsubmitted) {
          // Chưa làm hoặc đã nộp → được làm bài mới
          return (
            <>
              {shouldShowButtonStartOrRetake && (
                <ButtonPrimary
                  size="medium"
                  title="Start"
                  full
                  onClick={handleStartANewAttempt}
                />
              )}
              {renderBackButton()}
            </>
          );
        }

        if (attempt.number_of_attempts === limitCount) {
          if (isContinue) {
            // Là lần cuối và bài đang làm → tiếp tục bài đó
            return (
              <>
                <ButtonPrimary
                  size="medium"
                  title="Continue"
                  full
                  onClick={handleFinishTest}
                />
                <ButtonSecondary
                  title="Submit now"
                  size="medium"
                  full
                  onClick={() => handleSubmitNow()}
                />
              </>
            );
          } else {
            // Là lần cuối và đã nộp → chỉ xem kết quả
            return (
              <ButtonPrimary
                size="medium"
                title="View Result"
                full
                onClick={handleRedirectResult}
              />
            );
          }
        }

        // Còn lượt làm → tiếp tục bài cũ, nộp luôn hoặc làm mới
        return (
          <div className="flex flex-col items-center gap-3">
            <ButtonPrimary
              size="medium"
              title="Continue the previous attempt"
              full
              onClick={handleContinueLastAttempt}
            />
            <ButtonSecondary
              title="Submit now"
              size="medium"
              full
              onClick={() => handleSubmitNow()}
            />
            <ButtonText
              title="Start a new attempt"
              full
              size="medium"
              onClick={async () => {
                await handleSubmitNow();
                handleRetakeNewAttempt();
              }}
            />
          </div>
        );
      }
    }

    // Trường hợp khác: đã làm nhưng chưa hết lượt
    if (isContinue) {
      if (isTimeOut) {
        // Hết thời gian làm bài → chỉ xem kết quả hoặc bắt đầu lại
        return (
          <>
            <ButtonPrimary
              size="medium"
              title="View result"
              full
              onClick={handleRedirectResult}
            />
            <ButtonText
              title="Start a new attempt"
              size="medium"
              full
              onClick={handleRetakeNewAttempt}
            />
          </>
        );
      }

      // Còn thời gian → tiếp tục bài cũ, nộp hoặc bắt đầu mới
      return (
        <>
          <ButtonPrimary
            size="medium"
            title="Continue the previous attempt"
            full
            onClick={handleContinueLastAttempt}
          />
          <ButtonSecondary
            title="Submit now"
            size="medium"
            full
            onClick={() => handleSubmitNow()}
          />
          <ButtonText
            title="Start a new attempt"
            size="medium"
            full
            onClick={handleRetakeNewAttempt}
          />
        </>
      );
    }

    // Trường hợp không xác định → không hiển thị footer
    return null;
  };

  const handleContinueLastAttempt = async () => {
    if (
      remainingTimeLastAttempt.current === null &&
      quiz.is_limited &&
      quiz.quiz_timed > 0
    )
      return;
    if (
      remainingTimeLastAttempt.current !== null &&
      remainingTimeLastAttempt?.current <= 0
    ) {
      handleFinishTest();
    } else {
      handleStartANewAttempt();
    }
  };

  const handleRetakeNewAttempt = async () => {
    if (!can_retake) {
      return;
    }
    localStorage.removeItem("quizAttempt");
    handleStartANewAttempt();
  };

  const handleRedirectResult = () => {
    if (isManualGradingAndNotFinishedGrading) {
      router.push(
        `/courses/test/your-answers-detail/${attempt?.id}`,
      );
    } else {
      router.push({
        pathname: `/courses/test/test-result/${selectedResult?.value ?? attempt?.id}`,
        query: { attempt: selectedResult?.label },
      });
    }
  };

  return (
    <>
      <TestPopup
        open={open}
        setOpen={setOpen}
        title={
          <div className="flex items-center justify-center">
            {TEST_TYPE_LABELS[data?.course_section_type as keyof typeof TEST_TYPE_LABELS]}
          </div>
        }
        time={displayTime}
        
        customFooter={
          <div className="flex w-full flex-col items-center justify-center gap-3">
            {renderCustomFooter()}
          </div>
        }
        isClosable
      />
      {/* )} */}
    </>
  );
};

export default ModalActionTest;
