import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { DragNDropIcon } from '@assets/icons/test'

interface DraggableItemProps {
  id: string
  answer: string
  fromSlotId?: string
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  answer,
  fromSlotId,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        answer,
        ...(fromSlotId && { fromSlotId }),
      },
    })

  const transformStyle = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      className={`draggable-item flex touch-none items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } cursor-grab`}
      style={transformStyle}
      {...listeners}
      {...attributes}
    >
      <DragNDropIcon />
      {answer}
    </div>
  )
}

export default DraggableItem
