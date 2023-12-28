import EditorReader from '@components/base/editor/EditorReader'
import DragNDropPreivew from '@components/questionType/DragNDrop'
import AddWordPreview from '@components/questionType/FillText'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { FieldValues, UseFormReset, useForm } from 'react-hook-form'
import { QUESTION_TYPES } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  IActivityStateQuestion,
  confirmQuestion,
  courseActivityQuizReducer,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'

export type QuizComponentRef = {
  onSubmit: ({
    activityId,
    tabId,
    quizId,
    then,
  }: {
    activityId: string
    tabId: string
    quizId: string
    then?: (e: any) => void
  }) => void
  reset: UseFormReset<FieldValues>
}

type Props = {
  activeQuestion?: IActivityStateQuestion
}

const QuizComponent = forwardRef<QuizComponentRef, Props>(
  ({ activeQuestion }: Props, ref) => {
    const questionRef = useRef<HTMLDivElement>(null)

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
      const inputs = questionRef.current?.querySelectorAll(
        '.sapp-match-result',
      ) as any
      for (let e of inputs) {
        const childId = e.querySelector('.sapp-notched-container')
        value.push({ question_id: e.id, answer_id: childId?.id })
      }
      return value
    }
    const getAnswerDragNDrop = () => {
      let value = [] as any
      const inputs = questionRef.current?.querySelectorAll(
        '.sapp-input-dragNDrop',
      ) as any
      for (let e of inputs) {
        const idAnswer = e.querySelector('span')
        value.push({ id: e.id, value: e.innerText, idAnswer: idAnswer?.id })
      }
      return value
    }

    useEffect(() => {
      if (
        activeQuestion?.qType === QUESTION_TYPES.ONE_CHOICE ||
        activeQuestion?.qType === QUESTION_TYPES.TRUE_FALSE ||
        activeQuestion?.qType === QUESTION_TYPES.MULTIPLE_CHOICE
      ) {
        handleResponseResults()
      }
    }, [activeQuestion])

    const handleResponseResults = () => {
      if (activeQuestion) {
        if (!activeQuestion.confirmed) {
          return
        }
        switch (activeQuestion?.qType) {
          case QUESTION_TYPES.ONE_CHOICE:
          case QUESTION_TYPES.TRUE_FALSE: {
            setValue && setValue('answer', activeQuestion.defaultValue)
            break
          }

          case QUESTION_TYPES.MULTIPLE_CHOICE: {
            setValue && setValue('multiples', activeQuestion.defaultValue)
            break
          }
        }
      }
    }

    // Lift onSubmit using useImperativeHandle
    useImperativeHandle(ref, () => ({
      onSubmit: onSubmit,
      reset: reset,
    }))

    const onSubmit = ({
      activityId,
      tabId,
      quizId,
      then,
    }: {
      activityId: string
      tabId: string
      quizId: string
      then?: (e: any) => void
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
            break
          case QUESTION_TYPES.SELECT_WORD:
            myAnswers = getValueSelectText()
            break
          case QUESTION_TYPES.MATCHING:
            myAnswers = getAnswerMatching()
            break
          case QUESTION_TYPES.DRAG_DROP:
            myAnswers = getAnswerDragNDrop()
            break
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
          .unwrap()
          .then((e: any) => {
            then && then(e)
          })
      }
    }

    const renderQuestion = () => {
      switch (activeQuestion?.qType) {
        case QUESTION_TYPES.ONE_CHOICE:
        case QUESTION_TYPES.TRUE_FALSE:
          return (
            <OneChoiceQuestion
              data={activeQuestion}
              control={controlAnswer}
              corrects={activeQuestion.corrects}
              setValue={setValue}
            />
          )

        case QUESTION_TYPES.MULTIPLE_CHOICE:
          return (
            <MultiChoiceQuestion
              data={activeQuestion}
              control={controlAnswer}
              corrects={activeQuestion.corrects}
              setValue={setValue}
            />
          )

        case QUESTION_TYPES.MATCHING:
          return (
            <MatchingQuestion
              data={activeQuestion}
              action={getAnswerMatching}
              defaultAnswer={activeQuestion?.defaultValue}
            />
          )

        case QUESTION_TYPES.FILL_WORD:
          return (
            <AddWordPreview
              data={activeQuestion}
              action={getValueFillText}
              defaultAnswer={activeQuestion?.defaultValue}
              corrects={activeQuestion.corrects}
            />
          )

        case QUESTION_TYPES.DRAG_DROP:
          return (
            <DragNDropPreivew
              data={activeQuestion}
              action={getAnswerDragNDrop}
              defaultAnswer={activeQuestion?.defaultValue}
            />
          )

        case QUESTION_TYPES.SELECT_WORD:
          return (
            <SelectWord
              data={activeQuestion}
              action={getValueSelectText}
              defaultAnswer={activeQuestion?.defaultValue}
              corrects={activeQuestion.corrects}
            />
          )

        case QUESTION_TYPES.ESSAY:
          return <>ESSAY</>

        default:
          return <div></div>
      }
    }

    return (
      <div>
        <div ref={questionRef}>
          <React.Fragment>{renderQuestion()}</React.Fragment>
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
