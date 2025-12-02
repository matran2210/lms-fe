import { AlertIcon } from "@lms/assets";
import { useCourseContext, useFeature } from "@lms/contexts";
import { EAttemptStatus, IEventTest, MY_COURSES } from "@lms/core";
import { CardCourse } from "@lms/feature-courses";
import { ButtonSecondary, SappModalV3 } from "@lms/ui";
import { formatDate, formatTimer, isQuizExpired } from "@lms/utils";
import { compareAsc } from "date-fns";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const EventTest = ({
  data,
  onRefetch,
}: {
  data: IEventTest;
  onRefetch: () => void;
}) => {
  const { router, courseApi } = useFeature();
  const [open, setOpen] = useState<boolean>(false);
  const { setSubmitEventTest } = useCourseContext();
  const [remainingTimeLastAttempt, setRemainingTimeLastAttempt] =
    useState<number>(0);

  useEffect(() => {
    if (data) {
      if (
        data?.quiz_timed &&
        data?.attempt_status === EAttemptStatus["IN_PROGRESS"]
      ) {
        const calcTime = dayjs(
          dayjs(data?.created_at).add(data?.quiz_timed, "minutes"),
        ).diff(dayjs(), "seconds");

        setRemainingTimeLastAttempt(calcTime >= 0 ? calcTime : 0);
        const remainingTimeInterval = setInterval(() => {
          setRemainingTimeLastAttempt((prev) => {
            if (prev === 0) {
              handleSubmitQuestion();
              clearInterval(remainingTimeInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => {
          clearInterval(remainingTimeInterval);
        };
      }
    }
  }, [data]);

  const handleSubmitQuestion = async () => {
    try {
      const res = await courseApi.submitAllQuestion(
        data?.quiz_attempt_id as string,
      );
      if (res.success) {
        await onRefetch();
        setSubmitEventTest(true);
      }
    } catch (err) {}
  };

  const timeTakenFormatted = data?.total_attempt_time
    ? formatTimer(data?.total_attempt_time)
    : 0;
  const timeAllowFormatted = data?.quiz_timed
    ? formatTimer(data?.quiz_timed * 60)
    : "Unlimited";

  const currentTime = Date.now();
  const started_at = new Date(data?.started_at);
  const finished_at = new Date(data?.finished_at);

  const resultStartAt = compareAsc(currentTime, started_at);
  const resultFinishAt = compareAsc(currentTime, finished_at);

  function checkEventStatus(
    resultStartAt: number,
    resultFinishAt: number,
    textStart: string,
    textEnd: string,
  ) {
    return resultStartAt === -1
      ? textStart
      : resultFinishAt === 1
        ? textEnd
        : "";
  }

  const handleClickBegin = () => {
    if (resultStartAt === -1 || resultFinishAt === 1) {
      setOpen(true);
    } else {
      let isExpired = false;
      if (data?.quiz_timed) {
        isExpired = isQuizExpired(new Date(data?.created_at), data?.quiz_timed);
      }

      const isContinue = data?.attempt_status === EAttemptStatus["IN_PROGRESS"];
      if (
        (isContinue && !isExpired) ||
        (remainingTimeLastAttempt <= 0 &&
          data?.attempt_status === EAttemptStatus["IN_PROGRESS"])
      ) {
        handleClickContinue();
      } else {
        localStorage.removeItem("quizAttempt");
        router.push({
          pathname: `/test/${data?.id}`,
          query: {
            type: "event-test",
          },
        });
      }
    }
  };

  const handleClickContinue = () => {
    localStorage.setItem(
      "quizAttempt",
      JSON.stringify({
        id: data?.quiz_attempt_id,
        number_of_attempts: data?.attempt_times,
        is_limited: data?.is_limited,
        quiz_timed: data?.quiz_timed,
        created_at: data?.created_at,
      }),
    );
    router.push({
      pathname: `/test/${data?.id}`,
      query: {
        type: "event-test",
      },
    });
  };

  const renderButton = () => {
    if (data?.attempt_status === EAttemptStatus["IN_PROGRESS"]) {
      return (
        <ButtonSecondary
          title="Resume"
          size="small"
          className="ml-auto"
          onClick={handleClickBegin}
        />
      );
    } else if (data?.attempt_status === EAttemptStatus["SUBMITTED"]) {
      return (
        <ButtonSecondary
          title="Begin"
          className="invisible ml-auto"
          size="small"
          onClick={handleClickBegin}
        />
      );
    } else {
      return (
        <ButtonSecondary
          title="Begin"
          className="ml-auto"
          size="small"
          onClick={handleClickBegin}
        />
      );
    }
  };

  const cardFooter = (
    <div className="action relative mt-6 flex items-center justify-end md:mt-10">
      {renderButton()}
    </div>
  );

  const renderTimeContent = () => {
    if (
      data?.attempt_status === EAttemptStatus["IN_PROGRESS"] &&
      remainingTimeLastAttempt >= 0
    ) {
      return (
        <>
          <p>Time Remaining:</p>
          <p
            className={`font-medium ${remainingTimeLastAttempt > 0 ? "text-gray-800" : "text-error"}`}
          >
            {formatTimer(
              remainingTimeLastAttempt > 0 ? remainingTimeLastAttempt : 0,
            )}
          </p>
        </>
      );
    } else if (data?.attempt_status === EAttemptStatus["SUBMITTED"]) {
      return (
        <>
          <p>Time taken:</p>
          <p className="font-medium text-gray-800">{timeTakenFormatted}</p>
        </>
      );
    } else {
      return (
        <>
          <p>Time allowed: </p>
          <p className="font-medium text-gray-800">{timeAllowFormatted}</p>
        </>
      );
    }
  };

  return (
    <>
      <CardCourse
        title={data?.name || ""}
        attemptStatus={data?.attempt_status as EAttemptStatus}
        footer={cardFooter}
      >
        <div>
          <div className="info border-l border-[#DCDDDD] px-2 md:px-4">
            <div className="flex justify-between text-sm capitalize text-gray md:text-base">
              {renderTimeContent()}
            </div>
            <div className="flex justify-between pt-2 text-sm capitalize text-gray md:pt-4 md:text-base">
              <p>No of Attemps:</p>
              <>
                {/* {data?.attempt_status === EAttemptStatus['IN_PROGRESS'] ? (
                  <span className="text-gray-800">--</span>
                ) : (
                  <p className="font-medium text-info">
                    {data.attempts.length + '/' + data?.limit_count}
                  </p>
                )} */}
                <p className="font-medium text-gray-800">
                  {(data?.attempt_times ? data?.attempt_times : "0") +
                    "/" +
                    data?.limit_count}
                </p>
              </>
            </div>
            <div className="flex justify-between pt-2 text-sm capitalize text-gray-800 md:pt-4 md:text-base">
              <div className="flex items-center">
                <>
                  <span className={`text-gray`}>Result of Attempts:</span>
                  <span className="ml-1 text-gray">
                    {data?.attempt_times || ""}
                  </span>
                </>
              </div>
              {data?.attempt_status === EAttemptStatus["SUBMITTED"] ? (
                <p className="flex items-center font-medium text-info">
                  {data?.total_correct_answer + "/" + data?.total_question}
                </p>
              ) : (
                <span className="text-gray-800">--</span>
              )}
            </div>
          </div>
        </div>
      </CardCourse>

      {/* {data?.attempt_status === EAttemptStatus['IN_PROGRESS'] && (
        <SappModalV3
          title={
            <div className="flex items-center justify-between gap-2">
              <div>Event Test</div>
              {!!data?.quiz_timed &&
                (!!remainingTimeLastAttempt ||
                  remainingTimeLastAttempt === 0) && (
                  <div
                    className={`item-center flex gap-2 font-normal ${remainingTimeLastAttempt > 0 ? 'text-[#3964EA]' : 'text-error'}`}
                  >
                    <div className="m-auto">
                      <ClockIcon
                        color={
                          remainingTimeLastAttempt > 0 ? '#3964EA' : '#B90E0A'
                        }
                        size={24}
                      />
                    </div>
                    <div className="text-[20px]">
                      {formatTime(
                        remainingTimeLastAttempt > 0
                          ? remainingTimeLastAttempt
                          : 0,
                      )}
                    </div>
                  </div>
                )}
            </div>
          }
          open={isOpenPopupContinue}
          handleCancel={() => {
            setIsOpenPopupContinue(false)
            trackGAEvent('Click Button Cancel Modal Test')
          }}
          onOk={handleClickContinue}
          okButtonCaption={'Continue'}
          footerButtonClassName="flex justify-between item-center"
          cancelButtonCaption={'Cancel'}
          cancelButtonClass={'!px-0'}
          buttonSize="medium"
          icon={undefined}
        >
          <div className="my-4 text-start text-sm text-[#A1A1A1]">
            <div>
              {`Your last attempt was unexpectedly ended. Please click 'Continue'
              to proceed with the test.`}
            </div>
          </div>
        </SappModalV3>
      )} */}

      <SappModalV3
        open={open}
        okButtonCaption="Back"
        handleCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        fullWidthBtn={true}
        buttonSize="medium"
        icon={<AlertIcon />}
        header={checkEventStatus(
          resultStartAt,
          resultFinishAt,
          "Unstarted Event Test",
          "Ended Event Test",
        )}
      >
        <div className="text-center text-sm text-[#A1A1A1]">
          This Event Test{" "}
          {checkEventStatus(
            resultStartAt,
            resultFinishAt,
            "will start",
            "has ended",
          )}{" "}
          on{" "}
          <span className="font-semibold text-gray-800">
            {formatDate(
              new Date(
                resultStartAt === -1
                  ? data?.started_at
                  : resultFinishAt === 1
                    ? data?.finished_at
                    : "",
              ).toString(),
            )}
          </span>
          . Please come back later or contact our Support at{" "}
          {MY_COURSES.hotline}.
        </div>
      </SappModalV3>
    </>
  );
};

export default EventTest;
