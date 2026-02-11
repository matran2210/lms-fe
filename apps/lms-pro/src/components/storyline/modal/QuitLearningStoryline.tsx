'use client'
import { AlertTriagle, ArrowActionIcon } from '@lms/assets'
import { ExaminationForm, ExaminationsResponse } from '@lms/contexts'
import { SappModalV3 } from '@lms/ui'
import { useRouter } from 'next/navigation'
import { UseFormReturn } from 'react-hook-form'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
}
const QuitLearningStoryline = ({ open, setOpen }: IProps) => {
  const router = useRouter()
  const onClose = () => {
    setOpen(false)
  }
  const onSubmit = () => {
    // router.push('/storyline')
    console.log('back to section')
  }
  return (
    <SappModalV3
      handleClose={onClose}
      open={open}
      cancelButtonCaption="Cancel"
      okButtonCaption="Quit Anyway"
      handleCancel={onClose}
      onOk={onSubmit}
      revertFunction
      fullWidthBtn={true}
      icon={<ArrowActionIcon className="h-22 w-22 text-primary" />}
      header="Are you sure?"
    >
      If you quit at this time, the test results will not be saved
    </SappModalV3>
  )
}

export default QuitLearningStoryline
