import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface DraggableItemProps {
  id: string
  answer: string
  fromSlotId?: string
  style?: React.CSSProperties
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  answer,
  fromSlotId,
  style,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        answer,
        ...(fromSlotId && { fromSlotId }),
      },
    })

  const defaultStyle: React.CSSProperties = {
    padding: '8px 12px',
    background: '#e0f0ff',
    border: '1px solid #ccc',
    borderRadius: 4,
    cursor: 'grab',
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const finalStyle = { ...defaultStyle, ...style }

  return (
    <div ref={setNodeRef} style={finalStyle} {...listeners} {...attributes}>
      {answer}
    </div>
  )
}

export default DraggableItem
