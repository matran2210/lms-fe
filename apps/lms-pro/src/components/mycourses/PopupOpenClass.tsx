import { UnstartedIcon } from '@assets/icons'
import { SappModalV3 } from '@lms/ui'
import { formatDate } from '@utils/helpers'
import { Dispatch, SetStateAction } from 'react'
import { MY_COURSES } from '@lms/core'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  started_at: Date
}
const PopupLesson = ({ open, setOpen, started_at }: IProps) => {
  const onOk = () => {
    setOpen(false)
  }
  const ContentUnstartedCourse = () => {
    return (
      <div className="justify-center self-stretch text-center">
        <span className="text-base font-normal leading-normal text-gray-800">
          This Course will start on{' '}
          {formatDate(new Date(started_at).toString(), true)}. Please come back
          later or contact{' '}
          <span className="font-semibold">
            our Support at {MY_COURSES.hotline}
          </span>
        </span>
      </div>
    )
  }

  return (
    <SappModalV3
      open={open}
      handleCancel={onOk}
      onOk={onOk}
      icon={<UnstartedIcon />}
      header="Unstarted Course"
      content={<ContentUnstartedCourse />}
      showFooter
      okButtonCaption="Back to My Course"
      fullWidthBtn
      buttonSize="medium"
      showCancelButton={false}
      isUnderLine
    />
  )
}

export default PopupLesson
