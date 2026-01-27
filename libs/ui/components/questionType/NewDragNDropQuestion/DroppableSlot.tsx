import React from 'react'
import { useDroppable, useDraggable } from '@dnd-kit/core'

interface DroppableSlotProps {
  id: string
  value: string
  index: number
  disabled?: boolean
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({
  id,
  value,
  index,
  disabled,
}) => {
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
    disabled: !value || disabled,
  })

  const slotBaseClass =
    'min-w-[100px] min-h-[22px] px-3 py-2 text-center touch-none relative border-b w-[100px]'

  const draggingClass = isDragging ? 'opacity-50' : 'opacity-100'
  const cursorClass = disabled
    ? 'cursor-not-allowed'
    : value
      ? 'cursor-grab'
      : 'cursor-default'

  if (value) {
    return (
      <span
        ref={setDropRef}
        className="mx-1 inline-block min-h-[30px] min-w-[100px] align-middle"
      >
        <span
          ref={setDragRef}
          className={`${slotBaseClass} border-[#71717a] ${draggingClass} ${cursorClass}`}
          {...listeners}
          {...attributes}
        >
          {value}
        </span>
      </span>
    )
  }

  return (
    <span
      ref={setDropRef}
      className={`${slotBaseClass} dragNdrop-question__slot inline-block align-middle`}
      data-slot-index={`(${index})`}
    ></span>
  )
}

export default DroppableSlot
