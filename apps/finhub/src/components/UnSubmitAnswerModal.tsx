import { AlertTriagle } from '@assets/icons'
import ShortCourseModal from '@components/base/modal/ShortCourseModal'
import { trackGAEvent } from '@utils/google-analytics'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  data: number[] | []
  handleSubmit: () => void
  handleCancel: () => void
  title?: string
}
const UnSubmitAnswerModal = ({
  title,
  open,
  setOpen,
  data,
  handleSubmit,
  handleCancel,
}: IProps) => {
  const onSubmit = () => {
    handleSubmit()
    trackGAEvent('Click Button Submit Anyway Test')
  }

  const onCancel = () => {
    setOpen(false)
    trackGAEvent('Click Button Keep Doing Test')
  }

  const ContentUnSubmitAnswer = () => {
    return (
      <div className="text-center text-sm md:text-base">
        <span className="text-center font-normal text-gray-800">
          Oops look like you&apos;ve got a few unfinished questions:&nbsp;
        </span>
        <span className="text-center font-semibold text-primary">
          {data?.length > 10 ? data?.slice(0, 10)?.join(', ') : data.join(', ')}{' '}
          {data?.length > 10 ? '...' : ''}
        </span>
        <span className="text-center font-normal text-gray-800">
          After you submit, you can&apos;t edit this assignment.
        </span>
      </div>
    )
  }

  return (
    <ShortCourseModal
      open={open}
      handleCancel={onCancel}
      onOk={onSubmit}
      icon={<AlertTriagle />}
      header="Are You Sure?"
      content={<ContentUnSubmitAnswer />}
      showFooter
      okButtonCaption="Submit Anyway"
      fullWidthBtn
      buttonSize="medium"
      cancelButtonCaption="Keep Doing"
      isUnderLine
    />
  )
}

export default UnSubmitAnswerModal
