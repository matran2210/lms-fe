'use client'
import { useStoryline } from '@contexts/StorylineContext'
import { CircleCheckIcon, RestartIcon } from '@lms/assets'
import {
  AnswerItem,
  DEFAULT_EDITOR_VALUE,
  defaultSheetData,
  DocumentItem,
  IAnswerFillWord,
  IDragDropAnswer,
  IEssayAnswer,
  IMultiChoiceQuestion,
  IStorylineQuestion,
  myAnswer,
  myAnswerDragDrop,
  myAnswerFillWord,
  myAnswerMatching,
  myAnswerMultipleChoice,
  myAnswerSelectWord,
  QUESTION_TYPES,
  RESPONSE_OPTION
} from '@lms/core'
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
  EditorReader,
  EssayQuestionPreview,
  MatchQuizComponent,
  MultiChoiceQuestion,
  NewDragNDropQuestion,
  NewFillText,
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
import { Tabs } from 'antd'
import clsx from 'clsx'
import { isEmpty, isUndefined } from 'lodash'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CoursesAPI } from 'src/api/courses'
import { TestServiceAPI } from 'src/api/test-api'
import { v4 as uuidv4 } from 'uuid'


interface QuizBlockProps {
  minimalQuestion: IMultiChoiceQuestion
  quiz_id: string
  document_id: string
  docIndex: number
  document: DocumentItem
}


