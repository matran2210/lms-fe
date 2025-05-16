import { ActiveIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import React from 'react'

interface IModalFoundationCompletedProps {
  openContinue: boolean
  handleSkipCourse: () => void
  handleContinueFoundation: () => void
}

const ModalFoundationCompleted = ({
  openContinue,
  handleContinueFoundation,
  handleSkipCourse,
}: IModalFoundationCompletedProps) => {
  return (
    <SappModalV3
      open={openContinue}
      handleCancel={handleSkipCourse}
      onOk={handleContinueFoundation}
      icon={<ActiveIcon />}
      header="Foundation Not Completed"
      okButtonCaption="Continue with Foundation Course"
      cancelButtonCaption="Skip and start this course"
      isMaskClosable={false}
      fullWidthBtn={true}
      buttonSize="extra"
    >
      <div className="mt-4 text-center text-medium-sm text-gray-1">
        It looks like you haven&apos;t finished the Foundation Course.
      </div>
      <div className="mt-1 text-center text-medium-sm text-gray-1">
        Would you like to complete it first, or skip and start this course right
        away?
      </div>
    </SappModalV3>
  )
}

export default ModalFoundationCompleted
