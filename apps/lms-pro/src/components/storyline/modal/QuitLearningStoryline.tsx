'use client'
import { ArrowActionIcon } from '@lms/assets'
import { SappModalV3 } from '@lms/ui'
import { useRouter, useSearchParams } from 'next/navigation'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
}
const QuitLearningStoryline = ({ open, setOpen }: IProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const class_id = searchParams.get('class_id')
  const course_section_id = searchParams.get('course_section_id')
  const onClose = () => {
    setOpen(false)
  }
  const onSubmit = () => {
    router.push(`/courses/${class_id}/section/${course_section_id}`)
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
      buttonSize="medium"
    >
      Your learning progress has been saved. You can return and continue anytime
    </SappModalV3>
  )
}

export default QuitLearningStoryline
