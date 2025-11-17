import DetailCalendar from '@components/calendar/DetailCalendar'
import DetailCalendarMobile from '@components/calendar/DetailCalendarMobile'
import DetailCalendarTablet from '@components/calendar/DetailCalendarTablet'
import Layout from '@components/layout'
import HeaderMobile from '@components/layout/Header/HeaderMobile'
import CalendarApi from '@pages/api/calendar'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { SAPPCalendarV2 } from 'sapp-common-package'
import { IEvent, IFilter } from 'sapp-common-package/dist/types'
import {
  ANIMATION,
  CALENDAR_COLOR_TYPES,
  CALENDAR_FILTER_TYPE,
  CALENDAR_TYPE,
  PageLink,
  TitleSidebar,
} from '@lms/core'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { ICalendar, ICalendarList } from 'src/type/calendar'
import clsx from 'clsx'
const Page = () => {
  const { isAlwaysShowSidebar, isTabletView, isMobileView } =
    useTailwindBreakpoint()
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<ICalendarList>()
  const [filter, setFilter] = useState<IFilter>()
  const [open, setOpen] = useState<{ isOpen: boolean; data: IEvent | null }>({
    isOpen: false,
    data: null,
  })
  const [currentTime, setCurrentTime] = useState<{
    startDate: Date
    endDate: Date
  }>({
    startDate: dayjs().startOf('month').startOf('week').toDate(),
    endDate: dayjs().endOf('month').endOf('week').toDate(),
  })

  const fetchCalendar = async (params: {
    start_date: string
    end_date: string
  }) => {
    setLoading(true)
    try {
      const res = await CalendarApi.getEventSchedule(params)
      setData(res?.data)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const getType = (data: ICalendar) => {
    switch (data.mode) {
      case CALENDAR_FILTER_TYPE.HOLIDAY:
        return CALENDAR_COLOR_TYPES.YELLOW_COLOR
      case CALENDAR_FILTER_TYPE.OVERDUE:
        return CALENDAR_COLOR_TYPES.RED_COLOR
      case CALENDAR_FILTER_TYPE.ONLINE:
        return CALENDAR_COLOR_TYPES.BLUE_COLOR
      case CALENDAR_FILTER_TYPE.LIVE_ONLINE:
        return CALENDAR_COLOR_TYPES.PURPLE_COLOR
      case CALENDAR_FILTER_TYPE.OFFLINE:
        return CALENDAR_COLOR_TYPES.GREEN_COLOR
      default:
        return CALENDAR_COLOR_TYPES.GREEN_COLOR
    }
  }

  const filterEvents = (event: ICalendar, filter?: IFilter) => {
    if (!filter) return true
    const { type, courseId } = filter
    if (event.is_holiday && type?.includes(CALENDAR_FILTER_TYPE.HOLIDAY))
      return true
    const isOverdue =
      dayjs(`${event.end_date}T${event.end_time}Z`).isBefore(dayjs()) &&
      event.mode === CALENDAR_FILTER_TYPE.ONLINE
    if (
      (!type?.includes(CALENDAR_FILTER_TYPE.OVERDUE) && isOverdue) ||
      (event.is_case_study &&
        !type?.includes(CALENDAR_FILTER_TYPE.CASE_STUDY)) ||
      (event.is_test && !type?.includes(CALENDAR_FILTER_TYPE.TEST)) ||
      (event.is_key_before_content &&
        !type?.includes(CALENDAR_FILTER_TYPE.KEY_BEFORE_CONTENT)) ||
      (type?.length && !type.includes(event.mode)) ||
      !courseId?.includes(event.course_id)
    ) {
      return false
    }
    return true
  }

  const handleFilter = (filter: IFilter) => {
    setFilter(filter)
  }

  useEffect(() => {
    if (currentTime.startDate && currentTime.endDate) {
      fetchCalendar({
        start_date: currentTime.startDate.toISOString(),
        end_date: currentTime.endDate.toISOString(),
      })
    }
  }, [])

  const events = useMemo(() => {
    if (!data?.calendars) return []
    const results = data?.calendars?.filter((item) =>
      filterEvents(item, filter),
    )
    return results
  }, [filter, data])
  const router = useRouter()

  const handleBack = () => {
    router.push(PageLink.HOME)
  }

  return (
    <Layout
      title="Calendar"
      size="2xl"
      showSidebar={isAlwaysShowSidebar}
      className="h-full"
      childClassName="h-full"
    >
      <div
        className="mx-auto my-0 h-full max-w-[1644px]"
        id="calendar-root"
        data-aos={ANIMATION.DATA_AOS}
      >
        <div className="relative flex h-full flex-col">
          <div className="py-2 pt-4 sm:pt-4 md:pb-8 md:pt-8 lg:pb-8 lg:pt-10 xl:pb-6 xl:pt-4">
            <HeaderMobile
              title={TitleSidebar.CALENDAR}
              showIcon={isTabletView || isMobileView}
              onBack={handleBack}
            />
          </div>
          <div
            className={clsx(
              'flex h-fit flex-1 items-stretch justify-center pb-5 lg:justify-between lg:gap-6',
              {
                'gap-6': open.isOpen && isAlwaysShowSidebar,
              },
            )}
            data-aos={ANIMATION.DATA_AOS}
          >
            <div
              className="flex w-full min-w-0 justify-center lg:flex-1"
              data-aos={ANIMATION.DATA_AOS}
            >
              <SAPPCalendarV2
                showWeeklyNorm={false}
                events={
                  events?.map((item) => {
                    const isOverDue =
                      dayjs(`${item.end_date}T${item.end_time}Z`).isBefore(
                        dayjs(),
                      ) && item.mode === CALENDAR_FILTER_TYPE.ONLINE
                    return {
                      id: item.id,
                      title: item.name,
                      startDate: new Date(
                        `${item.start_date}T${item.start_time}Z`,
                      ),
                      endDate: new Date(`${item.end_date}T${item.end_time}Z`),
                      type: getType(item),
                      description: item.description,
                      isRepeat: false,
                      courseId: item?.course_id,
                      source: CALENDAR_TYPE.LMS,
                      isHoliday: item?.is_holiday,
                      isCaseStudy: item?.is_case_study,
                      isTest: item?.is_test,
                      isKeyContentBefore: item?.is_key_before_content,
                      isKeyContentAfter: item?.is_key_after_content,
                      isOverDue: isOverDue,
                    }
                  }) ?? []
                }
                onEventDetail={(event) => {
                  setOpen({ isOpen: true, data: event })
                }}
                type={CALENDAR_TYPE.LMS}
                hasFilter
                onRefetchAPI={async (startDate: Date, endDate: Date) => {
                  setCurrentTime({ startDate, endDate })
                  await fetchCalendar({
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                  })
                }}
                onfilter={handleFilter}
                courses={data?.courses}
                loading={loading}
                headerType={CALENDAR_TYPE.LMS}
              />
            </div>
            <div
              className={clsx(
                'transition-all duration-300 ease-in-out',
                open.isOpen && isAlwaysShowSidebar ? 'w-[425px]' : 'w-0',
              )}
            >
              {open.isOpen && (
                <>
                  {isMobileView && (
                    <DetailCalendarMobile open={open} setOpen={setOpen} />
                  )}
                  {isTabletView && (
                    <DetailCalendarTablet open={open} setOpen={setOpen} />
                  )}
                  {isAlwaysShowSidebar && (
                    <DetailCalendar open={open} setOpen={setOpen} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Page
