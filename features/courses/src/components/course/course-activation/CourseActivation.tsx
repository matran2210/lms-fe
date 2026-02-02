import { CalendarIconOutline } from "@lms/assets";
import { ButtonSecondary } from "@lms/ui";
// import {Tooltip} from '@lms/ui' lỗi monorepo
import { ICourse } from "@lms/core";
import { useTailwindBreakpoint } from "@lms/hooks";
import clsx from "clsx";
import { CardCourseActivation } from "../card-course";

const CourseActivation = ({
  course,
  index,
  lastElementRef,
  refetch,
  setOpenActiveCourse,
}: {
  course: ICourse;
  index: number;
  lastElementRef: (node: HTMLDivElement) => void;
  refetch: () => void;
  setOpenActiveCourse: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isMobileView, isDesktopView, isTabletView } = useTailwindBreakpoint();

  const category = course?.course_categories[0]?.name || "";

  let maxLengthTitle = 25;

  switch (true) {
    case isDesktopView:
      maxLengthTitle = 25;
      break;
    case isTabletView:
      maxLengthTitle = 15;
      break;
    case isMobileView:
      maxLengthTitle = 20;
      break;
    default:
      maxLengthTitle = 25;
  }

  return (
    <>
      <CardCourseActivation
        title={course?.name}
        key={index}
        ref={lastElementRef}
        classNameTitle={`mb-4 line-clamp-2 h-12  sm:h-12 md:h-14`}
        hideBadge={true}
        badgeCode={{
          badge: category,
          className: "bg-badge-200 text-badge-500 font-medium",
        }}
        classNameCard="lg:h-[220px] md:h-[220px] h-[178px]"
        onClick={() => {}}
      >
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`text-xs font-semibold flex gap-2 items-center md:text-sm`}
                >
                  <CalendarIconOutline />
                  Activation Expiry Date
                </div>
              </div>

              <div className="flex items-center gap-1 font-semibold text-xs">
                11/01/2025
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className={clsx("action flex items-center justify-end")}>
              <ButtonSecondary
                full
                size="small"
                title={"Activate"}
                className="w-full md:w-[84px]"
                onClick={() => setOpenActiveCourse(true)}
              />
            </div>
          </div>
        </div>
      </CardCourseActivation>
    </>
  );
};

export default CourseActivation;