const QuizBlock = ({
  minimalQuestion,
  quiz_id,
  document_id,
  docIndex,
  document,
}: QuizBlockProps) => {
  const MatchQuizRef = useRef(null) as any
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const FillWordRef = useRef(null) as any
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const { section_storyline_id } = useParams()


  const { control, setValue, reset, getValues, watch, resetField } = useForm()
  const {
    continueAction,
    visibleDocumentCount,
    updateProgress,
    storylineDocument,
    currentStep,
    class_user_id,
  } = useStoryline()
  const currentVisibleDocument = storylineDocument?.[visibleDocumentCount]
  const isLearnedBlock = docIndex < visibleDocumentCount
  const isLastVisibleDocument = docIndex === storylineDocument?.length
  const [loading, setLoading] = useState<boolean>(false)
  const [question, setQuestion] = useState<IStorylineQuestion | null>(null)
  // const [topicDescription, setTopicDescription] = useState<any>()
  const [openExplain, setOpenExplain] = useState(false)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)
  const [isRetakeQuestion, setIsRetakeQuestion] = useState(false)
  const [skipQuestion, setSkipQuestion] = useState(false)
  const isShowActionBtn =
    status === 'Review' || (status !== 'Review' && isLearnedBlock)
  const attemptId = document?.quiz?.attempt?.id
  const isQuestionConfirmed = !!question?.confirmed || !!attemptId

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
  const handleGetAnswer = (question: IStorylineQuestion) => {
    switch (question?.qType as QUESTION_TYPES) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        return getValues(`${question?.id}_answer`)
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return getValues(`${question?.id}_answer`)
      case QUESTION_TYPES.FILL_WORD:
        return getValues(`${question?.id}_answer`)
      case QUESTION_TYPES.SELECT_WORD:
        return getValues(`${question?.id}_answer`)
      case QUESTION_TYPES.MATCHING:
        return getAnswerMatching()
      case QUESTION_TYPES.DRAG_DROP:
        return getValues(`${question?.id}_answer`)
      case QUESTION_TYPES.ESSAY:
        if (question?.requirements?.length) {
          const answers: IEssayAnswer[] = []
          question?.requirements?.forEach((req, i) => {
            const fieldName = `${question?.id}_${req.id}_essay`


            const answer = getValues?.(fieldName)
            if (!!answer) {
              answers.push({
                question_id: question?.id || '',
                answer_file: req?.answer_file,
                short_answer:
                  !isUndefined(answer) && !isEmpty(answer)
                    ? String(answer).trim()
                    : '',
                response_option: question?.response_option
                  ? question?.response_option
                  : 'WORD',


                requirement_id: req?.id,
                active: 'SUBMITED',
              })
            }
          })
          return answers
        } else {
          const answer = getValues?.(`${question?.id}_essay`)
          return [
            {
              question_id: question?.id,
              answer_file: question.answer_file,
              short_answer:
                !isUndefined(answer) && !isEmpty(answer)
                  ? String(answer).trim()
                  : '',
              response_option: question?.response_option
                ? question?.response_option
                : 'WORD',
              requirement_id: null,
              active: 'SUBMITED',
            },
          ]
        }


      default:
        break
    }
  }
  const checkCorrectAnswer = (question: IStorylineQuestion, defaultAnswer?: any) => {
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
        const matchingAnswers = getAnswerMatching()?.length ? getAnswerMatching() : defaultAnswer || []
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
        const textAnswers = getValues(`${question?.id}_answer`)
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
        const dragDropAnswers = getValues(`${question?.id}_answer`)?.length ? getValues(`${question?.id}_answer`) : defaultAnswer || []
        const correctDragDropAnswers =
          (question?.drag_drop_answers as any[]) || []
        if (dragDropAnswers?.length !== correctDragDropAnswers?.length) {
          return false
        }
        return correctDragDropAnswers?.every((correct: any) => {
          const answer = dragDropAnswers?.find(
            (a: any) => a?.position === correct?.answer_position || a?.answer_position === correct?.answer_position,
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
  const getMultipleCorrectAnswer = (
  dragDropAnswers: IDragDropAnswer[],
  answers: AnswerItem[],
  corrects?: Correct[],
) => {
  const answersMapped = dragDropAnswers?.map((correctItem: IDragDropAnswer) => {
    const dragDropCurrent = answers?.find(
      (item: AnswerItem) =>
        correctItem?.answer_position ===
        (item?.position || item?.answer_position),
    );
    const correctAnswer = corrects?.find((item) => item?.id === dragDropCurrent?.answer_id);
    const isCorrect =
      correctItem?.answer_ids?.includes(
        dragDropCurrent?.answer_id || dragDropCurrent?.idAnswer || "",
      ) || false;
    return {
      ...dragDropCurrent,
      is_correct: isCorrect,
      id: dragDropCurrent?.id || dragDropCurrent?.answer_id,
      idAnswer: dragDropCurrent?.idAnswer || dragDropCurrent?.id || dragDropCurrent?.answer_id,
      position: correctItem?.answer_position,
      value: correctAnswer?.answer,
    };
  });

  return answersMapped;
};

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
      await handleSubmitAnswer()
      const resultResponse = await TestServiceAPI.getQuestionDetail(id, {
        after_test: true,
      })


      // const questionAnsswer = CoursesAPI.getQuizAttemptsAnswer({
      //   attempt_id: res.quizAttemptId,
      //   question_id: question?.id as string,
      // })


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
              correctsQuestion,
            )
            : questionType === QUESTION_TYPES.MATCHING
              ? question?.answers
              : answerTemp,
      }
      const isCorrect = checkCorrectAnswer(activeQuestion as IStorylineQuestion)
      setIsCorrectAnswer(isCorrect)
      const activeQuestionFormat = {
        ...activeQuestion,
        answers:
          questionType === QUESTION_TYPES.DRAG_DROP
            ? isCorrect || openExplain
              ? handleMultipleCorrectAnswer(
                responseFormat?.drag_drop_answers || [],
                getValues(`${question?.id}_answer`),
                correctsQuestion,
              )
              : []
            : questionType === QUESTION_TYPES.MATCHING
              ? question?.answers
              : answerTemp,
      }
      setQuestion(activeQuestionFormat as IStorylineQuestion)
    } catch (error) {
    } finally {
      updateProgress(document_id)
      setLoading(false)
    }
  }


  const formatMyAnswerFromForm = (
    rawAnswer:
      | string
      | string[]
      | { question_id: string; answer_id: string }[]
      | { idAnswer: string; position: number }[]
      | IEssayAnswer[],
    question: IStorylineQuestion,
    time_spent: number = 0,
  ): myAnswer[] => {
    if (!rawAnswer) return []


    switch (question?.qType as QUESTION_TYPES) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        return [
          {
            question_id: question.id,
            question_answer_id: rawAnswer as string,
            time_spent: time_spent,
          },
        ]


      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return [
          {
            question_id: question.id,
            answer: (rawAnswer as string[]).map((e: string) => ({
              answer_id: e,
            })),
            time_spent: time_spent,
          },
        ] as myAnswerMultipleChoice[]


      case QUESTION_TYPES.FILL_WORD:
        return [
          {
            question_id: question.id,
            answer: (rawAnswer as string[]).map((e: string, i: number) => ({
              answer_text: e,
              answer_position: i + 1,
            })),
            time_spent: time_spent,
          },
        ] as myAnswerFillWord[]


      case QUESTION_TYPES.SELECT_WORD:
        return [
          {
            question_id: question.id,
            answer: rawAnswer || [],
            time_spent: time_spent,
          },
        ] as myAnswerSelectWord[]


      case QUESTION_TYPES.MATCHING:
        return [
          {
            question_id: question.id,
            answer: (
              rawAnswer as { question_id: string; answer_id: string }[]
            ).map((e) => ({
              question_id: e.question_id,
              answer_id: e.answer_id,
            })),
            time_spent: time_spent,
          },
        ] as myAnswerMatching[]


      case QUESTION_TYPES.DRAG_DROP:
        return [
          {
            question_id: question.id,
            answer: (rawAnswer as { idAnswer: string; position: number }[]).map(
              (e) => ({
                answer_id: e.idAnswer,
                answer_position: e.position,
              }),
            ),
            time_spent: time_spent,
          },
        ] as myAnswerDragDrop[]


      case QUESTION_TYPES.ESSAY:
        return (rawAnswer as IEssayAnswer[]).map((item) => ({
          ...item,
          time_spent: time_spent,
        }))


      default:
        return []
    }
  }
  const handleSubmitAnswer = async () => {
    const myAnswers = handleGetAnswer(question as IStorylineQuestion)
    const formattedAnswer = formatMyAnswerFromForm(
      myAnswers,
      question as IStorylineQuestion,
      0,
    )
    // Create attempt & submit
    return await TestServiceAPI.submitQuizTest(
      quiz_id,
      {
        answers: formattedAnswer,
      },
      class_user_id,
      section_storyline_id as string,
    )
  }


  async function getDetail({ attemptId }: { attemptId?: string }) {
    const questionId = minimalQuestion?.id
    try {
      if (!isUndefined(minimalQuestion)) {
        if (attemptId) {
          const res = await CoursesAPI.getQuizAttemptsAnswer({
            attempt_id: attemptId || "",
            question_id: questionId,
          });
          const responseData = res?.data?.answer;
          const responseFormat = responseData.question
          const questionType = responseFormat.qType
          const answerTemp = responseFormat.answers || []
          const correctsQuestion = getCorrect(
            questionType !== QUESTION_TYPES.MATCHING
              ? answerTemp
              : responseFormat?.question_matchings,
            questionType,
          )
          const userAnswer = questionType === QUESTION_TYPES.ESSAY ?
            responseFormat.requirements?.length ? responseFormat.requirement_answers : responseData?.short_answer : responseData?.answer
            ? responseData?.answer?.map((answer) => {
              if (
                answer?.answer_id &&
                !answer?.answer_text &&
                !answer?.answer_position &&
                !answer?.question_id
              ) {
                return answer?.answer_id;
              } else if (
                answer?.answer_text &&
                answer?.answer_position &&
                !answer?.answer_id &&
                !answer?.question_id
              ) {
                return answer?.answer_text;
              } else {
                return answer;
              }
            })
            : responseData?.question_answer_id;
          const activeQuestion = {
            ...responseFormat,
            corrects: correctsQuestion,
            confirmed: true,
            answers:
              questionType === QUESTION_TYPES.DRAG_DROP
                ? getMultipleCorrectAnswer(
                  responseFormat?.drag_drop_answers || [],
                  userAnswer,
                  correctsQuestion
                )
                : questionType === QUESTION_TYPES.MATCHING
                  ? responseFormat.answers
                  : answerTemp,
          }
          setValue(`${responseFormat?.id}_answer`, questionType === QUESTION_TYPES.DRAG_DROP ? activeQuestion.answers : userAnswer)
          const isCorrect = checkCorrectAnswer(activeQuestion as IStorylineQuestion, userAnswer)
          setIsCorrectAnswer(isCorrect)
          if (res.success) {
            // Đảm bảo đối tượng trả về khớp với kiểu hành động đã được fulfill dự kiến
            return {
              question: {
                defaultValue: userAnswer,
                ...activeQuestion,
                answers:
                  questionType === QUESTION_TYPES.DRAG_DROP
                    ? getMultipleCorrectAnswer(
                        responseFormat?.drag_drop_answers || [],
                        userAnswer,
                        correctsQuestion
                      )
                      
                    : questionType === QUESTION_TYPES.MATCHING
                      ? responseFormat.answers || []
                      : answerTemp,
              },
            };
          }
        } else {
          const response = await TestServiceAPI.getQuestionDetail(minimalQuestion?.id)

          if (response.success) {
            // Đảm bảo đối tượng trả về khớp với kiểu hành động đã được fulfill dự kiến

            return {
              question: {
                ...response.data,
                time_spent: 0,
                quiz_position_mapping: [
                  {
                    question_id: questionId,
                  },
                ],
              },
            };
          }
        }
      }
    } catch (err) {
      return {
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
            key={`${question?.id}_answer`}
            data={question}
            defaultValues={question?.defaultValue}
            corrects={
              isCorrectAnswer || openExplain || attemptId
                ? question?.corrects
                  ? question?.corrects
                  : undefined
                : undefined
            }
            name={`${question?.id}_answer`}
            setValue={setValue}
            solution={
              isCorrectAnswer || openExplain || attemptId ? question?.solution : undefined
            }
            explainClassname="!mt-8 !p-0 !bg-transparent"
            control={control}
            readOnly={isQuestionConfirmed}
            isAnimationCorrectAnswer
          />
        )


      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <MultiChoiceQuestion
            key={`${question?.id}_answer`}
            data={question}
            defaultValues={question?.defaultValue}
            control={control}
            corrects={
              isCorrectAnswer || openExplain || attemptId
                ? question?.corrects
                  ? question?.corrects
                  : undefined
                : undefined
            }
            name={`${question?.id}_answer`}
            setValue={setValue}
            solution={
              isCorrectAnswer || openExplain || attemptId ? question?.solution : undefined
            }
            explainClassname="!mt-8 !p-0 !bg-transparent"
            readOnly={isQuestionConfirmed}
            isAnimationCorrectAnswer
          />
        )


      case QUESTION_TYPES.MATCHING:
        return (
          <MatchQuizComponent
            data={question}
            action={getAnswerMatching}
            defaultAnswer={question?.defaultValue || getAnswerMatching()}
            corrects={
              isCorrectAnswer || openExplain || attemptId
                ? question?.corrects
                  ? question?.corrects
                  : undefined
                : undefined
            }
            uuid={'_' + uuidv4().replaceAll('-', '_')}
            solution={
              isCorrectAnswer || openExplain || attemptId ? question?.solution : undefined
            }
            ref={MatchQuizRef}
            explainClassname="!mt-0 !p-0 !bg-transparent"
            correctAnswerClass="!mt-0 !pt-0"
            disabled={isQuestionConfirmed}
            isAnimationCorrectAnswer
          />
        )


      case QUESTION_TYPES.FILL_WORD:
        return (
          <NewFillText
            control={control}
            name={`${question?.id}_answer`}
            data={question}
            setValue={setValue}
            defaultAnswer={getValues(`${question?.id}_answer`)}
            corrects={
              isCorrectAnswer || openExplain || attemptId
                ? question?.corrects
                  ? (question?.corrects as any)
                  : undefined
                : undefined
            }
            ref={FillWordRef}
            solution={
              isCorrectAnswer || openExplain || attemptId ? question?.solution : undefined
            }
            watch={watch}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            readOnly={isQuestionConfirmed}
            isAnimationCorrectAnswer
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
            corrects={
              isCorrectAnswer || openExplain || attemptId
                ? correctsDragDrop
                  ? correctsDragDrop
                  : undefined
                : undefined
            }
            solution={
              (isCorrectAnswer || openExplain || attemptId) ? question?.solution : undefined
            }
            explainClassname="!mt-8 !p-0 !bg-transparent"
            disabled={isQuestionConfirmed}
            isAnimationCorrectAnswer
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
            defaultAnswer={question?.defaultValue || getValues(`${question?.id}_answer`)}
            corrects={
              isCorrectAnswer || openExplain || attemptId
                ? question?.corrects
                  ? (question?.corrects as any)
                  : undefined
                : undefined
            }
            solution={
              isCorrectAnswer || openExplain || attemptId ? question?.solution : undefined
            }
            disabled={isQuestionConfirmed}
            className="!bg-white"
            isAnimationCorrectAnswer
          />
        )


      case QUESTION_TYPES.ESSAY:
        const items =
          question?.requirements?.map((e, i: number) => {
            const getDefaultValue = () => {
              const defaultValue = question.requirement_answers?.find(
                (d) => d.requirement_id === e.id,
              )
              return defaultValue?.short_answer
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
                    handleSaveHighLight={() => { }}
                    forCaseStudy={true}
                    name={`${question?.id}_${e?.id}_essay`}
                    fullData={{
                      data: { ...question },
                      solution: question?.solution ?? '',
                    }}
                    isShowContent={false}
                    disable={isQuestionConfirmed}
                    isAnimationCorrectAnswer
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
                      defaultValue={question?.answer_template || question.defaultValue}
                    question_content={question?.question_content}
                    question_data={question}
                    control={control}
                    setValue={setValue}
                    handleSaveHighLight={() => { }}
                    forCaseStudy={true}
                    name={`${question?.id}_essay`}
                    fullData={{
                      data: { ...question },
                      solution: question?.solution ?? '',
                    }}
                    data={question}
                    index={undefined}
                    isShowContent={false}
                    disable={isQuestionConfirmed}
                    isAnimationCorrectAnswer
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
  const handleSkipQuestion = ({
    isUpdateProgress = true,
  }: {
    isUpdateProgress?: boolean
  }) => {
    setSkipQuestion(true)
    continueAction(
      currentVisibleDocument && currentVisibleDocument?.type !== 'QUIZ'
        ? currentVisibleDocument?.id
        : document_id,
      isUpdateProgress,
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


  // Effect retake: total_document_completed reset về 0 → update map về chưa hoàn thành
  useEffect(() => {
    if (!currentStep?.id) return
    const totalCompleted =
      currentStep?.item_progress?.total_document_completed ?? 0
    if (totalCompleted > 1) return
    handleRetakeQuestion()
  }, [currentStep?.item_progress?.total_document_completed])
  useLayoutEffect(() => {
    if (minimalQuestion?.id) {
      const hasAttempt = !!document.quiz?.attempt
      // setOpenExplain(hasAttempt)
      // setIsCorrectAnswer(!!document.quiz?.attempt.answers?.[0]?.is_correct)
      // setValue(
      //   `${minimalQuestion?.id}_answer`,
      //   document.quiz?.attempt.answers?.[0]?.question_answer_id,
      // )
      getDetail({ attemptId: document.quiz?.attempt?.id }).then((res) => {
        // if (res.topicDescription) {
        //   setTopicDescription(res.topicDescription.data)
        // }
        if (res?.question) {
          setQuestion({
            ...res?.question,
            confirmed: hasAttempt,
          } as IStorylineQuestion)
        }
      })
    }
  }, [minimalQuestion?.id, document])


  useEffect(() => {
    const target = questionRefs.current[docIndex]
    if (!target) return
    if (!openExplain && !isCorrectAnswer) return


    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [openExplain, isCorrectAnswer])


  return (
    <div
      key={docIndex}
      ref={(el) => {
        questionRefs.current[docIndex] = el
      }}
    >
      {/* {!!topicDescription?.description &&
        !isEmptyParagraph(topicDescription?.description) && (
          <EditorReader
            text_editor_content={topicDescription?.description ?? ''}
            className="sapp-questions"
          />
        )}


      {!!topicDescription?.description &&
        !isEmptyParagraph(topicDescription?.description) && (
          <Divider className="my-4 bg-gray-300 md:my-8" />
        )} */}
      <div
        className={clsx('min-h-[200px] rounded-t-2xl bg-gray-100 p-8', {
          'rounded-b-2xl': isLearnedBlock && !isShowActionBtn,
        })}
        data-aos={'fade-up'}
      >
        {renderQuestion()}
      </div>


      {/* Not Confirm */}
      <div
        className={clsx(
          'flex items-center justify-end gap-4 rounded-b-2xl px-6 py-4',
          'transition-transform duration-200 ease-out will-change-transform',
          {
            'max-h-0 translate-y-full !p-0 opacity-0':
              isLearnedBlock && !isShowActionBtn,
            'bg-primary-100':
              isQuestionConfirmed || !isCorrectAnswer || openExplain,
            'bg-success-50': !isQuestionConfirmed || isCorrectAnswer,
            'translate-y-0 opacity-100': isShowActionBtn,
          },
        )}
      // data-aos={'fade-up'}
      >
        {!isQuestionConfirmed ? (
          <>
            <div className="flex flex-1 items-center gap-2">
              <Image
                src="/assets/images/pointerIcon.png"
                alt="pointer"
                width={24}
                height={24}
                className="shrink-0"
              />
              <div className="text-lg font-semibold text-gray-800">
                {getHintQuestion()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!isShowClearSelection &&
                !isShowActionBtn &&
                !isLastVisibleDocument && (
                  <ButtonText
                    size="medium"
                    disabled={loading}
                    isUnderLine={false}
                    onClick={() =>
                      handleSkipQuestion({
                        isUpdateProgress: true,
                      })
                    }
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
                  className="font-semibold"
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
              {openExplain ? (
                <ExplainQuiz
                  text={'This is an explaination'}
                  icon={
                    <Image
                      src="/assets/images/zoomIcon.png"
                      alt="explain"
                      width={24}
                      height={24}
                      className="shrink-0"
                    />
                  }
                />
              ) : isCorrectAnswer ? (
                <ExplainQuiz
                  text={'You correct the question!'}
                  icon={
                    <Image
                      src="/assets/images/cheerIcon.png"
                      alt="correct"
                      width={24}
                      height={24}
                      className="shrink-0"
                    />
                  }
                />
              ) : (
                <ExplainQuiz
                  text={'Incorrect!'}
                  icon={
                    <Image
                      src="/assets/images/sadIcon.png"
                      alt="incorrect"
                      width={24}
                      height={24}
                      className="shrink-0"
                    />
                  }
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <ButtonSecondary
                className={clsx('bg-white', {
                  hidden: openExplain || isCorrectAnswer || attemptId,
                })}
                isUnderLine={false}
                size={'medium'}
                onClick={() => {
                  setOpenExplain(true)
                  // isLastVisibleDocument &&
                  //   handleSkipQuestion({
                  //     isUpdateProgress: false,
                  //   })
                }}
                title="See Explain"
              />
              <ButtonPrimary
                className={clsx({
                  hidden:
                    (openExplain || isCorrectAnswer || attemptId) &&
                    (isShowActionBtn || isLastVisibleDocument),
                })}
                size="medium"
                disabled={loading}
                onClick={() =>
                  openExplain || isCorrectAnswer || attemptId
                    ? handleSkipQuestion({
                      isUpdateProgress:
                        currentVisibleDocument &&
                        currentVisibleDocument?.type !== 'QUIZ',
                    })
                    : handleRetakeQuestion()
                }
              >
                {openExplain || isCorrectAnswer || attemptId ? 'Continue' : 'Try Again'}
              </ButtonPrimary>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


const ExplainQuiz = ({
  text,
  icon,
}: {
  text: string
  icon: React.ReactNode
}) => {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>{text}</div>
    </div>
  )
}
export default QuizBlock
