import { DeleteCommentIcon } from '@lms/assets'
import { SappModalV3 } from '@lms/ui'
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
  const ContentModalDeleteComment = () => {
    return (
      <div className="justify-center self-stretch text-center">
        <span className="text-base font-normal leading-normal text-gray-800">
          Are you sure you want to delete this comment?
        </span>
      </div>
    )
  }

  return (
    <SappModalV3
      open={isDelete}
      handleClose={() => setIsDelete(false)}
      handleCancel={() => setIsDelete(false)}
      onOk={onDeleteComment}
      icon={<DeleteCommentIcon />}
      header="Delete Comment?"
      content={<ContentModalDeleteComment />}
      showFooter
      okButtonCaption="Delete"
      fullWidthBtn
      buttonSize="medium"
      cancelButtonCaption="Cancel"
      headerClassName="text-center"
      isUnderLine
    />
  )
}

export default ModalDeleteComment
