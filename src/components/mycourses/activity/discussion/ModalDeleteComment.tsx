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
        <div className="p-8 rounded-full bg-secondary w-fit">
          <AlertIcon />
        </div>
      </div>
      <div className="text-bw-1 text-4xl font-semibold mt-6 flex justify-center">
        Delete Comment?
      </div>
      <div className="text-medium-sm text-gray-1 text-center mt-4 mb-11">
        Are you sure you want to delete this comment?
      </div>
    </SappModalV2>
  )
}

export default ModalDeleteComment
