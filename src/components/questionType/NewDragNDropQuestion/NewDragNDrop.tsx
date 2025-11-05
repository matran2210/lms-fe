import EditorReader from '@components/base/editor/EditorReader'
import SappDivider from '@components/common/Divider/Divider'
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core'
import parse, { Element } from 'html-react-parser'
import React, { useEffect, useMemo, useState } from 'react'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
import { MY_COURSES } from 'src/constants/lang'
import { QuestionTopic } from 'src/type'
import CorrectAnswer from './CorrectAnswer'
import DraggableItem from './DraggableItem'
import DroppableSlot from './DroppableSlot'

interface Answer {
  id: string
  answer: string
  answer_position: number
}

export interface SlotValue {
  id?: string
  value: string
  position: number
  idAnswer?: string
}

export interface Correct {
  id: string
  is_correct: boolean
  answer: string
  answer_position: number
}

interface DragDropQuestionProps {
  data: {
    question_content: string
    answers: Answer[]
    question_topic: QuestionTopic
  }
  defaultValue: SlotValue[]
  onChange?: (data: SlotValue[]) => void
  corrects?: Correct[]
  solution?: string
  explainClassname?: string
}

// Component cho bank area
const BankArea: React.FC<{ items: Answer[] }> = ({ items }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'bank' })

  return (
    <div className="flex w-full items-center gap-4 py-8 text-base">
      <div className="text-base font-medium">Drag your answer:</div>
      <div
        ref={setNodeRef}
        id="bank"
        className={`flex min-h-10 flex-1 flex-wrap gap-5 rounded-lg transition-colors ${isOver ? 'bg-gray-300' : ''}`}
      >
        {items.map((item) => (
          <DraggableItem key={item.id} id={item.id} answer={item.answer} />
        ))}
      </div>
    </div>
  )
}

