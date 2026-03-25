import { ArrowRightIcon, BookContinueLearningImage } from "@lms/assets";
import { PinnedNotificationWrapper } from "@lms/ui";
import Image from "next/image";
import { useFeature } from "@lms/contexts";
import { InstructionText } from "./InstructionText";

const ContinueLearning = () => {
  const {router, pageLink, query, params} = useFeature()
  const goToCourseContent = () => {
    router.push(
      pageLink.COURSE_DETAIL.replace(
        "[courseId]",
        params?.courseId as string || query.courseId as string,
      ),
    );
  };

  return (
    <div className="z-2 sticky inset-x-0 bottom-4">
      <div className="flex w-full flex-col gap-4">
        <PinnedNotificationWrapper
          bgColor="bg-primary-200"
          borderColor="border-primary"
          classPinned="bottom-5 flex flex-col gap-0 md:flex-row md:items-center md:justify-between md:gap-4"
        >
          {/* Nội dung chính bên trái */}
          <div className="flex items-center md:items-start gap-2 md:gap-4">
            {/* Hình ảnh */}
            <div className="h-6 w-6 md:size-10">
              <Image src={BookContinueLearningImage} alt="pinned-completed-course" />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2">
              <div className="text-base font-semibold text-gray-800 md:text-xl">
                Continue your learning journey!
              </div>

              {/* Desktop text */}
              <div className="hidden text-base text-gray-800 md:block">
                <InstructionText onClick={() => goToCourseContent()} />
              </div>
            </div>
          </div>

          {/* Mobile text */}
          <div className="mt-2 block text-sm text-gray-800 md:hidden">
            <InstructionText onClick={() => goToCourseContent()} />
          </div>

          {/* Link bên phải */}
          <div
            className="mt-2 hidden cursor-pointer items-center justify-start gap-2 md:mt-0 lg:flex lg:justify-end"
            onClick={() => goToCourseContent()}
          >
            <span className="text-red-800 text-sm font-semibold underline md:text-base">
              Course Content
            </span>
            <ArrowRightIcon />
          </div>
        </PinnedNotificationWrapper>
      </div>
    </div>
  );
};

export default ContinueLearning;
