'use client'
import { CommonQuestionBlockProps } from '@lms/core'
import { NewDragNDropQuestion } from '@lms/ui'
import { SlotValue } from '@lms/ui'

export default function DragDropQuestionBlock({
  data,
  currentTabID,
  defaultValue,
  corrects,
  solution,
  setValue,
}: CommonQuestionBlockProps) {
  console.log('data', data, defaultValue, corrects)
  return (

    <NewDragNDropQuestion
      data={data}
      defaultValue={defaultValue}
      onChange={(data: SlotValue[]) =>
        setValue(`${currentTabID}_drag_drop_answer`, data)
      }
      corrects={corrects}
      solution={solution}
      explainClassname="!mt-8 !p-0 !bg-transparent"
    />
  )
}
