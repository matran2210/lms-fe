'use client'
import { CircleCheckIcon, CircleInfoIcon } from '@lms/assets'
import {
  DEFAULT_EDITOR_VALUE,
  defaultSheetData,
  IQuestion,
  QUESTION_TYPES,
  RESPONSE_OPTION,
} from '@lms/core'
import {
  AddWordPreview,
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
  handleMultipleCorrectAnswer,
  isEmptyParagraph,
} from '@lms/utils'
import { Divider, Tabs } from 'antd'
import clsx from 'clsx'
import { isUndefined } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TestServiceAPI } from 'src/api/test-api'
import { IMultiChoiceQuestion, IQuiz } from 'src/type/storyline'
import { v4 as uuidv4 } from 'uuid'

interface QuizBlockProps {
  minimalQuestion: IMultiChoiceQuestion
  quiz_id: string
}

const QuizBlock = ({ minimalQuestion, quiz_id }: QuizBlockProps) => {
  const MatchQuizRef = useRef(null) as any
  const questionRef = useRef<HTMLDivElement>(null)
  const [activeQuestion, setActiveQuestion] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [question, setQuestion] = useState<IQuestion | null>(null)
  const [topicDescription, setTopicDescription] = useState<any>()

  const { setValue, control } = useForm()
  const getAnswerMatching = () => {
    const value = MatchQuizRef?.current?.getMatchedPairs?.()
    return value || []
  }
  const getValueFillText = () => {
    const value = []
    const inputs = questionRef?.current?.querySelectorAll(
      'input[stringHTML="true"]',
    ) as any
    for (const e of inputs) {
      value?.push(e?.value)
    }
    return value
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
      // const quizAttempts = axiosInstance.get('')
      // const selectedResponseAnswers = data.data.selectedResponseAnswers
      const resultResponse = await TestServiceAPI.getQuestionAnswer(id)

      const questionType = resultResponse?.data?.answer?.question?.qType
      const answerTemp = resultResponse?.data?.answer?.question?.answers || []
      setActiveQuestion({
        ...resultResponse.data.answer.question,
        program: resultResponse.data.program,
        answer_file: resultResponse.data.answer.answer_file,
        active: resultResponse.data.answer.active,
        confirmed: true,
        grading_question: resultResponse.data.answer.grading_question,
        corrects: getCorrect(
          questionType !== QUESTION_TYPES.MATCHING
            ? answerTemp
            : resultResponse?.data?.answer?.answer_matching_mapping,
          resultResponse?.data?.answer?.question?.qType,
        ),
        question_matchings:
          resultResponse?.data?.answer?.answer_matching_mapping,
        answers:
          questionType === QUESTION_TYPES.DRAG_DROP
            ? handleMultipleCorrectAnswer(
                resultResponse?.data?.answer?.question?.drag_drop_answers,
                resultResponse?.data?.answer?.answer,
                answerTemp,
              )
            : answerTemp,
        myAnswers: [
          {
            question_id: resultResponse?.data?.answer?.question?.id,
            question_answer_id:
              resultResponse?.data?.answer?.question_answer_id,
            answer: resultResponse?.data?.answer?.answer,
          },
        ],
        defaultValue: resultResponse?.data?.answer?.answer,
        next: resultResponse?.data?.next,
        previous: resultResponse?.data?.previous,
        total_question: resultResponse?.data?.total_question,
        index: resultResponse?.data?.index,
        answer_position_mapping:
          resultResponse?.data?.answer?.answer_position_mapping,
        question_topic: topicDescription?.data,
        short_answer: resultResponse?.data?.answer?.short_answer,
        response_option_answer: resultResponse?.data?.answer?.response_option,
      })
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

  const renderQuestion = () => {
    switch (question?.qType) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <OneChoiceQuestion
            data={question}
            name={`${question?.id}_answer`}
            solution={question?.solution}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            control={control}
          />
        )

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <MultiChoiceQuestion
            data={question}
            control={control}
            name={`${question?.id}_answer`}
            solution={question?.solution}
            explainClassname="!mt-8 !p-0 !bg-transparent"
          />
        )

      case QUESTION_TYPES.MATCHING:
        return (
          <MatchQuizComponent
            data={question}
            action={getAnswerMatching}
            uuid={'_' + uuidv4().replaceAll('-', '_')}
            solution={question?.solution}
            ref={MatchQuizRef}
            explainClassname="!mt-0 !p-0 !bg-transparent"
            correctAnswerClass="!mt-0 !pt-0"
          />
        )

      case QUESTION_TYPES.FILL_WORD:
        return (
          <AddWordPreview
            data={question}
            action={getValueFillText}
            solution={question?.solution}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            correctAnswerClass="!mt-8 !pt-0"
          />
        )

      case QUESTION_TYPES.DRAG_DROP:
        return (
          <NewDragNDropQuestion
            data={question as any}
            onChange={(data: SlotValue[]) => {
              setValue?.(`${question?.id}_answer`, data)
            }}
            solution={question?.solution}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            defaultValue={[]}
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
            ) => setValue?.(`${question?.id}_answer`, value)}
            data={question}
            solution={question?.solution}
          />
        )

      // case QUESTION_TYPES.ESSAY:
      //   const items =
      //     question?.requirements?.map((e, i: number) => {
      //       // const hasAnswer = !!watch?.(
      //       //   `${question?.id}_${question?.requirements?.length && question?.requirements?.length > 0 ? question?.requirements?.[i]?.id : document_id}_essay`,
      //       // )
      //       const getDefaultValue = () => {
      //         return e.answer_template
      //       }

      //       const isMeaningData = (() => {
      //         if (question?.response_option === RESPONSE_OPTION.WORD) {
      //           const currentValue = getDefaultValue()
      //           return (
      //             currentValue &&
      //             currentValue !== DEFAULT_EDITOR_VALUE &&
      //             currentValue.trim() !== '' &&
      //             !isEmptyParagraph(currentValue)
      //           )
      //         } else if (question?.response_option === RESPONSE_OPTION.SHEET) {
      //           const currentValue = getDefaultValue()

      //           return !!(
      //             currentValue &&
      //             currentValue !== defaultSheetData &&
      //             checkSheetAnswered(currentValue)
      //           )
      //         }
      //         return false
      //       })()

      //       return {
      //         key: e?.id,
      //         label: (
      //           <div className="learning-act-tab-label flex items-center gap-1 text-base font-normal capitalize">
      //             {`Requirement ${i + 1}`}{' '}
      //             {isMeaningData && (
      //               <div className="text-primary">
      //                 <CircleCheckIcon />
      //               </div>
      //             )}
      //           </div>
      //         ),
      //         children: (
      //           <div className="mt-6">
      //             {/* <Alert
      //                 message={
      //                   <div className="text-xs text-gray-800">
      //                     This feature is only available on desktop or tablet.
      //                   </div>
      //                 }
      //                 type={'info'}
      //                 showIcon
      //                 className="w-full rounded-md px-[14px] md:hidden"
      //                 icon={
      //                   <div className={'!mr-4'}>
      //                     <AlertInfoIcon />
      //                   </div>
      //                 }
      //               /> */}
      //             <EssayQuestionPreview
      //               className="!rounded-none !bg-transparent !p-0 md:block"
      //               editorClassName="learning-act-editor"
      //               explainClassname="!mt-8 !mb-0 !p-0 !bg-transparent"
      //               defaultValue={getDefaultValue()}
      //               data={e}
      //               question_content={question?.question_content}
      //               index={i}
      //               question_data={question}
      //               control={control}
      //               setValue={setValue}
      //               handleSaveHighLight={() => {}}
      //               forCaseStudy={true}
      //               name={`${question?.id}_${e?.id}_essay`}
      //               fullData={{
      //                 data: { ...question },
      //                 solution: question?.solution ?? '',
      //               }}
      //             />
      //           </div>
      //         ),
      //       }
      //     }) ?? []

      //   return (
      //     <>
      //       <div>
      //         <div className="mb-6">
      //           <div>
      //             <EditorReader
      //               className="text-lg"
      //               text_editor_content={question?.question_content}
      //             />
      //           </div>
      //           {!!question?.requirements?.length && (
      //             <div className="mt-6 flex items-start gap-2 text-warning">
      //               <CircleInfoIcon className="shrink-0" />
      //               <div className="text-base font-normal">
      //                 You must finished {question?.requirements?.length || 0}{' '}
      //                 requirements to complete this question (Your answer is
      //                 auto save)
      //               </div>
      //             </div>
      //           )}
      //         </div>

      //         {!!question?.requirements?.length ? (
      //           <Tabs
      //             className={clsx('learning-activity-tabs requirement-tab')}
      //             items={items}
      //           />
      //         ) : (
      //           <div className="mt-6">
      //             <EssayQuestionPreview
      //               className="!rounded-none !bg-transparent !p-0 md:block"
      //               editorClassName="learning-act-editor"
      //               explainClassname="!mt-8 !mb-0 !p-0 !bg-transparent"
      //               defaultValue={question?.answer_template}
      //               question_content={question?.question_content}
      //               question_data={question}
      //               control={control}
      //               setValue={setValue}
      //               handleSaveHighLight={() => {}}
      //               forCaseStudy={true}
      //               name={`${question?.id}_essay`}
      //               fullData={{
      //                 data: { ...question },
      //                 solution: question?.solution ?? '',
      //               }}
      //               data={question}
      //               index={undefined}
      //             />
      //           </div>
      //         )}
      //       </div>
      //     </>
      //   )

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

  console.log(question, topicDescription, 'question, topicDescription')

  return (
    <div>
      {!!topicDescription?.description &&
        !isEmptyParagraph(topicDescription?.description) && (
          <HighlightableHTML
            initialHTML={topicDescription?.description ?? ''}
            storageKey={`quiz-storyline-question-topic-${activeQuestion?.id}`}
            className="sapp-questions"
          />
        )}

      {!!topicDescription?.description &&
        !isEmptyParagraph(topicDescription?.description) && (
          <Divider className="my-4 bg-gray-300 md:my-8" />
        )}
      <div className="bg-gray-100 p-8">{renderQuestion()}</div>
    </div>
  )
}

export default QuizBlock
