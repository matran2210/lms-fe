'use client'
import { CommonQuestionBlockProps } from '@lms/core'
import { OneChoiceQuestion } from '@lms/ui'

export default function ChoiceQuestionBlock({
  data,
  currentTabID,
  defaultValue,
  corrects,
  highlighted,
  solution,
  control,
  setValue,
  handleSaveHighLight,
  removeHighlight,
  allowHighLight,
  allowUnHighLight,
  storageKey,
}: CommonQuestionBlockProps) {
  return (
    <OneChoiceQuestion
      data={data}
      control={control}
      name={`${currentTabID}_answer`}
      defaultValues={defaultValue}
      setValue={setValue}
      corrects={corrects}
      handleSaveHighLight={handleSaveHighLight}
      highlighted={highlighted}
      removeHighlight={removeHighlight}
      allowHighLight={allowHighLight}
      allowUnHighLight={allowUnHighLight}
      solution={solution}
      explainClassname="!mt-8 !p-0 !bg-transparent"
      storageKey={storageKey}
    />
  )
}
