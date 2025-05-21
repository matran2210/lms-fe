import DetailCalendar from '@components/calendar/DetailCalendar'
import Layout from '@components/layout'
import CalendarApi from '@pages/api/calendar'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { SAPPCalendar } from 'sapp-common-package'
import { IEvent, IFilter } from 'sapp-common-package/dist/types'
import {
  CALENDAR_COLOR_TYPES,
  CALENDAR_FILTER_TYPE,
  CALENDAR_TYPE,
} from 'src/constants'
import { ICalendar, ICalendarList } from 'src/type/calendar'
const Page = () => {
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
    startDate: dayjs().startOf('month').startOf('week').add(1, 'day').toDate(),
    endDate: dayjs().endOf('month').endOf('week').add(1, 'day').toDate(),
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
    const isOverdue = dayjs(`${event.end_date}T${event.end_time}Z`).isBefore(
      dayjs(),
    )
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
  }, [currentTime.endDate, currentTime.startDate])

  const events = useMemo(() => {
    if (!data?.calendars) return []
    const results = data?.calendars?.filter((item) =>
      filterEvents(item, filter),
    )
    return results
  }, [filter, data])

  return (
    <Layout title="Course Detail">
      <div className="mx-auto my-0 max-w-xxl pt-6 xl-max:mx-6">
        <div className="relative">
          <div className="flex w-full flex-col justify-between gap-3 pb-4 sm:flex-row sm:items-center">
            <div className="font-normal text-[#050505]">Calendar</div>
          </div>
          <div className="pb-5">
            <SAPPCalendar
              showWeeklyNorm={false}
              events={
                events?.map((item) => {
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
                    isKeyBeforeContent: item?.is_key_before_content,
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
        </div>
      </div>
      <DetailCalendar open={open} setOpen={setOpen} />
    </Layout>
  )
}

export default Page
