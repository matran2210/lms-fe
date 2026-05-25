import { CourseTimeIcon, GraduationCapIcon, Icon } from "@lms/assets";
import { useCourseContext, useFeature } from "@lms/contexts";
import { ButtonSecondary, Tooltip } from "@lms/ui";
import {
  clearStylesHtml,
  convertHourToDayLeft,
  convertLocalTimeToUTC,
  getUserPrefix,
  trackGAEvent,
  truncateString,
} from "@lms/utils";
import { differenceInDays, parseISO, startOfDay } from "date-fns";
import isNull from "lodash/isNull";
import round from "lodash/round";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
// import {Tooltip} from '@lms/ui' lỗi monorepo
import {
  BUTTON_STATUS,
  CLASS_STATUS,
  CLASS_USER_STATUS,
  CLASS_USER_TYPES,
  COURSE_STATUS,
  COURSE_TYPE,
  ICourse,
  LEARNING_USER_STATUS,
  PROGRAM,
} from "@lms/core";
import { useTailwindBreakpoint } from "@lms/hooks";
import clsx from "clsx";
import dayjs from "dayjs";
import ModalFoundationCompleted from "./ModalFoundationCompleted";
import PopupActive from "./PopupActive";
import PopupExtend from "./PopupExtend";
import PopupLesson from "./PopupLesson";
import PopupOpenClass from "./PopupOpenClass";
import { CardCourse } from "../course/card-course";

