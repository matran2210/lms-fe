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
  MatchQuizComponent,
  MultiChoiceQuestion,
  NewDragNDropQuestion,
  OneChoiceQuestion,
  SelectWord,
  SlotValue,
} from '@lms/ui'
import { checkSheetAnswered, isEmptyParagraph } from '@lms/utils'
import { Tabs } from 'antd'
import clsx from 'clsx'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

interface QuizBlockProps {
  question: IQuestion
}

export default function QuizBlock({ question }: QuizBlockProps) {
  const MatchQuizRef = useRef(null) as any
  const questionRef = useRef<HTMLDivElement>(null)

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

  return <div className="relative">{renderQuestion()}</div>
}
