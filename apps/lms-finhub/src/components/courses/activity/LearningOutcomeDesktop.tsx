import { ILearningOutcomeProps } from '@lms/core'
import { EditorReader } from '@lms/ui'
import { useEffect, useRef, useState } from 'react'
import { StarIcon } from '../icons'
import { ArrowUpIcon, ArrowDownIcon } from '@lms/assets'

export default function LearningOutcomeDesktop({
  title,
  items,
  visible,
  onClose,
}: ILearningOutcomeProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  useEffect(() => {
    if (!contentRef.current) return
    const el = contentRef.current
    const nextHeight = visible ? el.scrollHeight : 0
    setMaxHeight(nextHeight)
  }, [visible, items])
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-white p-6 font-bold shadow-search lg:block">
        <div
          className="flex cursor-pointer select-none justify-between"
          onClick={onClose}
        >
          <h2 className="text-lg font-semibold leading-7 text-gray-800">
            {title}
          </h2>
          {visible ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </div>
        <div
          ref={contentRef}
          className={`list-active overflow-hidden transition-all duration-300 ease-in-out ${
            visible ? 'mt-6 opacity-100' : 'opacity-0'
          }`}
          style={{ maxHeight }}
          aria-hidden={!visible}
        >
          {items.map((item, index) => (
            <div className="item mb-4 last:mb-0" key={index}>
              <div className="content flex gap-2">
                <div className="mt-[0.05em]">
                  <StarIcon />
                </div>
                <div className="flex select-none items-start gap-1 text-base font-normal text-gray-800">
                  <span>LO{index + 1}:</span>
                  <EditorReader text_editor_content={item.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
