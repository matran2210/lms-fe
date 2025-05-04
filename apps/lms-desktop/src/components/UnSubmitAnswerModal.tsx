import { AlertTriagle } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
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
      footerButtonClassName="flex flex-col-reverse gap-8"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      scrollbale={false}
      confirmOnclose={false}
      title={title ?? ''}
      cancelButtonCaption="Keep Doing"
    >
      <div className="mx-auto flex w-max items-center justify-center rounded-full bg-secondary p-8">
        <AlertTriagle />
      </div>
      <div className="text-center text-2xl font-semibold text-bw-1 md:text-4xl">
        Are You Sure
      </div>
      <div className="mb-3 mt-4 text-center">
        <span className="mb-3 mt-4 text-center text-medium-sm font-normal text-gray-1">
          Oops look like you&apos;ve got a few unfinished questions:
        </span>
        <span className="mb-3 ms-1 mt-4 text-center text-medium-sm font-semibold text-bw-1">
          {data?.length > 10 ? data?.slice(0, 10)?.join(', ') : data.join(', ')}
        </span>
        <span className="mb-3 ms-1 mt-4 text-center text-medium-sm font-normal text-gray-1">
          {data?.length > 10 ? '...' : ''}After you submit, you can&apos;t edit
          this assignment.
        </span>
      </div>
    </SappModalV2>
  )
}

export default UnSubmitAnswerModal
