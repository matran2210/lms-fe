import { AlertIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import SappModalV2 from '@components/base/modal/SappModalV2'

interface IProps {
  open: boolean
  setOpen: any
}
const PopupLesson = ({ open, setOpen }: IProps) => {
  const onOk = () => {
    setOpen(false)
  }
  return (
    <SappModalV2
      open={open}
      onOk={onOk}
      handleCancel={() => setOpen(false)}
      title={undefined}
      showFooter={false}
    >
      <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto mb-6">
        <AlertIcon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold flex justify-center">
        Course
      </div>
      <div className="text-medium-sm text-gray-1 text-center mt-4 mb-1 xl:mb-7 px-1">
        Please pass the Foundation Class to activate this course.
      </div>
    </SappModalV2>
  )
}

export default PopupLesson
