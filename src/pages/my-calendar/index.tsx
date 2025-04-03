import PageContainer from '@components/common/PageContainer'
import Layout from '@components/layout'
import Calendar from '@components/my-calendar/Calendar'
import EventDetails from '@components/my-calendar/EventDetails'
import NewEventSidebar from '@components/my-calendar/NewEventSidebar'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import 'sapp-common-package/dist/index.css'
import { IEvent } from 'sapp-common-package/dist/types'
import { DATE_TIME_FORMAT, TitleSidebar } from 'src/constants'
import { IPopupDetails } from 'src/type/my-calendar'

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
    <Layout title={TitleSidebar.MY_CALENDAR}>
      <PageContainer
        titlePage={TitleSidebar.MY_CALENDAR}
        breadcrumbs={breadcrumbs}
      >
        <Calendar
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
        />
        <EventDetails details={eventDetails} handleClose={handleCloseDetail} />
        <NewEventSidebar
          currentDate={selectedDate}
          isOpenCreate={isOpenCreate}
          setIsOpenCreate={setIsOpenCreate}
        />
      </PageContainer>
    </Layout>
  )
}

export default MyCalendar
