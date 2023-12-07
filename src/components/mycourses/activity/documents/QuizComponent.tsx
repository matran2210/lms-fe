import EditorReader from '@components/base/editor/EditorReader'
import AddWordPreview from '@components/questionType/FillText'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import React, { SetStateAction, useImperativeHandle } from 'react'
import { useRef, forwardRef, ForwardedRef } from 'react'
import { Control, FieldValues } from 'react-hook-form'
import { QUESTION_TYPES } from 'src/constants'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { IQuestion } from 'src/type/course/Question'

type Props = {
  activeQuestion?: IQuestion
  controlAnswer: Control<FieldValues, any>
  corrects?: { [key: string]: boolean }
  results?: IQuestion
  setResults: (
    value: SetStateAction<
      | {
          results: IQuestion
          corrects?:
            | {
                [key: string]: boolean
              }
            | undefined
        }
      | undefined
    >,
  ) => void
}
type ExternalFunctions = {
  onSubmit: (data: any) => Promise<void>
}

const QuizComponent = forwardRef(
  (
    { activeQuestion, controlAnswer, results, corrects, setResults }: Props,
    ref: ForwardedRef<ExternalFunctions | null>,
  ) => {
    const questionRef = useRef<HTMLDivElement>(null)

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

    const onSubmit = async (data: any) => {
      if (activeQuestion?.id) {
        const responseResults = await CourseActivityApi.getQuestionResults(
          activeQuestion.id,
        )
        if (responseResults.data) {
          switch (activeQuestion.qType) {
            case QUESTION_TYPES.ONE_CHOICE:
            case QUESTION_TYPES.TRUE_FALSE:
            case QUESTION_TYPES.MULTIPLE_CHOICE:
              {
                const corrects = responseResults.data?.[0]?.answers?.reduce(
                  (previousValue, currentValue) => {
                    return {
                      ...previousValue,
                      [currentValue.id]: currentValue.is_correct,
                    }
                  },
                  {},
                )
                setResults({ results: responseResults.data?.[0], corrects })
              }
              break

            case QUESTION_TYPES.FILL_WORD:
              {
                const data = getValueFillText()
                const answerMap = Object.fromEntries(
                  responseResults?.data[0]?.answers?.map((item) => [
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
                setResults({ results: responseResults.data?.[0], corrects: {} })
              }
              break

            default:
              break
          }
        }
      }
    }

    useImperativeHandle(
      ref,
      () => ({
        onSubmit,
      }),
      [questionRef],
    )

    const checkType = (type?: QUESTION_TYPES) => {
      switch (type) {
        case QUESTION_TYPES.ONE_CHOICE:
        case QUESTION_TYPES.TRUE_FALSE:
          return (
            <OneChoiceQuestion
              data={activeQuestion}
              control={controlAnswer}
              corrects={corrects}
            />
          )
        case QUESTION_TYPES.MULTIPLE_CHOICE:
          return (
            <MultiChoiceQuestion
              data={activeQuestion}
              control={controlAnswer}
              corrects={corrects}
            />
          )
        case QUESTION_TYPES.MATCHING:
          return (
            <MatchingQuestion
              data={activeQuestion}
              action={getAnswerMatching}
            />
          )
        case QUESTION_TYPES.FILL_WORD:
          return (
            <AddWordPreview data={activeQuestion} action={getValueFillText} />
          )
        case QUESTION_TYPES.DRAG_DROP:
        // return <DragNDropPreview data={activeQuestion} />
        case QUESTION_TYPES.SELECT_WORD:
          return (
            <SelectWord data={activeQuestion} action={getValueSelectText} />
          )
        // case QUESTION_TYPES.ESSAY:
        //   return (
        //     <EssayQuestionPreview
        //       data={essayData?.req}
        //       question_content={data.question_content}
        //       index={essayData?.index}
        //       question_data={data}
        //     />
        //   );
        default:
          return <div></div>
      }
    }

    return (
      <div ref={questionRef}>
        <div>{checkType(activeQuestion?.qType)}</div>
        {results && (
          <div className="p-4 font-semibold mt-8 bg-gray-4">
            <div>Solution</div>
            {results?.solution && (
              <EditorReader
                text_editor_content={results?.solution}
                className="mt-4"
              />
            )}
          </div>
        )}
      </div>
    )
  },
)
QuizComponent.displayName = 'QuizComponent'
export default QuizComponent
