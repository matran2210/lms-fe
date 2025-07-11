import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { IEvent } from 'sapp-common-package/dist/types'
import { ICalendarDetail } from 'src/type/calendar'
import CourseTree from './CourseTree'
import SappIcon from 'src/common/SappIcon'
import dayjs from 'dayjs'
import { CALENDAR_FILTER_TYPE, LEARNING_USER_STATUS } from 'src/constants'
import { useRouter } from 'next/router'
import { CourseSectionType, TEST_TYPE_ENUM } from '@utils/constants'
import { LearningMode } from 'src/type/progress'
import { buildQueryString } from '@utils/index'
import getConfig from 'next/config'
import { CloseDetailIcon, SkeletonDetailIcon } from '@assets/icons/calendar'
import { Divider } from 'antd'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig

interface IProps {
  open: { isOpen: boolean; data: IEvent | null }
  setOpen: Dispatch<SetStateAction<{ isOpen: boolean; data: IEvent | null }>>
}

const DetailCalendar = ({ open, setOpen }: IProps) => {
  const router = useRouter()
  const [data, setData] = useState<ICalendarDetail>()
  const [loading, setLoading] = useState<boolean>(false)
  const [collapse, setCollapse] = useState<{ top: boolean; bottom: boolean }>({
    top: true,
    bottom: true,
  })

  const getMode = () => {
    if (data?.schedule.is_holiday) {
      return (
        <div className="max-w-fit bg-warning/5 px-[19px] py-[4.5px] text-base font-normal text-warning">
          Online
        </div>
      )
    }
    switch (data?.mode) {
      case CALENDAR_FILTER_TYPE.OFFLINE:
        return (
          <div className="max-w-fit bg-success/5 px-[19px] py-[4.5px] text-success">
            Offline
          </div>
        )
      case CALENDAR_FILTER_TYPE.ONLINE:
        return (
          <div className="max-w-fit bg-info/5  px-[19px] py-[4.5px] text-info">
            Online
          </div>
        )
      case CALENDAR_FILTER_TYPE.LIVE_ONLINE:
        return (
          <div className="max-w-fit bg-liveOnline/5 px-[19px] py-[4.5px] text-liveOnline">
            Live Online
          </div>
        )
    }
  }

  const getKeyContent = () => {
    return data?.key_after_contents?.map((item) => {
      return (
        <div
          key={item.id}
          className="max-w-[111px] bg-[#F9F9F9] px-2 py-1 text-sm text-secondary"
        >
          {item.name}
        </div>
      )
    })
  }

  const isOnlyMidTermOrFinalTest =
    data?.is_test &&
    !data?.sections?.some((item) =>
      [TEST_TYPE_ENUM?.FINAL_TEST, TEST_TYPE_ENUM?.MID_TERM_TEST].includes(
        item?.course_section?.course_section_type as TEST_TYPE_ENUM,
      ),
    )

  const togglePopup = (position: 'top' | 'bottom') => {
    setCollapse((prev) => ({ ...prev, [position]: !prev[position] }))
  }

  const renderTime = useMemo(() => {
    const start = dayjs(
      `${data?.schedule?.start_date}T${data?.schedule?.start_time}Z`,
    )
    const end = dayjs(
      `${data?.schedule?.end_date}T${data?.schedule?.end_time}Z`,
    )
    if (data?.schedule.is_holiday) {
      return (
        <>
          <div className="col-span-1 ">Lesson Date:</div>
          <div className="col-span-1 text-right font-semibold">
            {start.format('MMM DD, YYYY')}
          </div>
        </>
      )
    }
    if (data?.mode === LearningMode?.ONLINE) {
      return (
        <>
          <div className="col-span-1 ">Lesson Date:</div>
          <div className="col-span-1 font-semibold">{`${start.format('HH:mm')} | ${start.format('MMM DD YYYY')}`}</div>
          <div className="col-span-1 ">Deadline</div>
          <div className="col-span-1 font-semibold">{`${end.format('HH:mm')} | ${end.format('MMM DD YYYY')}`}</div>
        </>
      )
    }
    return (
      <>
        <div className="col-span-1 ">Lesson Date:</div>
        <div className="col-span-1 font-semibold">{`${start.format('HH:mm')} - ${end.format('HH:mm')} | ${start.format('MMM DD YYYY')}`}</div>
      </>
    )
  }, [data])

  async function fetchData() {
    setLoading(true)
    try {
      if (!open?.data?.id) return
      const res = await (
        await import('@pages/api/calendar')
      ).default.getDetailEvent(open?.data?.id, open?.data?.type === 'HOLIDAY')
      setData(res.data)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const dateNow = dayjs().add(7, 'hour')
  const dateOpenSection = data?.class?.opening_at
    ? dayjs(data?.class?.opening_at)
    : dayjs(data?.class?.started_at)

  useEffect(() => {
    if (open.isOpen) {
      fetchData()
    }
  }, [open])

  const isOfflineOrLiveOnlineWithReview =
    [LearningMode.OFFLINE, LearningMode.LIVE_ONLINE].includes(
      data?.mode as LearningMode,
    ) && data?.is_review_allowed

  const isOnlineAndOpen =
    data?.mode === LearningMode.ONLINE && dateOpenSection.isBefore(dateNow)

  const renderFormattedDate = (dateString: string) => {
    const parsedDate = new Date(dateString)

    const day = parsedDate.getDate().toString()
    const monthName = parsedDate.toLocaleString('en-US', { month: 'long' })
    const year = parsedDate.getFullYear()

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
    )
  }
  if (!open.isOpen) return null

  return (
    <div className="flex !w-[425px] flex-col overflow-y-auto rounded-2xl bg-white p-8 shadow-calendar">
      <div className="mb-8 flex items-center justify-start gap-2">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setOpen({ isOpen: false, data: null })}
        >
          <CloseDetailIcon />
        </button>
        {renderFormattedDate(data?.schedule?.start_date as string)}
      </div>
      {data?.schedule ? (
        <>
          <div>
            <div className="mb-5 text-lg font-semibold text-secondary">
              <div>Primary Information</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-base">
              <div className="col-span-1 ">
                {data?.schedule.is_holiday ? 'Event Name:' : 'Class Code:'}
              </div>
              <div className="col-span-1 text-right font-semibold">
                {data?.schedule.is_holiday ? data?.name : data?.class?.code}
              </div>
              <div className="col-span-1 ">
                {data?.schedule.is_holiday ? 'Type:' : 'Learning Mode:'}
              </div>
              <div className="col-span-1 flex justify-end gap-x-2">
                <div>{getMode()}</div>
                {!data?.schedule.is_holiday &&
                  dayjs(
                    `${data?.schedule.end_date}T${data?.schedule.end_time}`,
                  ).isBefore(new Date()) &&
                  ![LearningMode.OFFLINE, LearningMode?.LIVE_ONLINE]?.includes(
                    data?.mode as LearningMode,
                  ) && (
                    <div className="flex max-w-fit items-center gap-x-2 px-[19px] py-[4.5px]">
                      <SappIcon icon={'warningIcon'} />
                      <div className="font-medium text-error">Overdue</div>
                    </div>
                  )}
              </div>
              {renderTime}
              {!data?.schedule.is_holiday && (
                <>
                  <div className="col-span-1 ">Key Content Of:</div>
                  <div className="col-span-1 flex flex-wrap gap-2 text-right font-semibold">
                    {getKeyContent()}
                  </div>
                </>
              )}
              {data?.is_test && isOnlyMidTermOrFinalTest && (
                <>
                  <div className="col-span-1 ">Test Name:</div>
                  <div className="col-span-1 break-words text-right font-semibold">
                    {data?.name}
                  </div>
                </>
              )}
              {data?.mode === LearningMode.OFFLINE && (
                <>
                  <div className="col-span-1 ">Classroom:</div>
                  <div className="col-span-1 break-words text-right font-semibold">
                    {data?.room?.name}
                  </div>
                  <div className="col-span-1 ">Classroom Address:</div>
                  <div className="col-span-1 break-words text-right font-semibold">
                    {data?.room?.address}
                  </div>
                </>
              )}
              {data?.mode &&
                [LearningMode?.LIVE_ONLINE].includes(
                  data?.mode as LearningMode,
                ) && (
                  <>
                    <div className="col-span-1 ">Link meeting:</div>
                    <div className="col-span-1 text-right font-semibold">
                      {data?.class?.link_meeting}
                    </div>
                  </>
                )}
            </div>
          </div>
          {!(data?.is_case_study || data?.schedule?.is_holiday) &&
            !isOnlyMidTermOrFinalTest && (
              <>
                <Divider />
                <div className="mb-5 text-lg font-semibold">
                  Course Content:
                </div>
                <CourseTree data={data?.sections ?? []} />
              </>
            )}
          {/* Footer action button */}
          {(isOfflineOrLiveOnlineWithReview || isOnlineAndOpen) && (
            <button
              className="mt-auto w-full rounded-none bg-primary py-2 font-semibold text-white"
              disabled={loading}
              onClick={() => {
                const deadline = dayjs(
                  `${data?.schedule?.end_date}T${data?.schedule?.end_time}Z`,
                )

                const listFilteredSections = data?.sections?.filter((item) =>
                  [
                    TEST_TYPE_ENUM.MID_TERM_TEST,
                    TEST_TYPE_ENUM.FINAL_TEST,
                    CourseSectionType.PART,
                  ].includes(
                    item?.course_section?.course_section_type as TEST_TYPE_ENUM,
                  ),
                )
                const listSectionIds = (listFilteredSections || []).map(
                  (item) => item?.course_section_id || item?.course_section.id,
                )

                const listFilteredSubSections = data?.sections?.filter((item) =>
                  [CourseSectionType.CHAPTER].includes(
                    item?.course_section
                      ?.course_section_type as CourseSectionType,
                  ),
                )
                const listSubSectionIds = (listFilteredSubSections || []).map(
                  (item) => item?.course_section_id || item?.course_section.id,
                )

                const listFilteredUnits = data?.sections?.filter((item) =>
                  [CourseSectionType.UNIT].includes(
                    item?.course_section
                      ?.course_section_type as CourseSectionType,
                  ),
                )
                const listUnitIds = (listFilteredUnits || []).map(
                  (item) => item?.course_section_id || item?.course_section.id,
                )

                const searchParams = buildQueryString({
                  focusSectionIds: listSectionIds.join(','),
                  focusSubSectionIds: listSubSectionIds.join(','),
                  focusUnitIds: listUnitIds.join(','),
                  deadline: deadline.format('YYYY-MM-DDTHH:mm:ssZ'),
                })
                if (data?.link_study) {
                  router.push(`${data?.link_study}?${searchParams}`)
                }
              }}
            >
              {LEARNING_USER_STATUS.READY_TO_LEARN === data?.status
                ? 'Start'
                : LEARNING_USER_STATUS.IN_PROGRESS === data?.status
                  ? 'Continue'
                  : 'Review'}
            </button>
          )}
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <SkeletonDetailIcon />
          <div className="text-xl font-normal">
            You dont have any schedule today!
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailCalendar
