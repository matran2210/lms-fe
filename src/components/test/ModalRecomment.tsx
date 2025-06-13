import EditorReader from '@components/base/editor/EditorReader'
import { Modal } from 'antd'

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
  return (
    <Modal
      width={1250}
      open={isOpen}
      className="sapp-modal max-w-[874px]"
      centered
      footer={false}
      onCancel={handleCloseRecomment}
    >
      <h1 className="mb-10 text-center text-3xl font-bold">
        {isComment ? 'Examiner’s Comment' : 'Recommendation'}
      </h1>
      <div className="flex flex-col gap-4">
        <div className="max-h-[570px] overflow-y-auto">
          <EditorReader text_editor_content={currentContent ?? ''} />
        </div>
      </div>
    </Modal>
  )
}

export default ModalRecomment