const Course = ({
  course,
  index,
  lastElementRef,
  refetch,
  isTeacher = false,
}: {
  course: ICourse;
  index: number;
  lastElementRef: (node: HTMLDivElement) => void;
  refetch: () => void;
  isTeacher?: boolean;
}) => {
  const {  courseApi, pageLink, router  } = useFeature();
  const [openExtend, setOpenExtend] = useState<boolean>(false);
  const [openActive, setOpenActive] = useState<boolean>(false);
  const [timeActive, setTimeActive] = useState<number>();
  const [openLesson, setOpenLesson] = useState<boolean>(false);
  const [openClass, setOpenClass] = useState<boolean>(false);
  const student = course?.classes?.[0]?.class_user_instances?.[0];
  const classInstance = course?.classes[0];
  const [daysDifference, setDaysDifference] = useState(0);
  const currentDate = useMemo(() => new Date(), []);
  const userPrefix = getUserPrefix(isTeacher, pageLink);
  useEffect(() => {
    if (student?.finished_at) {
      const currentLocalDate = new Date();
      const currentUTCDate = convertLocalTimeToUTC(currentLocalDate);
      const finishDate = new Date(student?.finished_at);
      const finishUTCDate = convertLocalTimeToUTC(finishDate);

      const currentTime = currentUTCDate.getTime();
      const finishTime = finishUTCDate.getTime();

      const theRestHours = (finishTime - currentTime) / 3600000;
      const dayLefts = convertHourToDayLeft(theRestHours);

      // Update state with the difference
      setDaysDifference(dayLefts);
    }
  }, [course, student?.finished_at]);

  const { isMobileView, isDesktopView, isTabletView } = useTailwindBreakpoint();

  const percentProgress =
    round(
      (Number(
        student?.learning_progress?.total_course_sections_completed ?? 0,
      ) /
        Number(student?.learning_progress?.total_course_sections ?? 0)) *
        100,
      2,
    ) || 0;

  const disabledCourseByClassType = [
    CLASS_USER_TYPES.RESERVED,
    CLASS_USER_TYPES.RETOOK,
    CLASS_USER_TYPES.TRANSFERED_TO,
    CLASS_USER_TYPES.MOVED_OUT,
    CLASS_USER_TYPES.CANCELED,
  ];

  // Function để hiển thị status của course
  const checkStatusCourse = () => {
    const courseStatus = course?.status;
    const classStatus = classInstance?.status;
    const classUserType = classInstance?.class_user_instances[0].type;
    const studentStatus = student?.status;
    const startedAt = student?.started_at;
    const finishedAt = student?.finished_at;

    // Chuyển đổi sang chuỗi theo định dạng ISO
    const formattedDate = new Date();

    if (
      courseStatus === COURSE_STATUS.PUBLISH ||
      courseStatus === COURSE_STATUS.LOCK ||
      courseStatus === COURSE_STATUS.BLOCK
    ) {
      if (
        classUserType === CLASS_USER_TYPES.TRANSFERED_TO &&
        classInstance?.type === "LESSON"
      ) {
        return BUTTON_STATUS.Disabled;
      }
      if (
        classStatus === CLASS_STATUS.PUBLIC ||
        classStatus === CLASS_STATUS.ENDED
      ) {
        if (course?.course_type === "TRIAL_COURSE" && !student) {
          if (classInstance?.duration_type === "FLEXIBLE")
            return BUTTON_STATUS.Active;
          if (
            classInstance?.duration_type === "FIXED" &&
            classInstance?.finished_at
          ) {
            const classFinish = new Date(classInstance?.finished_at as any);
            if (classFinish <= formattedDate) return BUTTON_STATUS.Extend;
            if (classFinish > formattedDate) return BUTTON_STATUS.Active;
          }
        }
        if (!startedAt && !finishedAt) {
          if (classInstance?.duration_type === "FLEXIBLE")
            return BUTTON_STATUS.Active;
          else return BUTTON_STATUS.Disabled; // Thông báo lỗi học viên không có trong lớp
        }

        if (startedAt && finishedAt) {
          const finishedAtDate = new Date(student?.finished_at as any);
          if (
            course?.course_type === "TRIAL_COURSE" &&
            finishedAtDate <= formattedDate
          )
            return BUTTON_STATUS.Extend;
          if (finishedAtDate <= formattedDate) return BUTTON_STATUS.Disabled;
          if (finishedAtDate > formattedDate) {
            if (studentStatus === "READY_TO_LEARN") return BUTTON_STATUS.Begin;
            if (studentStatus === "IN_PROGRESS") return BUTTON_STATUS.Resume;
            if (studentStatus === "COMPLETED") return BUTTON_STATUS.Review;
          } else return BUTTON_STATUS.Disabled;
        }

        if (startedAt && isNull(finishedAt)) {
          if (studentStatus === LEARNING_USER_STATUS.READY_TO_LEARN)
            return BUTTON_STATUS.Begin;
          if (studentStatus === LEARNING_USER_STATUS.IN_PROGRESS)
            return BUTTON_STATUS.Resume;
          if (studentStatus === LEARNING_USER_STATUS.COMPLETED)
            return BUTTON_STATUS.Review;
        }

        return BUTTON_STATUS.Disabled;
      }
      if (
        classStatus === CLASS_STATUS.DRAFT ||
        classStatus === CLASS_STATUS.BLOCK
      )
        return BUTTON_STATUS.Hidden;
      return BUTTON_STATUS.Hidden;
    }

    if (
      courseStatus === COURSE_STATUS.DRAFT ||
      disabledCourseByClassType.includes(classUserType)
    )
      return BUTTON_STATUS.Hidden;

    return BUTTON_STATUS.Hidden;
  };

  const determineButtonToShow = checkStatusCourse() as any;

  // Set active course dựa theo trạng thái của học viên
  const renderStatusUser = (status: string) => {
    switch (status) {
      case CLASS_USER_TYPES.RESERVED:
        return false;
      case CLASS_USER_TYPES.TRANSFERED_TO:
        return false;
      // case CLASS_USER_TYPES.CANCELED:
      //   return false;
      default:
        return true;
    }
  };
  const isActiveStudent = renderStatusUser(student?.status ?? "");

  async function activeCourse(foundation_class_id?: string) {
    if (course?.course_type === "TRIAL_COURSE") {
      localStorage.setItem(
        "daysDifference",
        course?.classes?.[0]?.flexible_days as any,
      );
      localStorage.setItem("showPinTrial", "true");
    } else {
      localStorage.removeItem("daysDifference");
      localStorage.removeItem("showPinTrial");
    }
    try {
      const params = {
        classId: foundation_class_id ? foundation_class_id : classInstance?.id,
      };
      const res = (await courseApi.activeCourse(params)) as {
        success: boolean;
      };
      if (res?.success) {
        router.push(
          `${userPrefix}/courses/my-course/${foundation_class_id || classInstance?.id}`,
        );

        refetch();
        if (course?.course_categories?.[0]?.name !== "ACCA") {
          toast.success("Active thành công!");
        }
      }
    } catch {}
  }
  async function extendCourse() {
    try {
      const res = (await courseApi.extendCourse({
        classId: classInstance?.id,
      })) as { success: boolean };
      if (res?.success) {
        refetch();
        toast.success("Gia hạn hành công!");
      }
    } catch {}
  }

  const { courseType } = useCourseContext();
  const category = course?.course_categories[0]?.name || "";

  useEffect(() => {
    if (course?.course_type === "TRIAL_COURSE") {
      localStorage.setItem("daysDifference", "");
    } else {
      localStorage.removeItem("daysDifference");
    }
  }, [courseType]);

  const handleCourseDetail = () => {
    const isRedirectDashboard =
      (course?.course_type == COURSE_TYPE.NORMAL_COURSE ||
        course?.course_type == COURSE_TYPE.PRACTICE_COURSE) &&
      (category == PROGRAM.ACCA ||
        category == PROGRAM.CFA ||
        category == PROGRAM.CMA ||
        category == PROGRAM.LD ||
        category == PROGRAM.B2B_EMOTIONAL_INTELLIGENCE);

    // Redirect to dashboard if the course type is practice, normal
    const basePath = `${userPrefix}/courses/my-course/${classInstance?.id}`;
    const path =
      isRedirectDashboard &&
      !isTeacher &&
      (determineButtonToShow === BUTTON_STATUS.Review ||
        determineButtonToShow === BUTTON_STATUS.Resume)
        ? `${basePath}/dashboard`
        : basePath;

    router.push(path);

    if (isRedirectDashboard) {
      localStorage.setItem(
        "courseInfo",
        JSON.stringify({
          name: course.name,
          courseType: course.course_type,
          category: category,
        }),
      );
    } else {
      localStorage.removeItem("courseInfo");
    }
    if (
      !isTeacher &&
      isRedirectDashboard &&
      (determineButtonToShow == BUTTON_STATUS.Review ||
        determineButtonToShow == BUTTON_STATUS.Resume)
    ) {
      router.push(
        `${userPrefix}/courses/my-course/${classInstance?.id}/dashboard`,
      );
      return;
    } else {
      router.push(`${userPrefix}/courses/my-course/${classInstance?.id}`);
    }

    router.push(`${userPrefix}/courses/my-course/${classInstance?.id}`);

    localStorage.setItem("courseDetail", basePath);
    if (course?.course_type === "TRIAL_COURSE") {
      localStorage.setItem("daysDifference", daysDifference as any);
    } else {
      localStorage.removeItem("daysDifference");
    }
  };

  /**
   * @description Trạng thái điều khiển việc hiển thị modal hoặc giao diện tiếp tục học lớp nền tảng.
   *
   * @type {boolean}
   * @default false - Mặc định đóng modal.
   */
  const [openContinue, setOpenContinue] = useState(false);

  const utcNow = dayjs().utc();
  const isPendingLesson =
    classInstance?.type === "LESSON" && !student?.is_passed;
  const isAccaCourse = category === "ACCA";
  const isCertDipCourse = category === "Cert/Dip";
  // const isFixedDuration =
  //   classInstance?.duration_type === "FIXED" ||
  //   classInstance?.duration_type === "FLEXIBLE";
  const isFlexibleDuration = classInstance?.duration_type === "FLEXIBLE";
  const hasNotStarted = dayjs(utcNow).isBefore(
    classInstance?.class_user_instances?.[0]?.started_at,
  );
  const isNotOpened = !classInstance?.class_user_instances?.[0]?.is_opened;
  const isCanceled =
    classInstance?.class_user_instances?.[0]?.status ===
    CLASS_USER_STATUS.CANCELED;

  const courseAction = () => {
    // Handle pending lesson cases
    if (isPendingLesson) {
      if (isAccaCourse || isCertDipCourse) {
        if (hasNotStarted) {
          setOpenClass(true);
          return;
        }
        setOpenContinue(true);
        return;
      }
      setOpenLesson(true);
      return;
    }

    // Handle active course case
    if (determineButtonToShow === "Active") {
      if (isFlexibleDuration) {
        setTimeActive(Number(classInstance?.flexible_days));
      } else {
        const classFinishedAt = parseISO(
          classInstance?.finished_at as any,
        ).setUTCHours(0, 0, 0, 0);
        const getDateActive = differenceInDays(
          startOfDay(classFinishedAt),
          startOfDay(currentDate),
        ) as any;
        setTimeActive(Number(getDateActive + 1));
      }
      setOpenActive(true);
      return;
    }

    // Handle extend case
    if (determineButtonToShow === "Extend") {
      setOpenExtend(true);
      return;
    }

    // Handle not opened case
    if (isNotOpened) {
      setOpenClass(true);
      return;
    }

    // Handle default case
    if (!isCanceled && determineButtonToShow !== "Disabled") {
      handleCourseDetail();
    }
  };

  // Set enable course dựa theo trạng thái của course
  const statusMap = {
    [CLASS_USER_STATUS.READY_TO_LEARN]: "Ready to learn",
    [CLASS_USER_STATUS.COMPLETED]: "Completed",
    [CLASS_USER_STATUS.IN_PROGRESS]: "In progress",
    [CLASS_USER_STATUS.CANCELED]: "",
  } as const;

  const classUserStatus = student?.status as keyof typeof statusMap;
  const showStatus = statusMap[classUserStatus];
  const enableCourse =
    determineButtonToShow !== "Disabled" && determineButtonToShow !== "Extend";

  // Set active course dựa theo trạng thái của học viên
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case `${CLASS_USER_STATUS.READY_TO_LEARN}`:
        return "like";
      case `${CLASS_USER_STATUS.IN_PROGRESS}`:
        return "hour";
      case `${CLASS_USER_STATUS.COMPLETED}`:
        return "completed";
      default:
        return "";
    }
  };
  const iconType = renderStatusIcon(classUserStatus ?? "");

  const progressPart = percentProgress > 100 ? 100 : percentProgress;

  /**
   * @description Xử lý điều hướng người dùng đến lớp học nền tảng (foundation class) đầu tiên của khóa học.
   * URL sẽ được tạo từ `foundation_class_id` nằm trong kết nối lớp học thường.
   *
   * @remarks
   * - Hàm sử dụng `router.push` để điều hướng.
   * - Nếu không có `course` hoặc dữ liệu lớp học chưa sẵn sàng, đường dẫn có thể không chính xác.
   */
  const handleContinueFoundation = () => {
    router.push(
      `${userPrefix}/courses/my-course/${course?.classes?.[0]?.normal_class_connections?.[0]?.foundation_class_id}`,
    );
  };

  /**
   * @description Gửi yêu cầu bỏ qua (skip) lớp học nền tảng hiện tại cho khóa học.
   *
   * @remarks
   * - Gọi API `CoursesAPI.skipFoundation` với `classId` đầu tiên trong danh sách lớp học.
   * - Sau khi thao tác thành công, gọi lại `refetch()` để cập nhật lại dữ liệu giao diện.
   *
   * @returns {Promise<void>}
   */
  const handleSkipCourse = async () => {
    try {
      await courseApi.skipFoundation(course?.classes?.[0]?.id);
    } finally {
      setOpenContinue(false);
      handleCourseDetail();
    }
  };

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

  const sizeIcon = "h-5 w-5 md:h-[1.25rem] md:w-[1.25rem]";
  const classNameDes = `text-sm font-normal md:text-base ${
    enableCourse ? "text-gray-800" : "text-gray-300"
  }`;

  return (
    <>
      {determineButtonToShow !== "Hidden" && (
        <CardCourse
          title={course?.name}
          key={index}
          ref={lastElementRef}
          disabledTitle={!enableCourse}
          classNameTitle={`mb-4 line-clamp-2 sm:h-12 md:h-14`}
          hideBadge={true}
          badgeCode={{
            badge: category,
            className: "bg-[#B3CEE0] text-[#08719D] font-medium",
          }}
          classNameCard="lg:h-[434px] md:h-[390px] h-[312px]"
          onClick={() => {
            if (isActiveStudent) {
              courseAction();
            }
          }}
        >
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <GraduationCapIcon
                      className={sizeIcon}
                      fill={enableCourse ? "#1C274C" : "#D1D5DB"}
                    />
                  </div>
                  <div
                    className={`text-xs font-semibold ${enableCourse ? "text-icon" : "text-gray-300"}  md:text-sm`}
                  >
                    <Tooltip
                      title={course?.classes?.[0]?.code}
                      // showTooltip={
                      //   course?.classes?.[0]?.code?.length > maxLengthTitle
                      // }
                    >
                      {truncateString(
                        course?.classes?.[0]?.code,
                        maxLengthTitle,
                      )}
                    </Tooltip>
                  </div>
                </div>

                {determineButtonToShow !== "Active" && (
                  <div className="flex items-center gap-1">
                    <div
                      className={`mr-1 ${
                        enableCourse ? "text-icon" : "text-gray-300"
                      }`}
                    >
                      <CourseTimeIcon className={sizeIcon} />
                    </div>
                    <div
                      className={`text-xs font-medium md:text-sm ${
                        enableCourse ? "text-icon" : "text-gray-300"
                      }`}
                    >
                      {daysDifference > 0
                        ? daysDifference
                        : enableCourse
                          ? 1
                          : 0}{" "}
                    </div>
                    <div
                      className={clsx(
                        "text-xs font-normal md:text-sm",
                        enableCourse ? "text-gray" : "text-gray-300",
                      )}
                    >
                      {daysDifference > 1 ? "days left" : "day left"}
                    </div>
                  </div>
                )}
              </div>
              <div className="des my-4 line-clamp-3 text-ellipsis leading-snug md:mb-8 md:mt-6 md:line-clamp-5">
                {(course?.description as string)?.length > 250 ? (
                  <Tooltip
                    title={
                      <p
                        dangerouslySetInnerHTML={{
                          __html: clearStylesHtml(course?.description),
                        }}
                      />
                    }
                    placement="bottom"
                  >
                    <p
                      dangerouslySetInnerHTML={{
                        __html: clearStylesHtml(course?.description),
                      }}
                      className={classNameDes}
                    />
                  </Tooltip>
                ) : (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: clearStylesHtml(course?.description),
                    }}
                    className={classNameDes}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              {enableCourse && (
                <div className="progress mb-6">
                  <div className="info mb-1.5 flex items-center justify-between">
                    <div className="text flex items-center">
                      <Icon
                        type={enableCourse ? iconType : "expired"}
                        className={`relative ${
                          enableCourse ? "text-gray-800" : "text-gray-300"
                        }`}
                      />
                      <p
                        className={`text-sm font-normal ${
                          enableCourse ? "text-gray-800" : "text-gray-300"
                        } ml-px pl-2`}
                      >
                        {enableCourse ? showStatus : "Expired"}
                      </p>
                    </div>
                    <div className="number">
                      <p
                        className={`text-sm font-normal ${
                          enableCourse ? "text-gray-800" : "text-gray-300"
                        }`}
                      >
                        {progressPart}%
                      </p>
                    </div>
                  </div>
                  <div className="progressbar h-[6px] rounded-[100px] bg-gray-200">
                    <div
                      className={`progress-percentage rounded-[100px] ${
                        enableCourse ? "bg-primary" : "bg-gray-200"
                      } h-[6px]`}
                      style={{ width: `${progressPart}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className={clsx("action flex items-center justify-end")}>
                {determineButtonToShow !== "Disabled" && (
                  <ButtonSecondary
                    full
                    size="small"
                    title={
                      determineButtonToShow === "Active"
                        ? "Activate"
                        : determineButtonToShow
                    }
                    className="w-full md:w-[84px]"
                    onClick={() => {
                      if (isActiveStudent) {
                        courseAction();
                      }
                      trackGAEvent("CLick Button Course Item");
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {/* <ResultRowsModal open={open} setOpen={setOpen} /> */}
        </CardCourse>
      )}
      <PopupExtend
        open={openExtend}
        setOpen={setOpenExtend}
        extendCourse={extendCourse}
        extend_count={student?.extend_count}
      />
      <PopupActive
        time={timeActive}
        open={openActive}
        setOpen={setOpenActive}
        activeCourse={activeCourse}
      />
      <PopupLesson open={openLesson} setOpen={setOpenLesson} />
      <PopupOpenClass
        open={openClass}
        setOpen={setOpenClass}
        started_at={classInstance?.class_user_instances?.[0]?.started_at}
      />
      <ModalFoundationCompleted
        openContinue={openContinue}
        handleSkipCourse={handleSkipCourse}
        handleClose={() => setOpenContinue(false)}
        handleContinueFoundation={
          classInstance?.duration_type === "FLEXIBLE"
            ? () =>
                activeCourse(
                  classInstance?.normal_class_connections?.[0]
                    ?.foundation_class_id,
                )
            : handleContinueFoundation
        }
      />
    </>
  );
};

export default Course;
