import { AlertTriagle } from '@assets/icons'
import { SappModalV2 } from '@lms/ui'
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

  return (
    <SappModalV2
      open={open}
      okButtonCaption="Submit Anyway"
      onOk={onSubmit}
      handleCancel={onCancel}
      showHeader={false}
      refClass="p-6 md:p-8 3xl:py-[70px] 3xl:px-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col gap-3"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="medium"
      scrollbale={false}
      confirmOnclose={false}
      title={title ?? ''}
      cancelButtonCaption="Keep Doing"
      cancelButtonClass="!p-0 underline hover:text-primary"
    >
      <div className="mx-auto flex w-max items-center justify-center rounded-full">
        <AlertTriagle className="h-12 w-12 md:h-[88px] md:w-[88px]" />
      </div>
      <div className="pb-4 pt-6 text-center text-2xl font-semibold text-gray-800 md:py-8 md:pt-10 md:text-3xl">
        Are You Sure?
      </div>
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
    </SappModalV2>
  )
}

export default UnSubmitAnswerModal
