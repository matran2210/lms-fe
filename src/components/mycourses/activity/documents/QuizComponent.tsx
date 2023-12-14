import EditorReader from '@components/base/editor/EditorReader'
import DragNDropPreivew from '@components/questionType/DragNDrop'
import AddWordPreview from '@components/questionType/FillText'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { FieldValues, UseFormReset, useForm } from 'react-hook-form'
import { QUESTION_TYPES } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import {
  IActivityStateQuestion,
  confirmQuestion,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'

export type QuizComponentRef = {
  onSubmit: ({
    activityId,
    tabId,
    quizId,
  }: {
    activityId: string
    tabId: string
    quizId: string
  }) => void
  reset: UseFormReset<FieldValues>
}

type Props = {
  activeQuestion?: IActivityStateQuestion
}

const QuizComponent = forwardRef<QuizComponentRef, Props>(
  ({ activeQuestion }: Props, ref) => {
    const questionRef = useRef<HTMLDivElement>(null)

    const [defaultAnswer, setDefaultAnswer] = useState<any>()
    const dispatch = useAppDispatch()
    const { control: controlAnswer, setValue, reset, getValues } = useForm({})

    const getValueFillText = () => {
      let value = []
      const inputs = document.querySelectorAll(
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
      const inputs = document.querySelectorAll('.sapp-match-result') as any
      for (let e of inputs) {
        const childId = e.querySelector('.sapp-notched-container')
        value.push({ question_id: e.id, answer_id: childId?.id })
      }
      return value
    }
    const getAnswerDragNDrop = () => {
      let value = [] as any
      const inputs = document.querySelectorAll('.sapp-input-dragNDrop') as any
      for (let e of inputs) {
        const idAnswer = e.querySelector('span')
        value.push({ id: e.id, value: e.innerText, idAnswer: idAnswer?.id })
      }
      return value
    }
    useEffect(() => {
      const handleResponseResults = () => {
        if (activeQuestion) {
          if (!activeQuestion.confirmed) {
            return
          }
          switch (activeQuestion?.qType) {
            case QUESTION_TYPES.ONE_CHOICE:
            case QUESTION_TYPES.TRUE_FALSE: {
              setValue &&
                setValue(
                  'answer',
                  activeQuestion.myAnswers?.find(
                    (e: any) => e.question_id === activeQuestion.id,
                  )?.question_answer_id,
                )

              break
            }

            case QUESTION_TYPES.MULTIPLE_CHOICE: {
              setValue &&
                setValue(
                  'multiples',
                  activeQuestion.myAnswers
                    ?.find((e: any) => e.question_id === activeQuestion.id)
                    ?.answer?.map((e: { answer_id: string }) => e.answer_id),
                )
              break
            }

            case QUESTION_TYPES.FILL_WORD: {
              const myAnswers = activeQuestion?.myAnswers
                ?.find((e: any) => e.question_id === activeQuestion.id)
                ?.answer?.map((e: any) => e.answer_id)
              setDefaultAnswer(myAnswers)
              break
            }
            case QUESTION_TYPES.SELECT_WORD:
              const myAnswers = activeQuestion?.myAnswers
                ?.find((e: any) => e.question_id === activeQuestion.id)
                ?.answer?.map((e: any) => e.answer_id)
              setDefaultAnswer(myAnswers)
              break
            default:
              break
          }
        }
      }

      // Gọi handleResponseResults khi results thay đổi
      handleResponseResults()
    }, [activeQuestion])

    // Lift onSubmit using useImperativeHandle
    useImperativeHandle(ref, () => ({
      onSubmit: onSubmit,
      reset: reset,
    }))

    const onSubmit = ({
      activityId,
      tabId,
      quizId,
    }: {
      activityId: string
      tabId: string
      quizId: string
    }) => {
      if (activeQuestion) {
        let myAnswers
        switch (activeQuestion.qType as QUESTION_TYPES) {
          case QUESTION_TYPES.ONE_CHOICE:
          case QUESTION_TYPES.TRUE_FALSE:
            myAnswers = getValues('answer')
            break
          case QUESTION_TYPES.MULTIPLE_CHOICE:
            myAnswers = getValues('multiples')
            break
          case QUESTION_TYPES.FILL_WORD:
            myAnswers = getValueFillText()
          default:
            break
        }

        dispatch(
          confirmQuestion({
            activityId: activityId,
            tabId: tabId,
            quizId: quizId,
            questionId: activeQuestion.id || '',
            myAnswers,
          }),
        )
      }
    }

    return (
      <div ref={questionRef}>
        <div>
          {activeQuestion?.qType === QUESTION_TYPES.ONE_CHOICE ||
          activeQuestion?.qType === QUESTION_TYPES.TRUE_FALSE ? (
            <OneChoiceQuestion
              data={activeQuestion}
              control={controlAnswer}
              corrects={activeQuestion.corrects}
              setValue={setValue}
            />
          ) : activeQuestion?.qType === QUESTION_TYPES.MULTIPLE_CHOICE ? (
            <MultiChoiceQuestion
              data={activeQuestion}
              control={controlAnswer}
              corrects={activeQuestion.corrects}
              setValue={setValue}
            />
          ) : activeQuestion?.qType === QUESTION_TYPES.MATCHING ? (
            <MatchingQuestion
              data={activeQuestion}
              action={getAnswerMatching}
            />
          ) : activeQuestion?.qType === QUESTION_TYPES.FILL_WORD ? (
            <AddWordPreview
              data={activeQuestion}
              action={getValueFillText}
              defaultAnswer={defaultAnswer}
              corrects={activeQuestion.corrects}
            />
          ) : activeQuestion?.qType === QUESTION_TYPES.DRAG_DROP ? (
            <DragNDropPreivew
              data={activeQuestion}
              action={getAnswerDragNDrop}
              defaultAnswer={defaultAnswer}
              // corrects={activeQuestion.corrects}
            />
          ) : activeQuestion?.qType === QUESTION_TYPES.SELECT_WORD ? (
            <SelectWord
              data={activeQuestion}
              action={getValueSelectText}
              defaultAnswer={defaultAnswer}
              // corrects={activeQuestion.corrects}
            />
          ) : activeQuestion?.qType === QUESTION_TYPES.ESSAY ? (
            <>ESSAY</>
          ) : (
            <div></div>
          )}
        </div>
        {activeQuestion?.confirmed && (
          <div className="p-4 mt-8 bg-gray-4">
            <div className="font-semibold">Solution</div>
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
  },
)

QuizComponent.displayName = 'QuizComponent'
export default QuizComponent
