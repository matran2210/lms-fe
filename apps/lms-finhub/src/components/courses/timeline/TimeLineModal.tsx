import React from 'react'
import { TimeLineProp } from 'src/type/courses-3-level'
import { formatTime } from '@components/common/timer'
import BaseModal from '@components/courses/popup/BaseModal'

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
              className="flex cursor-pointer gap-3 p-2 text-sm leading-5.5 text-gray-800 hover:bg-gray-100"
              onClick={() => handleGoTimeline(e?.time)}
            >
              <div className="min-w-[62px] font-medium text-state-info">
                {formatTime(e?.time)}
              </div>
              <div className="text-inherit line-clamp-2 text-gray-800">
                {e?.text}
              </div>
            </div>
          )
        })}
      </BaseModal>
    </>
  )
}
