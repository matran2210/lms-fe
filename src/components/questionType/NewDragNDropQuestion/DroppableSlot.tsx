import React from 'react'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface DroppableSlotProps {
  id: string
  value: string
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({ id, value }) => {
  const { isOver, setNodeRef: setDropRef } = useDroppable({ id })

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
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

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    minWidth: 100,
    minHeight: 30,
    margin: '0 4px',
  }

  const slotStyle: React.CSSProperties = {
    minWidth: 100,
    minHeight: 30,
    padding: '8px 12px',
    border: '2px dashed #aaa',
    background: isOver ? '#f0f0f0' : '#fafafa',
    textAlign: 'center',
    borderRadius: 4,
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: value ? 'grab' : 'default',
  }

  // Nếu có giá trị, sử dụng wrapper với cả droppable và draggable
  if (value) {
    return (
      <div ref={setDropRef} style={containerStyle}>
        <span ref={setDragRef} style={slotStyle} {...listeners} {...attributes}>
          {value}
        </span>
      </div>
    )
  }

  // Nếu không có giá trị, chỉ sử dụng droppable
  return (
    <span ref={setDropRef} style={slotStyle}>
      _______
    </span>
  )
}

export default DroppableSlot
