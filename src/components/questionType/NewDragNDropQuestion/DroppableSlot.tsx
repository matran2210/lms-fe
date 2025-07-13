import React from 'react'
import { useDroppable, useDraggable } from '@dnd-kit/core'

interface DroppableSlotProps {
  id: string
  value: string
  index: number
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({ id, value, index }) => {
  const { setNodeRef: setDropRef } = useDroppable({ id })

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `slot-${id}`,
    data: value
      ? {
          answer: value,
        }
      : undefined,
    disabled: !value,
  })

  const slotBaseClass =
    'min-w-[100px] min-h-[22px] px-3 py-2 text-center touch-none relative border-b border-[#71717a] w-[100px]'

  const draggingClass = isDragging ? 'opacity-50' : 'opacity-100'
  const cursorClass = value ? 'cursor-grab' : 'cursor-default'

  if (value) {
    return (
      <div
        ref={setDropRef}
        className="mx-1 inline-block min-h-[30px] min-w-[100px]"
      >
        <span
          ref={setDragRef}
          className={`${slotBaseClass} ${draggingClass} ${cursorClass}`}
          {...listeners}
          {...attributes}
        >
          {value}
        </span>
      </div>
    )
  }

  return (
    <div
      ref={setDropRef}
      className={`${slotBaseClass} dragNdrop-question__slot`}
      data-slot-index={`(${index + 1})`}
    ></div>
  )
}

export default DroppableSlot
