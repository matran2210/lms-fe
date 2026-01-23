import { IEntranceTest, IEntranceTestAttempt } from "@lms/core";
import { ButtonPrimary, ButtonSecondary, ButtonText } from "@lms/ui";
import { getNoOfAttemptEntranceTest, trackGAEvent } from "@lms/utils";
import dayjs from "dayjs";
import { TestPopup } from "@lms/feature-courses";
import { Dispatch, SetStateAction } from "react";
import { useFeature } from "@lms/contexts";

interface EntrancePopupContinueProps {
  currentAttempt: IEntranceTestAttempt;
  isOpenPopupLastAttempt: boolean;
  setIsOpenPopupLastAttempt: Dispatch<SetStateAction<boolean>>;
  data: IEntranceTest;
  remainingTimeLastAttempt: number;
  handleSubmit: (redirectToResult: boolean) => void;
  isLoading: boolean;
}

const EntrancePopupContinue = ({
  currentAttempt,
  isOpenPopupLastAttempt,
  setIsOpenPopupLastAttempt,
  data,
  remainingTimeLastAttempt,
  handleSubmit,
  isLoading,
}: EntrancePopupContinueProps) => {
  // useEffect(() => {
  //     if(remainingTimeLastAttempt === 0) {
  //         handleSubmitNow()
  //     }
  // }, [remainingTimeLastAttempt])
  const {router} = useFeature()

  const handleRedirectResult = () => {
    const searchParams = getNoOfAttemptEntranceTest({ data, currentAttempt });
    router.push(
      `/entrance-test/test-result/${currentAttempt?.id}?${searchParams}`,
    );
  };

  const handleStartANewAttempt = async () => {
    //reset local storage
    localStorage.removeItem("quizAttempt");

    try {
      router.push(`/test/${data?.id}?type=entrance`);
      trackGAEvent("Click Button Start Modal Test");
    } catch (err) {}
  };

  const handleContinueLastAttempt = async () => {
    try {
      router.push(`/test/${data?.id}?type=entrance`);
      trackGAEvent("Click Button Continue Modal Test");
    } catch (err) {}
  };

  const renderFooter = () => {
    if (remainingTimeLastAttempt === 0) {
      return (
        <>
          <ButtonPrimary
            title="View result"
            full
            size="medium"
            onClick={handleRedirectResult}
          />
          {data?.attempts?.length < data?.limit_count && (
            <ButtonText
              title="Start a new attempt"
              full
              size="medium"
              onClick={handleStartANewAttempt}
            />
          )}
        </>
      );
    }
    if (data?.limit_count === data?.attempts?.length) {
      //lượt làm cuối cùng của
      return (
        <>
          <ButtonPrimary
            title="Continue"
            full
            size="medium"
            onClick={handleContinueLastAttempt}
          />
          <ButtonSecondary
            title="Submit now"
            full
            size="medium"
            loading={isLoading}
            onClick={() => handleSubmit(true)}
          />
        </>
      );
    } else {
      return (
        <>
          <ButtonPrimary
            title="Continue the previous attempt"
            full
            size="medium"
            onClick={handleContinueLastAttempt}
          />
          <ButtonSecondary
            title="Submit now"
            full
            size="medium"
            loading={isLoading}
            onClick={() => handleSubmit(true)}
          />
          <ButtonText
            title="Start a new attempt"
            full
            size="medium"
            onClick={handleStartANewAttempt}
          />
        </>
      );
    }
  };

  return (
    <TestPopup
      title={
        <div
          className={`flex items-center justify-center ${remainingTimeLastAttempt === 0 ? "mt-10" : "mt-0"}`}
        >
          Entrance Test
        </div>
      }
      open={isOpenPopupLastAttempt}
      setOpen={setIsOpenPopupLastAttempt}
      time={
        dayjs()
          .startOf("day")
          .add(
            remainingTimeLastAttempt >= 0 ? remainingTimeLastAttempt : 0,
            "second",
          ) || ""
      }
      customFooter={
        <div className="flex w-full flex-col items-center justify-center gap-3">
          {renderFooter()}
        </div>
      }
      gapContent={"gap-8"}
    />
  );
};

export default EntrancePopupContinue;
