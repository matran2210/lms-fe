import { ConfirmIcon } from "@lms/assets";
import { useCourseContext } from "@lms/contexts";
import { EAttemptStatus, GRADE_STATUS, GRADING_METHOD, IClassAPI, IMyCourseDetail, TEST_TYPE } from "@lms/core";
import { TestModal, TestModalTeacher } from "@lms/feature-test";
import { ButtonSecondary, ButtonText, SappModalV3 } from "@lms/ui";
import { formatTimeMinToHhMm, getUserPrefix, roundNumber, trackGAEvent } from "@lms/utils";
import clsx from "clsx";
import router from "next/router";
import { useEffect, useMemo, useState } from "react";
import { CardCourse } from "../../course";
import ResultCourse from "./CourseResult";

const PartFailed = ({
  coursePart,
  class_user_id,
  is_passed_course,
  isLock = false,
  lastElementRef,
  isTeacher,
  hasCertificate = false,
  classApi,
  pageLink,
}: {
  coursePart: IMyCourseDetail;
  class_user_id?: string;
  is_passed_course: boolean;
  isLock?: boolean;
  lastElementRef: (node: HTMLDivElement) => void;
  isTeacher: boolean;
  hasCertificate?: boolean;
    classApi: IClassAPI;
    pageLink: { [key: string]: string;}
}) => {
  const noOfAttempts = `${coursePart?.quiz?.attempt?.number_of_attempts || 0}/${
    coursePart?.quiz?.is_limited ? coursePart?.quiz?.limit_count : "Unlimited"
  }`;
  const isSubmitted =
    coursePart?.quiz?.attempt &&
    coursePart?.quiz?.attempt?.status === "SUBMITTED";
  const isUnsubmitted =
    coursePart?.quiz?.attempt &&
    coursePart?.quiz?.attempt?.status === "UN_SUBMITTED";
  const isContinue =
    !coursePart?.quiz?.attempt ||
    (coursePart?.quiz?.attempt &&
      coursePart?.quiz?.attempt?.status === "IN_PROGRESS");
  const quizAttempt = coursePart?.quiz;
  const [open, setOpen] = useState(false);
  const [isRunoutAttemp, setIsRunoutAttemp] = useState<boolean>(true);
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<{
    label: string;
    value: string;
    ratio_score?: string;
    status: string;
    score: number;
    total_attempt_time: number;
  }>();
  const userPrefix = getUserPrefix(isTeacher, pageLink);
  const isManualGradingAndAwaitGrading =
    quizAttempt?.grading_method === GRADING_METHOD.MANUAL &&
    quizAttempt?.attempt?.grading_status === GRADE_STATUS.AWAITING_GRADING;
  const formattedTime = coursePart?.quiz?.quiz_timed
    ? formatTimeMinToHhMm(coursePart?.quiz?.quiz_timed * 60)
    : "Unlimited";

  const checkFinished = useMemo(() => {
    if (coursePart?.quiz?.attempt) {
      return true;
    }
    return false;
  }, [coursePart?.quiz?.attempt]);

  const countTimeSpent = (ratio_score: string) => {
    const parts = ratio_score?.split("/");
    const firstPoint = parseInt(parts?.[0] || "0", 10);
    const secondPoint = parseInt(parts?.[1] || "0", 10);
    return roundNumber((firstPoint / secondPoint) * 100) || 0;
  };

  const runOutAttemp =
    Number(
      coursePart?.quiz?.attempt?.number_of_attempts /
        coursePart?.quiz?.limit_count,
    ) || 0;

  const showTitleFinalTest =
    coursePart?.course_section_type === TEST_TYPE.FINAL_TEST
      ? "Final Test"
      : "MidTerm Test";

  useEffect(() => {
    if (runOutAttemp >= 1 && coursePart?.quiz?.is_limited === true) {
      setIsRunoutAttemp(false);
    }
  }, [runOutAttemp]);

  const { setOpenPopupCTA } = useCourseContext();
  const currentAttemptNumber = coursePart?.quiz?.attempt
    ?.number_of_attempts as number;
  const selectedAttemptNumber = selectedResult?.label?.split("/")[0];

  const isShowButtonAction = () => {
    if (hasCertificate) return false;
    // if (Number(currentAttemptNumber) > Number(selectedAttemptNumber))
    //   return false
    // if (Number(labelResult) > Number(selectedResult?.label)) return false
    // Case:  Unlimited time attempt
    if (!coursePart?.quiz?.is_limited) return true;

    // Case: Limited time attempt
    if (coursePart?.quiz?.is_limited && !!coursePart?.quiz?.limit_count) {
      // & Case: Not Attempt
      if (!coursePart?.quiz?.attempt) return true;

      // & Case: Last attempt
      if (
        coursePart?.quiz?.attempt?.number_of_attempts ===
          coursePart?.quiz?.limit_count &&
        !isSubmitted
      )
        return true;

      // & Case: has more than 1 attempt
      if (
        coursePart?.quiz?.attempt?.number_of_attempts <
        coursePart?.quiz?.limit_count
      )
        return true;
    }
    return false;
  };

  const renderOkButtonCaption = () => {
    // // Case: Unlimited time attempt and submitted
    if (!coursePart?.quiz?.is_limited && (isSubmitted || isUnsubmitted))
      return "Retake";
    // Case: Unlimited time attempt and continue
    if (!coursePart?.quiz?.is_limited && isContinue) return "Continue";
    // Case: Limited time attempt
    if (coursePart?.quiz?.is_limited && !!coursePart?.quiz?.limit_count) {
      // & Case: Not Attempt
      if (!coursePart?.quiz?.attempt) return "Retake";

      // & Case: Last attempt
      if (
        coursePart?.quiz?.attempt?.number_of_attempts ===
        coursePart?.quiz?.limit_count
      )
        return "Continue";
      // & Case: has more than 1 attempt
      if (
        coursePart?.quiz?.attempt?.number_of_attempts <
        coursePart?.quiz?.limit_count
      )
        return "Retake";
    }
    return "";
  };

  const isManualGradingAndNotFinishedGrading =
    coursePart?.quiz?.grading_method === GRADING_METHOD.MANUAL &&
    coursePart?.quiz?.attempt?.grading_status !== GRADE_STATUS.FINISHED_GRADING;

  const handleRedirectResult = () => {
    if (
      isManualGradingAndNotFinishedGrading &&
      coursePart?.quiz?.attempt?.grading_status ===
        GRADE_STATUS.AWAITING_GRADING
    ) {
      router.push(
        `${userPrefix}/courses/test/your-answers-detail/${quizAttempt?.attempt?.id}`,
      );
    } else if (
      isManualGradingAndNotFinishedGrading &&
      coursePart?.quiz?.attempt?.grading_status !==
        GRADE_STATUS.AWAITING_GRADING
    ) {
      if (quizAttempt?.attempt && quizAttempt?.attempt?.id) {
        router.push(
          `${userPrefix}/courses/test/test-result/${quizAttempt?.attempt?.id}`,
        );
      }
    } else {
      router.push({
        pathname: `${userPrefix}/courses/test/test-result/${selectedResult?.value}`,
        query: {
          attempt: selectedResult?.label,
          ...(hasCertificate && { hasCertificate }),
        },
      });
    }
    trackGAEvent(`Click Button Result ${showTitleFinalTest}`);
  };

  const titleButtonViewResult = () => {
    return coursePart?.quiz?.attempt?.grading_status ===
      GRADE_STATUS.AWAITING_GRADING
      ? "Your Answers"
      : "Result";
  };

  // const handleClickTitle = () => {
  //   if (coursePart?.course_section_link_parents?.[0]?.is_preview_locked) {
  //     setOpenPopupCTA({
  //       lockSection: true,
  //       ctaUpgrade: false,
  //       thankYou: false,
  //       thankYouLater: false,
  //     })
  //   } else {
  //     setOpen(true)
  //   }
  //   trackGAEvent(`Click Title ${showTitleFinalTest}`)
  // }

  const [labelResult, setLabelResult] = useState<string>("");
  const getAttemptStatus = () => {
    if (coursePart?.quiz?.grading_method === GRADING_METHOD.MANUAL) {
      if (coursePart?.quiz?.attempt?.status === EAttemptStatus.SUBMITTED) {
        return coursePart?.quiz?.attempt?.grading_status;
      }
      return coursePart?.quiz?.attempt?.status;
    }

    if (coursePart?.quiz?.grading_method === GRADING_METHOD.AUTO) {
      return coursePart?.quiz?.attempt?.status;
    }
  };
  const isRetake = renderOkButtonCaption() === "Retake";
  return (
    <>
      <CardCourse
        attemptStatus={(getAttemptStatus() || "UN_SUBMITTED") as EAttemptStatus}
        title={coursePart?.name}
        key={coursePart?.id}
        ref={lastElementRef}
        classNameTitle={`h-12 md:h-16 font-medium`}
        classNameCard="lg:h-[456px] md:h-[428px] h-[328px]"
        isLock={isLock}
        onClick={() => {
          if (coursePart?.course_section_link_parents?.[0]?.is_preview_locked) {
            setOpenPopupCTA({
              lockSection: true,
              ctaUpgrade: false,
              thankYou: false,
              thankYouLater: false,
            });
          } else {
            setOpen(true);
          }
        }}
      >
        <div className="flex h-full flex-1 flex-col justify-between">
          <div className="info mb-6 mt-4 border-l border-gray-2 pl-4 md:mt-6">
            {checkFinished && (
              <>
                <PartInfoItem
                  label="Time Spent:"
                  // value={
                  //   !!coursePart?.quiz?.attempt?.total_attempt_time
                  //     ? formatTimeMinToHhMm(
                  //       coursePart?.quiz?.attempt?.total_attempt_time,
                  //     )
                  //     : '--'
                  // }
                  value={
                    !!selectedResult?.total_attempt_time
                      ? formatTimeMinToHhMm(selectedResult?.total_attempt_time)
                      : "--"
                  }
                />
                <PartInfoItem
                  label="Latest Results:"
                  value={
                    isManualGradingAndAwaitGrading
                      ? "--"
                      : selectedResult?.score !== undefined &&
                          selectedResult?.score !== null
                        ? //  || (coursePart?.quiz?.attempt?.score !== undefined &&
                          //   coursePart?.quiz?.attempt?.score !== null)
                          `${selectedResult?.score}%`
                        : // ? `${coursePart?.quiz?.attempt?.score}%`
                          "--"
                  }
                />
              </>
            )}
            <PartInfoItem label="Time Allowed:" value={formattedTime} />
            <PartInfoItem label="No of Attempts:" value={noOfAttempts} />

            {/* Result of attempts */}
            <ResultCourse
              class_user_id={class_user_id}
              coursePart={coursePart}
              setOpenReport={setOpenReport}
              selectedResult={selectedResult}
              setSelectedResult={setSelectedResult}
              isTeacher={isTeacher}
              setLabelResult={setLabelResult}
            />
          </div>

          <div className="action flex items-center justify-end">
            {!checkFinished ? (
              !coursePart?.quiz?.is_limited ||
              (coursePart?.quiz?.attempt?.number_of_attempts !==
                coursePart?.quiz?.limit_count &&
                isRunoutAttemp) ? (
                <ButtonSecondary
                  size="small"
                  disabled={
                    coursePart?.quiz?.is_limited &&
                    coursePart?.quiz?.attempt?.number_of_attempts ===
                      coursePart?.quiz?.limit_count
                  }
                  title={`Start`}
                  className={`${
                    coursePart?.quiz?.attempt?.number_of_attempts !==
                      coursePart?.quiz?.limit_count && ""
                  } ml-auto w-full md:w-[84px]`}
                  onClick={() => {
                    if (
                      coursePart?.course_section_link_parents?.[0]
                        ?.is_preview_locked
                    ) {
                      setOpenPopupCTA({
                        lockSection: true,
                        ctaUpgrade: false,
                        thankYou: false,
                        thankYouLater: false,
                      });
                    } else {
                      setOpen(true);
                    }
                    trackGAEvent(`Click Button Start ${showTitleFinalTest}`);
                  }}
                />
              ) : (
                <></>
              )
            ) : (
              <div className="flex flex-1 items-center justify-end gap-4">
                {quizAttempt.id &&
                  (Number(currentAttemptNumber) >
                    Number(selectedAttemptNumber) ||
                    getAttemptStatus() !== EAttemptStatus.IN_PROGRESS) && (
                    <ButtonText
                      size="small"
                      title={titleButtonViewResult()}
                      onClick={handleRedirectResult}
                    />
                  )}

                {isShowButtonAction() && (
                  <ButtonSecondary
                    className={clsx(
                      isRetake ? "w-[84px]" : " w-full md:w-[84px]",
                    )}
                    size="small"
                    title={renderOkButtonCaption()}
                    onClick={() => {
                      if (
                        coursePart?.course_section_link_parents?.[0]
                          ?.is_preview_locked
                      ) {
                        setOpenPopupCTA({
                          lockSection: true,
                          ctaUpgrade: false,
                          thankYou: false,
                          thankYouLater: false,
                        });
                      } else {
                        setOpen(true);
                      }
                      trackGAEvent(`Click Button Retake ${showTitleFinalTest}`);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </CardCourse>
      {isTeacher ? (
        <TestModalTeacher
          open={open}
          setOpen={setOpen}
          title={coursePart?.name}
          data={coursePart}
          class_user_id={class_user_id}
          is_passed_course={is_passed_course}
          activeCourse={() => {}}
          classApi={classApi}
          pageLink={pageLink}
        />
      ) : (
        <TestModal
          open={open}
          setOpen={setOpen}
          title={coursePart?.name}
          data={coursePart}
          class_user_id={class_user_id}
          is_passed_course={is_passed_course}
          activeCourse={() => {}}
        />
      )}
      <SappModalV3
        open={openReport}
        okButtonCaption="Back"
        handleCancel={() => {}}
        onOk={() => {
          setOpenReport(false);
        }}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<ConfirmIcon />}
        header="Awating Grading"
        content={`Your test is currently being graded. The result will be sent to you via email as soon as the grading is complete.`}
      />
    </>
  );
};

const PartInfoItem = ({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) => {
  return (
    <div className="time-allow mb-2 flex justify-between md:mb-4">
      <p className="text-sm text-gray md:text-base">{label}</p>
      <p className="text-sm font-medium text-gray-800 md:text-base">{value}</p>
    </div>
  );
};

export default PartFailed;
