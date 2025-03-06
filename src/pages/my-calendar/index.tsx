import Layout from '@components/layout'
import Calendar from '@components/my-calendar/Calendar'
import EventDetails from '@components/my-calendar/EventDetails'
import Heading from '@components/my-calendar/Heading'
import NewEventSidebar from '@components/my-calendar/NewEventSidebar'
import { useCallback, useState } from 'react'
import 'sapp-common-package/dist/index.css'
import { IEvent } from 'sapp-common-package/dist/types'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { TitleSidebar } from 'src/constants'
import { IPopupDetails } from 'src/type/my-calendar'

const MyCalendar = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [eventDetails, setEventDetails] = useState<IPopupDetails | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleOpenDetail = useCallback((date: Date, events: IEvent[]) => {
    setEventDetails({ date, events })
  }, [])

  const handleCloseDetail = useCallback(() => {
    setEventDetails(null)
  }, [])

  const handleOpenCreate = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setSelectedDate(null)
  }, [])

  return (
    <SappLoadingGlobal loading={false}>
      <Layout title="My Calender">
        <div className="min-h-screen bg-gray-10">
          <div className="mx-auto my-0 max-w-xxl pb-6 pt-6 xl-max:mx-6 4xl:ms-[calc(((100vw-1440px)/2)-80px)] 4xl:max-w-2xl">
            <Heading title={TitleSidebar.MY_CALENDER} />
            <div className="mt-6">
              <Calendar
                onOpenCreate={handleOpenCreate}
                onOpenDetail={handleOpenDetail}
              />
            </div>
          </div>
        </div>
        <EventDetails details={eventDetails} handleClose={handleCloseDetail} />
        <NewEventSidebar
          currentDate={selectedDate}
          onCancel={handleCloseSidebar}
        />
      </Layout>
    </SappLoadingGlobal>
  )
}

export default MyCalendar
