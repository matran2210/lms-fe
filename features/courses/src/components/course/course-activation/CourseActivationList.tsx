import { ICourseActivation } from "@lms/core";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import CourseActivation from "./CourseActivation";
import ModalActiveCourseActivation from "./ModalActiveCourseActivation";
import ModalChoosingClass from "./ModalChoosingClass";
import { NoCoursesAvailable } from "@lms/ui";

interface CoursesProps {
  courses: ICourseActivation[];
  lastElementRef: (node: HTMLDivElement) => void;
  refetch: () => void;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isTeacher?: boolean;
}

const CourseActivationList: React.FC<CoursesProps> = ({
  courses,
  refetch,
  isFetching,
}) => {
  const [openActiveCourse, setOpenActiveCourse] = useState<{courseId: string; open: boolean}>({courseId: '', open: false});
  const [openChooseClass, setOpenChooseClass] = useState<{courseId: string; open: boolean, courseName?: string}>({courseId: '', open: false, courseName: ''});

  const handleCloseChooseClass = () => {
    setOpenChooseClass({courseId: '', open: false, courseName: ''});
  };
  const handleCloseActiveCourse = () => {
    setOpenActiveCourse({courseId: '', open: false});
  };

  if (isFetching) {
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
              refetch={refetch}
              setOpenChooseClass={setOpenChooseClass}
              />
          ))}
        </div>
      )}
      <ModalChoosingClass open={openChooseClass} onCancel={handleCloseChooseClass} />
      <ModalActiveCourseActivation
        open={openActiveCourse}
        onCancel={handleCloseActiveCourse}
      />
    </>
  );
};

export default CourseActivationList;
