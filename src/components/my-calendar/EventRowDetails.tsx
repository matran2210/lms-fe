import { memo, useMemo } from 'react'
import { IEvent } from 'sapp-common-package/dist/types'
import SappIcon from 'src/common/SappIcon'
import {
  EVENT_TYPES,
  EVENT_TYPES_LABEL,
  POPUP_EVENT_DETAILS,
} from 'src/constants'

const EventRowDetails = ({ event }: { event: IEvent }) => {
  const getEventTime = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }
    const startTime = event.startDate.toLocaleTimeString('en-GB', options)
    const endTime = event.endDate.toLocaleTimeString('en-GB', options)

    return `${startTime} - ${endTime}`
  }, [event])

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case EVENT_TYPES.TEACHING:
        return <SappIcon icon="book_open" className="" />
      case EVENT_TYPES.BUSY:
        return <SappIcon icon="calendar_busy" className="" />
      case EVENT_TYPES.TIME_OFF:
        return <SappIcon icon="start_outline" className="" />
      case EVENT_TYPES.OTHER:
        return <SappIcon icon="calendar_check" className="" />
      default:
        return ''
    }
  }

  return (
    <div key={event.id}>
      {/* Event name */}
      <div className="mb-2 flex	flex-row justify-between">
        <div className="min-w-[169px] text-sm leading-[21px] tracking-normal text-gray-11">
          {POPUP_EVENT_DETAILS.TITLE}
        </div>
        <div className="flex-1 text-sm leading-[21px] tracking-normal text-bw-11">
          {event.title}
        </div>
      </div>

      {/* Event time */}
      <div className="mb-2 flex	flex-row justify-between">
        <div className="min-w-[169px] text-sm leading-[21px] tracking-normal text-gray-11">
          {POPUP_EVENT_DETAILS.TIME}
        </div>
        <div className="flex-1 text-sm leading-[21px] tracking-normal text-bw-11">
          {getEventTime}
        </div>
      </div>

      {/* Event type */}
      <div className="mb-2 flex	flex-row justify-between">
        <div className="min-w-[169px] text-sm leading-[21px] tracking-normal text-gray-11">
          {POPUP_EVENT_DETAILS.TYPE}
        </div>
        <div className="flex-1 text-sm leading-[21px] tracking-normal text-bw-11">
          <div className="flex flex-row content-center justify-start">
            {getEventTypeIcon(event.type)}
            <span className="ml-3">{EVENT_TYPES_LABEL[event.type]}</span>
          </div>
        </div>
      </div>

      {/* Meeting link */}
      {event.meetingLink && (
        <div className="mb-2 flex	flex-row justify-between">
          <div className="min-w-[169px] text-sm leading-[21px] tracking-normal text-gray-11">
            {POPUP_EVENT_DETAILS.MEETING_LINK}
          </div>
          <div className="flex-1 text-sm leading-[21px] tracking-normal text-bw-11">
            <a
              href={event.meetingLink}
              target="_blank"
              className="text-sm font-normal italic leading-[21px] tracking-normal text-blue-2"
              rel="noreferrer"
            >
              {event.meetingLink}
            </a>
          </div>
        </div>
      )}

      {/* Classroom name */}
      {event.classroomName && (
        <div className="mb-2 flex	flex-row justify-between">
          <div className="min-w-[169px] text-sm leading-[21px] tracking-normal text-gray-11">
            {POPUP_EVENT_DETAILS.CLASSROOM_NAME}
          </div>
          <div className="flex-1 text-sm leading-[21px] tracking-normal text-bw-11">
            {event.classroomName}
          </div>
        </div>
      )}

      {/* Classroom address */}
      {event.classroomAddress && (
        <div className="mb-2 flex	flex-row justify-between">
          <div className="min-w-[169px] text-sm leading-[21px] tracking-normal text-gray-11">
            {POPUP_EVENT_DETAILS.CLASSROOM_ADDRESS}
          </div>
          <div className="flex-1 text-sm leading-[21px] tracking-normal text-bw-11">
            {event.classroomAddress}
          </div>
        </div>
      )}

      {/* Event description */}
      <div className="flex flex-row justify-between last:mb-0">
        <div className="min-w-[169px] text-sm leading-[21px] tracking-normal text-gray-11">
          {POPUP_EVENT_DETAILS.DESCRIPTION}
        </div>
        <div className="flex-1 text-sm leading-[21px] tracking-normal text-bw-11">
          {event.description || ''}
        </div>
      </div>
    </div>
  )
}

export default memo(EventRowDetails)