// Component cho slot có giá trị
const SlotWithValue: React.FC<{
  id: string
  value: string
  status: 'success' | 'error' | 'empty' | 'normal'
  disabled?: boolean
}> = ({ id, value, status, disabled }) => {
  const { setNodeRef: setDropRef } = useDroppable({ id })

  let borderColor = ''
  if (status === 'success') {
    borderColor = 'border-success'
  } else if (status === 'error') {
    borderColor = 'border-error'
  } else if (status === 'empty') {
    borderColor = 'border-b-2 border-error'
  } else {
    borderColor = ''
  }

  return (
    <span
      ref={setDropRef}
      className={`mx-1 inline-block align-middle ${borderColor}`}
    >
      <DraggableItem
        id={`slot-${id}`}
        answer={value}
        fromSlotId={id}
        disabled={disabled}
        borderColor={borderColor}
      />
    </span>
  )
}

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({
  data,
  defaultValue,
  onChange,
  corrects,
  solution,
  explainClassname,
}) => {
  const [slots, setSlots] = useState<SlotValue[]>([])
  const [items, setItems] = useState<Answer[]>([])

  // Tạo slots từ question_content
  const parsedSlots = useMemo(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(data.question_content, 'text/html')
    const elements = Array.from(doc.querySelectorAll('.question-content-tag'))

    return elements.map((el, idx) => {
      // Tìm defaultSlot theo position thay vì id
      // Position bắt đầu từ 1, nên map với idx + 1
      const defaultSlot = (defaultValue || []).find(
        (d) => d.position === idx + 1,
      )

      return {
        id: el.id,
        value: defaultSlot?.value || '',
        idAnswer: defaultSlot?.idAnswer || undefined,
        position: idx + 1, // position bắt đầu từ 1
      }
    })
  }, [data.question_content, defaultValue])

  useEffect(() => {
    setSlots(parsedSlots)

    const usedAnswerIds = new Set(
      parsedSlots.map((s) => s.idAnswer).filter((id) => id !== ''),
    )
    const remaining = data.answers.filter((a) => !usedAnswerIds.has(a.id))
    setItems(remaining)
  }, [parsedSlots, data.answers])

  // Parse lại HTML thành JSX + DroppableSlot hoặc SlotWithValue
  const isDisabled = !!(
    corrects &&
    Array.isArray(corrects) &&
    corrects.length > 0
  )
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

          // Xác định status
          let status: 'success' | 'error' | 'empty' | 'normal' = 'normal'
          if (value) {
            if (corrects && Array.isArray(corrects)) {
              const correct = corrects.find((c: any) => c.id === slot?.idAnswer)
              if (correct) {
                if (
                  correct.is_correct &&
                  correct.answer_position === (slot?.position ?? 0)
                ) {
                  status = 'success'
                } else {
                  status = 'error'
                }
              } else {
                status = 'error'
              }
            }
            return (
              <SlotWithValue
                key={id}
                id={id}
                value={value}
                status={status}
                disabled={isDisabled}
              />
            )
          } else {
            // Slot chưa điền
            return (
              <DroppableSlot
                key={id}
                id={id}
                value=""
                index={typeof slot?.position === 'number' ? slot.position : 0}
                disabled={isDisabled}
              />
            )
          }
        }
        return undefined
      },
    })
  }, [data.question_content, slots, corrects])

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    if (!over || !active || !over.id) {
      return
    }
    const draggedAnswer = active.data.current?.answer
    const fromSlotId = active.data.current?.fromSlotId
    const rawId = active.id as string
    const droppedSlotId = over.id as string
    // Nếu chỉ click hoặc thả vào chính slot gốc thì không làm gì cả
    if (fromSlotId && fromSlotId === droppedSlotId) {
      return
    }

    // Kéo từ slot về bank (chỉ xử lý khi thả vào bank)
    if (over.id === 'bank' && fromSlotId && draggedAnswer) {
      const slot = slots.find((s) => s.id === fromSlotId)

      if (!slot) return

      const newSlots = [...slots]
      const index = newSlots.findIndex((s) => s.id === fromSlotId)
      if (index === -1) return

      // Clear slot
      newSlots[index].value = ''
      newSlots[index].idAnswer = undefined
      setSlots(newSlots)

      // Thêm item vào bank
      setItems((prev) => {
        // Tìm item gốc từ data.answers dựa trên idAnswer
        const originalItem = data.answers.find((a) => a.id === slot.idAnswer)
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

        // Fallback - tìm theo answer text nếu không tìm được theo id
        const fallbackItem = data.answers.find(
          (a) => a.answer === draggedAnswer,
        )
        if (fallbackItem) {
          return [...prev, fallbackItem]
        }

        // Fallback cuối cùng - tạo item mới với ID duy nhất
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

    // Kéo từ slot ra ngoài (không thả vào bank hoặc slot khác) - không làm gì cả
    if (
      fromSlotId &&
      draggedAnswer &&
      over.id !== 'bank' &&
      !slots.some((slot) => slot.id === over.id)
    ) {
      return
    }

    // Kéo từ bank vào slot
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
      // Đổi chỗ 2 items
      const tempValue = newSlots[sourceSlotIndex].value
      const tempIdAnswer = newSlots[sourceSlotIndex].idAnswer
      newSlots[sourceSlotIndex].value = newSlots[targetSlotIndex].value
      newSlots[sourceSlotIndex].idAnswer =
        newSlots[targetSlotIndex].idAnswer ?? undefined
      newSlots[targetSlotIndex].value = tempValue
      newSlots[targetSlotIndex].idAnswer = tempIdAnswer ?? undefined
      // Cập nhật lại position cho từng slot
      newSlots.forEach((slot, idx) => {
        slot.position = idx + 1
      })
      setSlots(newSlots)
      onChange?.(newSlots)
      return
    }

    // Kéo từ bank vào slot (trường hợp thông thường)
    const oldValue = newSlots[targetSlotIndex].value
    const oldIdAnswer = newSlots[targetSlotIndex].idAnswer
    if (oldValue && oldIdAnswer) {
      const oldItem = data.answers.find((a) => a.id === oldIdAnswer)
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

    // Tìm idAnswer của item được kéo
    const draggedItem = data.answers.find((a) => a.answer === draggedAnswer)
    const draggedIdAnswer = draggedItem?.id || undefined

    newSlots[targetSlotIndex].value = draggedAnswer
    newSlots[targetSlotIndex].idAnswer = draggedIdAnswer
    setSlots(newSlots)
    setItems((prev) => prev.filter((item) => item.id !== rawId))
    onChange?.(newSlots)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <span className="dragNdrop-question">{renderedContent}</span>
        {!isDisabled && <BankArea items={items} />}
        {corrects && (
          <>
            <SappDivider />
            <CorrectAnswer
              questionContent={data.question_content}
              corrects={corrects}
            />
          </>
        )}
        {solution && (
          <>
            <SappDivider />
            <div className={explainClassname}>
              <SappTitleSolution title={`${MY_COURSES.solution}:`} />
              <EditorReader className="mt-4" text_editor_content={solution} />
            </div>
          </>
        )}
      </div>
    </DndContext>
  )
}

export default DragDropQuestion
