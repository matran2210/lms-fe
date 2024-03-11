import { ActiveIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'

interface IProps {
  open: boolean
  setOpen: any
  activeCourse: () => void
  time?: number
}
const PopupActive = ({ open, setOpen, activeCourse, time = 60 }: IProps) => {
  const handleCancel = () => {
    setOpen(false)
  }
  const onOk = () => {
    setOpen(false)
    activeCourse()
  }

  return (
    <SappModalV2
      open={open}
      okButtonCaption="Confirm"
      cancelButtonCaption="Cancel"
      onOk={onOk}
      handleCancel={handleCancel}
      cancelButtonClass={'no-underline'}
      showHeader={false}
      footerButtonClassName="flex flex-col-reverse gap-8"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      confirmOnclose={false}
      title={undefined}
    >
      <div className="mb-6 flex justify-center">
        <ActiveIcon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold flex justify-center">
        Active Course?
      </div>
      <div className="text-medium-sm text-gray-1 text-center mt-4 mb-1 2xl:mb-11">
        You will have {time} {time > 1 ? 'days' : 'day'} from the activation
        date to study this course
      </div>
    </SappModalV2>
  )
}

export default PopupActive
