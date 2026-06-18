import { CommonQuestionBlockProps } from '@lms/core'
import { NewFillText } from '@lms/ui'

interface FillWordProps extends CommonQuestionBlockProps {
  watch: any
  ref: any
}

export default function FillWordQuestionBlock({
  data,
  currentTabID,
  defaultValue,
  corrects,
  highlighted,
  solution,
  control,
  setValue,
  watch,
  ref,
  handleSaveHighLight,
  removeHighlight,
  allowHighLight,
  allowUnHighLight,
  storageKey,
}: FillWordProps) {
  return (
    <NewFillText
      control={control}
      name={`${currentTabID}_fillword`}
      data={data}
      setValue={setValue}
      handleSaveHighLight={handleSaveHighLight}
      highlighted={highlighted}
      removeHighlight={removeHighlight}
      allowHighLight={allowHighLight}
      allowUnHighLight={allowUnHighLight}
      defaultAnswer={defaultValue}
      corrects={corrects?.corrects}
      ref={ref}
      solution={solution}
      watch={watch}
      explainClassname="!mt-8 !p-0 !bg-transparent"
      storageKey={storageKey}
    />
  )
}
