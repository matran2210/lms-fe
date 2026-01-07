import { isEmpty } from 'lodash'
import { NoData, SappModalV3 } from '@lms/ui'
import EventTest from './EventTest'
import { IEventTest } from '@lms/core'
import { useCourseContext } from '@lms/contexts'
import { IconCongrats } from '@lms/assets'
import ContentTestCongratution from './ContentTestCongratution'
// import { ANIMATION } from '@lms/core'

const EventTestList = ({
  eventTestLists,
  onRefetch,
}: {
  eventTestLists: IEventTest[]
  onRefetch: () => void
}) => {
  const { setSubmitEventTest, submitEventTest } = useCourseContext();

  const handleCancelModalSubmitTest = () => {
    setSubmitEventTest(false);
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
          ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'
          : 'flex min-h-[calc(100vh-15rem)] items-center justify-center'
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
      open={submitEventTest}
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
        JSON.parse(localStorage.getItem("category") as any),
      )}
    </SappModalV3>
    </>
  )
}

export default EventTestList
