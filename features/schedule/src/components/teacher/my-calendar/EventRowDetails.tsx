import { memo, useMemo } from 'react'
import { IEvent } from '@sonhero/sapp-common-package'
import { SappIcon } from '@lms/ui'
import { EVENT_TYPES, EVENT_TYPES_LABEL, POPUP_EVENT_DETAILS } from '@lms/core'
import clsx from 'clsx'

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
        return <SappIcon icon="book_open" />
      case EVENT_TYPES.BUSY:
        return <SappIcon icon="calendar_busy" />
      case EVENT_TYPES.HOLIDAY:
        return <SappIcon icon="start_outline" />
      case EVENT_TYPES.OTHER:
        return <SappIcon icon="calendar_check" />
      default:
        return ''
    }
  }

  const renderDetail = (label: string, value: React.ReactNode) => (
    <div className="mb-2 flex flex-row justify-between last:mb-0">
      <div className="min-w-[169px] text-sm leading-[21px] tracking-normal text-accent">
        {label}
      </div>
      <div
        className={clsx(
          'flex-1 text-sm leading-[21px] tracking-normal text-gray-800',
          {
            'line-clamp-1': label === POPUP_EVENT_DETAILS.MEETING_LINK,
          },
        )}
      >
        {value}
      </div>
    </div>
  )

  return (
    <div key={event.id}>
      {/* Event name */}
      {renderDetail(POPUP_EVENT_DETAILS.TITLE, event.title)}

      {/* Event time */}
      {renderDetail(POPUP_EVENT_DETAILS.TIME, getEventTime)}

      {/* Event type */}
      {renderDetail(
        POPUP_EVENT_DETAILS.TYPE,
        <div className="flex flex-row content-center justify-start">
          {getEventTypeIcon(event.type)}
          <span className="ml-3">{EVENT_TYPES_LABEL[event.type]}</span>
        </div>,
      )}

      {renderDetail(POPUP_EVENT_DETAILS.REPEAT, event?.repeat || '')}

      {/* Meeting link */}
      {event.meetingLink &&
        renderDetail(
          POPUP_EVENT_DETAILS.MEETING_LINK,
          <a
            href={event.meetingLink}
            target="_blank"
            className="text-sm font-normal italic leading-[21px] tracking-normal text-[#091D37]"
            rel="noreferrer"
          >
            {event.meetingLink}
          </a>,
        )}

      {/* Classroom name */}
      {event.classroomName &&
        renderDetail(POPUP_EVENT_DETAILS.CLASSROOM_NAME, event.classroomName)}

      {/* Classroom address */}
      {event.classroomAddress &&
        renderDetail(
          POPUP_EVENT_DETAILS.CLASSROOM_ADDRESS,
          event.classroomAddress,
        )}

      {/* Event description */}
      {renderDetail(POPUP_EVENT_DETAILS.DESCRIPTION, event.description || '')}
    </div>
  )
}

export default memo(EventRowDetails)
