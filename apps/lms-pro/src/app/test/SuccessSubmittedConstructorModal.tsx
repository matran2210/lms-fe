"use client"
import { ConfirmIcon } from '@lms/assets'
import { FINISHED_TEST_TITLE } from '@lms/core'
import { SappModalV3 } from '@lms/ui'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<
    SetStateAction<{
      open: boolean
      resultId: string
    }>
  >
  quizName?: string
  handleOk?: () => void
  handleCancel?: () => void
}
const SuccessSubmittedConstructorModal = ({
  open,
  setOpen,
  quizName,
  handleCancel = () => {},
  handleOk = () => {},
}: IProps) => {
  return (
    <SappModalV3
      open={open}
      okButtonCaption="Review Answers"
      cancelButtonCaption="Back"
      handleClose={() =>
        setOpen({
          open: false,
          resultId: '',
        })
      }
      handleCancel={handleCancel}
      onOk={handleOk}
      fullWidthBtn={true}
      buttonSize="extra"
      icon={<ConfirmIcon />}
      header={FINISHED_TEST_TITLE}
      content={`Congratulations on completing ${quizName}. The result will be sent to you via email after the grading is finished.`}
    />
  )
}

export default SuccessSubmittedConstructorModal
