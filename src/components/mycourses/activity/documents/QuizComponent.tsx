import useClickOutside from '@components/base/clickoutside/HookClick'
import EditorReader from '@components/base/editor/EditorReader'
import MovableWindow from '@components/base/window'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
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
  useState,
} from 'react'
import { FieldValues, UseFormReset, useForm } from 'react-hook-form'
import SappIcon from 'src/common/SappIcon'
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
    const [essayData, setEssayData] = useState<any>()

    const dispatch = useAppDispatch()
    const { control: controlAnswer, setValue, reset, getValues } = useForm({})

    const [showListRequirement, setShowListRequirement] =
      useState<boolean>(false)
    const listRequirementRef = useRef<HTMLDivElement>(null)

    useClickOutside({
      ref: listRequirementRef,
      callback: () => setShowListRequirement(false),
    })

    const [showRequirement, setShowRequirement] = useState<{
      description: string
      index: number
      name: string
    }>()

    const [showExhibit, setShowExhibit] = useState<{
      id: string
      description: string
      index: number
      name: string
    }>()

    useEffect(() => {
      const defaultRequirement = activeQuestion?.requirements?.[0]
      if (defaultRequirement) {
        setShowRequirement({
          name: defaultRequirement.name,
          description: defaultRequirement.description,
          index: 1,
        })
      }
    }, [activeQuestion])

    useEffect(() => {
      if (activeQuestion?.requirements) {
        setEssayData({
          req: activeQuestion.requirements[0],
          index: 0,
        })
      }
    }, [activeQuestion])

    const handleShowRequirement = (data: {
      description: string
      index: number
      name: string
    }) => {
      setShowListRequirement(false)
      setShowRequirement(data)
    }

    const handleShowExhibit = (params: {
      id: string
      description: string
      index: number
      name: string
    }) => {
      setShowExhibit(params)
    }

    const handleCloseExhibit = () => {
      setShowExhibit(undefined)
    }

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
              corrects={activeQuestion.corrects}
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
              corrects={activeQuestion.corrects}
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
          return (
            <>
              <div>
                <div className="flex items-center cursor-pointer select-none">
                  <div className="relative">
                    <div
                      className="flex items-center hover:text-primary group"
                      onClick={() => setShowListRequirement(true)}
                    >
                      <div className="font-semibold">
                        Requirement {showRequirement?.index}/
                        {activeQuestion.requirements?.length || 0}
                      </div>
                      <div>
                        <SappIcon
                          className="ml-2 -mt-1 group-hover:fill-primary fill-bw-1"
                          icon="arrow_down"
                        ></SappIcon>
                      </div>
                    </div>
                    {showListRequirement && (
                      <div
                        ref={listRequirementRef}
                        className="absolute z-50 text-over  left-0 bottom-0 bg-white w-max max-w-md translate-y-full shadow-md py-1"
                      >
                        {activeQuestion.requirements?.map((e, i) => {
                          return (
                            <div
                              onClick={() => {
                                handleShowRequirement({
                                  description: e.description,
                                  index: i + 1,
                                  name: e.name,
                                })
                              }}
                              className="font-semibold hover:text-primary truncate py-1.5 px-3"
                              key={e.id}
                            >{`${e.name} Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto a laborum facilis illo, impedit quas ea? Placeat laudantium commodi provident obcaecati ducimus quae illum soluta, porro totam accusamus inventore ut!`}</div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className="text-state-error">* </span>
                    <span className="text-gray-1">
                      You must finished 3 requirements to complete this question
                      (Your answer is auto save)
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-semibold">{`Requirement : ${showRequirement?.name}`}</div>
                  {showRequirement?.description && (
                    <EditorReader
                      className="editor-wrap mt-1.5"
                      text_editor_content={showRequirement?.description}
                    />
                  )}
                </div>
                <div className="border border-gray-2 my-6"></div>
                <div className="flex items-center mb-4">
                  <div className="font-semibold">
                    Exhibits ({activeQuestion.exhibits?.length || 0})
                  </div>
                  <div className="ml-4">
                    <span className="text-state-error">* </span>
                    <span className="text-gray-1">Click to view</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {activeQuestion.exhibits?.map((e, i) => {
                    return (
                      <div
                        className="cursor-pointer hover:text-primary"
                        key={e.id}
                        onClick={() => {
                          handleShowExhibit({
                            id: e.id,
                            description: e.description,
                            name: e.name,
                            index: i + 1,
                          })
                        }}
                      >
                        Exhibit {i + 1}: {e.name}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="border border-gray-2 my-6"></div>
              <EssayQuestionPreview
                data={null}
                question_content={activeQuestion?.question_content}
                index={essayData?.index}
                question_data={activeQuestion}
                control={controlAnswer}
                handleSaveHighLight={() => {}}
                forCaseStudy={true}
              />
              {showExhibit?.id && (
                <MovableWindow
                  position={{
                    width: '624px',
                    height: '224px',
                    top: 'calc(50% - 150px)',
                    left: 'calc(50% - 200px)',
                  }}
                  // key={e.id}
                  // onClick={() => setOnFocusingPad(e.id)}
                  zIndex={999}
                >
                  <div className="w-full h-full absolute top-0 left-0 border bg-white py-4 px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold">
                          Exhibit {showExhibit.index}:{' '}
                        </span>
                        {showExhibit.name}
                      </div>
                      <div onClick={() => handleCloseExhibit()}>
                        <SappIcon
                          icon="x"
                          className="cursor-pointer hover:fill-primary"
                        ></SappIcon>
                      </div>
                    </div>
                    {showExhibit?.description && (
                      <EditorReader
                        className="editor-wrap mt-1.5"
                        text_editor_content={showExhibit?.description}
                      />
                    )}
                  </div>
                </MovableWindow>
              )}
            </>
          )

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
