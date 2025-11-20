import React from 'react';
import { EditorReader } from '@lms/ui'
import { CloseIconV2 } from '@lms/assets'
import { Modal } from 'antd'
import { useTailwindBreakpoint } from '@lms/hooks'

interface IProps {
  isOpen: boolean
  handleCloseRecomment: () => void
  currentContent: string | null
  isComment: boolean
}

const ModalRecomment = ({
  currentContent,
  isOpen,
  isComment,
  handleCloseRecomment,
}: IProps) => {
  const { isMobileView } = useTailwindBreakpoint()
  return (
    <Modal
      width={1250}
      open={isOpen}
      className="sapp-modal max-w-[874px]"
      centered
      footer={false}
      onCancel={handleCloseRecomment}
      closable={!isMobileView}
      closeIcon={<CloseIconV2 />}
    >
      <div className="mb-6 flex items-center justify-between md:mb-10">
        <h1 className="text-center text-xl font-bold text-gray-800 md:text-3xl">
          {isComment ? 'Examiner’s Comment' : 'Recommendation'}
        </h1>
        <div className="block md:hidden" onClick={handleCloseRecomment}>
          <CloseIconV2 />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="max-h-[570px] overflow-y-auto">
          <EditorReader
            text_editor_content={currentContent ?? ''}
            className="text-sm text-gray-800 md:text-base"
          />
        </div>
      </div>
    </Modal>
  )
}

export default ModalRecomment
