'use client'
import { useStoryline } from '@contexts/StorylineContext'
import { useStorylineSidebar } from '@contexts/StorylineSidebarContext'
import { CircleCheckIcon, CircleInfoIcon, RestartIcon } from '@lms/assets'
import {
  DEFAULT_EDITOR_VALUE,
  defaultSheetData,
  DocumentItem,
  IAnswerFillWord,
  IMultiChoiceQuestion,
  IQuestion,
  IStorylineQuestion,
  QUESTION_TYPES,
  RESPONSE_OPTION,
} from '@lms/core'
import {
  AddWordPreview,
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
  EditorReader,
  EssayQuestionPreview,
  HighlightableHTML,
  MatchQuizComponent,
  MultiChoiceQuestion,
  NewDragNDropQuestion,
  OneChoiceQuestion,
  SelectWord,
  SlotValue,
} from '@lms/ui'
import {
  checkSheetAnswered,
  Correct,
  handleMultipleCorrectAnswer,
  isEmptyParagraph,
} from '@lms/utils'
import { Divider, Tabs } from 'antd'
import clsx from 'clsx'
import { isUndefined } from 'lodash'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TestServiceAPI } from 'src/api/test-api'
import { v4 as uuidv4 } from 'uuid'

interface QuizBlockProps {
  minimalQuestion: IMultiChoiceQuestion
  quiz_id: string
  document_id: string
  docIndex: number
  storylinyeDocument: DocumentItem[]
}

