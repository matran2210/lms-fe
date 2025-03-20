import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { SAPPCalendar } from 'sapp-common-package'
import { IEvent } from 'sapp-common-package/dist/types'
import { EVENT_TYPES_ARRAY, EVENT_TYPES_RESPONSE } from 'src/constants'
import { SchedulesAPI } from 'src/pages/api/schedules'
import { IResponseSchedule } from 'src/redux/types/Schedule/schedule'
import CalendarHead from './CalendarHead'

interface IProps {
  onOpenDetail: (date: Date, events: IEvent[]) => void
  onOpenCreate: (date: Date) => void
}

const Calendar = ({ onOpenDetail, onOpenCreate }: IProps) => {
  const [startTime, setStartTime] = useState<Date>(
    dayjs().startOf('month').startOf('week').add(1, 'day').toDate(),
  )
  const [endTime, setEndTime] = useState<Date>(
    dayjs().endOf('month').endOf('week').add(1, 'day').toDate(),
  )
  const [eventName, setEventName] = useState<string>('')
  const [eventType, setEventType] = useState<
    (typeof EVENT_TYPES_ARRAY)[number] | ''
  >('')

  const router = useRouter()

  /**
   * @description config params khi filter
   */
  const params = {
    start_date: router.query.startDate || undefined,
    end_date: router.query.endDate || undefined,
    event_name: router.query.eventName || undefined,
    event_type: router.query.eventType || undefined,
  }

  /**
   * @description Gọi API My Course
   * @param {eventName, eventType, params} eventName: string, eventType: string, params: Object
   */
  const fetchSchedules = async ({ params }: { params: Object }) => {
    const response = await SchedulesAPI.get(params)
    const data = response.data?.map((item: IResponseSchedule) => {
      return {
        id: item.id,
        title: item.name,
        startDate: new Date(`${item.start_date}T${item.start_time}Z`),
        endDate: new Date(`${item.end_date}T${item.end_time}Z`),
        type: EVENT_TYPES_RESPONSE[item.teacher_type],
        description: item.description,
        classroomAddress: item.classroom_address,
        classroomName: item.classroom_name,
        meetingLink: item.meeting_link,
      } as IEvent
    })

    return { data: data || [], success: response.success }
  }

  const {
    data: schedulesData,
    isSuccess,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['schedules', startTime, endTime, eventName, eventType],
    queryFn: () => {
      const formatter = new Intl.DateTimeFormat('en-CA')

      let finalParams = {
        start_date: params.start_date || formatter.format(startTime),
        end_date: params.end_date || formatter.format(endTime),
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

      return fetchSchedules({ params: finalParams })
    },
    enabled: router.isReady,
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
      <CalendarHead onSearch={handleOnSearch} onOpenCreate={onOpenCreate} />
      <SAPPCalendar
        events={schedulesData?.data || []}
        onOpenDetail={onOpenDetail}
        onOpenCreate={onOpenCreate}
        norms={[]}
        onRefetchAPI={handleRefetch}
        loading={isLoading}
      />
    </>
  )
}

export default Calendar
