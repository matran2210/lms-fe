import BaseModal from '@components/courses/popup/BaseModal'
import { ILearningOutcomeProps } from '@lms/core'
import { EditorReader } from '@lms/ui'

export default function LearningOutcomeMobile({
  title,
  items,
  visible,
  onClose,
}: ILearningOutcomeProps) {
  return (
    <>
      <div className="md:hidden">
        <BaseModal
          title={title}
          visible={visible}
          onClose={onClose}
          bodyStyle={{
            maxHeight: '50vh',
            overflowY: 'auto',
          }}
          wrapClassName="learning-outcoming-modal"
        >
          {items.map((item, index) => (
            <div className="item mb-4 last:mb-0" key={index}>
              <p className="flex items-start gap-1 text-sm font-normal leading-5.5 text-gray-800">
                <span className="font-bold">LO{index + 1}:</span>
                <EditorReader text_editor_content={item.title} />
              </p>
            </div>
          ))}
        </BaseModal>
      </div>
    </>
  )
}
