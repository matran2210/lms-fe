import SappDrawer from '@components/base/SappDrawer'
import CalendarApi from '@pages/api/calendar'
import getConfig from 'next/config'
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
        <div className="bg-accent-warning/5 text-accent-warning max-w-fit px-[19px] py-[4.5px] text-base font-normal">
          Online
        </div>
      )
    }
    switch (data?.mode) {
      case CALENDAR_FILTER_TYPE.OFFLINE:
        return (
          <div className="bg-accent-success/5 text-accent-success max-w-fit px-[19px] py-[4.5px]">
            Offline
          </div>
        )
      case CALENDAR_FILTER_TYPE.ONLINE:
        return (
          <div className="bg-accent-info/5 text-accent-info  max-w-fit px-[19px] py-[4.5px]">
            Online
          </div>
        )
      case CALENDAR_FILTER_TYPE.LIVE_ONLINE:
        return (
          <div className="bg-purple-1/5 text-purple-1 max-w-fit px-[19px] py-[4.5px]">
            Live Online
          </div>
        )
    }
  }

  const getKeyContent = () => {
    return data?.key_after_contents?.map((item) => {
      return (
        <div key={item.id} className="text-gray-14 bg-gray-4 px-2 py-1 text-sm">
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
          <div className="text-gray-1 col-span-1">Lesson Date</div>
          <div className="col-span-1">{start.format('MMM DD, YYYY')}</div>
        </>
      )
    }
    if (data?.mode === LearningMode?.ONLINE) {
      return (
        <>
          <div className="text-gray-1 col-span-1">Lesson Date</div>
          <div className="col-span-1">{`${start.format('HH:mm')} | ${start.format('MMM DD YYYY')}`}</div>
          <div className="text-gray-1 col-span-1">Deadline</div>
          <div className="col-span-1">{`${end.format('HH:mm')} | ${end.format('MMM DD YYYY')}`}</div>
        </>
      )
    }
    return (
      <>
        <div className="text-gray-1 col-span-1">Lesson Date</div>
        <div className="col-span-1">{`${start.format('HH:mm')} - ${end.format('HH:mm')} | ${start.format('MMM DD YYYY')}`}</div>
      </>
    )
  }, [data])

  async function fetchData() {
    setLoading(true)
    try {
      if (!open?.data?.id) return
      const res = await CalendarApi.getDetailEvent(
        open?.data?.id,
        open?.data?.type === 'HOLIDAY',
      )
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

  return (
    <SappDrawer
      isOpen={open.isOpen}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={() => {
        setOpen({ isOpen: false, data: null })
      }}
      title="Event Infomation"
      confirmOnClose={false}
      footer={data?.mode === LearningMode?.ONLINE}
      drawerSubId={'-notes-list'}
      heightBody={'h-[calc(100vh-112px)]'}
      showCancelButton={false}
      showSubmitButton={isOfflineOrLiveOnlineWithReview || isOnlineAndOpen}
      btnSubmitTile={
        LEARNING_USER_STATUS.READY_TO_LEARN === data?.status
          ? 'Start'
          : LEARNING_USER_STATUS.IN_PROGRESS === data?.status
            ? 'Continue'
            : 'Review'
      }
      handleSubmit={() => {
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
            item?.course_section?.course_section_type as CourseSectionType,
          ),
        )
        const listSubSectionIds = (listFilteredSubSections || []).map(
          (item) => item?.course_section_id || item?.course_section.id,
        )

        const listFilteredUnits = data?.sections?.filter((item) =>
          [CourseSectionType.UNIT].includes(
            item?.course_section?.course_section_type as CourseSectionType,
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
      submitButtonClassName="rounded-none"
      footerClassName="!justify-end w-full"
      loading={loading}
    >
      <div>
        <div className="border border-solid border-gray-2 px-7 py-4">
          <div className="text-gray-14 flex items-center justify-between border-b pb-4  text-base font-semibold">
            <div>Primary Information</div>
            <div
              className="hover:cursor-pointer"
              onClick={() => togglePopup('top')}
            >
              {collapse.top ? (
                <SappIcon icon="arrowDown" />
              ) : (
                <SappIcon icon="arrowUp" />
              )}
            </div>
          </div>
          {collapse.top && (
            <div className="grid grid-cols-2 gap-y-[21.5px] pt-[21.5px] text-sm">
              <div className="text-gray-1 col-span-1">
                {data?.schedule.is_holiday ? 'Event Name' : 'Class Code'}
              </div>
              <div className="col-span-1">
                {data?.schedule.is_holiday ? data?.name : data?.class?.code}
              </div>
              <div className="text-gray-1 col-span-1">
                {data?.schedule.is_holiday ? 'Type' : 'Learning Mode'}
              </div>
              <div className="col-span-1 flex gap-x-2">
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
                      <div className="text-accent-error font-medium">
                        Overdue
                      </div>
                    </div>
                  )}
              </div>
              {renderTime}
              {!data?.schedule.is_holiday && (
                <>
                  <div className="text-gray-1 col-span-1">Key Content Of</div>
                  <div className="col-span-1 flex flex-wrap gap-2">
                    {getKeyContent()}
                  </div>
                </>
              )}
              {data?.is_test && isOnlyMidTermOrFinalTest && (
                <>
                  <div className="text-gray-1 col-span-1">Test Name</div>
                  <div className="col-span-1 break-words">{data?.name}</div>
                </>
              )}
              {data?.mode === LearningMode.OFFLINE && (
                <>
                  <div className="text-gray-1 col-span-1">Classroom</div>
                  <div className="col-span-1 break-words">
                    {data?.room?.name}
                  </div>
                  <div className="text-gray-1 col-span-1">
                    Classroom Address
                  </div>
                  <div className="col-span-1 break-words">
                    {data?.room?.address}
                  </div>
                </>
              )}
              {data?.mode &&
                [LearningMode?.LIVE_ONLINE].includes(
                  data?.mode as LearningMode,
                ) && (
                  <>
                    <div className="text-gray-1 col-span-1">Link meeting</div>
                    <div className="col-span-1">
                      {data?.class?.link_meeting}
                    </div>
                  </>
                )}
            </div>
          )}
        </div>
        {!data?.schedule?.is_holiday && !isOnlyMidTermOrFinalTest && (
          <div className="mt-4 border border-solid border-gray-2 px-7 py-4">
            <div className="text-gray-14 flex items-center justify-between border-b-[1px] pb-4 text-base font-semibold">
              <div>Course Content</div>
              <div
                className="hover:cursor-pointer"
                onClick={() => togglePopup('bottom')}
              >
                <SappIcon icon={collapse.bottom ? 'arrowDown' : 'arrowUp'} />
              </div>
            </div>
            {collapse.bottom && (
              <div className="pt-4">
                <CourseTree data={data?.sections ?? []} />
              </div>
            )}
          </div>
        )}
      </div>
    </SappDrawer>
  )
}

export default DetailCalendar
