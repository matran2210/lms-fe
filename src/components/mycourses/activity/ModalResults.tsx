import { CloseIcon } from '@assets/icons'
import { Modal } from 'antd'
import { QuizResultComponent } from 'quiz-result-package'
import React from 'react'
interface IProps {
  open: boolean
  handleOk: () => void
  handleCancel: () => void
  loading: boolean
  modalResult: any
  getTable: any
  handleShowQuestionResultDetail: any
}
const ModalResults = ({
  open,
  handleOk,
  handleCancel,
  loading,
  modalResult,
  handleShowQuestionResultDetail,
  getTable,
}: IProps) => {
  return (
    <Modal
      open={open}
      title=""
      onOk={handleOk}
      onCancel={handleCancel}
      closable={false}
      footer={[]}
      //   closeIcon={<CloseIcon className="transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-primary" />}
      style={{ top: 0, left: 0, padding: 0, maxWidth: '100%', height: '100%' }}
      width="100vw"
      centered={false}
      classNames={{
        content:
          'bg-white w-screen h-screen !max-w-none !rounded-none overflow-hidden !p-0',
      }}
    >
      <div className="m-auto max-w-screen-lg overflow-x-auto overflow-y-hidden px-6">
        <div
          className="absolute right-6 top-5  ml-auto cursor-pointer"
          onClick={handleCancel}
        >
          <CloseIcon className="transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-primary" />
        </div>
        <QuizResultComponent
          questionResponse={modalResult?.questions || []}
          getTable={getTable}
          onShowDetail={handleShowQuestionResultDetail}
          loading={loading}
        />
      </div>
    </Modal>
  )
}

export default ModalResults
