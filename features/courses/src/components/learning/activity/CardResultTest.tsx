import { ArrowRight } from "@lms/assets";
import { useFeature } from "@lms/contexts";
import {
  EAttemptStatus,
  EDateTime,
  GRADE_STATUS,
  GRADING_METHOD
} from "@lms/core";
import { StatusQuizTag } from "@lms/core/types/quiz/StatusActionCell";
import { useTailwindBreakpoint } from "@lms/hooks";
import { Tooltip } from "@lms/ui";
import { getTimeFromInput, isQuizExpired } from "@lms/utils";
import dayjs from "dayjs";
import { useState } from "react";
import ModalActionTest from "./ModalActionTest";

const CardResultTest = ({
  resultData,
  getNameTooltipContent,
  lastElementRef,
}: any) => {
  // }: ITestQuizProps) => {
  const { isMobileView } = useTailwindBreakpoint();
  const { router } = useFeature();
  const [openModal, setOpenModal] = useState(false)
  if (!resultData) return null;

  const dateSubmitted = resultData?.quiz?.attempts?.[0]?.updated_at;
  const timeSpent = resultData?.quiz?.attempts?.[0]?.total_attempt_time;
  const textButtonViewResult = () => {
    if (
      !resultData?.quiz?.attempts ||
      resultData?.quiz?.attempts?.length === 0
    ) {
      return "Start";
    }
    const attempt = resultData?.quiz?.attempts?.[0];
    const attemptStatus = attempt?.status;
    const gradingMethod = resultData?.quiz?.grading_method;
    if (attemptStatus === EAttemptStatus.IN_PROGRESS) {
      return "Continue";
    }
    if (gradingMethod === GRADING_METHOD.MANUAL) {
      if (
        attemptStatus === EAttemptStatus.SUBMITTED &&
        attempt?.grading_status !== GRADE_STATUS.FINISHED_GRADING
      ) {
        return "Your Answers Detail";
      }
    }
    return "View Result";
  };

  const btnViewResult = () => (
    <div className="flex items-center">
      <div className="mr-2 block text-sm font-medium text-gray-800 underline md:hidden">
        {textButtonViewResult()}
      </div>
      <div>
        <ArrowRight />
      </div>
    </div>
  );

  const openInNewTab = ({ url, isNewTab = true }: { url: string, isNewTab?: boolean }) => {
    if (isNewTab) {
      if (typeof window === "undefined") return;
      window.open(url, "_blank");
    } else {
      router.push(url);
    }
  };

  const handleCheckQuizAttempt = (data: any) => {
    let isExpired = false
    if (data?.quiz?.quiz_timed) {
      isExpired = isQuizExpired(
        new Date(data?.quiz?.attempts?.[0]?.started_at),
        data?.quiz?.quiz_timed,
      )
    }

    const isContinueAttempt = data?.quiz?.attempts?.[0]?.status === EAttemptStatus.IN_PROGRESS
    if (isContinueAttempt && !isExpired) {
      localStorage.setItem(
        'quizAttempt',
        JSON.stringify({
          id: data?.quiz?.attempts?.[0]?.id,
          number_of_attempts:
            data?.attempt?.number_of_attempts ||
            data?.quiz?.attempt?.number_of_attempts,
          is_limited: data?.is_limited,
          quiz_timed: data?.quiz?.quiz_timed,
          created_at: data?.quiz?.attempts?.[0]?.started_at,
        }),
      )
    } else {
      localStorage.removeItem('quizAttempt')
    }
  }
  const handleOpenTest = () => {
    handleCheckQuizAttempt(resultData)
    openInNewTab({
      url: `${process.env.NEXT_PUBLIC_SUB_DOMAIN_TEST}/test/${resultData?.quiz?.id}?class_user_id=${resultData?.class_user_id}`,
      isNewTab: false
    }

    );
  }
  const handleViewResult = () => {
    if (resultData?.quiz?.attempts?.length > 0) {
      if (resultData?.quiz?.grading_method === GRADING_METHOD.MANUAL) {
        if (resultData?.quiz?.attempts) {
          if (
            resultData?.quiz?.attempts?.[0]?.status === EAttemptStatus.SUBMITTED
          ) {
            if (
              resultData?.quiz?.attempts?.[0]?.grading_status ===
              GRADE_STATUS.FINISHED_GRADING
            ) {
              openInNewTab({ url: `/courses/test/test-result/${resultData?.quiz?.attempts?.[0]?.id}`, });
            } else {
              openInNewTab({ url: `/courses/test/your-answers-detail/${resultData?.quiz?.attempts?.[0]?.id}`, });
            }
          } else if (
            resultData?.quiz?.attempts?.[0]?.status ===
            EAttemptStatus.IN_PROGRESS
          ) {
            handleOpenTest()
          } else if (
            resultData?.quiz?.attempts?.[0]?.status ===
            EAttemptStatus.UN_SUBMITTED
          ) {
            openInNewTab({ url: `/courses/test/test-result/${resultData?.quiz?.attempts?.[0]?.id}`, });
          }
        } else {
          handleOpenTest()
        }
      } else {
        if (resultData?.quiz?.attempts) {
          if (
            resultData?.quiz?.attempts?.[0]?.status === EAttemptStatus.IN_PROGRESS
          ) {
            // handleOpenTest()
            setOpenModal(true);
          } else {
            openInNewTab({ url: `/courses/test/test-result/${resultData?.quiz?.attempts?.[0]?.id}`, });
          }
        } else {
          handleOpenTest()
        }
      }
    } else {
      handleOpenTest()
    }
  };

  const getAttemptStatus = () => {
    if (resultData?.quiz?.grading_method === GRADING_METHOD.MANUAL) {
      if (
        resultData?.quiz?.attempts?.[0]?.status === EAttemptStatus.SUBMITTED
      ) {
        return resultData?.quiz?.attempts?.[0]?.grading_status;
      }
      return resultData?.quiz?.attempts?.[0]?.status;
    }

    if (resultData?.quiz?.grading_method === GRADING_METHOD.AUTO) {
      return resultData?.quiz?.attempts?.[0]?.status;
    }
  };

  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 shadow-small hover:bg-primary-50 md:p-6"
      ref={lastElementRef}
      onClick={handleViewResult}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Tooltip
            title={getNameTooltipContent?.(resultData)}
            arrow={false}
            placement="topLeft"
          >
            <div className="text-base font-semibold leading-[27px] text-gray-800 md:text-lg">
              {resultData?.name}
            </div>
          </Tooltip>
          <StatusQuizTag status={getAttemptStatus()} />
        </div>
        {dateSubmitted && (timeSpent || timeSpent === 0) ? (
          <div className="flex">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex">
                <div className="mr-2 text-sm font-normal leading-normal text-gray-400 md:text-base">
                  Last submission:
                </div>
                <div className="text-sm font-medium leading-normal text-gray-800 md:text-base">
                  {dateSubmitted
                    ? dayjs(dateSubmitted).format(EDateTime.fullDate)
                    : "-"}
                </div>
              </div>
              {!isMobileView && <div className="mx-3 text-gray-300">|</div>}
              <div className="flex">
                <div className="mr-2 text-sm font-normal leading-normal text-gray-400 md:text-base">
                  Time spent:
                </div>
                <div className="text-sm font-medium leading-normal text-gray-800 md:text-base">
                  {getTimeFromInput(timeSpent, "seconds")}
                  {/* {timeSpent} */}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isMobileView && btnViewResult()}
      </div>
      {!isMobileView && btnViewResult()}

      {openModal && <ModalActionTest
        open={openModal}
        setOpen={setOpenModal}
        title={resultData?.name}
        data={resultData}
        class_user_id={resultData?.class_user_id}
      />}
    </div>
  );
};

export default CardResultTest;
