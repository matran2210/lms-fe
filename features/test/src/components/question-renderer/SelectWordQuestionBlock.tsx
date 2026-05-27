import { CommonQuestionBlockProps } from '@lms/core'
import { SelectWord } from '@lms/ui'

interface SelectWordProps extends CommonQuestionBlockProps {
  ref: any
}

export default function SelectWordQuestionBlock({
  data,
  currentTabID,
  defaultValue,
  corrects,
  highlighted,
  solution,
  setValue,
  ref,
  handleSaveHighLight,
  allowHighLight,
  allowUnHighLight,
}: SelectWordProps) {
  return (
    <SelectWord
      onChange={(value) =>
        setValue(`${currentTabID}_answer`, value)
      }
      data={data}
      handleSaveHighLight={handleSaveHighLight}
      highlighted={highlighted}
      allowHighLight={allowHighLight}
      allowUnHighLight={allowUnHighLight}
      defaultAnswer={defaultValue}
      corrects={corrects?.corrects}
      ref={ref}
      solution={solution}
    />
  )
}
