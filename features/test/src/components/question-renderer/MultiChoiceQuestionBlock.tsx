import { CommonQuestionBlockProps } from '@lms/core'
import { MultiChoiceQuestion } from '@lms/ui'

interface MultiChoiceProps extends CommonQuestionBlockProps {
  tabs: any[]
  currentPage: string
}

export default function MultiChoiceQuestionBlock({
  data,
  currentTabID,
  defaultValue,
  corrects,
  highlighted,
  solution,
  control,
  setValue,
  getValues,
  handleSaveHighLight,
  removeHighlight,
  allowHighLight,
  allowUnHighLight,
  storageKey,
  tabs,
  currentPage,
}: MultiChoiceProps) {
  return (
    <MultiChoiceQuestion
      data={data}
      control={control}
      name={`${currentTabID}_answer`}
      defaultValues={defaultValue}
      setValue={setValue}
      handleSaveHighLight={handleSaveHighLight}
      highlighted={highlighted}
      removeHighlight={removeHighlight}
      allowHighLight={allowHighLight}
      allowUnHighLight={allowUnHighLight}
      corrects={corrects}
      solution={solution}
      getValue={getValues}
      tabs={tabs}
      currentPage={currentPage}
      explainClassname="!mt-8 !p-0 !bg-transparent"
      storageKey={storageKey}
    />
  )
}
