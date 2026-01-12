import {
  CalculatorIconV2,
  DownloadIcon,
  FileTextIcon,
  FlagIcon,
  ResizeIcon,
  ScratchPadIconV2,
  ShowLessIcon,
  ShowMoreIcon,
} from '@lms/assets'
import {
  CourseProvider,
  disableUnsavedChange,
  loginSlice,
  useAppDispatch,
  useAppSelector,
  useCourseContext,
} from '@lms/contexts'
import {
  DISPLAY_TYPE,
  EXHIBIT_TEXT_REPLACE,
  GRADING_METHOD,
  IExhibit,
  PROGRAM,
  QUESTION_TYPES,
  RESPONSE_OPTION,
  TEST_TYPE,
} from '@lms/core'
import {
  QuitTestModal,
  TestTimeOutModal,
  UnSubmitAnswerModal,
} from '@lms/feature-test'
import {
  BackToTop,
  EssayQuestionPreview,
  FilterRadioGroup,
  Layout,
  MultiChoiceQuestion,
  NewFillText,
  OneChoiceQuestion,
  Popover,
  SappLoading,
  SelectWord,
  useClickOutside,
} from '@lms/ui'
import { cloneDeep, debounce, isEmpty, isUndefined, uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import LimitQuizModal from './limitQuizModal'
import styles from './test.module.scss'

import {
  removeHighlights,
  serializeHighlights,
} from '@funktechno/texthighlighter/lib'
import {
  CheckCircleOutlineYellow,
  FlagIconV2,
  Icon,
  NotesOutline,
  PulsingExclamation,
} from '@lms/assets'
import { showPopupCompletedCourse } from '@lms/contexts'
import {
  Answer,
  AnswerItem,
  AnswerList,
  DEFAULT_EDITOR_VALUE,
  defaultSheetData,
  DragDropAnswerItem,
  GradingPreference,
  IDataQuestion,
  IQuestion,
  IRequirement,
  Requirement,
  RequirementItem,
  ScratchPad,
  ScratchPadValue,
} from '@lms/core'
import {
  ButtonContent,
  ConFirmSubmit,
  ResetToAnswerTemplateModal,
  ShowAnswerTemplate,
} from '@lms/feature-courses'
import { RequirementsTab, TabSlide } from '@lms/feature-test'
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
  ButtonTextV2,
  HighlightableHTML,
  MatchQuizComponent,
  ModalUploadFile,
  NewDragNDropQuestion,
  SlotValue,
  TestWrapper,
} from '@lms/ui'
import {
  checkSheetAnswered,
  handleMultipleCorrectAnswer,
  runHighlight,
  trackGAEvent,
} from '@lms/utils'
import { EventTestAPI } from '@pages/api/event-test'
import { TestServiceAPI } from '@pages/api/test-api'
import { TabsProps, Tooltip } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { PageLink } from 'src/constants/routers'
import {
  checkTypeAndRenderTitle,
  hasEditorValueFromHtml,
  isValuesEqual,
  isWorkbookEmpty,
} from '../../utils/helpers/quiz-test/helper'
import SuccessSubmittedConstructorModal from './SuccessSubmittedConstructorModal'
import TestScratchPads from './TestScratchPads'
import useGetQuestionTabs from './custom-hook/useGetQuestionTabs'
import useGetQuizDetail from './custom-hook/useGetQuizDetail'
declare global {
  interface Window {
    userAgreed: any
  }
}
interface Tab {
  id: string
  flag?: boolean
  is_viewed_answer?: boolean
  [key: string]: any
}
const warningText = 'Are you sure you want to leave this page?'
const TestDetail = () => {
  const [, setHasScrollBar] = useState(undefined) as any
  const [editorReady, setEditorReady] = useState(true)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const answerListRef = useRef<AnswerList>({})
  const { courseType, setSubmitEventTest } = useCourseContext()
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { quizDetail } = useGetQuizDetail(router.query.id as string)
  const { questions } = useGetQuestionTabs(router.query.id as string)
  const type = router.query.type
  const [currentPage, setCurrentPage] = useState<any>(questions?.[0]?.id)
  const { control, watch, getValues, setValue, resetField } = useForm()
  const { control: controlFilter, watch: watchFilter } = useForm()
  const {
    getValues: getValuesExhibits,
    setValue: setValueExhibits,
    watch: watchExhibits,
  } = useForm()
  const timeRef = useRef(null) as any
  const ref = useRef(null) as any
  const refEditor = useRef(null) as any
  const currentTabIdRef = useRef(null)
  const dispatch = useAppDispatch()
  const [essayData, setEssayData] = useState<any>()
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [tabs, setTabs] = useState<any>([])
  const [showListRequirement, setShowLisRequirement] = useState(false)
  const [allowHighLight, setAllowHighLight] = useState(false)
  const [allowUnHighLight, setAllowUnHighLight] = useState(false)
  const [exhibitData, setExhibitData] = useState<IExhibit[]>()
  const [routeBack, setRouteBack] = useState(false)
  const [isQuizAttemptCreated, setIsQuizAttemptCreated] = useState(false)
  const dropUpRequire = useRef(null)
  const [startTime, setStartTime] = useState(Date.now())
  const [activeShowAll, setActiveShowAll] = useState<boolean>(false)
  const [submited, setSubmited] = useState(false)
  const [openTimeOut, setOpenTimeOut] = useState(false)
  const [QuizResultId, setQuizResultId] = useState('')
  const [openSubmit, setOpenSubmit] = useState(false)
  const [openQuit, setOpenQuit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openLimit, setOpenLimit] = useState(false)
  const [openUpload, setOpenUpload] = useState<any>({})
  const [startResize, setStartResize] = useState(false)
  const [currentMousePos, setCurrentMousePos] = useState(0)
  const [leftWidth, setLeftWidth] = useState(0)
  const [currentLeftWidth, setCurrentLeftWidth] = useState(0)
  const { unsavedChange } = useAppSelector((state) => state.loginReducer)
  const rightSideRef = useRef<any>(null)
  const [mousePosition, setMousePosition] = useState<{
    x: number | null
    y: number | null
  }>({ x: null, y: null })
  const [openUnSubmitAnswer, setUnSubmitAnswer] = useState(false)
  const [unSubmitAnswerData, setUnSubmitAnswerData] = useState<Array<number>>(
    [],
  )
  const [exhibitText, setExhibitText] = useState<string>('')
  const [isClickExhibitOpen, setIsClickExhibitOpen] = useState(false)

  const [openReportModal, setOpenReportModal] = useState({
    open: false,
    resultId: '',
  })
  const [oldCurrentTabData, setOldCurrentTabData] = useState<any>()
  const [scratchPadValues, setScratchPadValues] = useState<ScratchPadValue[]>(
    [],
  )
  // const [, setScoreFinalTest] = useState(0)
  const [scratchPads, setScratchPads] = useState<string>('')
  // const [listQuestionDone, setListQuestionDone] = useState<string[]>([])
  const [listSubmitError, setListSubmitError] = useState<
    Array<{
      question_id: string
      total_attempt_time: number
      scratch_pads: ScratchPad[]
      [key: string]: any
    }>
  >([])
  const [answersSubmitted, setAnswersSubmitted] = useState<any>([])
  const [openResetToTemplateModal, setOpenResetToTemplateModal] =
    useState(false)
  const quizAttempt = JSON.parse(localStorage.getItem('quizAttempt') || '{}')
  const onOpenResetToTemplateModal = () => {
    setOpenResetToTemplateModal(true)
  }
  const onCloseResetToTemplateModal = () => {
    setOpenResetToTemplateModal(false)
  }
  const [showWarning, setShowWarning] = useState(true)
  const [filteredTabs, setFilterTabs] = useState<any[]>([])
  const [trigger, setTrigger] = useState(false)

  // Tính toán số câu trên mỗi dòng dựa trên chiều rộng màn hình (responsive)
  const [windowWidth, setWindowWidth] = useState(0)
  const MAX_ITEMS_PER_ROW = 25
  const MIN_ITEMS_PER_ROW = 14
  const ITEM_WIDTH = 38 // Ước tính chiều rộng mỗi item (bao gồm gap)
  const GAP_WIDTH = 8 // Gap giữa các item

  const numberDisplayData = useMemo(() => {
    if (windowWidth === 0) return MAX_ITEMS_PER_ROW

    // Tính toán số câu có thể hiển thị trên 1 dòng
    const extraWidth = 430 // Chiều rộng của các btn 2 bên
    const availableWidth = windowWidth - 200 - extraWidth
    const itemsPerRow = Math.floor(availableWidth / (ITEM_WIDTH + GAP_WIDTH))

    // Giới hạn trong khoảng MIN_ITEMS_PER_ROW đến MAX_ITEMS_PER_ROW
    return Math.max(MIN_ITEMS_PER_ROW, Math.min(MAX_ITEMS_PER_ROW, itemsPerRow))
  }, [windowWidth])

  // Theo dõi chiều rộng màn hình
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }

    // Cập nhật ngay lập tức
    updateWindowWidth()

    // Thêm window resize listener
    window.addEventListener('resize', updateWindowWidth)

    return () => {
      window.removeEventListener('resize', updateWindowWidth)
    }
  }, [])

  useClickOutside({
    ref: dropUpRequire,
    callback: () => setShowLisRequirement(false),
  })

  const currentTabContent = useMemo(() => {
    if (tabs && tabs.length > 0) {
      const answerSubmitted = answersSubmitted.find(
        (e: any) => e.questionId === currentPage,
      )
      const objTab = tabs.find((e: any) => e.id === currentPage)
      const index = scratchPadValues?.findIndex(
        (item: ScratchPadValue) => item.id === currentPage,
      )

      if (!index || index === -1) {
        setScratchPadValues((prevScratchPads: ScratchPadValue[]) => [
          ...prevScratchPads,
          {
            id: currentPage,
            value: '',
          },
        ])
      }

      setScratchPads(answerSubmitted?.scratch_pad || '')

      if (answerSubmitted) {
        const getCorrectAndSolution = (
          currentTabContent: any,
          answerSubmitted: any,
        ): {
          corrects: any
          solution: any
          isSelfReflection: boolean
          requirements: any[]
        } => {
          if (!answerSubmitted?.[0]) {
            return {
              corrects: {},
              solution: '',
              isSelfReflection: false,
              requirements: [],
            }
          }

          const {
            answers,
            question_matchings,
            solution,
            is_self_reflection,
            requirements,
            drag_drop_answers,
          } = answerSubmitted?.[0]

          // Handle different question types
          if (
            [
              QUESTION_TYPES.ONE_CHOICE,
              QUESTION_TYPES.TRUE_FALSE,
              QUESTION_TYPES.MULTIPLE_CHOICE,
            ].includes(currentTabContent.qType)
          ) {
            return {
              corrects:
                answers?.reduce(
                  (acc: { [key: string]: boolean }, curr: any) => ({
                    ...acc,
                    [curr.id]: curr.is_correct,
                  }),
                  {},
                ) || {},
              solution,
              isSelfReflection: is_self_reflection || false,
              requirements: requirements || [],
            }
          }

          if (
            [QUESTION_TYPES.FILL_WORD, QUESTION_TYPES.SELECT_WORD].includes(
              currentTabContent.qType,
            )
          ) {
            return {
              corrects: { corrects: answers || [] },
              solution,
              isSelfReflection: is_self_reflection || false,
              requirements: requirements || [],
            }
          }

          if (currentTabContent.qType === QUESTION_TYPES.MATCHING) {
            return {
              corrects: { corrects: question_matchings || [] },
              solution,
              isSelfReflection: is_self_reflection || false,
              requirements: requirements || [],
            }
          }

          if (currentTabContent.qType === QUESTION_TYPES.DRAG_DROP) {
            const answersTemp = (answers || []).sort(
              (
                a: { answer_position: number },
                b: { answer_position: number },
              ) => a?.answer_position - b?.answer_position,
            )

            return {
              corrects: {
                corrects: handleMultipleCorrectAnswer(
                  drag_drop_answers,
                  answersTemp,
                ),
              },
              solution,
              isSelfReflection: is_self_reflection || false,
              requirements: requirements || [],
            }
          }

          return {
            corrects: {},
            solution: solution,
            isSelfReflection: is_self_reflection,
            requirements: requirements,
          }
        }

        const dataCorrectAndSolution = getCorrectAndSolution(
          objTab,
          answerSubmitted?.results,
        )
        const updatedObjTab = answerSubmitted?.results
          ? { ...objTab, ...dataCorrectAndSolution }
          : { ...objTab }

        if (objTab?.data?.qType === QUESTION_TYPES.ESSAY) {
          // Case: if objTab has data
          if (essayData) {
            if ((objTab?.data?.requirements ?? []).length > 0) {
              const requirementAmswer = (objTab?.data?.requirements ?? []).find(
                (req: Requirement) => req?.id === essayData?.req?.id,
              )
              if (
                requirementAmswer &&
                requirementAmswer?.answer_text &&
                requirementAmswer?.answer_file
              ) {
                return {
                  ...objTab,
                  // ...requirementAmswer,
                  // done: true,
                  attempted: true,
                }
              } else {
                return {
                  ...objTab,
                  data: {
                    ...objTab?.data,
                    requirements: (objTab?.data?.requirements ?? []).map(
                      (req: any) => {
                        const requirementData = (
                          answerSubmitted?.answers ?? []
                        ).find(
                          (r: RequirementItem) => r.requirement_id === req?.id,
                        )

                        return {
                          ...req,
                          answer_file:
                            req?.answer_file !== undefined
                              ? req?.answer_file
                              : requirementData?.answer_file,
                          short_answer:
                            req?.short_answer !== undefined &&
                            req?.short_answer !== null
                              ? req?.short_answer
                              : requirementData?.short_answer,
                          answer_text:
                            req?.answer_text !== undefined &&
                            req?.answer_text !== null
                              ? req?.answer_text
                              : requirementData?.short_answer,
                        }
                      },
                    ),
                  },
                  // done: true,
                  attempted: true,
                  answer: null,
                }
              }
            } else {
              // No requirement
              return {
                ...updatedObjTab,
                // ...requirementAmswer,
                // done: true,
                answer:
                  updatedObjTab?.answer !== undefined &&
                  updatedObjTab?.answer !== null
                    ? updatedObjTab?.answer
                    : answerSubmitted?.short_answer,

                answer_file:
                  updatedObjTab?.answer_file !== undefined
                    ? updatedObjTab?.answer_file
                    : answerSubmitted?.answer_file,

                attempted: true,
              }
            }
          }
          // Case: objTab no data
          else {
            if ((updatedObjTab?.data?.requirements ?? []).length > 0) {
              // & answerSubmitted has data
              if (answerSubmitted?.answer) {
                return {
                  ...updatedObjTab,
                  data: {
                    ...updatedObjTab?.data,
                    requirements: (updatedObjTab?.data?.requirements ?? []).map(
                      (req: Requirement) => {
                        const requirementAmswer = (
                          answerSubmitted?.answers ?? []
                        ).find(
                          (r: RequirementItem) => r.requirement_id === req?.id,
                        )
                        return {
                          ...req,
                          answer_file: requirementAmswer?.answer_file,
                          short_answer: requirementAmswer?.short_answer,
                          answer_text: requirementAmswer?.short_answer,
                        }
                      },
                    ),
                  },
                  // done: true,

                  attempted: true,
                  answer: null,
                }
              }

              // & answerSubmitted no data
              else {
                return {
                  ...objTab,
                  // done: true,
                  attempted: true,
                  answer: null,
                }
              }
            } else {
              return {
                ...updatedObjTab,
                // done: true,
                attempted: true,
                answer: answerSubmitted?.short_answer,
                answer_file: answerSubmitted?.answer_file,
              }
            }
          }
        }

        if (
          objTab?.data?.qType === QUESTION_TYPES.ONE_CHOICE ||
          objTab?.data?.qType === QUESTION_TYPES.TRUE_FALSE
        ) {
          // Case: if objTab has data
          if (updatedObjTab?.question_answer_id) {
            return {
              ...updatedObjTab,
              // done: true,
              attempted: true,
              answer: objTab?.question_answer_id,
            }
          } else if (objTab?.answer) {
            return updatedObjTab
          }
          // Case: objTab no data and answerSubmitted has data
          else if (answerSubmitted?.question_answer_id) {
            return {
              ...updatedObjTab,
              // done: true,
              attempted: true,
              answer: answerSubmitted?.question_answer_id,
            }
          } else {
            return updatedObjTab
          }
        }

        const listAnswers =
          objTab?.answer && objTab?.answer.length > 0
            ? objTab?.answer
            : answerSubmitted?.answer && answerSubmitted?.answer.length > 0
              ? answerSubmitted?.answer
              : []
        const transformAnswerData = listAnswers.map(
          (answer: AnswerItem | string, index: number) => {
            let savedData: AnswerItem | undefined
            let currentAnswer: string | undefined
            let currentQuestion: string | undefined
            if (typeof answer === 'string') {
              savedData =
                answersSubmitted.answer && answersSubmitted?.answer.length > 0
                  ? answersSubmitted.answer.find(
                      (item: AnswerItem) => item.question_id === objTab.id,
                    )
                  : undefined

              currentAnswer = answer
              currentQuestion = objTab.id
            } else {
              savedData =
                answersSubmitted.answer && answersSubmitted?.answer.length > 0
                  ? answersSubmitted.answer.find(
                      (item: AnswerItem) =>
                        item.question_id === answer.question_id,
                    )
                  : undefined

              currentAnswer = answer.answer_id ?? savedData?.answer_id
              currentQuestion = answer.question_id ?? savedData?.question_id
            }

            if (objTab?.data?.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
              return currentAnswer
            } else if (objTab?.data?.qType === QUESTION_TYPES.MATCHING) {
              return {
                answer_id: currentAnswer,
                question_id: currentQuestion,
              }
            } else if (
              objTab?.data?.qType === QUESTION_TYPES.DRAG_DROP &&
              typeof answer !== 'string'
            ) {
              let objAnswer: DragDropAnswerItem | undefined
              const savedData = answer
              // Case: Tab has answer
              if (
                objTab?.data?.answers &&
                objTab?.data?.answers.length > 0 &&
                objTab?.answer &&
                objTab?.answer.length > 0
              ) {
                const hasCurrentAnswer = objTab?.data?.answers.some(
                  (it: any) => it.id === answer.idAnswer,
                )
                if (hasCurrentAnswer) {
                  objAnswer = answer
                } else {
                  objAnswer = {
                    id: answer?.id ?? '',
                    idAnswer: undefined,
                    value: '',
                    position: savedData?.answer_position,
                  }
                }
              }

              // Case: Tab no answer
              // & has savedData answer
              else if (savedData) {
                const currentAnswer = (objTab?.data?.answers ?? []).find(
                  (el: any) => el.id === savedData?.answer_id,
                )
                objAnswer = {
                  idAnswer: savedData?.answer_id,
                  value: currentAnswer?.answer,
                  position: savedData?.answer_position,
                }
              }

              // Case: Tab no answer
              // & no savedData answer
              else {
                const currentAnswer = (objTab?.data?.answers ?? []).find(
                  (el: any) => el.id === objTab?.data?.answers[0].id,
                )

                objAnswer = {
                  id: currentAnswer?.dropId,
                  idAnswer: undefined,
                  value: '',
                  position: 0,
                }
              }
              return objAnswer
            } else if (objTab?.data?.qType === QUESTION_TYPES.SELECT_WORD) {
              return answer
            } else if (objTab?.data?.qType === QUESTION_TYPES.FILL_WORD) {
              const savedData: AnswerItem =
                answersSubmitted.answer && answersSubmitted?.answer.length > 0
                  ? answersSubmitted.answer.at(index)
                  : undefined

              currentAnswer =
                typeof answer !== 'string'
                  ? (answer.answer_text ?? savedData?.answer_text)
                  : answer
              return currentAnswer
            }
          },
        )

        if (transformAnswerData?.length > 0) {
          return {
            ...updatedObjTab,
            answer: transformAnswerData,
            // done: true,
          }
        } else {
          return updatedObjTab
        }
      } else {
        if (objTab?.data?.qType === QUESTION_TYPES.DRAG_DROP) {
          return {
            ...objTab,
            corrects: {
              corrects: handleMultipleCorrectAnswer(
                objTab?.data?.drag_drop_answers,
                objTab?.corrects?.corrects,
              ),
            },
          }
        }
        return objTab
      }
    } else return undefined
  }, [currentPage, tabs, answersSubmitted, essayData])

  const remainingTimeinSeconds = quizDetail?.quiz_timed
    ? (dayjs(
        dayjs(new Date(quizAttempt.created_at ?? '')).add(
          quizDetail?.quiz_timed,
          'minutes',
        ),
      ).diff(dayjs(), 'seconds') ?? 0)
    : null

  useEffect(() => {
    if (!openTimeOut && remainingTimeinSeconds && remainingTimeinSeconds <= 0) {
      setOpenTimeOut(true)
    }
  }, [openTimeOut, remainingTimeinSeconds])

  const isShowIconButtonInBottom = [
    QUESTION_TYPES.FILL_WORD,
    QUESTION_TYPES.TRUE_FALSE,
    QUESTION_TYPES.ONE_CHOICE,
    QUESTION_TYPES.SELECT_WORD,
  ].includes(currentTabContent?.topicDescription?.qType as QUESTION_TYPES)

  useEffect(() => {
    if (currentTabContent?.id) {
      const oldCurrentTabData = cloneDeep(currentTabContent)
      setOldCurrentTabData(oldCurrentTabData)
      setExhibitText(
        currentTabContent?.topicDescription?.course_category?.name ===
          PROGRAM.CMA
          ? EXHIBIT_TEXT_REPLACE.EXHIBIT_REPLACE
          : EXHIBIT_TEXT_REPLACE.EXHIBIT,
      )
    }
  }, [currentTabContent?.id])

  const checkCalExist = useMemo(() => {
    for (let i in openScratchPad) {
      if (openScratchPad[i].type === 'calculator') {
        return +i
      }
    }
    return -1
  }, [openScratchPad])

  const isScatchPadEnabled = useMemo(() => {
    return openScratchPad.some((item) => item.type === 'scratch_pad') || false
  }, [openScratchPad])

  const checkType = (
    data: any,
    type: string,
    currentTabID: string,
    defaultValue: any,
    corrects?: any,
    highlighted?: any,
    solution?: any,
    done?: boolean,
  ) => {
    const handleEssayChange = (id: string) => {
      setAnswerListValue(id as unknown as number)
    }
    const storageKey = `${router.query.id}-${currentTabContent?.data?.qType}-question-${currentTabContent?.id}`

    const essayRequirementsItem = (): TabsProps['items'] => {
      return (
        currentTabContent?.data?.requirements?.map(
          (requirement: any, index: number) => {
            const hasAnswer =
              currentTabContent?.data?.response_option === RESPONSE_OPTION.SHEET
                ? checkSheetAnswered(
                    getValues(`${currentTabID}_${index}_answer`),
                  )
                : hasEditorValueFromHtml(
                    getValues(`${currentTabID}_${index}_answer`),
                  )
            const key = `${currentTabID}_${index}_answer`
            const getDefaultValueEssay = () => {
              const valueFromForm = getValues(key)
              const response_option = currentTabContent?.data?.response_option
              switch (response_option) {
                case RESPONSE_OPTION.WORD:
                  if (valueFromForm !== undefined && valueFromForm !== null) {
                    return valueFromForm
                  }

                  if (requirement?.short_answer) {
                    return requirement.short_answer
                  }
                  if (requirement?.answer_text) {
                    return requirement.answer_text
                  }
                  if (requirement?.answer_template) {
                    return requirement.answer_template
                  }
                  if (currentTabContent.answer) {
                    return currentTabContent.answer
                  }

                  return currentTabContent?.data?.answer_template

                case RESPONSE_OPTION.SHEET:
                  const valueFromSheetForm = getValues(key)
                  if (valueFromSheetForm) {
                    const isEmptyWorkbook = isWorkbookEmpty(
                      JSON.parse(valueFromSheetForm),
                    )

                    if (isEmptyWorkbook) {
                      if (requirement?.short_answer) {
                        return requirement.short_answer
                      }
                      if (requirement?.answer_text) {
                        return requirement.answer_text
                      }
                      if (requirement?.answer_template) {
                        return requirement.answer_template || defaultSheetData
                      }
                      if (currentTabContent.answer)
                        return currentTabContent.answer
                      return (
                        currentTabContent?.data?.answer_template ||
                        defaultSheetData
                      )
                    }
                    return valueFromSheetForm
                  }
                  const requirementSheet =
                    currentTabContent?.data?.requirements?.[essayData?.index]
                  if (requirementSheet?.short_answer) {
                    return requirementSheet.short_answer
                  }
                  if (requirementSheet?.answer_text) {
                    return requirementSheet.answer_text
                  }
                  if (requirementSheet?.answer_template) {
                    return requirementSheet.answer_template || defaultSheetData
                  }
                  if (currentTabContent.answer) return currentTabContent.answer
                  return (
                    currentTabContent?.data?.answer_template || defaultSheetData
                  )
                // return getCurrentDefaultSheetValue
              }
            }
            return {
              label: (
                <span className="flex items-center gap-1 text-base font-normal">
                  Requirement {index + 1}
                  {hasAnswer && (
                    <CheckCircleOutlineYellow className="text-primary" />
                  )}
                </span>
              ),
              key: index,
              children: (
                <>
                  {editorReady && (
                    <EssayQuestionPreview
                      data={{
                        ...currentTabContent?.data?.requirements?.[index],
                        ...essayData?.req,
                      }}
                      question_content={
                        currentTabContent?.data?.question_content
                      }
                      index={index}
                      question_data={currentTabContent?.data}
                      control={control}
                      handleSaveHighLight={handleSaveHighLight}
                      highlighted={highlighted}
                      removeHighlight={removeHighlight}
                      allowHighLight={allowHighLight}
                      allowUnHighLight={allowUnHighLight}
                      solution={solution}
                      name={`${currentTabID}_${index}_answer`}
                      setValue={setValue}
                      defaultValue={getDefaultValueEssay()}
                      response_option_custom={currentTabContent.response_type}
                      externalRef={refEditor}
                      fullData={currentTabContent}
                      isShowContent={false}
                      openChooseFile={() =>
                        setOpenUpload({
                          status: true,
                          question_id: currentPage,
                          requirementIndex: index,
                        })
                      }
                      handleClearFile={handleClearFile}
                      setOpenPdf={handleOpenScratchPad}
                      handleSaveHighLightRequirement={
                        handleSaveHighLightRequirement
                      }
                      showRequiment={showListRequirement}
                      handleChange={handleEssayChange}
                      explainClassname="!mt-8 !p-0 !bg-transparent"
                      storageKey={storageKey}
                    />
                  )}
                </>
              ),
            }
          },
        ) ?? []
      )
    }

    switch (type) {
      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <OneChoiceQuestion
            data={data}
            control={control}
            name={`${currentTabID}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            corrects={corrects}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            solution={solution}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            storageKey={storageKey}
          />
        )
      case QUESTION_TYPES.ONE_CHOICE:
        return (
          <OneChoiceQuestion
            data={data}
            control={control}
            name={`${currentTabID}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            corrects={corrects}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            solution={solution}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            storageKey={storageKey}
          />
        )
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <MultiChoiceQuestion
            data={data}
            control={control}
            name={`${currentTabID}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            corrects={corrects}
            solution={solution}
            getValue={getValues}
            tabs={tabs}
            currentPage={currentPage}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            storageKey={storageKey}
          />
        )
      case QUESTION_TYPES.MATCHING:
        return (
          <MatchQuizComponent
            onChangeMatchedPairs={(pairs) =>
              setValue(`${currentTabID}_answer`, pairs)
            }
            data={data}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            done={done}
            corrects={corrects?.corrects}
            solution={solution}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            storageKey={storageKey}
          />
        )
      case QUESTION_TYPES.FILL_WORD:
        return (
          <NewFillText
            control={control}
            name={`${currentTabID}_fillword`}
            data={data}
            setValue={setValue}
            action={getValueFillText}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            ref={ref}
            solution={solution}
            watch={watch}
            explainClassname="!mt-8 !p-0 !bg-transparent"
            storageKey={storageKey}
          />
        )
      case QUESTION_TYPES.DRAG_DROP:
        return (
          <NewDragNDropQuestion
            data={data}
            defaultValue={defaultValue}
            onChange={(data: SlotValue[]) => {
              setValue(`${currentTabID}_drag_drop_answer`, data)
            }}
            corrects={corrects?.corrects}
            solution={solution}
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
            ) => setValue(`${currentTabID}_answer`, value)}
            data={data}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            ref={ref}
            solution={solution}
          />
        )
      case QUESTION_TYPES.ESSAY:
        const key = `${currentTabID}_${essayData?.index}_answer`
        const handleEssayChange = (id: string) => {
          setAnswerListValue(id as unknown as number)
        }
        // Tạo data từng bước
        const part1 =
          currentTabContent?.data?.requirements?.[essayData?.index] || {}
        const part2 = essayData?.req || {}
        const dataEssay = { ...part1, ...part2 }
        const defaultValueEssay = () => {
          const valueFromForm = getValues(key)
          const response_option = currentTabContent?.data?.response_option

          switch (response_option) {
            case RESPONSE_OPTION.WORD:
              if (valueFromForm !== undefined && valueFromForm !== null) {
                return valueFromForm
              }
              const requirement =
                currentTabContent?.data?.requirements?.[essayData?.index]

              if (requirement?.short_answer) {
                return requirement.short_answer
              }
              if (requirement?.answer_text) {
                return requirement.answer_text
              }
              if (requirement?.answer_template) {
                return requirement.answer_template
              }
              if (currentTabContent.answer) {
                return currentTabContent.answer
              }

              return currentTabContent?.data?.answer_template

            case RESPONSE_OPTION.SHEET:
              const valueFromSheetForm = getValues(key)
              if (valueFromSheetForm) {
                const isEmptyWorkbook = isWorkbookEmpty(
                  JSON.parse(valueFromSheetForm),
                )

                if (isEmptyWorkbook) {
                  const requirement =
                    currentTabContent?.data?.requirements?.[essayData?.index]
                  if (requirement?.short_answer) {
                    return requirement.short_answer
                  }
                  if (requirement?.answer_text) {
                    return requirement.answer_text
                  }
                  if (requirement?.answer_template) {
                    return requirement.answer_template || defaultSheetData
                  }
                  if (currentTabContent.answer) return currentTabContent.answer
                  return (
                    currentTabContent?.data?.answer_template || defaultSheetData
                  )
                }
                return valueFromSheetForm
              }
              const requirementSheet =
                currentTabContent?.data?.requirements?.[essayData?.index]
              if (requirementSheet?.short_answer) {
                return requirementSheet.short_answer
              }
              if (requirementSheet?.answer_text) {
                return requirementSheet.answer_text
              }
              if (requirementSheet?.answer_template) {
                return requirementSheet.answer_template || defaultSheetData
              }
              if (currentTabContent.answer) return currentTabContent.answer
              return (
                currentTabContent?.data?.answer_template || defaultSheetData
              )
          }
        }
        return (
          <>
            <HighlightableHTML
              initialHTML={currentTabContent?.data?.question_content || ''}
              storageKey={
                storageKey ||
                `${router.query.id}-${currentTabContent?.data?.qType}-question-${currentTabContent?.id}`
              }
              className="sapp-questions sapp-editor-reader"
            />
            {/* <EditorReader
              className="sapp-questions sapp-editor-reader"
              text_editor_content={currentTabContent?.data?.question_content}
              highlighted={highlighted}
            /> */}
            {currentTabContent?.data?.requirements?.length > 0 ? (
              <RequirementsTab
                destroyInactiveTabPane={true}
                items={essayRequirementsItem()}
                activeKey={essayData?.index ?? '0'}
                defaultActiveKey="1"
                onChange={(key) => {
                  setEssayData({
                    req: getValues(`${currentTabID}_${key}_answer`),
                    index: key,
                  })
                  refEditor.current.reset()
                }}
              />
            ) : (
              <EssayQuestionPreview
                isShowContent={false}
                data={dataEssay}
                question_content={currentTabContent?.data?.question_content}
                index={essayData?.index}
                question_data={currentTabContent?.data}
                control={control}
                handleSaveHighLight={handleSaveHighLight}
                highlighted={highlighted}
                removeHighlight={removeHighlight}
                allowHighLight={allowHighLight}
                allowUnHighLight={allowUnHighLight}
                solution={solution}
                name={key}
                setValue={setValue}
                defaultValue={defaultValueEssay()}
                response_option_custom={currentTabContent.response_type}
                externalRef={refEditor}
                fullData={currentTabContent}
                openChooseFile={() =>
                  setOpenUpload({
                    status: true,
                    question_id: currentPage,
                    requirementIndex: essayData?.index,
                  })
                }
                handleClearFile={handleClearFile}
                setOpenPdf={handleOpenScratchPad}
                handleSaveHighLightRequirement={handleSaveHighLightRequirement}
                showRequiment={showListRequirement}
                handleChange={handleEssayChange}
                storageKey={storageKey}
              />
            )}
          </>
        )
      default:
        return <div></div>
    }
  }

  /**
   * DES: confirm unfinished questions before submitting
   */
  const checkUnSubmitAnswer = (): number[] => {
    const answers = handleSaveCurrentAnswer(tabs, currentTabContent)
    const result: number[] = []
    answers?.map((item: Answer, index: number) => {
      if (!item.attempted) {
        result.push(index + 1)
      } else {
        if (item.data && (item?.data?.requirements ?? [])?.length > 0) {
          if (!item.done && !validateEssayAnswerWithRequirement(item.data)) {
            result.push(index + 1)
          }
        } else {
          if (
            !item.done &&
            !validateAnswer({
              answer: item.answer,
              answer_file: item?.answer_file,
            })
          ) {
            result.push(index + 1)
          }
        }
      }
    })
    setUnSubmitAnswerData(result)
    return result
  }
  // Validate các câu hỏi xem đã trả lời chưa
  const validateAnswer = (item: {
    answer: string | Object[] | string[]
    answer_file?: { file_key?: string; file_name?: string }
  }) => {
    if (item?.answer_file?.file_key) return true
    if (typeof item?.answer === 'string' && !item?.answer) {
      return false
    }
    if (!item?.answer?.length) return false
    if (Array.isArray(item?.answer)) {
      const emptyAnswer = item?.answer?.filter(
        (el: { idAnswer?: string; answer_id?: string }) => {
          if (el.hasOwnProperty('idAnswer') && !el?.idAnswer) {
            return el
          }
          if (el.hasOwnProperty('answer_id') && !el?.answer_id) {
            return el
          }
        },
      )
      const emptyEl = item.answer.filter((el) => typeof el === 'string' && !el)
      if (emptyAnswer?.length || emptyEl.length) {
        return false
      }
    }
    return true
  }
  // validate essay question with requirement
  const validateEssayAnswerWithRequirement = (data: IDataQuestion) => {
    if (data?.requirements?.length > 0) {
      return data?.requirements?.some(
        (el: Requirement) => !!el?.answer_text || !!el?.answer_file?.file_key,
      )
    } else {
      return false
    }
  }
  const handleOpenScratchPad = (
    type: string,
    file?: string,
    fileName?: string,
  ) => {
    setOnFocusingPad('')
    setOpenScratchPad((prev) => {
      const arr = [...prev]
      if (type === 'scratch_pad') {
        if (isScatchPadEnabled) {
          return arr
        } else {
          arr.push({ id: currentPage, type: type })
        }
      } else if (type === 'calculator') {
        if (checkCalExist > -1) {
          const cal = { ...arr[checkCalExist] }
          arr.splice(checkCalExist, 1)
          arr.push(cal)
          return arr
        }
        arr.push({ id: 'calculator', type: 'calculator' })
      } else if (type === 'file') {
        arr.push({
          type: type,
          file: file,
          id: uniqueId('file'),
          fileName: fileName,
        })
      }
      return arr
    })
  }
  const handleCloseScratchPad = (pad: any) => {
    setOpenScratchPad((prev) => {
      const arr = [...prev]
      const newArr = arr.filter((e) => e.id !== pad.id)
      if (pad.type === 'exhibits') {
        setValueExhibits(
          'exhibits',
          getValuesExhibits('exhibits').filter((e: string) => e !== pad.id),
        )
      }
      return newArr
    })
  }
  function removeHighlight() {
    const domEle = document.getElementById('hightlight_area')
    removeHighlights(domEle as any)
    handleSaveHighLight(serializeHighlights(domEle))
  }
  const OptionShowAll = () => {
    return (
      <div className="w-max">
        <FilterRadioGroup
          control={controlFilter}
          name={'filter'}
          options={[
            { label: 'Unattempted', value: 'unattempted' },
            { label: 'Attempted', value: 'attempted' },
            { label: 'Flag to Review', value: 'flag' },
          ]}
        />
      </div>
    )
  }
  const checkAnswered = (currentContent: any, isSubmit = false) => {
    if (
      currentContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentContent.qType === QUESTION_TYPES.TRUE_FALSE ||
      currentContent.qType === QUESTION_TYPES.MATCHING
    ) {
      if (
        !isEmpty(getValues(`${currentContent?.id}_answer`)) &&
        getValues(`${currentContent?.id}_answer`)?.length > 0
      ) {
        return true
      }
      return false
    } else if (currentContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
      if (
        !isEmpty(getValues(`${currentContent?.id}_answer`)) &&
        getValues(`${currentContent?.id}_answer`)?.length > 0
      ) {
        return true
      }
      return false
    } else if (currentContent.qType === QUESTION_TYPES.DRAG_DROP) {
      if (getValues(`${currentContent?.id}_drag_drop_answer`)) {
        for (const e of getValues(`${currentContent?.id}_drag_drop_answer`)) {
          if (e?.idAnswer && e?.value !== '') {
            return true
          }
        }
      }

      return false
    } else if (currentContent.qType === QUESTION_TYPES.SELECT_WORD) {
      for (const e of getValueSelectText()) {
        if (e && e !== '') {
          return true
        }
      }

      return false
    } else if (currentContent.qType === QUESTION_TYPES.FILL_WORD) {
      if (
        getValues(`${currentContent?.id}_fillword`) &&
        getValues(`${currentContent?.id}_fillword`)?.length > 0
      ) {
        for (const e of getValues(`${currentContent?.id}_fillword`)) {
          if (e) {
            return true
          }
        }
        return false
      }
      return false
    } else if (currentContent?.qType === QUESTION_TYPES.ESSAY) {
      if (Array.isArray(currentContent.data?.requirements)) {
        for (const req of currentContent.data?.requirements) {
          if (
            req?.answer_file?.file_key ||
            answerListRef?.current?.[req?.id || '']
          ) {
            return true
          }
        }
      }
      if (currentContent?.answer_file?.file_key) {
        return true
      }

      const hasRequirements =
        Array.isArray(currentContent?.data?.requirements) &&
        (currentContent?.data?.requirements?.length ?? 0) > 0

      // If essay has requirements, check each requirement's editor value
      if (hasRequirements) {
        const isSheet =
          currentContent?.data?.response_option === RESPONSE_OPTION.SHEET ||
          currentContent?.response_type === 1

        for (
          let idx = 0;
          idx < (currentContent?.data?.requirements?.length ?? 0);
          idx++
        ) {
          const reqValue = getValues(`${currentPage}_${idx}_answer`)
          if (isSheet) {
            if (checkSheetAnswered(reqValue)) return true
          } else {
            if (reqValue) return true
          }
        }
        return false
      }

      // No requirements -> fall back to single editor value
      const singleValue =
        isSubmit && (currentContent?.data?.requirements?.length ?? 0) <= 1
          ? getValues(
              `${currentContent?.id}_${currentContent?.data?.requirements?.length ? 0 : undefined}_answer`,
            )
          : getValues(`${currentPage}_${essayData?.index}_answer`)

      if (
        currentContent?.data?.response_option &&
        currentContent?.data?.response_option !== null
      ) {
        if (currentContent?.data?.response_option === RESPONSE_OPTION.SHEET) {
          return checkSheetAnswered(singleValue)
        } else {
          if (!singleValue || singleValue === DEFAULT_EDITOR_VALUE) {
            return false
          }
          return true
        }
      } else {
        if (currentContent.response_type === 1) {
          return checkSheetAnswered(singleValue)
        } else {
          if (!singleValue || singleValue === DEFAULT_EDITOR_VALUE) {
            return false
          }
          return true
        }
      }
    }
  }
  // TODO: Implement this
  const getValueFillText = () => {}
  const getValueSelectText = () => {
    const value = getValues(`${currentPage}_answer`) || []
    return value
  }
  const getResult = async (currentTabContent: any) => {
    const res = await TestServiceAPI.getQuestionAnswer(currentTabContent.id)
    let corrects = {} as any
    if (
      currentTabContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentTabContent.qType === QUESTION_TYPES.TRUE_FALSE ||
      currentTabContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
    ) {
      corrects = res?.data?.[0].answers?.reduce(
        (previousValue: any, currentValue: any) => {
          return {
            ...previousValue,
            [currentValue.id]: currentValue.is_correct,
          }
        },
        {} as { [key: string]: boolean },
      )
    } else if (
      currentTabContent.qType === QUESTION_TYPES.FILL_WORD ||
      currentTabContent.qType === QUESTION_TYPES.SELECT_WORD
    ) {
      corrects = { corrects: [...res?.data?.[0]?.answers] }
    } else if (currentTabContent.qType === QUESTION_TYPES.MATCHING) {
      corrects = { corrects: [...res?.data?.[0]?.question_matchings] }
    } else if (currentTabContent.qType === QUESTION_TYPES.DRAG_DROP) {
      corrects = {
        corrects: [
          ...res?.data?.[0]?.answers?.sort(
            (a: any, b: any) => a?.answer_position - b?.answer_position,
          ),
        ],
      }
    }
    return {
      corrects: corrects,
      solution: res?.data?.[0]?.solution,
      isSelfReflection: res?.data?.[0]?.is_self_reflection,
      requirements: res?.data?.[0]?.requirements,
    }
  }
  const confirmAnswer = async (
    corrects: any,
    solution: any,
    currentTabContent: any,
    isSelfReflection: boolean,
    requirements?: IRequirement[],
  ) => {
    setLoading(true)
    const newData = tabs?.map((item: any) => {
      if (currentTabContent?.id === item?.id) {
        if (
          currentTabContent.qType !== QUESTION_TYPES.FILL_WORD &&
          currentTabContent.qType !== QUESTION_TYPES.SELECT_WORD
        ) {
          ref.current?.handleReset()
        }
        if (item?.data?.requirements?.length) {
          item.data.requirements = item.data.requirements.map(
            (req: IRequirement, index: number) => ({
              ...requirements?.[index],
              ...req,
            }),
          )
        }
        return {
          ...item,
          done: true,
          attempted: true,
          corrects: corrects,
          solution: solution,
          is_viewed_answer: true,
          timeSpent: item?.timeSpent
            ? Date.now() - startTime + item?.timeSpent
            : Date.now() - startTime,
        }
      }
      return item
    })
    const newTabs = handleSaveCurrentAnswer(newData, currentTabContent)
    setTabs(newTabs)
    setLoading(false)
  }
  const handleSaveCurrentAnswer = (tabs: any, currentContent: any) => {
    if (
      currentContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentContent.qType === QUESTION_TYPES.TRUE_FALSE ||
      currentContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE ||
      currentContent.qType === QUESTION_TYPES.MATCHING
    ) {
      const answers = handleSaveAnswer(
        getValues(`${currentPage}_answer`),
        currentContent,
        tabs,
      )
      return answers
    } else if (currentContent.qType === QUESTION_TYPES.DRAG_DROP) {
      const answers = handleSaveAnswer(
        getValues(`${currentPage}_drag_drop_answer`),
        currentContent,
        tabs,
      )

      return answers
    } else if (currentContent.qType === QUESTION_TYPES.SELECT_WORD) {
      const answers = handleSaveAnswer(
        getValueSelectText(),
        currentContent,
        tabs,
      )
      return answers
    } else if (currentContent.qType === QUESTION_TYPES.FILL_WORD) {
      const answers = handleSaveAnswer(
        getValues(`${currentPage}_fillword`),
        currentContent,
        tabs,
      )
      return answers
    } else if (currentContent.qType === QUESTION_TYPES.ESSAY) {
      const answers = handleSaveAnswerEssay(currentContent, tabs)
      return answers
    } else return tabs
  }
  async function getDetail(currentPage: string) {
    let topicDescription
    let question
    try {
      if (!isUndefined(quizDetail) && !isUndefined(questions)) {
        topicDescription = await TestServiceAPI.getTopicDescription(
          questions[questions.findIndex((e: any) => e.id === currentPage)]
            ?.question_topic_id,
          quizDetail?.id,
          router?.query?.class_user_id as string,
        )
        question = await TestServiceAPI.getQuestionDetail(currentPage)
      }
      return { topicDescription, question: question?.data }
    } catch (err) {
      return {
        topicDescription: { data: {} },
        question: null,
      }
    }
  }
  const handleChangeTab = async (currentTab: any) => {
    setLoading(true)
    // setEssayData(undefined)
    const currentContent = tabs?.find((e: any) => e.id === currentTab)
    setStartTime(Date.now())
    const resetCurrentQuestionAndNextQuestion = async (
      question: IQuestion | null | undefined,
    ) => {
      const requirementLength = question?.requirements?.length
      const name = `${currentTab}_${requirementLength ? 0 : undefined}_answer`
      const valueFromFormReq = getValues(name)
      const savedAnswer = answersSubmitted?.find(
        (e: any) => e.questionId === currentTab,
      )
      const isWordDataDefault =
        question?.response_option === RESPONSE_OPTION.WORD
          ? DEFAULT_EDITOR_VALUE
          : defaultSheetData
      const getDefaultWordValue = () => {
        if (valueFromFormReq !== undefined) {
          return valueFromFormReq
        }
        const requirementId = question?.requirements?.[0]?.id
        const savedRequirement = savedAnswer?.requirements?.find(
          (e: any) => e.requirement_id === requirementId,
        )
        const requirement = question?.requirements?.[0]

        if (savedRequirement?.short_answer !== undefined) {
          return savedRequirement.short_answer ?? isWordDataDefault
        }
        if (savedRequirement?.answer_text !== undefined) {
          return savedRequirement.answer_text ?? isWordDataDefault
        }
        if (requirement?.answer_template !== undefined) {
          return requirement.answer_template ?? isWordDataDefault
        }
        if (savedAnswer?.short_answer !== undefined) {
          return savedAnswer?.short_answer ?? isWordDataDefault
        }
        // return savedAnswer?.short_answer ?? isWordDataDefault
        return question?.answer_template ?? isWordDataDefault
      }

      onResetFormatEssay(name, getDefaultWordValue())
      await refEditor?.current?.reset()
      await new Promise((resolve) => setTimeout(resolve, 10)) // hoặc setTimeout với delay nhỏ như 10ms

      if (
        refEditor?.current?.resetSheet &&
        question?.response_option === RESPONSE_OPTION.SHEET
      ) {
        refEditor?.current?.resetSheet()
      }
    }
    const doAfterSetState = () => {
      setEditorReady(false) // Ẩn trước
      setTimeout(() => {
        try {
          if (refEditor?.current?.editor?.layout) {
            refEditor.current.editor.layout()
          } else if (refEditor?.current?.getEditor) {
            refEditor.current.getEditor().root?.focus()
          }
          window.dispatchEvent(new Event('resize'))
        } catch (e) {
        } finally {
          setEditorReady(true)
        }
      }, 100)
    }

    if (!currentContent?.viewed) {
      const { question, topicDescription } = await getDetail(currentTab)
      await resetCurrentQuestionAndNextQuestion(question)
      if (question) {
        const newData = tabs?.map((item: any) => {
          if (currentTab === item.id) {
            if (item.viewed) {
              return { ...item }
            } else {
              return {
                ...item,
                viewed: true,
                data: question,
                topicDescription: topicDescription.data,
              }
            }
          }
          return item
        })
        if (
          currentTabContent.qType !== QUESTION_TYPES.FILL_WORD &&
          currentTabContent.qType !== QUESTION_TYPES.SELECT_WORD
        ) {
          ref.current?.handleReset()
        }
        const savedAnswer = handleSaveCurrentAnswer(newData, currentTabContent)
        setCurrentPage(currentTab)
        setOpenScratchPad([])
        setAllowHighLight(false)
        setAllowUnHighLight(false)
        setTabs(savedAnswer)
        doAfterSetState()
      } else {
        setLoading(false)
      }
    } else {
      await resetCurrentQuestionAndNextQuestion(currentContent?.data)
      if (
        currentTabContent.qType !== QUESTION_TYPES.FILL_WORD &&
        currentTabContent.qType !== QUESTION_TYPES.SELECT_WORD
      ) {
        ref.current?.handleReset()
      }
      const savedAnswer = handleSaveCurrentAnswer(tabs, currentTabContent)
      setCurrentPage(currentTab)
      setOpenScratchPad([])
      setAllowHighLight(false)
      setAllowUnHighLight(false)
      setTabs(savedAnswer)
      doAfterSetState() // <== gọi ở đây nếu không load lại dữ liệu
    }

    setLoading(false)
    // handleResetRequirementIndex()
    setScratchPadValues([])
  }
  const handleSaveAnswer = (data: any, tabContent: any, tabs: any) => {
    const newData = (tabs ?? []).map((item: any) => {
      if (tabContent.id === item?.id) {
        return {
          ...item,
          data: {
            ...item?.data,
            answers: (item?.data?.answers ?? []).map((answer: Answer) => {
              if (typeof data === 'string') {
                return {
                  ...answer,
                  dropId: data,
                }
              } else {
                const existAnswer = (data ?? []).find(
                  (e: any) => e.idAnswer === answer.id,
                )
                return {
                  ...answer,
                  dropId: existAnswer?.id,
                }
              }
            }),
          },
          answer: data,
          attempted: item?.attempted || checkAnswered(item),
          timeSpent: !item?.done
            ? item?.timeSpent
              ? Date.now() - startTime + item?.timeSpent
              : Date.now() - startTime <= 0
                ? 0
                : Date.now() - startTime
            : item?.timeSpent,
        }
      }
      return item
    })
    return newData
  }
  const handleSaveAnswerEssay = (tabContent: any, tabs: any) => {
    const newData = tabs.map((item: any) => {
      if (tabContent?.id === item?.id) {
        if (
          (tabContent?.data?.requirements ?? item?.data?.requirements ?? [])
            .length > 0
        ) {
          return {
            ...item,
            data: {
              ...item?.data,
              requirements: (
                tabContent?.data?.requirements ??
                item?.data?.requirements ??
                []
              ).map((requirement: Requirement, reqIndex: number) => {
                const editorContent = getValues(
                  `${currentPage}_${reqIndex}_answer`,
                )

                return {
                  ...requirement,
                  answer_text: editorContent ?? requirement?.answer_text,
                }
              }),
            },

            attempted: item?.attempted || checkAnswered(item),
            timeSpent: !item?.done
              ? item?.timeSpent
                ? Date.now() - startTime + item?.timeSpent
                : Date.now() - startTime <= 0
                  ? 0
                  : Date.now() - startTime
              : item?.timeSpent,
          }
        } else {
          const answer = getValues(
            `${currentTabContent?.id}_${essayData?.index}_answer`,
          )
          return {
            ...item,
            answer: answer,
            attempted: item?.attempted || checkAnswered(item),
            timeSpent: !item?.done
              ? item?.timeSpent
                ? Date.now() - startTime + item?.timeSpent
                : Date.now() - startTime <= 0
                  ? 0
                  : Date.now() - startTime
              : item?.timeSpent,
          }
        }
      } else {
        return item
      }
    })
    return newData
  }
  const handleSaveFileEssay = (file: any, requirementIndex: number | null) => {
    const newTabs = tabs.map((tab: any) => {
      if (tab.id === currentPage) {
        // Case Essay has requirement
        if (currentTabContent?.data?.requirements?.length > 0) {
          return {
            ...tab,
            data: {
              ...tab?.data,
              requirements: currentTabContent?.data?.requirements?.map(
                (req: any, idx: number) => {
                  if (idx === requirementIndex) {
                    return {
                      ...req,
                      answer_file: {
                        file_key: file?.file_key,
                        file_name: file?.name,
                      },
                    }
                  }
                  return req
                },
              ),
            },
          }
        }
        // Case Essay has no requirement
        return {
          ...tab,
          answer_file: {
            file_key: file?.file_key,
            file_name: file?.name,
          },
        }
      }
      return tab
    })
    setTabs(newTabs)
  }

  // Initialize answerListRef values once when component mounts
  useEffect(() => {
    if (
      currentTabContent?.data?.response_option === 'SHEET' ||
      currentTabContent?.data?.response_option === 'WORD'
    ) {
      currentTabContent?.data?.requirements?.forEach((req: Requirement) => {
        if (req?.id) {
          if (req?.answer_file?.file_key) {
            answerListRef.current[req.id] = req?.answer_file?.file_key
          } else if (req?.answer_text) {
            if (currentTabContent?.data?.response_option === 'SHEET') {
              answerListRef.current[req.id] = checkSheetAnswered(
                req.answer_text,
              )
                ? req.answer_text
                : ''
            } else {
              answerListRef.current[req.id] = req.answer_text
            }
          }
        }
      })
    }
  }, [currentTabContent])

  const setAnswerListValue = debounce((requirementId: number) => {
    answerListRef.current[requirementId] =
      getValues(`${currentPage}_${essayData?.index}_answer`) || ''
  }, 200)
  const handleSubmitAnswer = async (action?: string) => {
    if (!currentTabContent) return
    if (currentTabContent?.is_viewed_answer) return

    // Early return for tab changes if question not answered
    if (['change-tab', 'timeout', 'finish'].includes(action ?? '')) {
      if (!checkAnswered(currentTabContent)) return
      if (action === 'change-tab' || action === 'finish') {
        if (currentTabContent?.qType !== QUESTION_TYPES.ESSAY) {
          const isEqualValue = await isValuesEqual(
            currentTabContent,
            oldCurrentTabData,
            getValues,
          )
          // Check if the current tab content is the same as the old tab content
          if (isEqualValue) return
        }
      }
    }

    // Get current answers and prepare submission data
    const allQuest = handleSaveCurrentAnswer(tabs, currentTabContent)
    const currentQuestion = allQuest.find(
      (e: any) => e.id === currentTabContent?.id,
    )

    // if (!currentQuestion?.answer) return
    // Format answer based on question type
    const answerItem = formatAnswerItem(currentQuestion)
    // Prepare submission payload
    const payload = {
      question_id: currentTabContent?.id,
      total_attempt_time:
        quizDetail?.quiz_timed * 60 -
        (quizDetail?.quiz_timed ? timeRef?.current?.handleGetTime() || 0 : 0),
      scratch_pads: scratchPads || [],
      flag: currentTabContent?.flag,
      is_viewed_answer:
        action === 'view-answer' ? true : currentTabContent?.is_viewed_answer,
      ...answerItem,
    }

    // Disable unsaved changes tracking
    dispatch(disableUnsavedChange())

    try {
      const res = await TestServiceAPI.submitAnswer(
        quizAttempt?.id as string,
        payload,
      )

      if (res?.success) {
        // Remove from error list on success
        setListSubmitError((prev) =>
          prev.filter((item) => item.question_id !== currentTabContent?.id),
        )
      } else {
        // Add to error list on failure
        handleSubmissionError(payload)
      }
    } catch (err) {
      // Handle API errors
      handleSubmissionError(payload)
      return false
    }
  }
  const handleFlagQuestion = async (question_id: string) => {
    try {
      const payload = {
        question_id,
        flag: !currentTabContent?.flag,
      }
      await TestServiceAPI.updateFlagInQuestion(
        quizAttempt?.id as string,
        payload,
      )
      setTabs((prevTabs: Tab[]) =>
        prevTabs.map((tab) =>
          tab.id === question_id ? { ...tab, flag: !tab.flag } : tab,
        ),
      )
    } catch (error) {}
  }
  // Helper function to format answer based on question type
  const formatAnswerItem = (question: any) => {
    const baseAnswer = {
      question_id: question.id,
      time_spent: Math.ceil(question.timeSpent / 1000),
    }
    // Handle essay questions
    if (question.qType === QUESTION_TYPES.ESSAY) {
      if (!checkAnswered(question, true)) return null
      const requirements =
        question?.data?.requirements?.length > 0
          ? question?.data?.requirements
          : []

      if (requirements?.length > 0) {
        const requirementAnswers = requirements.map(
          (requirement: Requirement | null) => ({
            question_id: question.id,
            short_answer: requirement?.answer_text ?? '',
            requirement_id: requirement?.id || null,
            response_option:
              question?.data?.response_option ??
              (question?.response_type === 0 ? 'WORD' : 'SHEET'),
            time_spent: Math.ceil(question.timeSpent / 1000),
            ...(!!(
              requirement?.answer_text ||
              requirement?.answer_file ||
              question?.answer_file
            ) && {
              active: 'SUBMITED',
            }),
            answer_file:
              requirement?.answer_file || question?.answer_file || null,
          }),
        )

        return {
          question_id: question.id,
          total_attempt_time:
            quizDetail?.quiz_timed * 60 -
            (quizDetail?.quiz_timed
              ? timeRef?.current?.handleGetTime() || 0
              : 0),
          scratch_pads: scratchPads || [],
          answer: requirementAnswers,
        }
      }

      return {
        ...baseAnswer,
        short_answer: question?.answer || '',
        requirement_id: null,
        response_option:
          question?.data?.response_option ??
          (question?.response_type === 0 ? 'WORD' : 'SHEET'),
        ...(!!(question?.answer || question?.answer_file) && {
          active: 'SUBMITED',
        }),
        answer_file: question?.answer_file || null,
      }
    }

    // Handle single choice and true/false questions
    if (
      [QUESTION_TYPES.ONE_CHOICE, QUESTION_TYPES.TRUE_FALSE].includes(
        question.qType,
      )
    ) {
      if (question?.answer) {
        return {
          ...baseAnswer,
          question_answer_id: question?.answer,
        }
      } else {
        return baseAnswer
      }
    }

    // Handle multiple choice questions
    if (question.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
      return {
        ...baseAnswer,
        answer: (question?.answer || [])?.map((el: string) => ({
          answer_id: el,
        })),
      }
    }

    // Handle matching questions
    if (question.qType === QUESTION_TYPES.MATCHING) {
      return {
        ...baseAnswer,
        answer: question.answer,
      }
    }

    // Handle drag and drop questions
    if (question.qType === QUESTION_TYPES.DRAG_DROP) {
      return {
        ...baseAnswer,
        answer: (question.answer ?? [])
          .filter((item: any) => item?.idAnswer)
          .map((item: any) => ({
            answer_id: item.idAnswer,
            answer_position: item.position,
          })),
      }
    }

    // Handle select word questions
    if (question.qType === QUESTION_TYPES.SELECT_WORD) {
      return {
        ...baseAnswer,
        answer: question?.answer,
      }
    }

    // Handle fill word questions
    if (question.qType === QUESTION_TYPES.FILL_WORD) {
      return {
        ...baseAnswer,
        answer: question.answer
          .filter((item: string) => item && item !== '')
          .map((item: string, index: number) => ({
            answer_text: item,
            answer_position: index + 1,
          })),
      }
    }

    return null
  }
  // Helper function to handle submission errors
  const handleSubmissionError = (payload: any) => {
    setListSubmitError((prev) => {
      const index = prev.findIndex(
        (item) => item.question_id === payload.question_id,
      )
      if (index !== -1) {
        const newList = [...prev]
        newList[index] = payload
        return newList
      }
      return [...prev, payload]
    })
  }

  const handleSubmitQuestions = async (typeSubmit: 'timeout' | 'submit') => {
    if (currentTabContent) {
      const allQuest = handleSaveCurrentAnswer(tabs, currentTabContent)
      const quiz_position_mapping = []
      // let reformTabs: any[] = []
      setLoading(true)
      for (const e of allQuest) {
        // reformTabs.push({ ...e, done: true })
        quiz_position_mapping.push({
          question_id: e.id,
          answers: e.data?.answers,
        })
      }
      dispatch(disableUnsavedChange())

      const res = await TestServiceAPI.submitAllQuestion(
        quizAttempt?.id as string,
        {
          quiz_position_mapping: quiz_position_mapping,
          scratch_pads: scratchPads || [],
          total_attempt_time:
            quizDetail.quiz_timed * 60 -
            (quizDetail.quiz_timed
              ? timeRef?.current?.handleGetTime() || 0
              : 0),
        },
      )
      if (res?.success) {
        setSubmited(true)
        localStorage.setItem(
          'quizAttempt',
          JSON.stringify({
            ...quizAttempt,
            is_submitted: true,
          }),
        )

        const isCompletedCourse = res?.data?.progress
        if (typeSubmit === 'submit') {
          if (!!isCompletedCourse?.is_completed) {
            setTimeout(() => {
              dispatch(
                showPopupCompletedCourse(isCompletedCourse?.content || ''),
              )
            }, 2000)
          }

          if (quizDetail?.grading_method === GRADING_METHOD.MANUAL) {
            setOpenReportModal({
              open: true,
              resultId: res?.data?.id,
            })
            setLoading(false)
            return
          }
          if (type === 'entrance') {
            const searchParams =
              quizAttempt?.number_of_attempts && quizDetail?.limit_count
                ? `attempt=${quizAttempt?.number_of_attempts}/${quizDetail?.limit_count}`
                : ``
            router.replace(
              `/entrance-test/test-result/${res?.data?.id}?${searchParams}`,
            )
          } else if (type === 'event-test') {
            router.replace(`/event-test`)
            setSubmitEventTest(true)
            localStorage.setItem(
              'category',
              JSON.stringify(res?.data?.course_category?.name),
            )
          } else {
            if (type !== 'entrance' && quizDetail?.quiz_type !== 'FINAL_TEST') {
              router.replace(`/courses/test/test-result/${res?.data?.id}`)
            } else {
              if (
                courseType === 'FOUNDATION_COURSE' &&
                quizDetail?.quiz_type == 'FINAL_TEST'
              ) {
                router.push(localStorage.getItem('courseDetail') || '')
              } else {
                router.replace(`/courses/test/test-result/${res?.data?.id}`)
              }
            }
          }
        } else {
          if (!!isCompletedCourse?.is_completed) {
            setTimeout(() => {
              dispatch(
                showPopupCompletedCourse(isCompletedCourse?.content || ''),
              )
            }, 2000)
          }
          // setScoreFinalTest(res?.data?.score)
          setQuizResultId(() => {
            setOpenTimeOut(true)
            return res?.data?.id
          })
        }
      }
      setLoading(false)
    }
  }

  const handleClearSelection = async (currentTabContent: any) => {
    const data = currentTabContent.data

    if (data && !currentTabContent.is_viewed_answer) {
      setTabs((prev: any) => {
        const arr = [...prev]
        const currentIndex = arr.findIndex((e) => e.id === data.id)
        arr[currentIndex] = {
          ...arr[currentIndex],
          answer: undefined,
          attempted: false,
        }
        if (
          data.qType === QUESTION_TYPES.DRAG_DROP ||
          data.qType === QUESTION_TYPES.MATCHING ||
          data.qType === QUESTION_TYPES.FILL_WORD ||
          data.qType === QUESTION_TYPES.SELECT_WORD
        ) {
          ref.current?.handleReset()
        }
        return arr
      })
      if (data.qType === QUESTION_TYPES.ESSAY) {
        await resetWordBeforeAction()
        setValue(`${currentTabContent?.id}_answer`, undefined)
      } else {
        setValue(`${currentTabContent?.id}_answer`, '')
      }
      setValue(`${currentTabContent?.id}_fillword`, '')
      if (data.qType === QUESTION_TYPES.ESSAY) {
        // refEditor?.current?.reset()
        setTabs((prev: any) => {
          const newData = prev.map((item: any) => {
            if (currentTabContent?.id === item.id) {
              const updatedRequirements = item?.data?.requirements?.map(
                (req: Requirement) => ({
                  ...req,
                  answer_file: undefined,
                }),
              )

              return {
                ...item,
                answer_file: undefined,
                data: {
                  ...item.data,
                  requirements: updatedRequirements,
                },
              }
            }
            return item
          })
          return newData
        })
      }
    }
  }
  const handleClearFile = (requirementIndex: number) => {
    const newTabs = tabs.map((tab: any) => {
      if (tab.id === currentPage) {
        // Case Essay has requirement
        if (currentTabContent?.data?.requirements?.length > 0) {
          return {
            ...tab,
            data: {
              ...tab?.data,
              requirements: currentTabContent?.data?.requirements?.map(
                (req: any, idx: number) => {
                  if (idx === requirementIndex) {
                    const editorContent = getValues(
                      `${currentPage}_${idx}_answer`,
                    )
                    return {
                      ...req,
                      answer_text:
                        editorContent !== undefined
                          ? editorContent
                          : req?.answer_text,
                      short_answer:
                        editorContent !== undefined
                          ? editorContent
                          : req?.short_answer,
                      answer_file: null,
                    }
                  }
                  return req
                },
              ),
            },
          }
        }
        // Case Essay has no requirement
        return {
          ...tab,
          answer_file: null,
        }
      }
      return tab
    })
    setTabs(newTabs)
  }
  const handleSaveHighLight = (e: any) => {
    setTabs((prev: any) => {
      const newData = prev.map((item: any) => {
        if (currentPage === item.id) {
          return { ...item, hightlight: e }
        }
        return item
      })
      return newData
    })
  }
  const handleSaveHighLightTopic = (e: any) => {
    setTabs((prev: any) => {
      const newData = prev?.map((item: any) => {
        if (currentPage === item.id) {
          // setCurrentTabContent({ ...item, hightlightTopic: e })

          return { ...item, hightlightTopic: e }
        }
        return item
      })
      return newData
    })
  }

  const handleSaveHighLightRequirement = (e: any) => {
    setTabs((prev: any) => {
      const newData = prev.map((item: any) => {
        if (currentPage === item.id) {
          // setCurrentTabContent({ ...item, hightlightTopic: e })
          item.data.requirements[essayData.index] = {
            ...item.data.requirements[essayData.index],
            highlighted: e,
          }
          return { ...item }
        }
        return item
      })
      return newData
    })
  }

  const handleOpenExhibit = (exhibitId?: string) => {
    if (!exhibitId) return
    const exhibitIds = getValuesExhibits('exhibits') ?? []
    if (exhibitIds.includes(exhibitId)) {
      setValueExhibits(
        'exhibits',
        exhibitIds.filter((id: string) => id !== exhibitId),
      )
    } else {
      exhibitIds.push(exhibitId)
      setValueExhibits('exhibits', exhibitIds)
    }
    rightSideRef?.current &&
      rightSideRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
  }

  const exhibits = useMemo(() => {
    const exhibitsOptions = []
    const topics = currentTabContent?.topicDescription

    const exhibitTopic = topics?.exhibits?.map((exhibit: IExhibit) => exhibit)

    if (exhibitTopic?.length) {
      exhibitsOptions.push(...exhibitTopic)
    }

    if (topics?.question?.length) {
      for (const question of topics?.questions) {
        if (question.exhibits?.length) {
          exhibitsOptions.push(...question.exhibits)
        }
      }
    }

    setExhibitData(exhibitsOptions)
    return exhibitsOptions?.map((exhibit, index: number) => ({
      label: `${exhibitText} ${+index + 1}`,
      value: exhibit.id,
    }))
  }, [currentTabContent])

  useEffect(() => {
    if (tabs.length > 0) {
      const filter = watchFilter('filter')
      if (filter === 'attempted') {
        setFilterTabs(
          tabs.filter((e: any) => e?.attempted === true || e?.done === true),
        )
        return
      } else if (filter === 'unattempted') {
        setFilterTabs(tabs.filter((e: any) => !e?.attempted && !e?.done))
        return
      } else if (filter === 'flag') {
        setFilterTabs(tabs.filter((e: any) => e?.flag === true))
        return
      } else setFilterTabs(tabs)
    }
  }, [tabs, trigger])

  useEffect(() => {
    if (tabs?.length > 0) {
      if (currentTabContent?.done) {
        setTrigger(!trigger)
      } else {
        const savedAnswer = handleSaveCurrentAnswer(tabs, currentTabContent)
        setTabs(() => {
          return savedAnswer
        })
      }
    }
  }, [watchFilter('filter')])

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent | TouchEvent) => {
      const clientX =
        ev instanceof TouchEvent ? ev.touches[0].clientX : ev.clientX
      const clientY =
        ev instanceof TouchEvent ? ev.touches[0].clientY : ev.clientY

      setMousePosition({ x: clientX as number, y: clientY as number })
    }

    const clickPosition = (ev: MouseEvent | TouchEvent) => {
      const clientX =
        ev instanceof TouchEvent ? ev.touches[0].clientX : ev.clientX
      const clientY =
        ev instanceof TouchEvent ? ev.touches[0].clientY : ev.clientY

      setMousePosition(() => {
        setCurrentMousePos(clientX)
        return { x: clientX, y: clientY }
      })
    }

    if (startResize) {
      window.addEventListener('mousemove', updateMousePosition)
      window.addEventListener('mousedown', clickPosition)

      window.addEventListener('touchmove', updateMousePosition, {
        passive: false,
      })
      window.addEventListener('touchstart', clickPosition, { passive: false })
    } else {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousedown', clickPosition)

      window.removeEventListener('touchmove', updateMousePosition)
      window.removeEventListener('touchstart', clickPosition)
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousedown', clickPosition)

      window.removeEventListener('touchmove', updateMousePosition)
      window.removeEventListener('touchstart', clickPosition)
    }
  }, [startResize])

  useEffect(() => {
    dispatch(loginSlice.actions.enableUnsavedChange())
  }, [dispatch])

  useEffect(() => {
    if (startResize) {
      const temp = currentLeftWidth
      setLeftWidth(temp + (currentMousePos - (mousePosition.x || 0)))
    }
  }, [mousePosition.x, startResize, currentLeftWidth, currentMousePos])

  useEffect(() => {
    if (watchExhibits('exhibits')) {
      setOpenScratchPad((prev) => {
        const arr = [...prev]
        const newArr = arr.filter((e) => {
          return e.type !== 'exhibits'
        })
        for (const e of watchExhibits('exhibits')) {
          setOnFocusingPad(e)
          newArr.push({ id: e, type: 'exhibits' })
        }
        return newArr
      })
    }
  }, [watchExhibits('exhibits')])

  useEffect(() => {
    if (quizAttempt?.id) {
      const fetchAnswersSubmitted = async () => {
        try {
          setLoading(true)
          const response = await TestServiceAPI.getAnswersSubmitted(
            quizAttempt.id,
          )
          setExhibitText(EXHIBIT_TEXT_REPLACE.EXHIBIT)
          setIsQuizAttemptCreated(true) // Mark the attempt as created
          setAnswersSubmitted(response.data)
        } catch (err) {
        } finally {
          setLoading(false)
        }
      }

      fetchAnswersSubmitted()
    } else {
      if (router.query.id) {
        const createQuizAttempt = async () => {
          try {
            const res = await TestServiceAPI.createQuizAttempt(
              router.query.id as string,
              router.query.class_user_id as string,
            )
            localStorage.setItem('quizAttempt', JSON.stringify(res.data))
            setIsQuizAttemptCreated(true) // Mark the attempt as created
          } catch (err: any) {
            if (err.response?.data?.error.code === '400|060710') {
              dispatch(disableUnsavedChange())
              setOpenLimit(true)
            }
            if (err.response?.data?.success === false) {
              setRouteBack(true)
              setIsQuizAttemptCreated(true) // Mark the attempt as created even on error
              switch (
                quizDetail?.quiz_type ||
                quizDetail?.quiz_type === undefined
              ) {
                case TEST_TYPE.MID_TERM_TEST:
                case TEST_TYPE.FINAL_TEST:
                case TEST_TYPE.TOPIC_TEST:
                case TEST_TYPE.CHAPTER_TEST:
                case TEST_TYPE.PART_TEST:
                  return router.push(PageLink.COURSES)
                case TEST_TYPE.ENTRANCE_TEST:
                  return router.push(PageLink.ENTRANCE_TEST)
                default:
                  return router.push(PageLink.COURSES)
              }
            }
          }
        }
        createQuizAttempt()
      }
    }
  }, [router.query.id])

  useEffect(() => {
    if (!isQuizAttemptCreated) return

    const handleWindowClose = (e: any) => {
      if (!unsavedChange) return
      e.preventDefault()
      return (e.returnValue = warningText)
    }

    const handleBrowseAway = () => {
      if (unsavedChange === true && routeBack === false) {
        if (!unsavedChange) return
        if (window.confirm(warningText)) return
        router.events.emit('routeChangeError')
        throw 'routeChange aborted.'
      }
    }

    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [unsavedChange, isQuizAttemptCreated])

  useEffect(() => {
    if (startResize) {
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.userSelect = 'unset'
    }
    return () => {
      document.body.style.userSelect = 'unset'
    }
  }, [startResize])

  // const handleResetRequirementIndex = () => {
  //   if (
  //     tabs &&
  //     tabs.length > 0 &&
  //     currentTabContent &&
  //     currentTabContent?.data?.requirements
  //     // && !essayData
  //   ) {
  //     setEssayData({
  //       req: currentTabContent?.data?.requirements?.[0],
  //       index: currentTabContent?.data?.requirements?.[0] ? 0 : undefined,
  //     })
  //   }
  // }
  useEffect(() => {
    if (
      tabs &&
      tabs.length > 0 &&
      currentTabContent &&
      currentTabContent?.data?.requirements &&
      currentTabIdRef.current !== currentTabContent?.id
      // && !essayData
    ) {
      currentTabIdRef.current = currentTabContent?.id
      setEssayData({
        req: currentTabContent?.data?.requirements?.[0],
        index: currentTabContent?.data?.requirements?.[0] ? 0 : undefined,
      })
    }
  }, [currentTabContent?.id, tabs])

  useEffect(() => {
    async function fetchTabs() {
      if (questions?.length > 0) {
        const answerMap = new Map(
          answersSubmitted.map(
            (answer: {
              questionId: string
              flag?: boolean
              is_viewed_answer?: boolean
              has_answer?: boolean
            }) => [answer.questionId, answer],
          ),
        )

        const arr = await Promise.all(
          questions.map(async (question: any, index: any) => {
            const hasAnswer =
              answerMap.has(question.id) &&
              !!(answerMap.get(question.id) as any)?.has_answer

            // const hasAnswer = answerMap.has(question.id)

            let baseData = {
              ...question,
              viewed: index === 0,
              flag:
                (answerMap.get(question.id) as { flag?: boolean } | undefined)
                  ?.flag || false,
              done: hasAnswer,
              attempted: hasAnswer,
              index,
              response_type: 0,
              is_viewed_answer:
                (answerMap.get(question.id) as { is_viewed_answer?: boolean })
                  ?.is_viewed_answer || false,
            }

            if (index === 0) {
              const { topicDescription, question: questionDetail } =
                await getDetail(question.id)
              baseData = {
                ...baseData,
                viewed: !!questionDetail,
                ...(questionDetail && {
                  data: questionDetail,
                  topicDescription: topicDescription?.data,
                }),
              }
            }
            return baseData
          }),
        )
        setTabs(arr)
      } else {
        router.push(PageLink.PAGE_NOT_FOUND)
      }
      setCurrentPage(questions?.[0]?.id)
    }
    if (questions) {
      fetchTabs()
    }
  }, [questions, router, quizDetail?.id, answersSubmitted])

  const handleSubmitAnswerError = async (answerSubmitErr: any) => {
    const res = await TestServiceAPI.submitAnswer(
      quizAttempt?.id as string,
      answerSubmitErr,
    )
    if (res?.success) {
      setListSubmitError((prev) =>
        prev.filter(
          (item) => item.question_id !== answerSubmitErr?.question_id,
        ),
      )
    }
  }
  const isGradingAfterEachQuestion =
    quizDetail?.grading_preference === GradingPreference.AFTER_EACH_QUESTION
  const groupAction = () => {
    const indexTab = filteredTabs.findIndex((e: any) => e.id === currentPage)

    const currentAnswer = watch(`${currentPage}_answer`)
    return (
      <div>
        <div
          className={clsx('flex items-center justify-end gap-2', {
            'gap-3': isShowTemplate,
            'gap-2': !isShowTemplate,
          })}
        >
          {currentTabContent &&
            currentTabContent.qType === QUESTION_TYPES.ESSAY &&
            isShowTemplate && (
              <div className="flex items-center justify-end gap-3">
                <ButtonTextV2
                  title="Reset to Answer Template"
                  onClick={onOpenResetToTemplateModal}
                  className="bg-transparent hover:!bg-transparent"
                />
                <ShowAnswerTemplate
                  {...{
                    currentTabContent,
                    essayData,
                  }}
                />
              </div>
            )}
          {[QUESTION_TYPES.ONE_CHOICE].includes(currentTabContent?.qType) &&
            !currentTabContent?.is_viewed_answer && (
              <ButtonSecondary
                className={clsx({ '!bg-white !font-semibold': currentAnswer })}
                disabled={!currentAnswer}
                onClick={() => {
                  handleClearSelection(currentTabContent)
                  trackGAEvent('Click Button Clear Selection Test')
                }}
                title="Clear Selection"
              />
            )}
          <Tooltip
            title={
              currentTabContent?.is_viewed_answer ||
              ![
                QUESTION_TYPES.TRUE_FALSE,
                QUESTION_TYPES.ONE_CHOICE,
                QUESTION_TYPES.MULTIPLE_CHOICE,
              ].includes(currentTabContent?.qType) ||
              !!currentAnswer
                ? null
                : 'You should select an answer before click'
            }
            classNames={{
              root: 'max-w-[288px] rounded-md',
              body: 'text-sm !py-1 !px-2 flex items-center',
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentElement!}
            placement="top"
            color={'#404041'}
          >
            {isGradingAfterEachQuestion &&
            currentTabContent?.is_viewed_answer &&
            indexTab < filteredTabs.length - 1 ? (
              <ButtonText
                onClick={() => {
                  handleChangeTab(filteredTabs[indexTab + 1].id)
                  trackGAEvent('Click Button Next Question')
                }}
              >
                <div className="flex items-center gap-2">
                  Next Question <Icon type="arrow-right" />
                </div>
              </ButtonText>
            ) : (
              <ButtonPrimary
                className="bg-gray-100 hover:!bg-gray-100"
                onClick={async () => {
                  if (isGradingAfterEachQuestion) {
                    if (currentTabContent?.is_viewed_answer) {
                      if (indexTab === filteredTabs.length - 1) {
                        handleSubmitAnswer('finish')
                        if (checkUnSubmitAnswer()?.length > 0) {
                          setUnSubmitAnswer(true)
                        } else {
                          setOpenSubmit(true)
                        }
                        dispatch(disableUnsavedChange())
                      }
                    } else {
                      const data = await getResult(currentTabContent)
                      handleSubmitAnswer('view-answer')
                      confirmAnswer(
                        data?.corrects,
                        data?.solution,
                        currentTabContent,
                        data?.isSelfReflection,
                        data?.requirements,
                      )
                    }
                  } else {
                    if (indexTab < filteredTabs.length - 1) {
                      handleChangeTab(filteredTabs[indexTab + 1].id)
                      handleSubmitAnswer('change-tab')
                    } else if (indexTab === filteredTabs.length - 1) {
                      handleSubmitAnswer('finish')
                      if (checkUnSubmitAnswer()?.length > 0) {
                        setUnSubmitAnswer(true)
                      } else {
                        setOpenSubmit(true)
                      }
                      dispatch(disableUnsavedChange())
                    }
                  }
                  trackGAEvent('Click Button Confirm Answer')
                }}
                title={
                  isGradingAfterEachQuestion
                    ? currentTabContent?.is_viewed_answer
                      ? 'Finish'
                      : 'Confirm'
                    : indexTab < filteredTabs.length - 1
                      ? 'Confirm & Next'
                      : 'Confirm'
                }
              />
            )}
          </Tooltip>
        </div>
      </div>
    )
  }
  const isShowTemplate =
    currentTabContent?.data?.answer_template ||
    currentTabContent?.data?.requirements?.some(
      (req: Requirement) => req?.answer_template,
    )
  const onResetFormatEssay = (key: string, value: string) => {
    resetField(key, {
      defaultValue: value,
      keepDirty: false,
      keepTouched: false,
      keepError: false,
    }) // reset riêng field đó
    setValue(key, value, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: true,
    }) // cập nhật lại giá trị
    // reset()
  }

  const getTemplateValueForWord = () => {
    const requirement =
      currentTabContent?.data?.requirements?.[essayData?.index]
    if (requirement?.answer_template) {
      return requirement.answer_template
    }
    return currentTabContent?.data?.answer_template
  }

  const getTemplateValueForSheet = () => {
    const requirementSheet =
      currentTabContent?.data?.requirements?.[essayData?.index]
    if (requirementSheet?.answer_template) {
      return requirementSheet.answer_template || defaultSheetData
    }
    return currentTabContent?.data?.answer_template || defaultSheetData
  }
  const onResetAnswerEssayToTemplate = () => {
    const key = `${currentTabContent?.id}_${essayData?.index}_answer`
    const response_option = currentTabContent?.data?.response_option

    switch (response_option) {
      case RESPONSE_OPTION.WORD: {
        const templateValueWord = getTemplateValueForWord()
        // Reset form value
        onResetFormatEssay(key, templateValueWord)
        // Reset component con
        if (refEditor?.current?.reset) {
          refEditor.current.reset(templateValueWord)
        }
        break
      }
      case RESPONSE_OPTION.SHEET: {
        const templateValue = getTemplateValueForSheet()
        // Reset form value
        onResetFormatEssay(key, templateValue)
        // Reset component con
        if (refEditor?.current?.clear) {
          refEditor.current.clear(templateValue)
        }
        break
      }
    }
  }
  const resetWordBeforeAction = async () => {
    if (currentTabContent?.data?.response_option === RESPONSE_OPTION.WORD) {
      const key = `${currentTabContent?.id}_${essayData?.index}_answer`
      const defaultValueEssay = () => {
        const valueFromForm = getValues(key)
        const response_option = currentTabContent?.data?.response_option

        switch (response_option) {
          case RESPONSE_OPTION.WORD: {
            if (valueFromForm !== undefined && valueFromForm !== null) {
              return valueFromForm
            }
            const requirement =
              currentTabContent?.data?.requirements?.[essayData?.index]

            if (requirement?.short_answer) {
              return requirement.short_answer
            }
            if (requirement?.answer_text) {
              return requirement.answer_text
            }
            if (requirement?.answer_template) {
              return requirement.answer_template
            }
            if (currentTabContent.answer) {
              return currentTabContent.answer
            }

            return currentTabContent?.data?.answer_template
          }
          case RESPONSE_OPTION.SHEET: {
            const valueFromSheetForm = getValues(key)
            if (valueFromSheetForm) {
              const isEmptyWorkbook = isWorkbookEmpty(
                JSON.parse(valueFromSheetForm),
              )

              if (isEmptyWorkbook) {
                const requirement =
                  currentTabContent?.data?.requirements?.[essayData?.index]
                if (requirement?.short_answer) {
                  return requirement.short_answer
                }
                if (requirement?.answer_text) {
                  return requirement.answer_text
                }
                if (requirement?.answer_template) {
                  return requirement.answer_template || defaultSheetData
                }
                if (currentTabContent.answer) return currentTabContent.answer
                return (
                  currentTabContent?.data?.answer_template || defaultSheetData
                )
              }
              return valueFromSheetForm
            }
            const requirementSheet =
              currentTabContent?.data?.requirements?.[essayData?.index]
            if (requirementSheet?.short_answer) {
              return requirementSheet.short_answer
            }
            if (requirementSheet?.answer_text) {
              return requirementSheet.answer_text
            }
            if (requirementSheet?.answer_template) {
              return requirementSheet.answer_template || defaultSheetData
            }
            if (currentTabContent.answer) return currentTabContent.answer
            return currentTabContent?.data?.answer_template || defaultSheetData
          }
        }
      }
      const defaultValue = defaultValueEssay()
      refEditor?.current?.reset(defaultValue)
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }
  return (
    <Layout
      title={checkTypeAndRenderTitle(quizDetail?.quiz_type)}
      showSidebar={false}
      fullWidth
    >
      <CourseProvider router={router} api={{ get: EventTestAPI.get }}>
        <SappLoading
          className={loading || !currentTabContent?.id ? 'block' : 'hidden'}
        />
        <TestWrapper
          quizDetail={quizDetail}
          quizAttempt={quizAttempt}
          setOpenSubmit={setOpenSubmit}
          timeRef={timeRef}
          setUnSubmitAnswer={setUnSubmitAnswer}
          checkUnSubmitAnswer={checkUnSubmitAnswer}
          setOpenQuit={setOpenQuit}
          setSubmitEventTest={setSubmitEventTest}
          type={type}
          onSubmitAnswer={async (mode) => {
            const savedAnswer = await handleSaveCurrentAnswer(
              tabs,
              currentTabContent,
            )
            setTabs(savedAnswer)
            setTimeout(() => {
              handleSubmitAnswer(mode)
            }, 100)
          }}
          handleTimeoutSubmit={async () => {
            if (!openLimit) {
              await resetWordBeforeAction()
              if (!submited && !quizAttempt?.is_submitted) {
                const remainingTimeinSeconds = quizDetail?.quiz_timed
                  ? dayjs(
                      dayjs(new Date(quizAttempt.created_at ?? '')).add(
                        quizDetail?.quiz_timed,
                        'minutes',
                      ),
                    ).diff(dayjs(), 'seconds')
                  : null

                // No call when time out > 60s
                if ((remainingTimeinSeconds ?? 0) > -60) {
                  if (listSubmitError.length > 0) {
                    for (const el of listSubmitError) {
                      await handleSubmitAnswerError(el)
                    }
                  }
                  await handleSubmitAnswer('timeout')
                }
                handleSubmitQuestions('timeout')
                dispatch(disableUnsavedChange())
                  .unwrap()
                  .then(() => {
                    trackGAEvent('Click Button Submit Time Out Test')
                  })
              } else {
                setOpenTimeOut(true)
                setQuizResultId(quizAttempt?.id)
              }
            }
          }}
          resetWordBeforeAction={resetWordBeforeAction}
          footer={
            <div
              className={clsx(
                'flex items-center justify-center overflow-hidden px-8 py-4 transition-[height] duration-300 ease-in-out will-change-contents lg:h-[var(--footer-h)] lg:justify-between',
              )}
              style={{
                ['--footer-h' as any]: activeShowAll
                  ? `${80 + Math.max(1, Math.ceil((filteredTabs?.length || 0) / numberDisplayData) - 1) * 44}px`
                  : '80px',
              }}
            >
              <div className="hidden h-full w-[150px] items-center gap-1 lg:flex">
                <Popover
                  content={
                    <div className="flex items-center gap-2 px-2 ">
                      Scratch Pad
                    </div>
                  }
                  trigger="hover"
                  placement="top"
                >
                  <button
                    className={`h-fit rounded-lg ${
                      isScatchPadEnabled && 'bg-primary'
                    }`}
                    onClick={() => {
                      handleOpenScratchPad('scratch_pad')
                      trackGAEvent('Click Button ScratchPad Test')
                    }}
                  >
                    <ButtonContent
                      icon={<ScratchPadIconV2 isActive={isScatchPadEnabled} />}
                      content=""
                    />
                  </button>
                </Popover>
                <Popover
                  content={
                    <div className="flex items-center gap-2 px-2 ">
                      Calculator
                    </div>
                  }
                  trigger="hover"
                  placement="top"
                >
                  <button
                    className={`h-fit rounded-lg ${
                      checkCalExist > -1 && 'bg-primary'
                    }`}
                    onClick={() => {
                      handleOpenScratchPad('calculator')
                      trackGAEvent('Click Button Calculator Test')
                    }}
                    disabled={checkCalExist > -1}
                  >
                    <ButtonContent
                      icon={<CalculatorIconV2 isActive={checkCalExist > -1} />}
                      content=""
                    />
                  </button>
                </Popover>
              </div>
              {/** Tabs */}
              {tabs?.length > 0 && (
                <div
                  className={`flex w-fit min-w-0 max-w-[100%] flex-1 flex-col justify-center gap-3 lg:max-w-[68%] lg:flex-row`}
                >
                  <TabSlide
                    data={filteredTabs}
                    currentTab={currentPage}
                    setCurrentTab={setCurrentPage}
                    handleChangeTab={async (id?: string) => {
                      setScratchPads('')
                      handleSubmitAnswer('change-tab')
                      setEssayData(undefined)
                      handleChangeTab(id)
                    }}
                    setHasScrollBar={setHasScrollBar}
                    activeShowAll={activeShowAll}
                    isScrollCenter={false}
                  />
                  <div
                    className={clsx(
                      `flex items-center justify-center lg:justify-start`,
                      activeShowAll ? 'lg:ml-8' : 'lg:ml-0',
                    )}
                  >
                    {activeShowAll && <OptionShowAll />}
                    <Tooltip
                      className="tooltip-show-all"
                      open={tooltipOpen}
                      onOpenChange={(visible) => setTooltipOpen(visible)}
                      title={
                        <div className="flex items-center gap-2">
                          {activeShowAll ? (
                            <div className="rounded-full bg-white">
                              <ShowMoreIcon size={16} color="#404041" />
                            </div>
                          ) : (
                            <div className="rounded-full bg-white">
                              <ShowLessIcon size={16} color="#404041" />
                            </div>
                          )}
                          <span>
                            {activeShowAll ? 'Show Less' : 'Show All'}
                          </span>
                        </div>
                      }
                    >
                      <div
                        className="absolute -top-3 left-[50%] z-[99] w-max translate-x-[-50%] cursor-pointer text-sm font-semibold leading-4.5 text-white underline"
                        onClick={() => {
                          setActiveShowAll(!activeShowAll)
                          setTooltipOpen(false)
                        }}
                        // onMouseUp={() => setTooltipOpen(true)}
                      >
                        {!activeShowAll ? (
                          <ShowLessIcon size={24} />
                        ) : (
                          <ShowMoreIcon size={24} />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}

              {/** End Tabs */}
              <div
                className="hidden w-[150px] min-w-[150px] cursor-pointer items-center gap-2 whitespace-nowrap text-base font-semibold text-gray-800 underline hover:text-primary lg:flex"
                onClick={() => {
                  handleFlagQuestion(currentPage)
                  trackGAEvent('Click Button Flag To Review Test')
                }}
              >
                <FlagIcon />
                {currentTabContent?.flag ? (
                  <div>Unflag to Review</div>
                ) : (
                  <div>Flag to Review</div>
                )}
              </div>
            </div>
          }
        >
          <div
            className="relative flex h-full flex-col overflow-hidden bg-white"
            onMouseUp={() => {
              setStartResize(false)
              setCurrentLeftWidth(leftWidth)
            }}
          >
            {/** Question Content */}
            {!isUndefined(currentTabContent) && (
              <>
                {currentTabContent?.data?.display_type ===
                DISPLAY_TYPE.VERTICAL ? (
                  <div
                    className={`flex flex-1 overflow-auto bg-[#F1F1F1]`}
                    id={'preview-question'}
                  >
                    <div
                      className={clsx(
                        'h-full min-w-[20%] overflow-auto bg-white p-8',
                        styles.scrollYOnly,
                      )}
                      style={{
                        width: `calc(50% - ${leftWidth}px)`,
                      }}
                    >
                      <div
                        id="hightlight_area_topic"
                        onMouseUp={(e: any) => {
                          if (
                            e.target.tagName.charAt(0) !== 'm' &&
                            e.target.firstChild?.tagName !== 'math'
                          ) {
                            if (e) {
                              if (allowHighLight) {
                                runHighlight(
                                  handleSaveHighLightTopic,
                                  allowHighLight || false,
                                  'hightlight_area_topic',
                                )
                              } else if (allowUnHighLight) {
                                runHighlight(
                                  handleSaveHighLightTopic,
                                  allowUnHighLight || false,
                                  'hightlight_area_topic',
                                  { color: 'white' },
                                )
                              }
                            }
                          }
                        }}
                      >
                        {currentTabContent?.topicDescription?.description && (
                          <HighlightableHTML
                            initialHTML={
                              currentTabContent?.topicDescription
                                ?.description || ''
                            }
                            storageKey={`${router.query.id}-${currentTabContent?.data?.qType}-question-topic-${currentTabContent?.id}`}
                            className="sapp-questions mb-6"
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="z-10 flex h-full w-[2px] cursor-ew-resize items-center justify-center bg-[#99A1B7]"
                      onMouseDown={() => setStartResize(true)}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        setStartResize(true)
                      }}
                      onTouchMove={() => setStartResize(true)}
                      onMouseUp={() => setStartResize(false)}
                      onTouchEnd={() => setStartResize(false)}
                    >
                      <div className="h-8 w-8 rounded-full bg-white">
                        <ResizeIcon />
                      </div>
                    </div>
                    <div
                      className={clsx(
                        'h-full overflow-auto bg-white p-8',
                        styles.scrollYOnly,
                        'has-horizontal',
                      )}
                      style={{ width: `calc(50% + ${leftWidth}px)` }}
                      ref={rightSideRef}
                    >
                      <div
                        className={clsx(
                          'flex w-full flex-col gap-8 rounded-xl bg-gray-100 p-8',
                          {
                            'min-w-[350px] bg-white px-0 py-8':
                              currentTabContent?.data?.qType ===
                              QUESTION_TYPES.ESSAY,
                            '!w-fit':
                              currentTabContent?.data?.qType ===
                              QUESTION_TYPES.MATCHING,
                          },
                        )}
                      >
                        {checkType(
                          currentTabContent?.data,
                          currentTabContent?.data?.qType,
                          currentTabContent?.id,
                          currentTabContent?.answer,
                          currentTabContent?.corrects,
                          currentTabContent?.hightlight,
                          currentTabContent?.solution,
                          currentTabContent?.done,
                        )}

                        {groupAction()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex-1 overflow-auto p-8`}
                    id={'preview-question'}
                    ref={scrollRef}
                  >
                    <div
                      id="hightlight_area_topic"
                      onMouseUp={(e: any) => {
                        if (
                          e.target.tagName.charAt(0) !== 'm' &&
                          e.target.firstChild?.tagName !== 'math'
                        ) {
                          if (e) {
                            if (allowHighLight) {
                              runHighlight(
                                handleSaveHighLightTopic,
                                allowHighLight || false,
                                'hightlight_area_topic',
                              )
                            } else if (allowUnHighLight) {
                              runHighlight(
                                handleSaveHighLightTopic,
                                allowUnHighLight || false,
                                'hightlight_area_topic',
                                { color: 'white' },
                              )
                            }
                          }
                        }
                      }}
                      className="m-auto mb-3 w-full max-w-[950px]"
                    >
                      {currentTabContent?.topicDescription?.description && (
                        <HighlightableHTML
                          initialHTML={
                            currentTabContent?.topicDescription?.description ||
                            ''
                          }
                          storageKey={`${router.query.id}-${currentTabContent?.data?.qType}-question-topic-${currentTabContent?.id}`}
                          className="mb-4"
                        />
                      )}
                    </div>

                    <div
                      className={clsx(
                        'mx-auto mt-8 flex w-full max-w-[950px] flex-col gap-8 rounded-xl bg-gray-100 p-8',
                        {
                          'min-w-[350px] bg-white px-0 py-8':
                            currentTabContent?.data?.qType ===
                            QUESTION_TYPES.ESSAY,
                          '!w-fit':
                            currentTabContent?.data?.qType ===
                            QUESTION_TYPES.MATCHING,
                        },
                      )}
                    >
                      {checkType(
                        currentTabContent?.data,
                        currentTabContent?.data?.qType,
                        currentTabContent?.id,
                        currentTabContent?.answer,
                        currentTabContent?.corrects,
                        currentTabContent?.hightlight,
                        currentTabContent?.solution,
                        currentTabContent?.done,
                      )}
                      {groupAction()}
                    </div>
                  </div>
                )}
              </>
            )}
            {/** End Question Content */}

            <TestScratchPads
              currentPage={currentPage}
              exhibitData={exhibitData}
              scratchPadValues={scratchPadValues}
              setScratchPadValues={setScratchPadValues}
              scratchPads={scratchPads}
              setScratchPads={setScratchPads}
              onFocusingPad={onFocusingPad}
              setOnFocusingPad={setOnFocusingPad}
              handleCloseScratchPad={handleCloseScratchPad}
              openScratchPad={openScratchPad}
              exhibitText={exhibitText}
            />
            {/** End Scratchpads */}

            <TestTimeOutModal
              type={type}
              okButtonCaption={
                quizDetail?.grading_method === GRADING_METHOD.MANUAL
                  ? 'Review Answers'
                  : 'View Results'
              }
              open={openTimeOut}
              setOpen={setOpenTimeOut}
              handleSubmit={() => {
                dispatch(disableUnsavedChange())
                  .unwrap()
                  .then(() => {
                    if (type === 'entrance') {
                      const searchParams =
                        quizAttempt?.number_of_attempts &&
                        quizDetail?.limit_count
                          ? `attempt=${quizAttempt?.number_of_attempts}/${quizDetail?.limit_count}`
                          : ``
                      router.replace(
                        `/entrance-test/test-result/${QuizResultId}?${searchParams}`,
                      )
                    } else if (type === 'event-test') {
                      router.replace(`/event-test`)
                      // setSubmitEventTest(true)
                    } else {
                      // if (type !== 'entrance') {
                      if (
                        quizDetail?.grading_method === GRADING_METHOD.MANUAL
                      ) {
                        router.replace(
                          `/courses/test/your-answers-detail/${QuizResultId}`,
                        )
                      } else {
                        router.replace(
                          `/courses/test/test-result/${QuizResultId}`,
                        )
                      }
                      // } else {
                      //   console.log('back backs')
                      //   router.back()
                      //   setScoreQuestion(scoreFinalTest)
                      //   setSubmitTest(true)
                      // }
                    }
                    trackGAEvent('Click Button Submit Time Out Test')
                  })
              }}
              handleQuit={() => {
                trackGAEvent('Click Button Quit Time Out Test')
                router.back()
              }}
            />

            <QuitTestModal
              open={openQuit}
              setOpen={setOpenQuit}
              handleQuit={() => {
                switch (type) {
                  case 'event-test':
                    router.replace(`/event-test`)
                    break
                  case 'entrance':
                    router.replace(`/entrance-test`)
                    break
                  default: {
                    const class_id = router.query.class_id
                    if (class_id) {
                      router.push(`/courses/my-course/${class_id}`)
                    } else {
                      router.back()
                    }
                    break
                  }
                }
                // if (type === 'event-test') {
                //
                //   // setSubmitEventTest(true)
                // } else {
                //   router.back()
                // }
              }}
              handleCancel={() =>
                dispatch(loginSlice.actions.enableUnsavedChange())
              }
              content="If you quit now, your answers will be saved and the timer will continue running. You can come back later to resume the test."
            />

            <LimitQuizModal
              open={openLimit}
              setOpen={setOpenLimit}
              handleQuit={() => router.back()}
            />

            <ConFirmSubmit
              open={openSubmit}
              setOpen={setOpenSubmit}
              handleSubmit={() => {
                handleSubmitQuestions('submit')
                if (type !== 'event-test') {
                  setOpenSubmit(false)
                }
              }}
              handleCancel={() =>
                dispatch(loginSlice.actions.enableUnsavedChange())
              }
            />

            <UnSubmitAnswerModal
              open={openUnSubmitAnswer}
              setOpen={setUnSubmitAnswer}
              data={unSubmitAnswerData}
              handleSubmit={() => {
                if (type !== 'event-test') {
                  setUnSubmitAnswer(false)
                }
                handleSubmitQuestions('submit')
              }}
              handleCancel={() => setUnSubmitAnswer(false)}
            />

            <ModalUploadFile
              open={openUpload?.status}
              isMultiple={false}
              handleClose={() => {
                setOpenUpload({
                  status: false,
                  question_id: undefined,
                  requirementIndex: undefined,
                })
              }}
              fileType={'ESSAY'}
              location={`question-answer/${openUpload?.question_id}`}
              setSelectedFile={(e: any) =>
                handleSaveFileEssay(e[0], openUpload?.requirementIndex)
              }
            />
            {openReportModal && openReportModal.open && (
              <SuccessSubmittedConstructorModal
                open={openReportModal.open}
                setOpen={setOpenReportModal}
                quizName={quizDetail?.name}
                handleCancel={() => {
                  setOpenReportModal({
                    open: false,
                    resultId: '',
                  })
                  router.back()
                }}
                handleOk={() => {
                  router.replace(
                    `/courses/test/your-answers-detail/${openReportModal.resultId}`,
                  )
                }}
              />
            )}
          </div>

          {openResetToTemplateModal && (
            <ResetToAnswerTemplateModal
              open={openResetToTemplateModal}
              handleReset={onResetAnswerEssayToTemplate}
              handleClose={onCloseResetToTemplateModal}
            />
          )}
        </TestWrapper>
      </CourseProvider>
      {exhibitData && exhibitData?.length > 0 && (
        <Popover
          placement="leftTop"
          trigger="click"
          open={isClickExhibitOpen}
          onOpenChange={(open) => setIsClickExhibitOpen(open)}
          content={
            <div className="flex flex-col gap-2">
              {exhibits?.map(
                (e: { label: string; value: string }, index: number) => {
                  return (
                    <div
                      key={e?.value}
                      className={
                        'min-w-36 cursor-pointer rounded-md p-2 text-center hover:bg-secondary-800'
                      }
                      onClick={() => {
                        handleOpenExhibit(e?.value)
                        setShowWarning(false)
                      }}
                    >{`${exhibitText} ${index + 1}`}</div>
                  )
                },
              )}
            </div>
          }
        >
          <Popover
            content={
              <div className="flex items-center gap-2 px-2 ">
                <NotesOutline className="h-4 w-4 text-white" />
                <div className="text-sm">
                  {`${exhibitText} (${exhibitData?.length > 9 ? exhibitData?.length : `0${exhibitData?.length}`})`}
                </div>
              </div>
            }
            trigger="hover"
            open={!isClickExhibitOpen ? undefined : false}
            placement="left"
          >
            <div className="group fixed bottom-[242px] right-8 grid cursor-pointer place-items-center rounded-full bg-primary p-2 hover:bg-blend-overlay">
              <NotesOutline className="size-8 text-white" />
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
        </Popover>
      )}
      {currentTabContent?.topicDescription?.files?.length > 0 && (
        <div className="absolute bottom-[182px] right-8 z-[1050] flex flex-col gap-2">
          <Popover
            className=""
            placement="leftTop"
            trigger="click"
            getPopupContainer={() => document.body}
            content={
              <div className="flex flex-col gap-2 py-3">
                {currentTabContent?.topicDescription?.files?.map((e: any) => {
                  return (
                    <div
                      className={clsx(
                        `flex items-start justify-between gap-8 px-4 py-2`,
                      )}
                      key={e?.value}
                    >
                      <div
                        key={e?.value}
                        className={clsx(
                          'min-w-36 max-w-96 cursor-pointer overflow-hidden text-ellipsis text-nowrap text-state-info underline hover:text-primary',
                        )}
                        onClick={() =>
                          handleOpenScratchPad(
                            'file',
                            e?.resource?.url,
                            e?.resource?.name,
                          )
                        }
                      >
                        {e?.resource?.name}
                      </div>
                      <div
                        className="cursor-pointer text-white"
                        onClick={() => {
                          TestServiceAPI.downloadFile({
                            files: [
                              {
                                name: e?.resource?.name,
                                file_key: e?.resource?.file_key,
                              },
                            ],
                          })
                        }}
                      >
                        <DownloadIcon color="currentColor" />
                      </div>
                    </div>
                  )
                })}
              </div>
            }
            zIndex={1050}
          >
            <div
              className={clsx(
                'group grid cursor-pointer place-items-center rounded-full bg-primary p-2 text-white shadow-icon hover:bg-blend-overlay',
                {
                  'top-[74px]':
                    (currentTabContent?.topicDescription?.qType ===
                      QUESTION_TYPES.ESSAY &&
                      !currentTabContent?.topicDescription?.requirements
                        ?.length) ||
                    !isShowIconButtonInBottom,
                  'top-[214px]':
                    currentTabContent?.topicDescription?.qType ===
                      QUESTION_TYPES.ESSAY &&
                    !!currentTabContent?.topicDescription?.requirements?.length,
                  'bottom-0': isShowIconButtonInBottom,
                },
              )}
            >
              <FileTextIcon className="size-8" />
              <div className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-20" />
            </div>
          </Popover>
        </div>
      )}
      <div
        onClick={() => {
          handleOpenScratchPad('scratch_pad')
          trackGAEvent('Click Button ScratchPad Test')
        }}
        className={clsx(
          'group fixed bottom-[302px] right-8 grid cursor-pointer place-items-center rounded-full bg-white p-2 shadow-card lg:hidden',
          { '!bg-primary': isScatchPadEnabled },
        )}
      >
        <ScratchPadIconV2 isActive={isScatchPadEnabled} className="size-8" />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-20" />
      </div>
      <div
        onClick={() => {
          handleOpenScratchPad('calculator')
          trackGAEvent('Click Button Calculator Test')
        }}
        className={clsx(
          'group fixed bottom-[362px] right-8 grid cursor-pointer place-items-center rounded-full bg-white p-2 shadow-card lg:hidden',
          { '!bg-primary': checkCalExist > -1 },
        )}
      >
        <CalculatorIconV2 isActive={checkCalExist > -1} className="size-8" />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-20" />
      </div>
      <div
        onClick={() => {
          handleFlagQuestion(currentPage)
          trackGAEvent('Click Button Flag To Review Test')
        }}
        className="group fixed bottom-[422px] right-8 grid cursor-pointer place-items-center rounded-full bg-white p-2 shadow-card lg:hidden"
      >
        <FlagIconV2 isActive={currentTabContent?.flag} />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-20" />
      </div>
      <BackToTop
        scrollContainerRef={scrollRef}
        className="!right-8 bottom-[482px] lg:bottom-[302px]"
        iconWrapperClassName={'size-12'}
        iconClassName={'size-7'}
      />
    </Layout>
  )
}

export default TestDetail
