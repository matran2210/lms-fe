import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { DragNDropIcon } from '@lms/assets/test'

interface DraggableItemProps {
  id: string
  answer: string
  fromSlotId?: string
  disabled?: boolean
  borderColor?: string
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  answer,
  fromSlotId,
  disabled,
  borderColor,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        answer,
        ...(fromSlotId && { fromSlotId }),
      },
      disabled,
    })

  const transformStyle = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      className={`draggable-item flex touch-none items-center gap-1 rounded-md border bg-white px-2 py-1 ${borderColor ? borderColor : 'border-gray-200'} ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${disabled ? 'cursor-not-allowed' : 'cursor-grab'}`}
      style={transformStyle}
      {...(!disabled ? listeners : {})}
      {...(!disabled ? attributes : {})}
    >
      {!disabled && <DragNDropIcon />}
      {answer}
    </div>
  )
}

export default DraggableItem
