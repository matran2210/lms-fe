import { AlertIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { formatDate } from '@utils/helpers'
import { Dispatch, SetStateAction } from 'react'
import { MY_COURSES } from 'src/constants/lang'

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
      okButtonCaption="Back to my course"
      onOk={onOk}
      handleCancel={() => setOpen(false)}
      showHeader={false}
      footerButtonClassName="flex flex-col-reverse gap-8"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="medium"
      confirmOnclose={false}
      title={undefined}
      showCancelButton={false}
    >
      <div className="mx-auto mb-6 flex w-max items-center justify-center rounded-full bg-secondary p-8">
        <AlertIcon />
      </div>
      <div className="flex justify-center text-2xl font-semibold text-bw-1 md:text-4xl">
        Unstarted Course
      </div>
      <div className="mb-1 mt-4 px-1 text-center text-sm text-gray-1 xl:mb-7">
        This Course will start on{' '}
        {formatDate(new Date(started_at).toString(), true)}. Please come back
        later or contact our Support at {MY_COURSES.hotline}.
      </div>
    </SappModalV2>
  )
}

export default PopupLesson
