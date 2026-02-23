import { useFeature } from "@lms/contexts";
import { ISubjectWaitingActivation } from "@lms/core";
import { NoCoursesAvailable } from "@lms/ui";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { useQuery } from "react-query";
import CourseActivation from "./CourseActivation";
import ModalActiveCourseActivationFailed from "./ModalActiveCourseActivationFailed";
import ModalChoosingClass from "./ModalChoosingClass";
import NoAvailableClasses from "./NoAvailableClasses";

interface CoursesProps {
  courses?: ISubjectWaitingActivation[];
  refetch: () => void;
  isFetching: boolean;
}

const CourseActivationList: React.FC<CoursesProps> = ({
  courses,
  refetch,
  isFetching,
}) => {
  const { courseActivationAPI } = useFeature();
  const [courseActive, setCourseActive] =
    useState<ISubjectWaitingActivation | null>(null);

  const {
    data: dataCourseActive,
    isLoading: isLoadingCourseActive,
    isSuccess: isSuccessCourseActive,
  } = useQuery({
    queryKey: ["class-for-activate-subject", courseActive?.subject_id],
    queryFn: () =>
      courseActivationAPI.getSubjectClassForActivateSubject(
        courseActive?.subject_id || "",
      ),
    enabled: !!courseActive?.subject_id,
    staleTime: 0, 
    cacheTime: 0, 
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const canActive = dataCourseActive?.data?.can_active;

  const classes = dataCourseActive?.data;

  const mergedClasses = [
    classes?.class_suggest_on_going,
    classes?.class_suggest_upcoming,
  ].filter(Boolean);

  const handleCloseActiveCourse = () => {
    setCourseActive(null);
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
              setCourseActive={setCourseActive}
            />
          ))}
        </div>
      )}
      <ModalChoosingClass
        open={
          canActive &&
          isSuccessCourseActive &&
          !!courseActive &&
          mergedClasses.length > 0
        }
        onCancel={handleCloseActiveCourse}
        classes={mergedClasses}
        isLoading={isLoadingCourseActive}
        courseName={courseActive?.subject_name}
      />
      <NoAvailableClasses
        open={
          canActive &&
          isSuccessCourseActive &&
          !!courseActive &&
          mergedClasses.length === 0
        }
        onCancel={handleCloseActiveCourse}
      />
      <ModalActiveCourseActivationFailed
        open={!canActive && isSuccessCourseActive && !!courseActive}
        onCancel={handleCloseActiveCourse}
        error={dataCourseActive?.data?.message}
      />
    </>
  );
};

export default CourseActivationList;
