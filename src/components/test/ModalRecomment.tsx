import EditorReader from '@components/base/editor/EditorReader'
import SappModalV3 from '@components/base/modal/SappModalV3'
import React from 'react'
import SappIcon from 'src/common/SappIcon'

interface IProps {
  isOpen: boolean
  handleCloseRecomment: () => void
  currentContent: string | null
  isComment: boolean
}

const ModalRecomment = ({
  currentContent,
  handleCloseRecomment,
  isOpen,
  isComment,
}: IProps) => {
  return (
    <SappModalV3
      width={1250}
      open={isOpen}
      handleCancel={handleCloseRecomment}
      onOk={() => {}}
      icon={undefined}
      header={''}
      showFooter={false}
      classNameModal="sapp-modal--comment"
    >
      <div className="flex items-center justify-between bg-[#F1F1F1] px-8 py-[13px]">
        <div className="flex items-center text-base font-medium text-[#050505]">
          {isComment ? 'Examiner’s Comment' : 'Recommendation'}
        </div>
        <div className="cursor-pointer" onClick={handleCloseRecomment}>
          <SappIcon icon="closeicon" />
        </div>
      </div>
      <div className="max-h-[570px] overflow-y-auto p-8">
        <EditorReader text_editor_content={currentContent ?? ''} />
      </div>
    </SappModalV3>
  )
}

export default ModalRecomment
