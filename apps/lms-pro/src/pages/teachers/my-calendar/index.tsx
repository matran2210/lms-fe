import Calendar from '@components/my-calendar/Calendar'
import EventDetails from '@components/my-calendar/EventDetails'
import NewEventSidebar from '@components/my-calendar/NewEventSidebar'
import { UserType } from '@lms/contexts'
import { DATE_TIME_FORMAT, IPopupDetails, TitleSidebar } from '@lms/core'
import { LayoutTeacher } from '@lms/ui'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { IEvent } from '@sapp-fe/sapp-common-package/dist/types'
import withAuthorization from 'src/HOC/withAuthorization'

const breadcrumbs = [
  {
    title: 'Home',
    link: '#',
  },
  {
    title: TitleSidebar.MY_CALENDAR,
    link: '#',
  },
]

const MyCalendar = () => {
  const [eventDetails, setEventDetails] = useState<IPopupDetails | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isOpenCreate, setIsOpenCreate] = useState(false)

  const handleOpenDetail = useCallback((date: Date, events: IEvent[]) => {
    setEventDetails({ date, events })
  }, [])

  const handleCloseDetail = useCallback(() => {
    setEventDetails(null)
  }, [])

  const handleOpenCreate = useCallback(
    (date: Date) => {
      if (
        dayjs().format(DATE_TIME_FORMAT) !==
          dayjs(date).format(DATE_TIME_FORMAT) &&
        dayjs().isAfter(date)
      ) {
        return toast.error('Cannot create event in the past')
      }

      setSelectedDate(date)
      setIsOpenCreate(true)
    },
    [setSelectedDate, setIsOpenCreate],
  )

  return (
    <LayoutTeacher
      title={TitleSidebar.MY_CALENDAR}
      breadcrumbs={breadcrumbs}
      className="bg-[#F2F4F7] p-0"
    >
      <div className="h-fit w-full rounded-xl bg-white px-8 py-5">
        <Calendar
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
        />
      </div>
      <EventDetails details={eventDetails} handleClose={handleCloseDetail} />
      <NewEventSidebar
        currentDate={selectedDate}
        isOpenCreate={isOpenCreate}
        setIsOpenCreate={setIsOpenCreate}
      />
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(MyCalendar)
