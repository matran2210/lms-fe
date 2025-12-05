import { memo } from 'react'
import { SappIcon } from '@lms/ui'
import EventRowDetails from './EventRowDetails'
import { SappModalV3 } from '@lms/ui'
import { IPopupDetails } from '@lms/core'
import { IEvent } from 'sapp-common-package/dist/types'

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
    <div className="flex flex-row justify-between border-b border-[#7E8299] pb-5">
      <div className="flex flex-row items-center">
        <SappIcon icon="calendar" />
        <span className="ml-3 font-inter text-lg font-semibold leading-[17px] tracking-normal">
          {formattedDate}
        </span>
      </div>
      <div onClick={handleClose} className="cursor-pointer">
        <SappIcon icon="closeicon" className="text-[#99A1B7]" />
      </div>
    </div>
  )
}

const ModalContent = ({ events }: IModalContentProps) => {
  return (
    <div className="p-2">
      {events?.map((event, index) => (
        <div key={event.id} className="text-start">
          <EventRowDetails event={event} />
          {index + 1 < events.length && (
            <hr className="my-4 border-dashed border-[#DBDFE9]" />
          )}
        </div>
      ))}
    </div>
  )
}

const EventDetails = ({ details, handleClose }: IProps) => {
  return (
    <SappModalV3
      open={details != null}
      size="max-w-[630px]"
      title={
        details && <ModalHeader date={details.date} handleClose={handleClose} />
      }
      showFooter={false}
      handleCancel={handleClose}
      onOk={() => {}}
      icon={null}
      header=""
      classNameModal="[&>div>div]:!px-6 [&>div>div]:!py-5"
    >
      {details && <ModalContent events={details.events} />}
    </SappModalV3>
  )
}

export default memo(EventDetails)
