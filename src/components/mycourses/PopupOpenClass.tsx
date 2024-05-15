import { AlertIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { formatDate } from '@utils/helpers'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  started_at: Date
}
const PopupLesson = ({ open, setOpen, started_at }: IProps) => {
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
        This Course will start on{' '}
        {formatDate(new Date(started_at).toLocaleDateString(), true)}. Please
        come back later or contact our Support at 0889 662 276.
      </div>
    </SappModalV2>
  )
}

export default PopupLesson
