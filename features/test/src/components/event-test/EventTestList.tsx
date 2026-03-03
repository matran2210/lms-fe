import { IconCongrats } from "@lms/assets";
import { useFeature } from "@lms/contexts";
import { IEventTest } from "@lms/core";
import { NoData, SappModalV3 } from "@lms/ui";
import { isEmpty } from "lodash";
import ContentTestCongratution from "./ContentTestCongratution";
import EventTest from "./EventTest";

const EventTestList = ({
  eventTestLists,
  onRefetch,
}: {
  eventTestLists: IEventTest[];
  onRefetch: () => void;
}) => {
  const { query, router, pathname } = useFeature();
  const category = query?.category;
  const submitedTest = query?.submitted;

  const handleCancelModalSubmitTest = () => {
    const params = new URLSearchParams(query);
    params.delete("submitted");

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  };

  const renderContentPopup = (type: string) => {
    switch (type) {
      case "ACCA":
        return (
          <ContentTestCongratution
            text1="Your test results will"
            text2="be emailed to you on November 11, 2025"
            text3="Please check your email regularly to receive the earliest update."
          />
        );
      case "CMA":
        return (
          <ContentTestCongratution
            text1="Your results will"
            text2="be emailed to you on October 14, 2025"
            text3="Please remember to check your inbox to ensure you don’t miss the update."
          />
        );
      case "CFA":
        return (
          <ContentTestCongratution
            text1="Your results will"
            text2="be emailed to you on January 26, 2026"
            text3="Please remember to check your inbox to ensure you don’t miss the update."
          />
        );
      default:
        return (
          <ContentTestCongratution
            text1="Your test results will"
            text2="be emailed to you on October 04, 2024"
            text3="Please check your email regularly to receive the earliest update."
          />
        );
    }
  };

  return (
    <>
      <div
        className={`${
          !isEmpty(eventTestLists)
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            : "flex min-h-[calc(100vh-15rem)] items-center justify-center"
        }`}
        // data-aos={ANIMATION.DATA_AOS}
      >
        {!isEmpty(eventTestLists) ? (
          eventTestLists?.map((e: IEventTest, index) => (
            <EventTest key={index} data={e} onRefetch={onRefetch} />
          ))
        ) : (
          <NoData />
        )}
      </div>
      <SappModalV3
        handleClose={handleCancelModalSubmitTest}
        open={submitedTest}
        okButtonCaption="Back"
        handleCancel={handleCancelModalSubmitTest}
        onOk={handleCancelModalSubmitTest}
        fullWidthBtn={true}
        buttonSize="medium"
        icon={<IconCongrats />}
        header={
          <div className={`flex items-center justify-center`}>
            Congratulations
          </div>
        }
      >
        {renderContentPopup(
          // JSON.parse(localStorage.getItem("category") as any),
          category as string,
        )}
      </SappModalV3>
    </>
  );
};

export default EventTestList;
