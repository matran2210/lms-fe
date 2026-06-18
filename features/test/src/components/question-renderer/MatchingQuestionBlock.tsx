import { CommonQuestionBlockProps } from '@lms/core'
import { MatchQuizComponent } from '@lms/ui'

export default function MatchingQuestionBlock({
  data,
  currentTabID,
  defaultValue,
  corrects,
  highlighted,
  solution,
  done,
  setValue,
  handleSaveHighLight,
  removeHighlight,
  allowHighLight,
  allowUnHighLight,
  storageKey,
}: CommonQuestionBlockProps) {
  return (
    <MatchQuizComponent
      data={data}
      onChangeMatchedPairs={(pairs) =>
        setValue(`${currentTabID}_answer`, pairs)
      }
      handleSaveHighLight={handleSaveHighLight}
      highlighted={highlighted}
      removeHighlight={removeHighlight}
      allowHighLight={allowHighLight}
      allowUnHighLight={allowUnHighLight}
      defaultAnswer={defaultValue}
      done={done}
      corrects={corrects?.corrects}
      solution={solution}
      explainClassname="!mt-8 !p-0 !bg-transparent"
      storageKey={storageKey}
    />
  )
}
