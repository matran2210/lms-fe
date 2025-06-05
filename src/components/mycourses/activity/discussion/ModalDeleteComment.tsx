import { AlertIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import React, { Dispatch, SetStateAction } from 'react'

interface IProps {
  isDelete: boolean
  setIsDelete: Dispatch<SetStateAction<boolean>>
  onDeleteComment: () => void
}

const ModalDeleteComment = ({
  isDelete,
  onDeleteComment,
  setIsDelete,
}: IProps) => {
  return (
    <SappModalV2
      title={undefined}
      open={isDelete}
      handleCancel={() => setIsDelete(false)}
      showOkButton={true}
      onOk={onDeleteComment}
      okButtonCaption={'Delete'}
      cancelButtonCaption={'Cancel'}
      buttonSize="lager"
      cancelButtonClass={'no-underline'}
      showHeader={false}
      refClass="p-6 md:py-[70px] md:px-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all overflow-y-auto"
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-8"
      childClass="flex flex-col justify-center items-center"
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      scrollbale={false}
    >
      <div className="flex justify-center">
        <div className="w-fit rounded-full bg-secondary p-8">
          <AlertIcon />
        </div>
      </div>
      <div className="mt-6 flex justify-center text-4xl font-semibold text-bw-1">
        Delete Comment?
      </div>
      <div className="mb-11 mt-4 text-center text-sm text-gray-1">
        Are you sure you want to delete this comment?
      </div>
    </SappModalV2>
  )
}

export default ModalDeleteComment
