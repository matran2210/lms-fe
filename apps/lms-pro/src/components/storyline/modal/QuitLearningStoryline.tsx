'use client'
import { AlertTriagle, ArrowActionIcon } from '@lms/assets'
import { ExaminationForm, ExaminationsResponse } from '@lms/contexts'
import { SappModalV3 } from '@lms/ui'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { UseFormReturn } from 'react-hook-form'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
}
const QuitLearningStoryline = ({ open, setOpen }: IProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const class_id = searchParams.get('class_id')
  const params = useParams()
  const onClose = () => {
    setOpen(false)
  }
  const onSubmit = () => {
    // router.push(`/courses/c5bfb6c8-8308-4f3b-baf9-4d86a0e63b21/section/cda6f760-bdcd-44a5-80ce-3171983cb4ee?&chapter=cc99e588-76e7-44e0-9ab4-ebdcecccf46f`)
    // console.log('back to section')
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
