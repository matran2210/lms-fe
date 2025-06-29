import React, { useEffect, useMemo, useState } from 'react'
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core'
import parse, { Element, domToReact } from 'html-react-parser'
import DroppableSlot from './DroppableSlot'
import DraggableItem from './DraggableItem'

interface Answer {
  id: string
  answer: string
  answer_position: number
}

export interface SlotValue {
  id: string
  value: string
  position: number
}

interface DragDropQuestionProps {
  data: {
    question_content: string
    answers: Answer[]
  }
  defaultValue: SlotValue[]
  onChange?: (data: SlotValue[]) => void
}

// Component cho bank area
const BankArea: React.FC<{ items: Answer[] }> = ({ items }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'bank' })

  return (
    <div
      ref={setNodeRef}
      id="bank"
      className="flex flex-wrap gap-2 rounded-lg border border-gray-100 p-3"
      style={{
        background: isOver ? '#f0f8ff' : 'transparent',
        borderColor: isOver ? '#3b82f6' : '#e5e7eb',
      }}
    >
      {items.map((item) => (
        <DraggableItem key={item.id} id={item.id} answer={item.answer} />
      ))}
    </div>
  )
}

// Component cho slot có giá trị
const SlotWithValue: React.FC<{ id: string; value: string }> = ({
  id,
  value,
}) => {
  const { isOver, setNodeRef: setDropRef } = useDroppable({ id })

  return (
    <div ref={setDropRef} style={{ display: 'inline-block', margin: '0 4px' }}>
      <DraggableItem
        id={`slot-${id}`}
        answer={value}
        fromSlotId={id}
        style={{
          minWidth: 100,
          minHeight: 30,
          padding: '8px 12px',
          border: '2px dashed #aaa',
          background: isOver ? '#f0f0f0' : '#fafafa',
          textAlign: 'center',
          borderRadius: 4,
        }}
      />
    </div>
  )
}

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({
  data,
  defaultValue,
  onChange,
}) => {
  const [slots, setSlots] = useState<SlotValue[]>([])
  const [items, setItems] = useState<Answer[]>([])

  // Tạo slots từ question_content
  const parsedSlots = useMemo(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(data.question_content, 'text/html')
    return Array.from(doc.querySelectorAll('.question-content-tag')).map(
      (el, idx) => ({
        id: el.id,
        value: (defaultValue || []).find((d) => d.id === el.id)?.value || '',
        position: idx,
      }),
    )
  }, [data.question_content, defaultValue])

  useEffect(() => {
    setSlots(parsedSlots)

    const usedAnswers = new Set(parsedSlots.map((s) => s.value))
    const remaining = data.answers.filter((a) => !usedAnswers.has(a.answer))
    setItems(remaining)
  }, [parsedSlots, data.answers])

  // Parse lại HTML thành JSX + DroppableSlot hoặc SlotWithValue
  const renderedContent = useMemo(() => {
    return parse(data.question_content, {
      replace: (domNode) => {
        if (
          domNode instanceof Element &&
          domNode.name === 'span' &&
          domNode.attribs?.class?.includes('question-content-tag')
        ) {
          const id = domNode.attribs.id
          const slot = slots.find((s) => s.id === id)
          const value = slot?.value || ''

          if (value) {
            return <SlotWithValue key={id} id={id} value={value} />
          } else {
            return <DroppableSlot key={id} id={id} value="" />
          }
        }
        return undefined
      },
    })
  }, [data.question_content, slots])

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    if (!over || !active) return

    const draggedAnswer = active.data.current?.answer
    const fromSlotId = active.data.current?.fromSlotId
    const rawId = active.id as string

    // Kéo từ slot về bank
    if (over.id === 'bank' && fromSlotId && draggedAnswer) {
      const slot = slots.find((s) => s.id === fromSlotId)

      if (!slot) return

      const newSlots = [...slots]
      const index = newSlots.findIndex((s) => s.id === fromSlotId)
      if (index === -1) return

      // Clear slot
      newSlots[index].value = ''
      setSlots(newSlots)

      // Thêm item vào bank
      setItems((prev) => {
        // Tìm item gốc từ data.answers
        const originalItem = data.answers.find(
          (a) => a.answer === draggedAnswer,
        )
        if (originalItem) {
          // Kiểm tra xem item gốc này đã có trong bank chưa
          const existingOriginalItem = prev.find(
            (i) => i.id === originalItem.id,
          )
          if (existingOriginalItem) {
            // Nếu item gốc đã có, tạo một bản sao với ID khác
            return [
              ...prev,
              {
                ...originalItem,
                id: `item-${Date.now()}-${Math.random()}`,
              },
            ]
          }
          return [...prev, originalItem]
        }

        // Fallback - tạo item mới với ID duy nhất
        const newItem = {
          id: `item-${Date.now()}-${Math.random()}`,
          answer: draggedAnswer,
          answer_position: 0,
        }
        return [...prev, newItem]
      })

      onChange?.(newSlots)
      return
    }

    // Kéo từ bank vào slot
    const droppedSlotId = over.id as string
    if (!draggedAnswer || !rawId || !droppedSlotId || droppedSlotId === 'bank')
      return

    const newSlots = [...slots]
    const targetSlotIndex = newSlots.findIndex(
      (slot) => slot.id === droppedSlotId,
    )
    if (targetSlotIndex === -1) return

    // Nếu kéo từ slot này sang slot khác (swap)
    if (fromSlotId && fromSlotId !== droppedSlotId) {
      const sourceSlotIndex = newSlots.findIndex(
        (slot) => slot.id === fromSlotId,
      )
      if (sourceSlotIndex === -1) return

      // Đổi chỗ 2 items
      const tempValue = newSlots[sourceSlotIndex].value
      newSlots[sourceSlotIndex].value = newSlots[targetSlotIndex].value
      newSlots[targetSlotIndex].value = tempValue

      setSlots(newSlots)
      onChange?.(newSlots)
      return
    }

    // Kéo từ bank vào slot (trường hợp thông thường)
    const oldValue = newSlots[targetSlotIndex].value
    if (oldValue) {
      const oldItem = data.answers.find((a) => a.answer === oldValue)
      if (oldItem) {
        setItems((prev) => {
          // Kiểm tra xem item gốc này đã có trong bank chưa
          const existingOriginalItem = prev.find((i) => i.id === oldItem.id)
          if (existingOriginalItem) {
            // Nếu item gốc đã có, tạo một bản sao với ID khác
            return [
              ...prev,
              {
                ...oldItem,
                id: `item-${Date.now()}-${Math.random()}`,
              },
            ]
          }
          return [...prev, oldItem]
        })
      }
    }

    newSlots[targetSlotIndex].value = draggedAnswer
    setSlots(newSlots)
    setItems((prev) => prev.filter((item) => item.id !== rawId))
    onChange?.(newSlots)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        style={{ fontSize: '18px', lineHeight: '32px', marginBottom: '1rem' }}
      >
        <div className="dragNdrop-question">{renderedContent}</div>
      </div>

      <BankArea items={items} />
    </DndContext>
  )
}

export default DragDropQuestion
