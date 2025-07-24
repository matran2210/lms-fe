import { ArrowDownIcon, ArrowUpIcon, StarIcon } from '../icons'
import { ILearningOutcomeProps } from 'src/type/courses-3-level'
import EditorReader from '@components/base/editor/EditorReader'

export default function LearningOutcomeDesktop({
  title,
  items,
  visible,
  onClose,
}: ILearningOutcomeProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white p-6 font-bold shadow-search lg:block">
        <div
          className="mb-6 flex cursor-pointer justify-between"
          onClick={onClose}
        >
          <h2 className="text-lg font-semibold leading-7 text-bw-15">
            {title}
          </h2>
          {visible ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </div>
        {visible && (
          <div className="list-active">
            {items.map((item, index) => (
              <div className="item mb-4 last:mb-0" key={index}>
                <div className="content flex gap-2">
                  <div className="mt-[0.05em]">
                    <StarIcon />
                  </div>
                  <div className="flex items-start gap-1 text-base font-normal text-bw-15">
                    <span>LO{index + 1}:</span>
                    <EditorReader text_editor_content={item.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
