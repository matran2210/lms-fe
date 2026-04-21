import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { IEvent } from "@sapp-fe/sapp-common-package";
import { ICalendarDetail } from "@lms/core";
import CourseTree from "./CourseTree";
import dayjs, { Dayjs } from "dayjs";
import {
  ANIMATION,
  CALENDAR_FILTER_TYPE,
  LEARNING_USER_STATUS,
} from "@lms/core";
import { CourseSectionType, TEST_TYPE_ENUM } from "@lms/core";
import { LearningMode } from "@lms/core";
import { buildQueryString } from "@lms/utils";
import { CloseDetailIcon, StatusDotIcon, ZoomIcon } from "@lms/assets";
import { Divider } from "antd";
import clsx from "clsx";
import { ButtonPrimary, SappIcon } from "@lms/ui";
import { SpinIcon } from "@lms/assets";
import { useFeature } from "../../../../libs/state";

interface IProps {
  open: { isOpen: boolean; data: IEvent | null };
  setOpen: Dispatch<SetStateAction<{ isOpen: boolean; data: IEvent | null }>>;
}

const DetailCalendar = ({ open, setOpen }: IProps) => {
  const { calendarApi, router } = useFeature();
  const [data, setData] = useState<ICalendarDetail>();
  const [loading, setLoading] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<{ top: boolean; bottom: boolean }>({
    top: true,
    bottom: true,
  });

  const getMode = () => {
    if (data?.schedule.is_holiday) {
      return (
        <div className="flex max-w-fit items-center gap-1 rounded-[100px] bg-warning/5 px-[12px] py-[2px] text-sm font-normal text-warning">
          <StatusDotIcon />
          Holiday
        </div>
      );
    }

    const modeMap = {
      [CALENDAR_FILTER_TYPE.OFFLINE]: { text: "Offline", color: "success" },
      [CALENDAR_FILTER_TYPE.ONLINE]: { text: "Online", color: "info" },
      [CALENDAR_FILTER_TYPE.LIVE_ONLINE]: {
        text: "Live Online",
        color: "liveOnline",
      },
    } as const;

    const mode = data?.mode as keyof typeof modeMap;

    if (!mode || !modeMap[mode]) return null;

    const { text, color } = modeMap[mode];

    return (
      <div
        className={clsx(
          "max-w-fit",
          `bg-${color}/5`,
          `text-${color}`,
          "flex items-center gap-1 rounded-[100px] px-[12px] py-[2px] text-sm font-normal",
        )}
      >
        <StatusDotIcon />
        {text}
      </div>
    );
  };

  const getKeyContent = () => {
    return data?.key_after_contents?.map((item) => {
      return (
        <div
          key={item.id}
          className="max-w-[111px] rounded bg-[#F9F9F9] px-2 py-1 text-sm text-secondary"
        >
          {item.name}
        </div>
      );
    });
  };

  const isOnlyMidTermOrFinalTest =
    data?.is_test &&
    !data?.sections?.some((item) =>
      [TEST_TYPE_ENUM?.FINAL_TEST, TEST_TYPE_ENUM?.MID_TERM_TEST].includes(
        item?.course_section?.course_section_type as TEST_TYPE_ENUM,
      ),
    );

  const togglePopup = (position: "top" | "bottom") => {
    setCollapse((prev) => ({ ...prev, [position]: !prev[position] }));
  };

  const renderTime = useMemo(() => {
    const start = dayjs(
      `${data?.schedule?.start_date}T${data?.schedule?.start_time}Z`,
    );
    const end = dayjs(
      `${data?.schedule?.end_date}T${data?.schedule?.end_time}Z`,
    );
    if (data?.schedule.is_holiday) {
      return (
        <>
          <div className="col-span-1 ">Lesson Date:</div>
          <div className="col-span-1 text-right font-semibold">
            {start.format("MMM DD, YYYY")}
          </div>
        </>
      );
    }
    if (data?.mode === LearningMode?.ONLINE) {
      return (
        <>
          <div className="col-span-1 ">Lesson Date:</div>
          <div className="col-span-1 text-right font-semibold">{`${start.format("HH:mm")} | ${start.format("MMM DD YYYY")}`}</div>
          <div className="col-span-1 ">Deadline</div>
          <div className="col-span-1 text-right font-semibold">{`${end.format("HH:mm")} | ${end.format("MMM DD YYYY")}`}</div>
        </>
      );
    }
    return (
      <>
        <div className="col-span-1 ">Lesson Date:</div>
        <div className="col-span-1 text-right font-semibold">{`${start.format("HH:mm")} - ${end.format("HH:mm")} | ${start.format("MMM DD YYYY")}`}</div>
      </>
    );
  }, [data]);

  async function fetchData() {
    setLoading(true);
    try {
      if (!open?.data?.id) return;
      const res = await calendarApi?.getDetailEvent(
        open?.data?.id,
        open?.data?.type === "HOLIDAY",
      );
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }

  const dateNow = dayjs().add(7, "hour");
  const dateOpenSection = data?.class?.opening_at
    ? dayjs(data?.class?.opening_at)
    : dayjs(data?.class?.started_at);

  useEffect(() => {
    if (open.isOpen && open.data?.id !== data?.id) {
      fetchData();
    }
  }, [open]);

  const isOfflineOrLiveOnlineWithReview =
    [LearningMode.OFFLINE, LearningMode.LIVE_ONLINE].includes(
      data?.mode as LearningMode,
    ) && data?.is_review_allowed;

  const isOnlineAndOpen =
    data?.mode === LearningMode.ONLINE && dateOpenSection.isBefore(dateNow);

  const handleRedirectZoom = () => {
    const url = data?.class?.link_meeting;
    if (url) {
      window.open(url, "_blank");
    }
  };

  const renderFormattedDate = (date: Dayjs) => {
    const day = date.date().toString();
    const monthName = date.format("MMMM");
    const year = date.year();

    return (
      <div className="flex text-2xl">
        <div className="font-medium">
          {day}
          <span className="inline-block w-1" />
          {monthName},
          <span className="inline-block w-1" />
        </div>
        <div className="font-normal">{year}</div>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "sticky top-4 h-[calc(100vh-32px)] w-full flex-col overflow-y-auto rounded-2xl bg-white p-8 !text-gray-800 shadow-table lg:flex",
        "transition-all duration-300 ease-in-out",
        open.isOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0",
      )}
      data-aos={ANIMATION.DATA_AOS}
    >
      <div className="mb-8 flex items-center justify-start gap-2">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setOpen({ isOpen: false, data: null })}
        >
          <CloseDetailIcon />
        </button>
        {open?.data?.current_date
          ? renderFormattedDate(open?.data?.current_date as Dayjs)
          : null}
      </div>
      {data?.schedule && !loading ? (
        <>
          <div>
            <div className="mb-5 text-lg font-semibold">
              <div>Primary Information</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-base">
              <div className="col-span-1 ">
                {data?.schedule.is_holiday ? "Event Name:" : "Class Code:"}
              </div>
              <div className="col-span-1 text-right font-semibold">
                {data?.schedule.is_holiday ? data?.name : data?.class?.code}
              </div>
              <div className="col-span-1 ">
                {data?.schedule.is_holiday ? "Type:" : "Learning Mode:"}
              </div>
              <div className="col-span-1 flex justify-end gap-x-2">
                {getMode()}
                {!data?.schedule.is_holiday &&
                  dayjs(
                    `${data?.schedule.end_date}T${data?.schedule.end_time}`,
                  ).isBefore(new Date()) &&
                  ![LearningMode.OFFLINE, LearningMode?.LIVE_ONLINE]?.includes(
                    data?.mode as LearningMode,
                  ) && (
                    <div className="flex max-w-fit items-center gap-x-2 px-[19px] py-[4.5px]">
                      <SappIcon icon={"warningIcon"} />
                      <div className="font-medium text-error">Overdue</div>
                    </div>
                  )}
              </div>
              {renderTime}
              {data?.is_test && isOnlyMidTermOrFinalTest && (
                <>
                  <div className="col-span-1 ">Test Name:</div>
                  <div className="col-span-1 break-words text-right font-semibold">
                    {data?.name}
                  </div>
                </>
              )}
            </div>
          </div>
          {data?.mode === LearningMode.OFFLINE && (
            <>
              <Divider />
              <div className="flex flex-col gap-5">
                <div className="text-lg font-semibold text-[#1F2937]">
                  Classroom Detail
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2">
                    <div>Classroom:</div>
                    <div className="break-words text-right font-semibold">
                      {data?.room?.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div>Classroom Address:</div>
                    <div className="break-words text-right font-semibold">
                      {data?.room?.address}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {data?.mode === LearningMode.LIVE_ONLINE &&
            data.class.link_meeting && (
              <>
                <Divider />
                <div className="flex flex-col gap-5">
                  <div className="text-lg font-semibold text-[#1F2937]">
                    Classroom Detail
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2">
                      <div>Platform:</div>
                      <div
                        className="flex cursor-pointer justify-end"
                        onClick={handleRedirectZoom}
                      >
                        <ZoomIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          {!data?.schedule?.is_holiday && !isOnlyMidTermOrFinalTest && (
            <>
              <Divider />
              <div className="flex flex-col gap-5">
                <div className="text-lg font-semibold text-[#1F2937]">
                  Course Content
                </div>
                <CourseTree data={data?.sections ?? []} />
              </div>
            </>
          )}

          {!data?.schedule.is_holiday &&
            data?.key_after_contents?.length > 0 && (
              <>
                <Divider />
                <div className="flex flex-col gap-5">
                  <div className="col-span-1 text-lg font-semibold">
                    Key Content Before
                  </div>
                  <div className="col-span-1 flex flex-wrap gap-2 text-right font-semibold">
                    {getKeyContent()}
                  </div>
                </div>
              </>
            )}
         
          {/* Footer action button */}
          {(isOfflineOrLiveOnlineWithReview || isOnlineAndOpen) && (
            <div className="mt-auto flex justify-end">
              <ButtonPrimary
                disabled={loading}
                onClick={() => {
                  const deadline = dayjs(
                    `${data?.schedule?.end_date}T${data?.schedule?.end_time}Z`,
                  );

                  const listFilteredSections = data?.sections?.filter((item) =>
                    [
                      TEST_TYPE_ENUM.MID_TERM_TEST,
                      TEST_TYPE_ENUM.FINAL_TEST,
                      CourseSectionType.PART,
                    ].includes(
                      item?.course_section
                        ?.course_section_type as TEST_TYPE_ENUM,
                    ),
                  );
                  const listSectionIds = (listFilteredSections || []).map(
                    (item) =>
                      item?.course_section_id || item?.course_section.id,
                  );

                  const listFilteredSubSections = data?.sections?.filter(
                    (item) =>
                      [CourseSectionType.CHAPTER].includes(
                        item?.course_section
                          ?.course_section_type as CourseSectionType,
                      ),
                  );
                  const listSubSectionIds = (listFilteredSubSections || []).map(
                    (item) =>
                      item?.course_section_id || item?.course_section.id,
                  );

                  const listFilteredUnits = data?.sections?.filter((item) =>
                    [CourseSectionType.UNIT].includes(
                      item?.course_section
                        ?.course_section_type as CourseSectionType,
                    ),
                  );
                  const listUnitIds = (listFilteredUnits || []).map(
                    (item) =>
                      item?.course_section_id || item?.course_section.id,
                  );

                  const searchParams = buildQueryString({
                    focusSectionIds: listSectionIds.join(","),
                    focusSubSectionIds: listSubSectionIds.join(","),
                    focusUnitIds: listUnitIds.join(","),
                    deadline: deadline.format("YYYY-MM-DDTHH:mm:ssZ"),
                  });
                  if (data?.link_study) {
                    router.push(`${data?.link_study}?${searchParams}`);
                  }
                }}
              >
                {LEARNING_USER_STATUS.READY_TO_LEARN === data?.status
                  ? "Start"
                  : LEARNING_USER_STATUS.IN_PROGRESS === data?.status
                    ? "Continue"
                    : "Review"}
              </ButtonPrimary>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <SpinIcon />
        </div>
      )}
    </div>
  );
};

export default DetailCalendar;
