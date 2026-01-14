import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { SAPPCalendar } from '@sapp-fe/sapp-common-package'
import { IEvent } from '@sapp-fe/sapp-common-package/dist/types'
import {
  EVENT_REPEAT_LABEL,
  EVENT_REPEAT_TYPES,
  EVENT_TYPES,
  EVENT_TYPES_ARRAY,
  EVENT_TYPES_RESPONSE,
} from '@lms/core'
import { SchedulesAPI } from 'src/api/schedules'
import CalendarHead from './CalendarHead'
import { pick } from 'lodash'
import { formatDateTimeWithTimeZone } from '@lms/utils'
import { IResponseSchedule } from '@lms/contexts'
import { formatRecurringSchedule } from '@utils/request'

interface IProps {
  onOpenDetail: (date: Date, events: IEvent[]) => void
  onOpenCreate: (date: Date) => void
}

const Calendar = ({ onOpenDetail, onOpenCreate }: IProps) => {
  const [startTime, setStartTime] = useState<Date>(
    dayjs().startOf('month').startOf('week').toDate(),
  )
  const [endTime, setEndTime] = useState<Date>(
    dayjs().endOf('month').endOf('week').toDate(),
  )
  const [eventName, setEventName] = useState<string>('')
  const [eventType, setEventType] = useState<
    (typeof EVENT_TYPES_ARRAY)[number] | ''
  >('')

  const router = useRouter()
  const searchParams = useSearchParams()

  const query = Object.fromEntries(searchParams.entries())
  /**
   * @description config params khi filter
   */
  const params = {
    start_date: query.startDate || undefined,
    end_date: query.endDate || undefined,
    event_name: query.eventName || undefined,
    event_type: query.eventType || undefined,
  }

  /**
   * @description Gọi API My Course
   * @param {eventName, eventType, params} eventName: string, eventType: string, params: Object
   */
  const fetchData = async ({ params }: { params: Record<string, any> }) => {
    const [resSchedule, resWeeklyNorms] = await Promise.all([
      SchedulesAPI.get(
        params.event_type === EVENT_TYPES.HOLIDAY
          ? {
              ...pick(params, ['event_name', 'start_date', 'end_date']),
              is_holiday: true,
            }
          : params,
      ),
      SchedulesAPI.getWeeklyNorms({
        fromDate: params.start_date,
        toDate: params.end_date,
      }),
    ])
    const events =
      resSchedule.data?.map(
        (item: IResponseSchedule) =>
          ({
            id: item.id,
            title: item.name,
            startDate: new Date(`${item.start_date}T${item.start_time}Z`),
            endDate: new Date(`${item.end_date}T${item.end_time}Z`),
            type: item.is_holiday
              ? 'HOLIDAY'
              : EVENT_TYPES_RESPONSE[item.event_type],
            description: item.description,
            classroomAddress: item.classroom_address,
            classroomName: item.classroom_name,
            meetingLink: item.link_meeting,
            repeat: item.is_schedule_recurring
              ? formatRecurringSchedule(
                  item.recurring_pattern,
                  formatDateTimeWithTimeZone(
                    item.recurring_pattern.start_date,
                    item.start_time,
                  ),
                )
              : EVENT_REPEAT_LABEL[EVENT_REPEAT_TYPES.NO_REPEAT],
          }) as IEvent,
      ) || []
    const norms =
      resWeeklyNorms.data.map((weeklyNorm) => ({
        id: weeklyNorm.id,
        startDate: new Date(weeklyNorm.start_date),
        endDate: new Date(weeklyNorm.end_date),
        maxShift: weeklyNorm.max_shift,
      })) || []

    return {
      events,
      norms,
      success: resSchedule.success && resWeeklyNorms.success,
    }
  }

  const enabled = Boolean(startTime) && Boolean(endTime)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['schedules', startTime, endTime, eventName, eventType],
    queryFn: () => {
      let finalParams = {
        start_date: params.start_date || dayjs(startTime).toISOString(),
        end_date: params.end_date || dayjs(endTime).toISOString(),
      } as Object

      if (params.event_name || eventName) {
        finalParams = {
          ...finalParams,
          event_name: params.event_name || eventName,
        }
      }

      if (params.event_type || eventType) {
        finalParams = {
          ...finalParams,
          event_type: params.event_type || eventType,
        }
      }

      return fetchData({ params: finalParams })
    },
    enabled,
    refetchOnWindowFocus: true,
    retry: false,
  })

  const handleOnSearch = useCallback(
    ({
      eventName,
      eventType,
    }: {
      eventName: string
      eventType: (typeof EVENT_TYPES_ARRAY)[number] | ''
    }) => {
      setEventName(eventName)
      setEventType(eventType)
      refetch()
    },
    [],
  )

  const handleRefetch = useCallback(async (startDate: Date, endDate: Date) => {
    setStartTime(startDate)
    setEndTime(endDate)
    refetch()
  }, [])

  return (
    <>
      <CalendarHead
        onSearch={handleOnSearch}
        onOpenCreate={onOpenCreate}
        loading={isLoading}
      />
      <SAPPCalendar
        events={data?.events || []}
        onOpenDetail={onOpenDetail}
        onOpenCreate={onOpenCreate}
        norms={data?.norms || []}
        onRefetchAPI={handleRefetch}
        loading={isLoading}
      />
    </>
  )
}

export default Calendar
