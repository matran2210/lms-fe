import SappModal from '@components/base/modal/SappModal'
import { memo } from 'react'
import { IEvent } from 'sapp-common-package/dist/types'
import SappIcon from 'src/common/SappIcon'
import { IPopupDetails } from 'src/type/my-calendar'
import EventRowDetails from './EventRowDetails'

interface IProps {
  details: IPopupDetails | null
  handleClose: () => void
}

interface IModalHeaderProps {
  date: Date
  handleClose: () => void
}

interface IModalContentProps {
  events: IEvent[] | null
}

const ModalHeader = ({ date, handleClose }: IModalHeaderProps) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }
  const formattedDate = date.toLocaleDateString('en-US', options)

  return (
    <div className="flex flex-row justify-between border-b border-gray-5 px-6 py-5">
      <div className="flex flex-row items-center">
        <SappIcon icon="calendar" className="" />
        <span className="ml-3 font-inter text-lg font-semibold leading-4.5 tracking-normal">
          {formattedDate}
        </span>
      </div>
      <div onClick={handleClose} className="cursor-pointer">
        <SappIcon icon="closeicon" className="text-gray-11" />
      </div>
    </div>
  )
}

const ModalContent = ({ events }: IModalContentProps) => {
  return (
    events &&
    events.map((event, index) => (
      <div key={event.id}>
        <EventRowDetails event={event} />
        {index + 1 < events.length && (
          <hr className="my-4 border-dashed border-[#DBDFE9]" />
        )}
      </div>
    ))
  )
}

const EventDetails = ({ details, handleClose }: IProps) => {
  return (
    <SappModal
      open={details != null}
      size="max-w-[630px]"
      refClass="p-0 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all rounded-lg"
      position="center"
      overlayClass="bg-[#00000066;]"
      customHeader={
        details ? (
          <ModalHeader date={details.date} handleClose={handleClose} />
        ) : (
          <></>
        )
      }
      parentChildClass="p-8"
      showFooter={false}
      showCloseIcon={true}
      handleCancel={handleClose}
    >
      {details ? <ModalContent events={details.events} /> : <></>}
    </SappModal>
  )
}

export default memo(EventDetails)
