import { Modal } from 'antd'

const FilterCourseModal = ({ children }: { children: React.ReactNode }) => {
  return (
    <Modal>
      <div>{children}</div>
    </Modal>
  )
}

export default FilterCourseModal