const QuizBlock = ({
  minimalQuestion,
  quiz_id,
  document_id,
  docIndex,
  storylinyeDocument,
}: QuizBlockProps) => {
  const MatchQuizRef = useRef(null) as any
  const questionRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  const { control, setValue, reset, getValues, watch, resetField } = useForm()
  const { continueAction, visibleDocumentCount, currentStep } = useStoryline()
  const { listStorylines } = useStorylineSidebar()
  const currentVisibleDocument = storylinyeDocument?.[visibleDocumentCount]

  const exactCurrentStoryline = listStorylines?.find(
    (storyline) => storyline?.id === currentStep?.id,
  )
  const isShowActionBtn = status === 'Review'
  const [loading, setLoading] = useState<boolean>(false)
  const [question, setQuestion] = useState<IStorylineQuestion | null>(null)
  const [topicDescription, setTopicDescription] = useState<any>()
  const [openExplain, setOpenExplain] = useState(false)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)
  const [isRetakeQuestion, setIsRetakeQuestion] = useState(false)
  const isLearnedBlock = docIndex < visibleDocumentCount
  const isQuestionConfirmed = !!question?.confirmed
  const isShowClearSelection =
    ([
      QUESTION_TYPES.TRUE_FALSE,
      QUESTION_TYPES.ONE_CHOICE,
      QUESTION_TYPES.MULTIPLE_CHOICE,
    ].includes(question?.qType as QUESTION_TYPES) &&
      (question?.qType === QUESTION_TYPES.TRUE_FALSE ||
        question?.qType === QUESTION_TYPES.ONE_CHOICE) &&
      watch(`${question?.id}_answer`)) ||
    (question?.qType === QUESTION_TYPES.MULTIPLE_CHOICE &&
      watch(`${question?.id}_answer`)?.length &&
      !isQuestionConfirmed)

  const getAnswerMatching = () => {
    const value = MatchQuizRef?.current?.getMatchedPairs?.()
    return isRetakeQuestion ? [] : value || []
  }
  const getValueFillText = () => {
    const value = []
    const inputs = questionRef?.current?.querySelectorAll(
      'input[stringHTML="true"]',
    ) as any
    for (const e of inputs) {
      value?.push(e?.value)
    }
    return isRetakeQuestion ? [] : value
  }
  const checkCorrectAnswer = (question: IStorylineQuestion) => {
    switch (question.qType) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        const answerId = getValues(`${question?.id}_answer`)
        const correctAnswer = question?.answers?.find(
          (answer: any) => answer.is_correct,
        )
        return answerId === correctAnswer?.id
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        const answerIds = getValues(`${question?.id}_answer`)
        for (const [key, value] of Object.entries(question?.corrects || {})) {
          if (value) {
            if (!answerIds?.includes(key)) {
              return false
            }
          } else {
            if (answerIds?.includes(key)) {
              return false
            }
          }
        }
        return true
      case QUESTION_TYPES.MATCHING:
        const matchingAnswers = getAnswerMatching()
        if (matchingAnswers?.length !== question?.answers?.length) {
          return false
        }
        return question?.corrects?.every((correct: any) => {
          const answer = matchingAnswers?.find(
            (a: any) => a.question_id === correct.id,
          )
          if (!answer || !correct?.answer_ids?.includes(answer?.answer_id)) {
            return false
          }
          return true
        })
      case QUESTION_TYPES.FILL_WORD:
        const textAnswers = getValueFillText()
        const correctAnswers: IAnswerFillWord[] =
          question?.corrects
            ?.filter((answer: IAnswerFillWord) => answer?.is_correct)
            ?.sort(
              (a: IAnswerFillWord, b: IAnswerFillWord) =>
                a?.answer_position - b?.answer_position,
            ) || []
        const groupedAnswers = Object.values(
          correctAnswers.reduce<
            Record<number, { answer_position: number; answers: string[] }>
          >((acc, item) => {
            if (!acc[item.answer_position]) {
              acc[item.answer_position] = {
                answer_position: item.answer_position,
                answers: [],
              }
            }

            acc[item.answer_position].answers.push(item.answer)

            return acc
          }, {}),
        )

        return groupedAnswers.every((correct, index: number) => {
          const answer = textAnswers?.[index]
          if (!answer || !correct?.answers?.includes(answer)) {
            return false
          }
          return true
        })
      case QUESTION_TYPES.DRAG_DROP:
        const dragDropAnswers = getValues(`${question?.id}_answer`) || []
        const correctDragDropAnswers =
          (question?.drag_drop_answers as any[]) || []
        if (dragDropAnswers?.length !== correctDragDropAnswers?.length) {
          return false
        }
        return correctDragDropAnswers?.every((correct: any) => {
          const answer = dragDropAnswers?.find(
            (a: any) => a?.position === correct?.answer_position,
          )
          if (!answer || !correct?.answer_ids?.includes(answer?.idAnswer)) {
            return false
          }
          return true
        })
      case QUESTION_TYPES.SELECT_WORD:
        const selectWordAnswers = getValues(`${question?.id}_answer`) || []
        const correctSelectWordAnswers =
          question?.corrects?.filter(
            (answer: IAnswerFillWord) => answer?.is_correct,
          ) || []
        if (selectWordAnswers?.length !== correctSelectWordAnswers?.length) {
          return false
        }
        return correctSelectWordAnswers?.every((correct: any) => {
          const answer = selectWordAnswers?.find(
            (a: any) => a?.answer_position === correct?.answer_position,
          )
          if (!answer || answer?.answer_id !== correct?.id) {
            return false
          }
          return true
        })
      case QUESTION_TYPES.ESSAY:
        return true
      default:
        return false
    }
  }

  function getCorrect(answers: any, questionType: any) {
    switch (questionType as QUESTION_TYPES) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        const correctAnswers = answers
        const corrects = Object?.fromEntries(
          correctAnswers?.map((answer: any) => [answer.id, answer.is_correct]),
        )
        return corrects
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return Object.fromEntries(
          (answers || [])?.map((originalAnswer: any) => [
            originalAnswer.id,
            originalAnswer.is_correct,
          ]),
        )
      case QUESTION_TYPES.FILL_WORD:
      case QUESTION_TYPES.SELECT_WORD:
        return answers || []
      case QUESTION_TYPES.MATCHING:
        return answers || []
      case QUESTION_TYPES.DRAG_DROP:
        return answers || []
      default:
        return {}
    }
  }
  const getActiveQuestion = async (id: string) => {
    setLoading(true)
    try {
      const resultResponse = await TestServiceAPI.getQuestionDetail(id, {
        after_test: true,
      })
      const responseFormat = resultResponse?.data
      const questionType = responseFormat?.qType
      const answerTemp = responseFormat.answers || []
      const correctsQuestion = getCorrect(
        questionType !== QUESTION_TYPES.MATCHING
          ? answerTemp
          : responseFormat?.question_matchings,
        questionType,
      )
      const activeQuestion = {
        ...responseFormat,
        corrects: correctsQuestion,
        confirmed: true,
        answers:
          questionType === QUESTION_TYPES.DRAG_DROP
            ? handleMultipleCorrectAnswer(
                responseFormat?.drag_drop_answers || [],
                getValues(`${question?.id}_answer`),
              )
            : questionType === QUESTION_TYPES.MATCHING
              ? question?.answers
              : answerTemp,
      }
      setQuestion(activeQuestion as IStorylineQuestion)
      setIsCorrectAnswer(
        checkCorrectAnswer(activeQuestion as IStorylineQuestion),
      )
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  async function getDetail() {
    let topicDescription
    let question
    try {
      if (!isUndefined(minimalQuestion)) {
        topicDescription = await TestServiceAPI.getTopicDescription(
          minimalQuestion.question_topic.id,
          quiz_id,
        )
        question = await TestServiceAPI.getQuestionDetail(minimalQuestion?.id)
      }
      return { topicDescription, question: question?.data }
    } catch (err) {
      return {
        topicDescription: { data: {} },
        question: null,
      }
    }
  }

  const handleClearSelection = (activeQuestion: any) => {
    if (!isQuestionConfirmed) {
      setValue(`${activeQuestion?.id}_answer`, '')
    }
  }

  const renderQuestion = () => {
    const correctsDragDrop = question?.corrects
      ? {
          corrects: question?.corrects,
          answers: question?.answers,
        }
      : undefined
    switch (question?.qType) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <OneChoiceQuestion
            data={question}
            corrects={question?.corrects ? question?.corrects : undefined}
            name={`${question?.id}_answer`}
            setValue={setValue}
            solution={openExplain ? question?.solution : undefined}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            control={control}
          />
        )

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <MultiChoiceQuestion
            data={question}
            control={control}
            corrects={question?.corrects ? question?.corrects : undefined}
            name={`${question?.id}_answer`}
            setValue={setValue}
            solution={openExplain ? question?.solution : undefined}
            explainClassname="!mt-8 !p-0 !bg-transparent"
          />
        )

      case QUESTION_TYPES.MATCHING:
        return (
          <MatchQuizComponent
            data={question}
            action={getAnswerMatching}
            defaultAnswer={getAnswerMatching()}
            corrects={question?.corrects ? question?.corrects : undefined}
            uuid={'_' + uuidv4().replaceAll('-', '_')}
            solution={openExplain ? question?.solution : undefined}
            ref={MatchQuizRef}
            explainClassname="!mt-0 !p-0 !bg-transparent"
            correctAnswerClass="!mt-0 !pt-0"
          />
        )

      case QUESTION_TYPES.FILL_WORD:
        return (
          <AddWordPreview
            data={question}
            defaultAnswer={getValueFillText()}
            corrects={
              question?.corrects ? (question?.corrects as any) : undefined
            }
            solution={openExplain ? question?.solution : undefined}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            correctAnswerClass="!mt-8 !pt-0"
          />
        )

      case QUESTION_TYPES.DRAG_DROP:
        return (
          <NewDragNDropQuestion
            data={question as any}
            defaultValue={getValues(`${question?.id}_answer`)}
            onChange={(data: SlotValue[]) => {
              setValue(`${question?.id}_answer`, data)
            }}
            corrects={correctsDragDrop ? correctsDragDrop : undefined}
            solution={openExplain ? question?.solution : undefined}
            explainClassname="!mt-8 !p-0 !bg-transparent"
          />
        )

      case QUESTION_TYPES.SELECT_WORD:
        return (
          <SelectWord
            onChange={(
              value: Array<{
                answer_id: string
                answer_position: number
              }>,
            ) => setValue(`${question?.id}_answer`, value)}
            data={question}
            defaultAnswer={getValues(`${question?.id}_answer`)}
            corrects={
              question?.corrects ? (question?.corrects as any) : undefined
            }
            solution={openExplain ? question?.solution : undefined}
          />
        )

      case QUESTION_TYPES.ESSAY:
        const items =
          question?.requirements?.map((e, i: number) => {
            const getDefaultValue = () => {
              return e.answer_template
            }

            const isMeaningData = (() => {
              if (question?.response_option === RESPONSE_OPTION.WORD) {
                const currentValue = getDefaultValue()
                return (
                  currentValue &&
                  currentValue !== DEFAULT_EDITOR_VALUE &&
                  currentValue.trim() !== '' &&
                  !isEmptyParagraph(currentValue)
                )
              } else if (question?.response_option === RESPONSE_OPTION.SHEET) {
                const currentValue = getDefaultValue()

                return !!(
                  currentValue &&
                  currentValue !== defaultSheetData &&
                  checkSheetAnswered(currentValue)
                )
              }
              return false
            })()

            return {
              key: e?.id,
              label: (
                <div className="learning-act-tab-label flex items-center gap-1 text-base font-normal capitalize">
                  {`Requirement ${i + 1}`}{' '}
                  {isMeaningData && (
                    <div className="text-primary">
                      <CircleCheckIcon />
                    </div>
                  )}
                </div>
              ),
              children: (
                <div className="mt-6">
                  <EssayQuestionPreview
                    className="!rounded-none !bg-transparent !p-0 md:block"
                    editorClassName="learning-act-editor"
                    explainClassname="!mt-8 !mb-0 !p-0 !bg-transparent"
                    defaultValue={getDefaultValue()}
                    data={e}
                    question_content={question?.question_content}
                    index={i}
                    question_data={question}
                    control={control}
                    setValue={setValue}
                    handleSaveHighLight={() => {}}
                    forCaseStudy={true}
                    name={`${question?.id}_${e?.id}_essay`}
                    fullData={{
                      data: { ...question },
                      solution: question?.solution ?? '',
                    }}
                    isShowContent={false}
                  />
                </div>
              ),
            }
          }) ?? []

        return (
          <>
            <div>
              <div className="mb-6">
                <div>
                  <EditorReader
                    className="text-lg"
                    text_editor_content={question?.question_content}
                  />
                </div>
              </div>

              {!!question?.requirements?.length ? (
                <Tabs
                  className={clsx('learning-activity-tabs requirement-tab')}
                  items={items}
                />
              ) : (
                <div className="mt-6">
                  <EssayQuestionPreview
                    className="!rounded-none !bg-transparent !p-0 md:block"
                    editorClassName="learning-act-editor"
                    explainClassname="!mt-8 !mb-0 !p-0 !bg-transparent"
                    defaultValue={question?.answer_template}
                    question_content={question?.question_content}
                    question_data={question}
                    control={control}
                    setValue={setValue}
                    handleSaveHighLight={() => {}}
                    forCaseStudy={true}
                    name={`${question?.id}_essay`}
                    fullData={{
                      data: { ...question },
                      solution: question?.solution ?? '',
                    }}
                    data={question}
                    index={undefined}
                    isShowContent={false}
                  />
                </div>
              )}
            </div>
          </>
        )

      default:
        return <div></div>
    }
  }

  const handleRetakeQuestion = async () => {
    setOpenExplain(false)
    setIsRetakeQuestion(true)
    setValue(`${question?.id}_answer`, undefined)
    setQuestion({
      ...question,
      answers:
        question?.qType === QUESTION_TYPES.DRAG_DROP
          ? question?.corrects?.map((answer: any) => {
              return {
                answer: answer.answer,
                answer_position: answer.answer_position,
                id: answer.id,
              }
            })
          : question?.answers?.map((answer: any) => {
              return {
                answer: answer.answer,
                answer_position: answer.answer_position,
                id: answer.id,
              }
            }),
      corrects: undefined,
      confirmed: false,
      solution: undefined,
    } as any)
    switch (question?.qType) {
      case QUESTION_TYPES.MATCHING:
        MatchQuizRef?.current?.handleResetEdges?.()
        await new Promise((resolve) => setTimeout(resolve, 100))
        setIsRetakeQuestion(false)
        break

      case QUESTION_TYPES.FILL_WORD:
        await new Promise((resolve) => setTimeout(resolve, 100))
        setIsRetakeQuestion(false)
        break

      case QUESTION_TYPES.DRAG_DROP:
        break

      case QUESTION_TYPES.SELECT_WORD:
        break

      case QUESTION_TYPES.ESSAY:
        break
      default:
        break
    }
  }
  const handleSkipQuestion = () => {
    continueAction(
      currentVisibleDocument && currentVisibleDocument?.type !== 'QUIZ'
        ? currentVisibleDocument?.id
        : document_id,
    )
  }

  const getHintQuestion = () => {
    switch (question?.qType) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        return 'Choose one correct answer'

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return 'Choose multiple correct answers'

      case QUESTION_TYPES.MATCHING:
        return 'Match the correct answer'

      case QUESTION_TYPES.FILL_WORD:
        return 'Fill the correct answer'

      case QUESTION_TYPES.DRAG_DROP:
        return 'Drag the correct answer'

      case QUESTION_TYPES.SELECT_WORD:
        return 'Select the correct answer'

      case QUESTION_TYPES.ESSAY:
        return 'Write the correct answer'
      default:
        return <div></div>
    }
  }

  useEffect(() => {
    if (minimalQuestion?.id) {
      getDetail().then((res) => {
        if (res.topicDescription) {
          setTopicDescription(res.topicDescription.data)
        }
        if (res.question) {
          setQuestion(res.question)
        }
      })
    }
  }, [minimalQuestion])

  return (
    <div ref={questionRef}>
      {!!topicDescription?.description &&
        !isEmptyParagraph(topicDescription?.description) && (
          <EditorReader
            text_editor_content={topicDescription?.description ?? ''}
            className="sapp-questions"
          />
        )}

      {!!topicDescription?.description &&
        !isEmptyParagraph(topicDescription?.description) && (
          <Divider className="my-4 bg-gray-300 md:my-8" />
        )}
      <div
        className={clsx('rounded-t-2xl bg-gray-100 p-8', {
          'rounded-b-2xl': isLearnedBlock && !isShowActionBtn,
        })}
      >
        {renderQuestion()}
      </div>

      {/* Not Confirm */}
      <div
        className={clsx(
          'flex items-center justify-end gap-4 rounded-b-2xl p-6 transition-all duration-200',
          {
            'opacity-0': isLearnedBlock,
            'bg-primary-100': isQuestionConfirmed,
            'bg-success-50': !isQuestionConfirmed,
            '!opacity-100': isShowActionBtn,
          },
        )}
      >
        {!isQuestionConfirmed ? (
          <>
            <div className="flex-1 text-lg font-semibold text-gray-800">
              {getHintQuestion()}
            </div>
            <div className="flex items-center gap-4">
              {!isShowClearSelection && !isShowActionBtn && (
                <ButtonText
                  size="medium"
                  disabled={loading}
                  isUnderLine={false}
                  onClick={handleSkipQuestion}
                >
                  Skip Question
                </ButtonText>
              )}
              {isShowClearSelection ? (
                <ButtonText
                  isUnderLine={false}
                  startIcon={<RestartIcon className="h-6 w-6" />}
                  size={'medium'}
                  onClick={() => {
                    handleClearSelection(question)
                  }}
                  title="Clear Selection"
                />
              ) : null}
              <ButtonPrimary
                size="medium"
                disabled={loading}
                onClick={() => {
                  if (question?.qType === QUESTION_TYPES.ESSAY) {
                    setIsCorrectAnswer(true)
                    setOpenExplain(true)
                  }
                  getActiveQuestion(question?.id ?? '')
                }}
              >
                Submit
              </ButtonPrimary>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 text-lg font-semibold text-gray-800">
              {openExplain
                ? 'This is an explaination'
                : isCorrectAnswer
                  ? 'You correct the question!'
                  : 'Incorrect!'}
            </div>
            <div className="flex items-center gap-4">
              <ButtonSecondary
                className={clsx({
                  hidden: openExplain || isCorrectAnswer,
                })}
                isUnderLine={false}
                size={'medium'}
                onClick={() => setOpenExplain(true)}
                title="See Explain"
              />
              <ButtonPrimary
                className={clsx({
                  hidden: (openExplain || isCorrectAnswer) && isShowActionBtn,
                })}
                size="medium"
                disabled={loading}
                onClick={() =>
                  openExplain || isCorrectAnswer
                    ? handleSkipQuestion()
                    : handleRetakeQuestion()
                }
              >
                {openExplain || isCorrectAnswer ? 'Continue' : 'Try Again'}
              </ButtonPrimary>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default QuizBlock
