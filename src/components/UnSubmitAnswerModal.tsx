import { AlertTriagle } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
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
  }
  const onCancel = () => {
    setOpen(false)
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
      <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto">
        <AlertTriagle />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold text-center">
        Are You Sure
      </div>
      <div className="text-center mt-4 mb-3">
        <span className="text-gray-1 text-medium-sm font-normal mt-4 mb-3 text-center">
          Oops look like you&apos;ve got a few unfinished questions:
        </span>
        <span className="text-bw-1 text-medium-sm font-semibold mt-4 mb-3 text-center ms-1">
          {data?.length > 10 ? data?.slice(0, 10)?.join(', ') : data.join(', ')}
        </span>
        <span className="text-gray-1 text-medium-sm font-normal mt-4 mb-3 text-center ms-1">
          {data?.length > 10 ? '...' : ''}After you submit, you can&apos;t edit
          this assignment.
        </span>
      </div>
    </SappModalV2>
  )
}

export default UnSubmitAnswerModal
