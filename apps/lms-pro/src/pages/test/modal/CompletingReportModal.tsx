import { ConfirmIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import React from 'react'
import { FINISHED_TEST_TITLE } from '@lms/core'

interface IProps {
  open: boolean
  onOk: () => void
  handleCancel: () => void
  quizName: string
}
const CompletingReportModal = (props: IProps) => {
  const { open, handleCancel, onOk, quizName } = props
  return (
    <SappModalV3
      open={open}
      okButtonCaption="Back"
      handleCancel={handleCancel}
      onOk={onOk}
      fullWidthBtn={true}
      buttonSize="extra"
      icon={<ConfirmIcon />}
      header={FINISHED_TEST_TITLE}
      content={`Congratulations on completing ${quizName}. The result will be sent to you via email after the grading is finished.`}
    />
  )
}

export default CompletingReportModal
