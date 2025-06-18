import {
  CircleCheckIcon,
  CircleInfoIcon,
  DownloadIcon,
  FileTextIcon,
  InfoIcon,
} from '@assets/icons'
import useClickOutside from '@components/base/clickoutside/HookClick'
import EditorReader from '@components/base/editor/EditorReader'
import HighlightableText from '@components/highlights/HighlightableText'
import { HighlightableHTML } from '@components/highlights/HighlightHTML'
import { NotesOutline } from '@components/icons/Notes'
import PulsingExclamation from '@components/icons/PulsingExclamation'
import { download } from '@components/learning/activity/ActivityResource'
import Popover from '@components/Popover'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
import DragNDropPreview from '@components/questionType/DragNDrop'
import AddWordPreview from '@components/questionType/FillText'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MatchQuizComponent from '@components/questionType/MatchQuiz/MatchQuiz'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import ModalUploadFile from '@components/uploadFile/ModalUploadFile/ModalUploadFile'
import { Divider, Tabs } from 'antd'
import clsx from 'clsx'
import { isEmpty, isUndefined } from 'lodash'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  Control,
  FieldValues,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import SappIcon from 'src/common/SappIcon'
import { QUESTION_TYPES, RESPONSE_OPTION } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import {
  IActivityStateQuestion,
  clearFileEssay,
  confirmQuestion,
  saveFileEssay,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'

import { IEssayAnswer } from 'src/type/answer'
import { IFile } from 'src/type/course'
import { IExhibit, IExhibitData } from 'src/type/exhibit'
import { v4 as uuidv4 } from 'uuid'

interface IRequirement {
  id: string
  name: string
  type?: 'TEXT' | 'FILE'
  description: string
  files?: IFile[]
  answer_file?: {
    file_key: string
    file_name: string
  }
  short_answer?: string
  explanation?: string
}

export type QuizComponentRef = {
  onSubmit: ({
    activityId,
    tabId,
    quizId,
    time_spent,
    then,
    onError,
    onFinally,
  }: {
    activityId: string
    tabId: string
    quizId: string
    time_spent?: number
    then?: (e: any) => void
    onError?: (e: any) => void
    onFinally?: () => void
  }) => void
  reset: UseFormReset<FieldValues>
  onSaveAnswer: (activeQuestion: IActivityStateQuestion) => void
}

type Props = {
  activeQuestion?: IActivityStateQuestion
  showCorrect?: boolean
  document_id: string
  activityId: string
  tabId: string
  quizId: string
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
  grading_preference: 'AFTER_EACH_QUESTION' | 'AFTER_ALL_QUESTIONS'
  showQuestionContent?: boolean
  isHideExhibit?: boolean
  saveAnswer?: () => void
  exhibitText?: string
  controlAnswer: Control<FieldValues, any>
  setValue: UseFormSetValue<FieldValues>
  reset: UseFormReset<FieldValues>
  getValues: UseFormGetValues<FieldValues>
  watch: UseFormWatch<FieldValues>
}

type RefEditor = {
  reset: () => void
}

const QuizComponent = forwardRef<QuizComponentRef, Props>(
  (
    {
      activeQuestion,
      showCorrect,
      document_id,
      activityId,
      tabId,
      quizId,
      setOpenFile,
      grading_preference,
      showQuestionContent = true,
      isHideExhibit = true,
      saveAnswer,
      exhibitText = 'Exhibit',
      controlAnswer,
      setValue,
      reset,
      getValues,
      watch,
    }: Props,
    ref,
  ) => {
    const questionRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()

    const DragDropRef = useRef(null) as any
    const MatchQuizRef = useRef(null) as any

    const [showListRequirement, setShowListRequirement] =
      useState<boolean>(false)
    const listRequirementRef = useRef<HTMLDivElement>(null)
    const [exhibitData, setExhibitData] = useState<IExhibit[]>()

    const [isChange, setIsChange] = useState<boolean>(false)
    const [isUploadFile, setIsUploadFile] = useState<boolean>(false)
    const [essayData, setEssayData] = useState<{
      req?: IRequirement
      index?: number
    }>()
    const [showWarning, setShowWarning] = useState(true)

    useClickOutside({
      ref: listRequirementRef,
      callback: () => setShowListRequirement(false),
    })

    const [showRequirement, setShowRequirement] = useState<{
      id: string
      description: string
      index: number
      name: string
      files: any
    } | null>()

    const [openUpload, setOpenUpload] = useState<{
      requirement_id?: string
      question_id?: string
      status: boolean
    }>({ requirement_id: undefined, question_id: undefined, status: false })
    const [openPdf, setOpenPdf] = useState<{ status: boolean; url: string }>()
    const refEditor = useRef<RefEditor>(null)

    const handleShowRequirement = (data: {
      description: string
      index: number
      name: string
      files: any
      id: string
    }) => {
      saveAnswer && saveAnswer()
      setShowListRequirement(false)
      if (activeQuestion?.response_option === RESPONSE_OPTION.WORD) {
        refEditor?.current?.reset()
      }
      setShowRequirement(data)
      setValue(
        `${activeQuestion?.id}_${data?.id}_essay`,
        activeQuestion?.myAnswers?.[data.index - 1]?.short_answer ??
          getValues(`${activeQuestion?.id}_${data?.id}_essay`) ??
          null,
      )
      setEssayData({
        req: data,
        index: data.index - 1,
      })
    }

    const getValueFillText = () => {
      let value = []
      const inputs = document?.querySelectorAll(
        'input[stringHTML="true"]',
      ) as any
      for (let e of inputs) {
        value?.push(e?.value)
      }
      return value
    }

    const getValueSelectText = () => {
      let value = [] as any
      const inputs = questionRef?.current?.querySelectorAll(
        'select.sapp-select--selectword-preview',
      ) as any

      for (let e of inputs) {
        value?.push(e?.value)
      }
      return value
    }

    const getAnswerMatching = () => {
      const value = MatchQuizRef?.current?.getMatchedPairs?.()
      return value || []
    }

    const getAnswerDragNDrop = () => {
      let value = [] as any
      const inputs = questionRef?.current?.querySelectorAll(
        '.sapp-input-dragNDrop',
      ) as any
      for (let e of inputs) {
        const idAnswer = e?.querySelector('span')
        value.push({ id: e?.id, value: e?.innerText, idAnswer: idAnswer?.id })
      }
      return value
    }

    const handleResponseResults = () => {
      if (activeQuestion) {
        if (!activeQuestion?.confirmed && !activeQuestion.isDrafAnswer) {
          return
        }
        setTimeout(() => {
          switch (activeQuestion?.qType) {
            case QUESTION_TYPES.ONE_CHOICE:
            case QUESTION_TYPES.TRUE_FALSE: {
              setValue &&
                setValue(
                  `${activeQuestion?.id}_${document_id}_answer`,
                  activeQuestion?.defaultValue,
                )

              break
            }

            case QUESTION_TYPES.MULTIPLE_CHOICE: {
              setValue &&
                setValue(
                  `${activeQuestion?.id}_${document_id}_answer`,
                  activeQuestion?.defaultValue,
                )
              break
            }

            case QUESTION_TYPES.ESSAY: {
              activeQuestion?.myAnswers?.map((ans: IEssayAnswer) => {
                ans?.short_answer &&
                  setValue(
                    `${activeQuestion?.id}_${ans.requirement_id ?? document_id}_essay`,
                    ans?.short_answer,
                  )
              })
            }
          }
        })
      }
    }

    // Lift onSubmit using useImperativeHandle
    useImperativeHandle(ref, () => ({
      onSubmit: onSubmit,
      reset: reset,
      onSaveAnswer: handleGetAnswer,
    }))

    const handleGetAnswer = (activeQuestion: IActivityStateQuestion) => {
      switch (activeQuestion?.qType as QUESTION_TYPES) {
        case QUESTION_TYPES.ONE_CHOICE:
        case QUESTION_TYPES.TRUE_FALSE:
          return getValues(`${activeQuestion?.id}_${document_id}_answer`)
        case QUESTION_TYPES.MULTIPLE_CHOICE:
          return getValues(`${activeQuestion?.id}_${document_id}_answer`)
        case QUESTION_TYPES.FILL_WORD:
          return getValueFillText()
        case QUESTION_TYPES.SELECT_WORD:
          return getValueSelectText()
        case QUESTION_TYPES.MATCHING:
          return getAnswerMatching()
        case QUESTION_TYPES.DRAG_DROP:
          return getAnswerDragNDrop()
        case QUESTION_TYPES.ESSAY:
          const value = getValues(`${activeQuestion?.id}_${document_id}_essay`)
          const isSubmitted = (() => {
            if (activeQuestion?.response_option === RESPONSE_OPTION.SHEET) {
              if (
                isChange ||
                (isUploadFile && grading_preference === 'AFTER_ALL_QUESTIONS')
              ) {
                return true
              } else if (value) {
                const data = JSON.parse(value)
                for (let e of data) {
                  if (e?.celldata && e?.celldata?.length > 0) {
                    return true
                  }
                }
              }
              return false
            } else {
              if (
                (value !== undefined && value !== '') ||
                isChange ||
                (isUploadFile && grading_preference === 'AFTER_ALL_QUESTIONS')
              ) {
                return true
              }
              return false
            }
          })()

          let active = 'UNFINISHED'

          if (isSubmitted || activeQuestion?.answer_file) {
            active = 'SUBMITED'
          }
          if (activeQuestion?.requirements?.length) {
            const answers = activeQuestion?.requirements?.map((req) => {
              const answer = getValues(`${activeQuestion?.id}_${req.id}_essay`)
              return {
                question_id: activeQuestion?.id,
                answer_file: req?.answer_file,
                short_answer:
                  !isUndefined(answer) && !isEmpty(answer)
                    ? String(answer).trim()
                    : '',
                response_option: activeQuestion?.response_option
                  ? activeQuestion?.response_option
                  : 'WORD',

                requirement_id: req?.id,
                active,
              }
            })
            return answers
          } else {
            const answer = getValues(
              `${activeQuestion?.id}_${activeQuestion?.requirements?.length ? showRequirement?.id : document_id}_essay`,
            )
            return [
              {
                question_id: activeQuestion?.id,
                answer_file: activeQuestion.answer_file,
                short_answer:
                  !isUndefined(answer) && !isEmpty(answer)
                    ? String(answer).trim()
                    : '',
                response_option: activeQuestion?.response_option
                  ? activeQuestion?.response_option
                  : 'WORD',
                requirement_id: null,
                active,
              },
            ]
          }

        default:
          break
      }
    }

    const onSubmit = ({
      activityId,
      tabId,
      quizId,
      time_spent,
      then,
      onError,
      onFinally: onFinally,
    }: {
      activityId: string
      tabId: string
      quizId: string
      time_spent?: number
      then?: (e: any) => void
      onError?: (e: any) => void
      onFinally?: () => void
    }) => {
      if (activeQuestion) {
        let myAnswers = handleGetAnswer(activeQuestion)

        DragDropRef?.current?.handleReset()
        try {
          dispatch(
            confirmQuestion({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: activeQuestion?.id || '',
              myAnswers: myAnswers,
              time_spent: time_spent,
            }),
          )
            .unwrap()
            .then((e: any) => {
              then && then(e)
            })
            .catch((e) => {
              toast.error('Có lỗi xảy ra xin vui lòng thử lại!')
              onError && onError(e)
            })
        } catch (error) {
          toast.error('Có lỗi xảy ra xin vui lòng thử lại!')
          onError && onError(error)
        } finally {
          onFinally && onFinally()
        }
      }
    }

    const handleSaveFileEssay = (
      file: any,
      question_id: string,
      topic_id: string,
      requirement_id: string,
    ) => {
      try {
        dispatch(
          saveFileEssay({
            activityId,
            tabId,
            quizId,
            question_id: question_id,
            file: file,
            topic_id: topic_id,
            requirement_id,
            requirements: activeQuestion?.requirements?.map((item: any) => {
              if (item?.id === showRequirement?.id) {
                return {
                  ...item,
                  answer_file: {
                    file_key: file.file_key,
                    file_name: file.name,
                  },
                }
              }
              return item
            }),
          }),
        )
        setIsUploadFile(true)
      } catch (error) {
        toast.error('Có lỗi xảy ra xin vui lòng thử lại!')
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
              corrects={showCorrect ? activeQuestion?.corrects : undefined}
              setValue={setValue}
              setOpenFile={setOpenFile}
              name={`${activeQuestion?.id}_${document_id}_answer`}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              isShowWarning={
                !watch(`${activeQuestion?.id}_${document_id}_answer`)
              }
              explainClassname="!mt-8 !p-0 !bg-transparent"
            />
          )

        case QUESTION_TYPES.MULTIPLE_CHOICE:
          return (
            <MultiChoiceQuestion
              data={activeQuestion}
              control={controlAnswer}
              corrects={showCorrect ? activeQuestion?.corrects : undefined}
              setValue={setValue}
              setOpenFile={setOpenFile}
              name={`${activeQuestion?.id}_${document_id}_answer`}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              isShowWarning={
                !(
                  watch(`${activeQuestion?.id}_${document_id}_answer`) &&
                  watch(`${activeQuestion?.id}_${document_id}_answer`).length >
                    0
                )
              }
              explainClassname="!mt-8 !p-0 !bg-transparent"
            />
          )

        case QUESTION_TYPES.MATCHING:
          return (
            <MatchQuizComponent
              data={activeQuestion}
              action={getAnswerMatching}
              defaultAnswer={activeQuestion?.defaultValue}
              corrects={showCorrect ? activeQuestion?.corrects : undefined}
              setOpenFile={setOpenFile}
              uuid={'_' + uuidv4().replaceAll('-', '_')}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              ref={MatchQuizRef}
              explainClassname="!mt-0 !p-0 !bg-transparent"
              correctAnswerClass="!mt-0 !pt-0"
            />
          )

        case QUESTION_TYPES.FILL_WORD:
          return (
            <AddWordPreview
              data={activeQuestion}
              action={getValueFillText}
              defaultAnswer={activeQuestion?.defaultValue}
              setOpenFile={setOpenFile}
              corrects={showCorrect ? activeQuestion?.corrects : undefined}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              explainClassname="!mt-8 !p-0 !bg-transparent"
              correctAnswerClass="!mt-8 !pt-0"
            />
          )

        case QUESTION_TYPES.DRAG_DROP:
          return (
            <DragNDropPreview
              data={activeQuestion}
              action={getAnswerDragNDrop}
              defaultAnswer={activeQuestion?.defaultValue}
              corrects={showCorrect ? activeQuestion?.corrects : undefined}
              resetDefaultAnswer={false}
              setOpenFile={setOpenFile}
              ref={DragDropRef}
              uuid={'_' + uuidv4().replaceAll('-', '_')}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              explainClassname="!mt-8 !p-0 !bg-transparent"
              correctAnswerClass="!mt-8 !pt-0"
            />
          )

        case QUESTION_TYPES.SELECT_WORD:
          return (
            <SelectWord
              data={activeQuestion}
              action={getValueSelectText}
              defaultAnswer={activeQuestion?.defaultValue}
              setOpenFile={setOpenFile}
              corrects={showCorrect ? activeQuestion.corrects : undefined}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              explainClassname="!mt-8 !p-0 !bg-transparent"
              correctAnswerClass="!mt-8 !pt-0"
            />
          )

        case QUESTION_TYPES.ESSAY:
          const items =
            activeQuestion?.requirements?.map((e, i: number) => {
              const hasAnswer = !!watch(
                `${activeQuestion?.id}_${activeQuestion?.requirements?.length && activeQuestion?.requirements?.length > 0 ? activeQuestion?.requirements?.[i]?.id : document_id}_essay`,
              )

              return {
                key: e?.id,
                label: (
                  <div className="learning-act-tab-label flex items-center gap-1 text-base font-normal capitalize">
                    {`Requirement ${i + 1}`}{' '}
                    {hasAnswer && (
                      <div className="text-primary">
                        <CircleCheckIcon />
                      </div>
                    )}
                  </div>
                ),
                children: (
                  <div className="mt-6">
                    <EssayQuestionPreview
                      className="!bg-transparent !p-0"
                      editorClassName="learning-act-editor"
                      explainClassname="!mt-8 !mb-0 !p-0 !bg-transparent"
                      defaultValue={
                        activeQuestion?.myAnswers?.find((ans: IEssayAnswer) => {
                          if (
                            ans.requirement_id ===
                            activeQuestion?.requirements?.[
                              essayData?.index ?? 0
                            ]?.id
                          ) {
                            return ans
                          }
                        })?.short_answer ??
                        activeQuestion?.myAnswers?.[0]?.short_answer ??
                        null
                      }
                      data={
                        activeQuestion?.requirements?.[essayData?.index ?? 0]
                      }
                      question_content={activeQuestion?.question_content}
                      index={essayData?.index}
                      question_data={activeQuestion}
                      control={controlAnswer}
                      setValue={setValue}
                      handleSaveHighLight={() => {}}
                      forCaseStudy={true}
                      name={`${activeQuestion?.id}_${activeQuestion?.requirements?.length && activeQuestion?.requirements?.length > 0 ? activeQuestion?.requirements?.[essayData?.index ?? 0]?.id : document_id}_essay`}
                      fullData={{
                        data: { ...activeQuestion },
                        solution: activeQuestion?.solution ?? '',
                      }}
                      openChooseFile={(e: any) =>
                        setOpenUpload({
                          status: true,
                          question_id: activeQuestion?.id,
                          requirement_id: showRequirement?.id,
                        })
                      }
                      handleClearFile={() => {
                        dispatch(
                          clearFileEssay({
                            activityId,
                            tabId,
                            quizId,
                            question_id: activeQuestion?.id,
                            requirement_id: showRequirement?.id,
                            requirements: activeQuestion?.requirements?.map(
                              (item: IRequirement) => {
                                if (item?.id === showRequirement?.id) {
                                  return { ...item, answer_file: null }
                                }
                                return item
                              },
                            ),
                          }),
                        )
                      }}
                      handleChange={() => {
                        !isChange && setIsChange(true)
                      }}
                      isShowContent={showQuestionContent}
                      externalRef={refEditor}
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
                      className="editor-wrap text-lg font-semibold"
                      text_editor_content={activeQuestion?.question_content}
                    />
                  </div>
                  {!!activeQuestion?.requirements?.length && (
                    <div className="mt-6 flex items-center gap-2 text-warning">
                      <CircleInfoIcon />
                      <div className="text-base font-normal">
                        You must finished{' '}
                        {activeQuestion?.requirements?.length || 0} requirements
                        to complete this question (Your answer is auto save)
                      </div>
                    </div>
                  )}
                </div>

                {!!activeQuestion?.requirements?.length ? (
                  <Tabs
                    className={clsx('learning-activity-tabs requirement-tab')}
                    items={items}
                    onChange={(key: string) => {
                      const optionIndex =
                        activeQuestion?.requirements?.findIndex(
                          (item: IRequirement) => item?.id === key,
                        )
                      if (optionIndex !== -1) {
                        const option =
                          activeQuestion?.requirements?.[optionIndex ?? 0]
                        handleShowRequirement({
                          id: key,
                          description: option?.description ?? '',
                          index: (optionIndex ?? 0) + 1,
                          name: option?.name ?? '',
                          files: option?.files ?? [],
                        })
                      }
                    }}
                  />
                ) : (
                  <div className="mt-6">
                    <EssayQuestionPreview
                      className="!bg-transparent"
                      editorClassName="learning-act-editor"
                      explainClassname="!mt-8 !mb-0 !p-0 !bg-transparent"
                      defaultValue={
                        activeQuestion?.myAnswers?.find((ans: IEssayAnswer) => {
                          if (
                            ans.requirement_id ===
                            activeQuestion?.requirements?.[
                              essayData?.index ?? 0
                            ]?.id
                          ) {
                            return ans
                          }
                        })?.short_answer ??
                        activeQuestion?.myAnswers?.[0]?.short_answer ??
                        null
                      }
                      data={
                        activeQuestion?.requirements?.[essayData?.index ?? 0]
                      }
                      question_content={activeQuestion?.question_content}
                      index={essayData?.index}
                      question_data={activeQuestion}
                      control={controlAnswer}
                      setValue={setValue}
                      handleSaveHighLight={() => {}}
                      forCaseStudy={true}
                      name={`${activeQuestion?.id}_${activeQuestion?.requirements?.length && activeQuestion?.requirements?.length > 0 ? activeQuestion?.requirements?.[essayData?.index ?? 0]?.id : document_id}_essay`}
                      fullData={{
                        data: { ...activeQuestion },
                        solution: activeQuestion?.solution ?? '',
                      }}
                      openChooseFile={(e: any) =>
                        setOpenUpload({
                          status: true,
                          question_id: activeQuestion?.id,
                          requirement_id: showRequirement?.id,
                        })
                      }
                      handleClearFile={() => {
                        dispatch(
                          clearFileEssay({
                            activityId,
                            tabId,
                            quizId,
                            question_id: activeQuestion?.id,
                            requirement_id: showRequirement?.id,
                            requirements: activeQuestion?.requirements?.map(
                              (item: IRequirement) => {
                                if (item?.id === showRequirement?.id) {
                                  return { ...item, answer_file: null }
                                }
                                return item
                              },
                            ),
                          }),
                        )
                      }}
                      handleChange={() => {
                        !isChange && setIsChange(true)
                      }}
                      isShowContent={showQuestionContent}
                      externalRef={refEditor}
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

    const handleDefaultRequirement = () => {
      const defaultRequirement = activeQuestion?.requirements?.[0]
      if (defaultRequirement?.id) {
        setShowRequirement({
          name: defaultRequirement?.name,
          id: defaultRequirement?.id,
          description: defaultRequirement?.description,
          files: defaultRequirement?.files,
          index: 1,
        })
      } else {
        setShowRequirement(null)
      }
    }

    const handleGetExhibit = () => {
      if (activeQuestion?.requirements) {
        setEssayData({
          req: activeQuestion?.requirements?.[0],
          index: 0,
        })
      }
      let exhibitOption = []

      if (
        activeQuestion?.exhibits?.length &&
        0 < activeQuestion?.exhibits?.length
      ) {
        exhibitOption.push(...activeQuestion?.exhibits)
      }

      if (activeQuestion?.question_topic?.exhibits?.length) {
        exhibitOption?.push(...activeQuestion?.question_topic?.exhibits)
      }

      setExhibitData(exhibitOption)
    }
    useEffect(() => {
      handleDefaultRequirement()
      handleGetExhibit()
      if (activeQuestion?.response_option === RESPONSE_OPTION.WORD) {
        refEditor?.current?.reset()
      }
      if (
        activeQuestion?.qType === QUESTION_TYPES.ONE_CHOICE ||
        activeQuestion?.qType === QUESTION_TYPES.TRUE_FALSE ||
        activeQuestion?.qType === QUESTION_TYPES.MULTIPLE_CHOICE ||
        activeQuestion?.qType === QUESTION_TYPES.ESSAY
      ) {
        handleResponseResults()
      }
    }, [activeQuestion?.id])

    return (
      <div>
        <div ref={questionRef}>
          {activeQuestion?.question_topic?.description && (
            <HighlightableHTML
              initialHTML={activeQuestion?.question_topic?.description ?? ''}
              storageKey={`${activityId}-${tabId}-${quizId}-question-topic-${activeQuestion?.id}`}
              className="sapp-questions"
            />
          )}

          {activeQuestion?.question_topic?.description && (
            <Divider className="my-8" />
          )}
          <div className="relative">
            {renderQuestion()}

            {activeQuestion?.question_topic?.files?.length > 0 && (
              <Popover
                className=""
                placement="leftTop"
                trigger="click"
                content={
                  <div className="flex flex-col gap-2">
                    {activeQuestion?.question_topic?.files?.map(
                      (e: any, index: number) => {
                        return (
                          <div
                            className={clsx(
                              `flex items-start justify-between gap-8 p-2`,
                            )}
                            key={e?.value}
                          >
                            <div
                              key={e?.value}
                              className={clsx(
                                'text-blue-7 min-w-36 max-w-96 cursor-pointer overflow-hidden text-ellipsis text-nowrap underline hover:text-primary',
                              )}
                              onClick={() => {
                                setOpenFile &&
                                  setOpenFile(
                                    { type: 'file' },
                                    e?.resource?.url,
                                    e?.resource?.name,
                                  )
                              }}
                            >
                              {e?.resource?.name}
                            </div>
                            <div
                              className="cursor-pointer text-white"
                              onClick={() => {
                                download(
                                  e?.resource?.name,
                                  e?.resource?.file_key,
                                )
                              }}
                            >
                              <DownloadIcon color="currentColor" />
                            </div>
                          </div>
                        )
                      },
                    )}
                  </div>
                }
              >
                <div
                  className={clsx(
                    'group absolute right-0 top-[74px] z-10 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-icon hover:bg-blend-overlay',
                    {
                      '!top-[214px]':
                        activeQuestion?.qType === QUESTION_TYPES.ESSAY &&
                        !!activeQuestion?.requirements?.length,
                    },
                  )}
                >
                  <FileTextIcon />
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-20" />
                </div>
              </Popover>
            )}
            {exhibitData && exhibitData?.length > 0 && (
              <Popover
                placement="leftTop"
                trigger="click"
                content={
                  <div className="flex flex-col gap-2">
                    {exhibitData?.map((e: any, index: number) => {
                      return (
                        <div
                          key={e?.value}
                          className={clsx(
                            'min-w-36 cursor-pointer rounded-md p-2 text-center hover:bg-secondary-800',
                          )}
                          onClick={(event) => {
                            setShowWarning(false)
                            setOpenFile &&
                              setOpenFile(
                                {
                                  type: 'exhibits',
                                  description: e?.description,
                                  name: e?.name,
                                  index: index,
                                  files: e?.files,
                                },
                                null,
                                null,
                                event,
                              )
                          }}
                        >
                          {exhibitText} {index + 1}
                        </div>
                      )
                    })}
                  </div>
                }
              >
                <div
                  className={clsx(
                    'group absolute right-0 top-[12px] z-10 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary shadow-icon hover:bg-blend-overlay',
                    {
                      '!top-[142px]':
                        activeQuestion?.qType === QUESTION_TYPES.ESSAY &&
                        !!activeQuestion?.requirements?.length,
                    },
                  )}
                >
                  <NotesOutline className="h-8 w-8" />
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-20" />
                  {showWarning && (
                    <PulsingExclamation
                      className="absolute -right-3 -top-4"
                      style={{
                        animation: 'pulseAnim 1.2s infinite ease-in-out',
                        transformOrigin: 'center',
                      }}
                    />
                  )}
                </div>
              </Popover>
            )}
          </div>
        </div>

        {openUpload.status && (
          <ModalUploadFile
            open={openUpload.status}
            isMultiple={false}
            handleClose={() => {
              setOpenUpload({
                status: false,
                question_id: undefined,
                requirement_id: undefined,
              })
            }}
            overlayClass="!h-screen"
            className="!overflow-auto"
            fileType={'ESSAY'}
            location={`question-answer/${openUpload.question_id}`}
            setSelectedFile={(e: any) =>
              handleSaveFileEssay(
                e?.[0],
                openUpload?.question_id ?? '',
                '',
                showRequirement?.id ?? '',
              )
            }
          />
        )}
      </div>
    )
  },
)

QuizComponent.displayName = 'QuizComponent'
export default QuizComponent
