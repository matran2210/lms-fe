import EditorReader from '@components/base/editor/EditorReader'
import AddWordPreview from '@components/questionType/FillText'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import { useEffect, useRef, useState } from 'react'
import { Control, FieldValues, UseFormSetValue } from 'react-hook-form'
import { QUESTION_TYPES } from 'src/constants'
import { IActivityStateQuestion } from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'

type Props = {
  activeQuestion?: IActivityStateQuestion
  controlAnswer: Control<FieldValues, any>
  setValue: UseFormSetValue<FieldValues>
}

const QuizComponent = ({ activeQuestion, controlAnswer, setValue }: Props) => {
  const questionRef = useRef<HTMLDivElement>(null)
  const [corrects, setCorrects] = useState<{ [key: string]: boolean }>()

  const getValueFillText = () => {
    let value = []
    const inputs = questionRef.current?.querySelectorAll(
      'input[stringHTML="true"]',
    ) as any
    for (let e of inputs) {
      value.push(e.value)
    }
    return value
  }

  const getValueSelectText = () => {
    let value = [] as any
    const inputs = questionRef.current?.querySelectorAll(
      'select.sapp-select--selectword-preview',
    ) as any

    for (let e of inputs) {
      value.push(e.value)
    }
    return value
  }

  const getAnswerMatching = () => {
    let value = [] as any
    const inputs = questionRef.current?.querySelectorAll(
      '.sapp-match-result',
    ) as any
    for (let e of inputs) {
      value.push(e.innerText)
    }
    return value
  }

  useEffect(() => {
    const handleResponseResults = () => {
      if (activeQuestion) {
        switch (activeQuestion?.qType) {
          case QUESTION_TYPES.ONE_CHOICE:
          case QUESTION_TYPES.TRUE_FALSE:
          case QUESTION_TYPES.MULTIPLE_CHOICE: {
            if (!activeQuestion.confirmed) {
              return
            }
            setValue('answer', activeQuestion.myAnswers?.['answer'])
            const corrects = activeQuestion.answers?.reduce(
              (previousValue, currentValue) => {
                return {
                  ...previousValue,
                  [currentValue.id]: currentValue.is_correct,
                }
              },
              {} as { [key: string]: boolean },
            )
            if (corrects) {
              setCorrects(corrects)
            }
            break
          }

          case QUESTION_TYPES.FILL_WORD: {
            if (!activeQuestion.confirmed) {
              return
            }
            const data = getValueFillText()
            const answerMap = Object.fromEntries(
              activeQuestion?.answers?.map((item) => [
                `${item.answer_position}:${item.answer?.trim()}`,
                item.is_correct,
              ]) || [],
            )
            const arr3 = data?.map(
              (element) => answerMap[`${1}:${element?.trim()}`] || false,
            )

            const corrects = questionRef?.current?.querySelectorAll(
              '.sapp-input-preview',
            )
            if (corrects) {
              corrects.forEach((element, index) => {
                const isCorrect = arr3?.[index]
                if (element instanceof HTMLElement) {
                  element.classList.add(
                    isCorrect ? 'border-success' : 'border-error',
                  )
                }
                element.classList.add('pointer-events-none')
              })
            }
            setCorrects(undefined)
            break
          }

          default:
            break
        }
      }
    }

    // Gọi handleResponseResults khi results thay đổi
    handleResponseResults()
  }, [activeQuestion])

  return (
    <div ref={questionRef}>
      <div>
        {activeQuestion?.qType === QUESTION_TYPES.ONE_CHOICE ||
        activeQuestion?.qType === QUESTION_TYPES.TRUE_FALSE ? (
          <OneChoiceQuestion
            data={activeQuestion}
            control={controlAnswer}
            corrects={corrects}
          />
        ) : activeQuestion?.qType === QUESTION_TYPES.MULTIPLE_CHOICE ? (
          <MultiChoiceQuestion
            data={activeQuestion}
            control={controlAnswer}
            corrects={corrects}
          />
        ) : activeQuestion?.qType === QUESTION_TYPES.MATCHING ? (
          <MatchingQuestion data={activeQuestion} action={getAnswerMatching} />
        ) : activeQuestion?.qType === QUESTION_TYPES.FILL_WORD ? (
          <AddWordPreview data={activeQuestion} action={getValueFillText} />
        ) : activeQuestion?.qType === QUESTION_TYPES.DRAG_DROP ? (
          <>DRAG_DROP</>
        ) : activeQuestion?.qType === QUESTION_TYPES.SELECT_WORD ? (
          <SelectWord data={activeQuestion} action={getValueSelectText} />
        ) : activeQuestion?.qType === QUESTION_TYPES.ESSAY ? (
          <>ESSAY</>
        ) : (
          <div></div>
        )}
      </div>
      {activeQuestion?.confirmed && (
        <div className="p-4 font-semibold mt-8 bg-gray-4">
          <div>Solution</div>
          {activeQuestion?.solution && (
            <EditorReader
              text_editor_content={activeQuestion?.solution}
              className="mt-4"
            />
          )}
        </div>
      )}
    </div>
  )
}

QuizComponent.displayName = 'QuizComponent'
export default QuizComponent
