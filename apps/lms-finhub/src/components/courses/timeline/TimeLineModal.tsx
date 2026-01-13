import React from 'react'
import { TimeLineProp } from 'src/type/courses-3-level'
import BaseModal from '@components/courses/popup/BaseModal'
import { formatTimer } from '@lms/utils'

export default function TimeLineModal({
  items,
  visible,
  onClose,
  onGoTimeline,
}: TimeLineProp) {
  const handleGoTimeline = (time: number) => {
    if (onGoTimeline) {
      onGoTimeline(time)
    }
  }

  return (
    <>
      <BaseModal
        closable={false}
        visible={visible}
        onClose={onClose}
        width={'auto'}
        bodyStyle={{
          maxHeight: '230px',
          overflowY: 'auto',
        }}
        wrapClassName="timeline-modal"
      >
        {items?.map((e, i) => {
          return (
            <div
              key={i}
              className="flex cursor-pointer gap-3 p-2 text-sm leading-5.5 text-bw-15 hover:bg-gray-4"
              onClick={() => handleGoTimeline(e?.time)}
            >
              <div className="min-w-[62px] font-medium text-state-info">
                {formatTimer(e?.time)}
              </div>
              <div className="text-inherit line-clamp-2 text-bw-1">
                {e?.text}
              </div>
            </div>
          )
        })}
      </BaseModal>
    </>
  )
}
