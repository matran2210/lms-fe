import { ICourse } from "@lms/core";
import { NoCoursesAvailable } from "@lms/ui";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import CourseActivation from "./CourseActivation";
import ModalActiveCourseActivation from "./ModalActiveCourseActivation";
import ModalChoosingClass from "./ModalChoosingClass";

interface CoursesProps {
  courses: ICourse[];
  lastElementRef: (node: HTMLDivElement) => void;
  refetch: () => void;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isTeacher?: boolean;
}

const CourseActivationList: React.FC<CoursesProps> = ({
  courses,
  lastElementRef,
  refetch,
  isFetching,
  isFetchingNextPage,
}) => {
  const [openActiveCourse, setOpenActiveCourse] = useState(false);
  const [openChooseClass, setOpenChooseClass] = useState(false);

  const handleCloseChooseClass = () => {
    setOpenChooseClass(false);
  };
  const handleCloseActiveCourse = () => {
    setOpenActiveCourse(false);
  };

  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="mb-6 grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3 xl-max:px-6">
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="item flex w-full flex-col rounded-xl bg-white p-7.5 shadow-sidebar"
            >
              <div className="flex min-h-[352px] flex-col">
                {/* Skeleton content */}
                <div className="w-full animate-pulse space-y-4">
                  {/* Khối chính */}
                  <div className="h-6 w-3/4 animate-pulse rounded-md bg-skeleton"></div>
                  <div className="h-5 w-1/2 animate-pulse rounded-md bg-skeleton"></div>
                  <div className="h-36 w-full animate-pulse rounded-md bg-skeleton"></div>
                </div>
                {/* Skeleton button */}
                <div className="mt-auto self-end">
                  <div className="h-8 w-24 animate-pulse rounded-md bg-skeleton"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (isEmpty(courses))
    return <NoCoursesAvailable title="No Available Courses" />;

  return (
    <>
      {!isEmpty(courses) && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {courses?.map((course, index: number) => (
            <CourseActivation
              key={index}
              course={course}
              index={index}
              lastElementRef={lastElementRef}
              refetch={refetch}
              setOpenActiveCourse={setOpenActiveCourse}
            />
          ))}
        </div>
      )}
      <ModalActiveCourseActivation
        open={openActiveCourse}
        onCancel={handleCloseActiveCourse}
      />
      <ModalChoosingClass open={openChooseClass} onCancel={handleCloseChooseClass} />
    </>
  );
};

export default CourseActivationList;
