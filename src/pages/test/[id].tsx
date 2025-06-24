import {
  removeHighlights,
  serializeHighlights,
} from '@/../node_modules/@funktechno/texthighlighter/lib/index'
import {
  ArrowUpIcon,
  CalculatorIcon,
  ExcelIcon,
  ExhibitsIcon,
  FlagIcon,
  HighlightIcon,
  ScratchPadIcon,
  TextSquareIcon,
  UnHighLightIcon,
  WordIcon,
} from '@assets/icons'
import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import useClickOutside from '@components/base/clickoutside/HookClick'
import EditorReader from '@components/base/editor/EditorReader'
import TabSlide from '@components/base/tabSlide/TabSlide'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
import DragNDropPreivew from '@components/questionType/DragNDrop'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import NewFiltext from '@components/questionType/NewFillText'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import ModalUploadFile from '@components/uploadFile/ModalUploadFile/ModalUploadFile'
import { CourseProvider, useCourseContext } from '@contexts/index'
import { runHighlight } from '@utils/index'
import { cloneDeep, debounce, isEmpty, isUndefined, uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import SappLoading from 'src/common/SappLoading'
import UnSubmitAnswerModal from 'src/components/UnSubmitAnswerModal'
import {
  DISPLAY_TYPE,
  EXHIBIT_TEXT_REPLACE,
  GRADING_METHOD,
  PageLink,
  PROGRAM,
  QUESTION_TYPES,
  RESPONSE_OPTION,
  TEST_TYPE,
} from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import { disableUnsavedChange, loginSlice } from 'src/redux/slice/Login/Login'
import { IExhibit } from 'src/type/exhibit'
import { CoursesAPI } from '../api/courses'
import QuitTestModal from '../courses/test/quit-test'
import TestTimeOutModal from '../courses/test/test-timeout'
import ConFirmSubmit from './conFirmSubmit'
import LimitQuizModal from './limitQuizModal'

import ButtonContent from '@components/mycourses/test/ButtonContent'
import HeaderTest from '@components/test/HeaderTest'
import { trackGAEvent } from '@utils/google-analytics'
import dayjs from 'dayjs'
import { showPopupCompletedCourse } from 'src/redux/slice/Popup/Result-test'
import {
  Answer,
  AnswerItem,
  AnswerList,
  DragDropAnswerItem,
  IDataQuestion,
  Requirement,
  RequirementItem,
  ScratchPadValue,
} from 'src/type'
import { IRequirement } from 'src/type/case-study'
import {
  checkSheetAnswered,
  checkTypeAndRenderTitle,
  getAnswerDragNDrop,
  getAnswerMatching,
  getResult,
  getValueFillText,
  getValueSelectText,
  isValuesEqual,
} from '../../utils/helpers/quiz-test/helper'
import { QuestionAPI } from '../api/question'
import SuccessSubmittedConstructorModal from './SuccessSubmittedConstructorModal'
import TestScratchPads from './TestScratchPads'
import useGetQuestionTabs from './custom-hook/useGetQuestionTabs'
import useGetQuizDetail from './custom-hook/useGetQuizDetail'

declare global {
  interface Window {
    userAgreed: any
  }
}

const warningText = 'Are you sure you want to leave this page?'
const TestDetail = () => {
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
          />
        )
      case QUESTION_TYPES.MATCHING:
        return (
          <MatchingQuestion
            data={data}
            action={getAnswerMatching}
            ref={ref}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            done={done}
            corrects={corrects?.corrects}
            solution={solution}
          />
        )
      case QUESTION_TYPES.FILL_WORD:
        return (
          <NewFiltext
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
          />
        )
      case QUESTION_TYPES.DRAG_DROP:
        return (
          <DragNDropPreivew
            data={data}
            action={getAnswerDragNDrop}
            ref={ref}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            solution={solution}
            handleGetData={(data: DragDropAnswerItem) => {
              setValue(`${currentTabID}_drag_drop_answer`, data)
            }}
          />
        )
      case QUESTION_TYPES.SELECT_WORD:
        return (
          <SelectWord
            data={data}
            action={getValueSelectText}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            ref={ref}
            solution={solution}
          />
        )
      case QUESTION_TYPES.ESSAY:
        const handleEssayChange = (id: string) => {
          setAnswerListValue(id as unknown as number)
        }

        const defaultValueEssay = () => {
          const key = `${currentTabID}_${essayData?.index}_answer`
          const valueFromForm = getValues(key)

          if (valueFromForm) {
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

          return currentTabContent.answer
        }

        return (
          <EssayQuestionPreview
            data={{
              ...currentTabContent?.data?.requirements?.[essayData?.index],
              ...essayData?.req,
            }}
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
            name={`${currentTabID}_${essayData?.index}_answer`}
            setValue={setValue}
            defaultValue={defaultValueEssay()}
            response_option_custom={currentTabContent.response_type}
            externalRef={refEditor}
            fullData={currentTabContent}
            openChooseFile={(e: any) =>
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
          />
          // <Luckysheet/>
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
    let result: number[] = []
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

  const router = useRouter()

  const { quizDetail } = useGetQuizDetail(router.query.id as string)
  const { questions } = useGetQuestionTabs(router.query.id as string)

  const type = router.query.type
  const [currentPage, setCurrentPage] = useState<any>(questions?.[0]?.id)
  const { control, getValues, setValue } = useForm()
  const {
    control: controlFilter,
    watch: watchFilter,
    setValue: setValueFilter,
  } = useForm()
  const {
    getValues: getValuesExhibits,
    setValue: setValueExhibits,
    watch,
  } = useForm()
  const [essayData, setEssayData] = useState<any>()
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [tabs, setTabs] = useState<any>([])
  const [showListExhibits, setShowListExhibits] = useState(false)
  const [showListRequirement, setShowLisRequirement] = useState(false)
  const [allowHighLight, setAllowHighLight] = useState(false)
  const [allowUnHighLight, setAllowUnHighLight] = useState(false)
  const [exhibitData, setExhibitData] = useState<IExhibit[]>()
  const [routeBack, setRouteBack] = useState(false)
  const [isQuizAttemptCreated, setIsQuizAttemptCreated] = useState(false)
  const [isCompletedCourse, setIsCompletedCourse] = useState({
    status: false,
    content: '',
  })
  const dropUpRef = useRef(null)
  const dropUpRequire = useRef(null)
  const [startTime, setStartTime] = useState(Date.now())
  const [activeShowAll, setActiveShowAll] = useState<boolean>(false)
  const timeRef = useRef(null) as any
  const dispatch = useAppDispatch()

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
  const [mousePosition, setMousePosition] = useState({ x: null, y: null })
  const [openUnSubmitAnswer, setUnSubmitAnswer] = useState(false)
  const [unSubmitAnswerData, setUnSubmitAnswerData] = useState<Array<number>>(
    [],
  )
  const [exhibitText, setExhibitText] = useState<string>('')
  const [openReportModal, setOpenReportModal] = useState({
    open: false,
    resultId: '',
  })
  const [oldCurrentTabData, setOldCurrentTabData] = useState<any>()
  const [scratchPadValues, setScratchPadValues] = useState<ScratchPadValue[]>(
    [],
  )
  const [scoreFinalTest, setScoreFinalTest] = useState(0)
  const [scratchPads, setScratchPads] = useState<string>('')
  // const [listQuestionDone, setListQuestionDone] = useState<string[]>([])
  const [listSubmitError, setListSubmitError] = useState<
    Array<{
      question_id: string
      total_attempt_time: number
      scratch_pad: string
      [key: string]: any
    }>
  >([])
  const [answersSubmitted, setAnswersSubmitted] = useState<any>([])
  const quizAttempt = JSON.parse(localStorage.getItem('quizAttempt') || '{}')

  useClickOutside({
    ref: dropUpRef,
    callback: () => setShowListExhibits(false),
  })

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
          scratchPad: string,
        ): {
          corrects: any
          solution: any
          isSelfReflection: boolean
          requirements: any[]
          scratch_pad: string
        } => {
          if (!answerSubmitted?.[0]) {
            return {
              corrects: {},
              solution: '',
              isSelfReflection: false,
              requirements: [],
              scratch_pad: scratchPad,
            }
          }

          const {
            answers,
            question_matchings,
            solution,
            is_self_reflection,
            requirements,
          } = answerSubmitted[0]

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
              scratch_pad: scratchPad,
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
              scratch_pad: scratchPad,
            }
          }

          if (currentTabContent.qType === QUESTION_TYPES.MATCHING) {
            return {
              corrects: { corrects: question_matchings || [] },
              solution,
              isSelfReflection: is_self_reflection || false,
              requirements: requirements || [],
              scratch_pad: scratchPad,
            }
          }

          if (currentTabContent.qType === QUESTION_TYPES.DRAG_DROP) {
            return {
              corrects: {
                corrects: (answers || []).sort(
                  (a: any, b: any) => a?.answer_position - b?.answer_position,
                ),
              },
              solution,
              isSelfReflection: is_self_reflection || false,
              requirements: requirements || [],
              scratch_pad: scratchPad,
            }
          }

          return {
            corrects: {},
            solution: solution,
            isSelfReflection: is_self_reflection,
            requirements: requirements,
            scratch_pad: scratchPad,
          }
        }

        const dataCorrectAndSolution = getCorrectAndSolution(
          objTab,
          answerSubmitted?.results,
          answerSubmitted?.scratch_pad,
        )

        const updatedObjTab = answerSubmitted?.results
          ? { ...objTab, ...dataCorrectAndSolution }
          : { ...objTab, scratch_pad: answerSubmitted?.scratch_pad }

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
                            req?.short_answer !== undefined
                              ? req?.short_answer
                              : requirementData?.short_answer,
                          answer_text:
                            req?.answer_text !== undefined
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
                  updatedObjTab?.answer !== undefined
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
                    position: index + 1,
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
                  id: currentAnswer?.dropId,
                  idAnswer: savedData?.answer_id,
                  value: currentAnswer?.answer,
                  position: index + 1,
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
                  position: index + 1,
                }
              }
              return objAnswer
            } else if (objTab?.data?.qType === QUESTION_TYPES.SELECT_WORD) {
              return currentAnswer
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
        return objTab
      }
    } else return undefined
  }, [currentPage, tabs, answersSubmitted, essayData])

  useEffect(() => {
    if (currentTabContent?.id) {
      const oldCurrentTabData = cloneDeep(currentTabContent)
      setOldCurrentTabData(oldCurrentTabData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTabContent?.id])

  const checkCalExist = useMemo(() => {
    for (let i in openScratchPad) {
      if (openScratchPad[i].type === 'calculator') {
        return +i
      }
    }
    return -1
  }, [openScratchPad])

  const handleOpenScratchPad = (
    type: string,
    file?: string,
    fileName?: string,
  ) => {
    setOnFocusingPad('')
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      if (type === 'scratch_pad') {
        arr.push({ id: currentPage, type: type })
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

  interface Tab {
    id: string
    flag?: boolean
    is_viewed_answer?: boolean
    [key: string]: any
  }

  const handleCloseScratchPad = (pad: any) => {
    setOpenScratchPad((prev) => {
      let arr = [...prev]
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
        <HookFormCheckBoxGroup
          toggle
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
    //check đã có câu trả lời
    if (
      currentContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentContent.qType === QUESTION_TYPES.TRUE_FALSE
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
    } else if (currentContent.qType === QUESTION_TYPES.MATCHING) {
      for (let e of getAnswerMatching()) {
        if (e.answer_id && e.answer_id !== '') {
          return true
        }
      }
      return false
    } else if (currentContent.qType === QUESTION_TYPES.DRAG_DROP) {
      for (let e of getValues(`${currentPage}_drag_drop_answer`) ??
        getAnswerDragNDrop()) {
        if (e.idAnswer && e.idAnswer !== '') {
          return true
        }
      }
      return false
    } else if (currentContent.qType === QUESTION_TYPES.SELECT_WORD) {
      for (let e of getValueSelectText()) {
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
        for (let e of getValues(`${currentContent?.id}_fillword`)) {
          if (e) {
            return true
          }
        }
        return false
      }
      return false
    } else if (currentContent?.qType === QUESTION_TYPES.ESSAY) {
      if (Array.isArray(currentContent.data?.requirements)) {
        for (let req of currentContent.data?.requirements) {
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
      const value = isSubmit
        ? getValues(`${currentContent?.id}_0_answer`)
        : getValues(`${currentContent?.id}_${essayData?.index}_answer`)

      if (
        currentContent?.data?.response_option &&
        currentContent?.data?.response_option !== null
      ) {
        if (currentContent?.data?.response_option === RESPONSE_OPTION.SHEET) {
          if (value) {
            const data = JSON.parse(value)
            for (let e of data) {
              if (e?.celldata && e?.celldata?.length > 0) {
                return true
              }
            }
            return false
          }
          return false
        } else {
          if (!value) {
            return false
          }
          return true
        }
      } else {
        if (currentContent.response_type === 1) {
          if (value) {
            const data = JSON.parse(value)
            for (let e of data) {
              if (e?.celldata && e?.celldata?.length > 0) {
                return true
              }
            }
            return false
          }
          return false
        } else {
          if (!value) {
            return false
          }
          return true
        }
      }
    }
  }
  const [filteredTabs, setFilterTabs] = useState<any[]>([])
  const [trigger, setTrigger] = useState(false)

  const ref = useRef(null) as any
  const refEditor = useRef(null) as any

  // TODO: Implement this

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
      currentContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
    ) {
      const answers = handleSaveAnswer(
        getValues(`${currentPage}_answer`),
        currentContent,
        tabs,
      )
      return answers
    } else if (currentContent.qType === QUESTION_TYPES.MATCHING) {
      const answers = handleSaveAnswer(
        getAnswerMatching(),
        currentContent,
        tabs,
      )
      return answers
    } else if (currentContent.qType === QUESTION_TYPES.DRAG_DROP) {
      const answers = handleSaveAnswer(
        getValues(`${currentPage}_drag_drop_answer`) ?? getAnswerDragNDrop(),
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
        topicDescription = await CoursesAPI.getTopicDescription(
          questions[questions.findIndex((e: any) => e.id === currentPage)]
            ?.question_topic_id,
          quizDetail?.id,
        )
        question = await QuestionAPI.getQuestionDetail(currentPage)
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
    const currentContent = tabs?.find((e: any) => e.id === currentTab)
    setStartTime(Date.now())
    if (!currentContent?.viewed) {
      const { question, topicDescription } = await getDetail(currentTab)
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
        refEditor?.current?.reset()
        const savedAnswer = handleSaveCurrentAnswer(newData, currentTabContent)
        setCurrentPage(currentTab)
        setOpenScratchPad([])
        setAllowHighLight(false)
        setAllowUnHighLight(false)
        setTabs(savedAnswer)
      } else {
        setLoading(false)
      }
    } else {
      if (
        currentTabContent.qType !== QUESTION_TYPES.FILL_WORD &&
        currentTabContent.qType !== QUESTION_TYPES.SELECT_WORD
      ) {
        ref.current?.handleReset()
      }
      refEditor?.current?.reset()
      const savedAnswer = handleSaveCurrentAnswer(tabs, currentTabContent)
      setCurrentPage(currentTab)
      setOpenScratchPad([])
      setAllowHighLight(false)
      setAllowUnHighLight(false)
      setTabs(savedAnswer)
    }
    setLoading(false)
  }

  const handleSaveAnswer = (data: any, tabContent: any, tabs: any) => {
    const newData = (tabs ?? []).map((item: any) => {
      if (tabContent.id === item?.id) {
        return {
          ...item,
          data: {
            ...item?.data,
            answers: (item?.data?.answers ?? []).map(
              (answer: Answer, index: number) => {
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
              },
            ),
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

  const handleCheckAllRequirementHasAnswer = (tabContent: any) => {
    if (Array.isArray(tabContent.data?.requirements)) {
      const hasAnswer = (req: any) =>
        req?.answer_file?.file_key || answerListRef?.current?.[req?.id || '']
      return tabContent.data.requirements.every(hasAnswer)
    }
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

                //nếu bài làm là sheet và không có giá trị thì lưu lên BE là null
                if (tabContent?.data?.response_option === 'SHEET') {
                  if (!checkSheetAnswered(editorContent)) {
                    return {
                      ...requirement,
                      answer_text: null,
                    }
                  }
                }

                return {
                  ...requirement,
                  answer_text: editorContent ?? requirement?.answer_text,
                }
              }),
            },

            attempted:
              item?.attempted ||
              (checkAnswered(item) && handleCheckAllRequirementHasAnswer(item)),
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

  const handleChangeTypeEssay = (value: number) => {
    const newTabs = tabs.map((tab: any) => {
      if (tab.id === currentPage) {
        return {
          ...tab,
          data: {
            ...tab?.data,
            requirements: currentTabContent?.data?.requirements?.map(
              (req: any, idx: number) => {
                return {
                  ...req,
                  response_type: value,
                }
              },
            ),
          },
        }
      }
      return tab
    })
    setTabs(newTabs)
  }

  const answerListRef = useRef<AnswerList>({})

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
    let answer = ''
    if (getValues(`${currentPage}_${essayData?.index}_answer`)) {
      if (currentTabContent?.data?.response_option === 'SHEET') {
        if (
          checkSheetAnswered(
            getValues(`${currentPage}_${essayData?.index}_answer`),
          )
        ) {
          answer = getValues(`${currentPage}_${essayData?.index}_answer`)
        }
      } else {
        answer = getValues(`${currentPage}_${essayData?.index}_answer`)
      }
    }
    answerListRef.current[requirementId] = answer
  }, 200)

  const { setScoreQuestion, setSubmitTest, courseType, setSubmitEventTest } =
    useCourseContext()

  const handleSubmitAnswer = async (action?: string) => {
    if (!currentTabContent) return
    if (currentTabContent?.is_viewed_answer) return

    // Early return for tab changes if question not answered
    if (['change-tab', 'timeout', 'finish'].includes(action ?? '')) {
      if (!checkAnswered(currentTabContent)) return
      if (action === 'change-tab' || action === 'finish') {
        const isEqualValue = await isValuesEqual(
          currentTabContent,
          oldCurrentTabData,
          getValues,
        )
        // Check if the current tab content is the same as the old tab content
        if (isEqualValue) return
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
      scratch_pad: scratchPads || '',
      flag: currentTabContent?.flag,
      is_viewed_answer:
        action === 'view-answer' ? true : currentTabContent?.is_viewed_answer,
      ...answerItem,
    }

    // Disable unsaved changes tracking
    dispatch(disableUnsavedChange())

    try {
      const res = await CoursesAPI.submitAnswer(
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
      const hasRequiment = currentTabContent?.data?.requirements?.length > 0
      const payload = {
        question_id,
        flag: !currentTabContent?.flag,
        ...(hasRequiment && {
          answer: currentTabContent?.data?.requirements.map((e: any) => ({
            requirement_id: e.id,
            question_id: question_id,
          })),
        }),
      }
      await CoursesAPI.updateFlagInQuestion(quizAttempt?.id as string, payload)
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
          scratch_pad: scratchPads || '',
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
          .map((item: any, index: number) => ({
            answer_id: item.idAnswer,
            answer_position: index + 1,
          })),
      }
    }

    // Handle select word questions
    if (question.qType === QUESTION_TYPES.SELECT_WORD) {
      return {
        ...baseAnswer,
        answer: question?.answer
          ?.filter((item: string) => item && item !== '')
          .map((item: string, index: number) => ({
            answer_id: item,
            answer_position: index + 1,
          })),
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
      let quiz_position_mapping = []
      // let reformTabs: any[] = []
      setLoading(true)
      for (let e of allQuest) {
        // reformTabs.push({ ...e, done: true })
        quiz_position_mapping.push({
          question_id: e.id,
          answers: e.data?.answers,
        })
      }
      dispatch(disableUnsavedChange())

      const res = await CoursesAPI.submitAllQuestion(
        quizAttempt?.id as string,
        {
          quiz_position_mapping: quiz_position_mapping,
          scratch_pad: scratchPads || '',
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
        if (typeSubmit === 'submit') {
          if (isCompletedCourse.status) {
            setTimeout(() => {
              dispatch(showPopupCompletedCourse(isCompletedCourse.content))
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
            router.replace(`/entrance-test/test-result/${res?.data?.id}`)
          } else if (type === 'event-test') {
            setSubmitEventTest(true)
            router.replace(`/event-test`)
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
          if (isCompletedCourse.status) {
            setTimeout(() => {
              dispatch(showPopupCompletedCourse(isCompletedCourse.content))
            }, 2000)
          }
          setScoreFinalTest(res?.data?.score)
          setQuizResultId(() => {
            setOpenTimeOut(true)
            return res?.data?.id
          })
        }
      }
      setLoading(false)
    }
  }

  const handleClearSelection = (currentTabContent: any) => {
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
        setValue(`${currentTabContent?.id}_answer`, undefined)
      } else {
        setValue(`${currentTabContent?.id}_answer`, '')
      }
      setValue(`${currentTabContent?.id}_fillword`, '')
      if (data.qType === QUESTION_TYPES.ESSAY) {
        refEditor?.current?.reset()
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
    let exhibitsOptions = []
    const topics = currentTabContent?.topicDescription

    const exhibitTopic = topics?.exhibits?.map((exhibit: IExhibit) => exhibit)

    if (exhibitTopic?.length) {
      exhibitsOptions.push(...exhibitTopic)
    }

    if (topics?.question?.length) {
      for (let question of topics?.questions) {
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
    const updateMousePosition = (ev: any) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    const clickPosition = (ev: any) => {
      setMousePosition(() => {
        setCurrentMousePos(ev.clientX)
        return { x: ev.clientX, y: ev.clientY }
      })
    }
    if (startResize) {
      window.addEventListener('mousemove', updateMousePosition)
      window.addEventListener('mousedown', clickPosition)
    } else {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousedown', clickPosition)
    }
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousedown', clickPosition)
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
    if (watch('exhibits')) {
      setOpenScratchPad((prev) => {
        let arr = [...prev]
        const newArr = arr.filter((e) => {
          return e.type !== 'exhibits'
        })
        for (let e of watch('exhibits')) {
          setOnFocusingPad(e)
          newArr.push({ id: e, type: 'exhibits' })
        }
        return newArr
      })
    }
  }, [watch('exhibits')])

  useEffect(() => {
    if (quizAttempt?.id) {
      const fetchAnswersSubmitted = async () => {
        try {
          setLoading(true)
          const response = await CoursesAPI.getAnswersSubmitted(quizAttempt.id)
          setIsQuizAttemptCreated(true) // Mark the attempt as created
          setAnswersSubmitted(response.data)
        } catch (err) {
          // console.log(err)
        } finally {
          setLoading(false)
        }
      }

      fetchAnswersSubmitted()
    } else {
      if (router.query.id) {
        const createQuizAttempt = async () => {
          try {
            const res = await CoursesAPI.createQuizAttempt(
              router.query.id as string,
              router.query.class_user_id as string,
            )
            setExhibitText(
              res.data.program === PROGRAM.CMA
                ? EXHIBIT_TEXT_REPLACE.EXHIBIT_REPLACE
                : EXHIBIT_TEXT_REPLACE.EXHIBIT,
            )
            if (res?.data?.progress?.is_completed) {
              setIsCompletedCourse({
                status: res?.data?.progress?.is_completed,
                content: res?.data?.progress?.content,
              })
            }
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
      document.body.style.webkitUserSelect = 'none'

      document.body.style.userSelect = 'none'
    } else {
      document.body.style.webkitUserSelect = 'unset'

      document.body.style.userSelect = 'unset'
    }
    return () => {
      document.body.style.webkitUserSelect = 'unset'

      document.body.style.userSelect = 'unset'
    }
  }, [startResize])

  useEffect(() => {
    if (
      tabs &&
      tabs.length > 0 &&
      currentTabContent &&
      currentTabContent?.data?.requirements &&
      !essayData
    ) {
      setEssayData({
        req: currentTabContent?.data?.requirements?.[0],
        index: 0,
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
    const res = await CoursesAPI.submitAnswer(
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

  return (
    <FullScreenLayout title={checkTypeAndRenderTitle(quizDetail?.quiz_type)}>
      <CourseProvider>
        <SappLoading
          className={loading || !currentTabContent?.id ? 'block' : 'hidden'}
        />
        <div
          className="relative flex h-screen flex-col overflow-hidden bg-white"
          onMouseUp={() => {
            setStartResize(false)
            setCurrentLeftWidth(leftWidth)
          }}
        >
          {/** Header */}
          <div>
            {currentTabContent && quizAttempt && (
              <HeaderTest
                quizDetail={quizDetail}
                handleSubmitQuestions={handleSubmitQuestions}
                timeRef={timeRef}
                quizAttempt={quizAttempt}
                setUnSubmitAnswer={setUnSubmitAnswer}
                checkUnSubmitAnswer={checkUnSubmitAnswer}
                setOpenQuit={setOpenQuit}
                type={type}
                submited={submited}
                setOpenSubmit={setOpenSubmit}
                onSubmitAnswer={handleSubmitAnswer}
                handleTimeoutSubmit={async () => {
                  if (!openLimit) {
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
                      setQuizResultId(quizAttempt?.id)
                    }
                  }
                }}
              />
            )}

            {/** Tabs */}
            {tabs?.length > 0 && (
              <div className="relative z-10 w-full bg-gray-4 px-6 py-2 shadow-pagination">
                <TabSlide
                  data={filteredTabs}
                  currentTab={currentPage}
                  setCurrentTab={setCurrentPage}
                  optionShowAll={<OptionShowAll />}
                  handleChangeTab={async (id?: string) => {
                    if (id) {
                      setScratchPads('')
                      handleSubmitAnswer('change-tab')
                      setEssayData(undefined)
                      handleChangeTab(id)
                    }
                  }}
                  activeShowAll={activeShowAll}
                  setActiveShowAll={setActiveShowAll}
                  setValueFilter={setValueFilter}
                  isScrollCenter={false}
                />
              </div>
            )}
            {/** End Tabs */}
          </div>
          {/** End Header */}

          {/** Question Content */}
          {!isUndefined(currentTabContent) && (
            <>
              {currentTabContent?.data?.display_type ===
              DISPLAY_TYPE.VERTICAL ? (
                <div
                  className={`flex flex-1 overflow-auto bg-gray-3`}
                  id={'preview-question'}
                >
                  <div
                    className="h-full overflow-auto bg-white p-6"
                    style={{ width: `calc(50% - ${leftWidth}px)` }}
                  >
                    <div
                      className="min-w-[700px]"
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
                      <EditorReader
                        className="mb-4"
                        text_editor_content={
                          currentTabContent?.topicDescription?.description
                        }
                        highlighted={currentTabContent?.hightlightTopic}
                        highlighArea="hightlight_area_topic"
                      />
                      {currentTabContent?.topicDescription?.files?.length > 0 &&
                        currentTabContent?.topicDescription?.files?.map(
                          (e: any, indexReq: number) => {
                            return (
                              <div
                                className="cursor-pointer text-state-info hover:underline"
                                onClick={() =>
                                  handleOpenScratchPad(
                                    'file',
                                    e?.resource?.url,
                                    e?.resource?.name,
                                  )
                                }
                                key={indexReq}
                              >
                                {e?.resource?.name}
                              </div>
                            )
                          },
                        )}
                    </div>
                  </div>
                  <div
                    className="h-full w-[20px] cursor-ew-resize bg-gray-3"
                    onMouseDown={() => {
                      setStartResize(true)
                    }}
                    onMouseUp={() => setStartResize(false)}
                  ></div>
                  <div
                    className="h-full overflow-auto bg-white py-6"
                    style={{ width: `calc(50% + ${leftWidth}px)` }}
                    ref={rightSideRef}
                  >
                    <div className="min-w-[700px] px-6">
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
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex-1 overflow-auto px-6 py-6`}
                  id={'preview-question'}
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
                    className="editor-wrap m-auto mb-3 w-full max-w-[950px]"
                  >
                    <EditorReader
                      className="mb-4"
                      text_editor_content={
                        currentTabContent?.topicDescription?.description
                      }
                      highlighted={currentTabContent?.hightlightTopic}
                      highlighArea="hightlight_area_topic"
                    />
                    {currentTabContent?.topicDescription?.files?.length > 0 &&
                      currentTabContent?.topicDescription?.files?.map(
                        (e: any, index: number) => {
                          return (
                            <div
                              className="cursor-pointer text-state-info hover:underline"
                              onClick={() =>
                                handleOpenScratchPad(
                                  'file',
                                  e?.resource?.url,
                                  e?.resource?.name,
                                )
                              }
                              key={index}
                            >
                              {e?.resource?.name}
                            </div>
                          )
                        },
                      )}
                  </div>

                  <div className="m-auto w-full max-w-[950px]">
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
                  </div>
                </div>
              )}
            </>
          )}
          {/** End Question Content */}

          {/** Scratchpads */}
          <div className="z-10 flex h-[48px] items-center justify-between bg-gray-3 shadow-question-footer">
            <div className="flex h-full items-center">
              <button
                className={`h-full ${allowHighLight && 'bg-yellow-300'}`}
                onClick={() => {
                  setAllowHighLight(!allowHighLight)
                  setAllowUnHighLight(false)
                  trackGAEvent('Click Button Highlight Test')
                }}
              >
                <ButtonContent icon={<HighlightIcon />} content="Highlight" />
              </button>
              <button
                className={`h-full ${allowUnHighLight && 'bg-yellow-300'}`}
                onClick={() => {
                  setAllowUnHighLight(!allowUnHighLight),
                    setAllowHighLight(false)
                  trackGAEvent('Click Button Unhighlight Test')
                }}
              >
                <ButtonContent
                  icon={<UnHighLightIcon />}
                  content="Unhighlight"
                />
              </button>
              <button
                className="h-full"
                onClick={() => {
                  handleOpenScratchPad('scratch_pad')
                  trackGAEvent('Click Button ScratchPad Test')
                }}
              >
                <ButtonContent icon={<ScratchPadIcon />} content="ScratchPad" />
              </button>
              <button
                className={`h-full ${
                  checkCalExist > -1 && 'sapp-disable-button'
                }`}
                onClick={() => {
                  handleOpenScratchPad('calculator')
                  trackGAEvent('Click Button Calculator Test')
                }}
                disabled={checkCalExist > -1}
              >
                <ButtonContent icon={<CalculatorIcon />} content="Calculator" />
              </button>
              {exhibitData && exhibitData?.length > 0 && (
                <button className="relative h-full" ref={dropUpRef}>
                  <div
                    className="flex items-center gap-3 border-l px-4 3xl:px-6"
                    onClick={() => {
                      setShowListExhibits(!showListExhibits)
                    }}
                  >
                    <ExhibitsIcon />
                    <div className="flex items-center gap-3 text-sm font-normal">
                      <div>
                        <span className="hidden xl:inline-block 3xl:me-1">
                          {`${exhibitText}s (${exhibitData?.length || 0})`}
                        </span>
                      </div>
                      <ArrowUpIcon />
                    </div>
                  </div>
                  {showListExhibits && (
                    <div className="sapp-separateLine absolute bottom-full h-fit justify-center bg-gray-3 shadow-questions-exhibits 3xl:w-full">
                      {exhibits?.map(
                        (
                          e: { label: string; value: string },
                          index: number,
                        ) => {
                          return (
                            <button
                              key={e?.value}
                              className={`whitespace-nowrap p-3 ${exhibitText === EXHIBIT_TEXT_REPLACE.EXHIBIT_REPLACE ? 'min-w-[200px]' : 'min-w-[100px]'} ${
                                !watch('exhibits')?.includes(e?.value) &&
                                'text-gray-1'
                              }`}
                              onClick={() => handleOpenExhibit(e?.value)}
                            >{`${exhibitText} ${index + 1}`}</button>
                          )
                        },
                      )}
                    </div>
                  )}
                </button>
              )}
              {currentTabContent?.data?.qType === QUESTION_TYPES.ESSAY && (
                <button className="relative h-full" ref={dropUpRequire}>
                  <div
                    className="flex items-center gap-3 border-l px-4 3xl:px-6"
                    onClick={() => {
                      setShowLisRequirement(!showListRequirement)
                    }}
                  >
                    <TextSquareIcon />
                    <div className="flex items-center gap-3 text-sm font-normal">
                      <div>
                        <span className="hidden lg:inline-block 3xl:me-1">
                          Requirement
                        </span>
                        <span>{`(${currentTabContent?.data?.requirements?.length})`}</span>
                      </div>
                      <ArrowUpIcon />
                    </div>
                  </div>
                  {showListRequirement && (
                    <div className="sapp-separateLine absolute bottom-full h-fit justify-center bg-gray-3 shadow-questions-exhibits 3xl:w-full">
                      {currentTabContent?.data?.requirements?.map(
                        (e: any, indexReq: number) => {
                          return (
                            <button
                              key={e.id}
                              className={`p-3 ${
                                essayData?.index !== indexReq && 'text-gray-1'
                              }`}
                              onClick={() => {
                                if (e?.id !== essayData?.req?.id) {
                                  //chọn requirement khác thì mới set lại state
                                  setEssayData({ req: e, index: indexReq })
                                  if (refEditor?.current) {
                                    refEditor.current.reset()
                                  }
                                }
                                rightSideRef?.current &&
                                  rightSideRef.current.scrollTo({
                                    top: 0,
                                    behavior: 'smooth',
                                  })
                              }}
                            >{`Requirement (${indexReq + 1})`}</button>
                          )
                        },
                      )}
                    </div>
                  )}
                </button>
              )}
            </div>

            <div className="flex h-full items-center gap-3 pe-6">
              {currentTabContent?.data?.response_option === null &&
                currentTabContent?.data?.qType === QUESTION_TYPES.ESSAY &&
                !currentTabContent.done && (
                  <div className="flex gap-1">
                    <div className="hidden 3.5xl:block">
                      Choose response option:
                    </div>
                    <button
                      onClick={() => {
                        dispatch(
                          confirmDialog.open({
                            // Nội dung của hộp thoại xác nhận
                            message:
                              'Change Type will delete your input, do you want to continue?',
                            // Hàm thực thi khi người dùng xác nhận hành động
                            onConfirm: () => {
                              handleChangeTypeEssay(0)
                              handleClearSelection(currentTabContent)
                            },
                          }),
                        )
                      }}
                      className={`${
                        currentTabContent?.response_type === 0 && 'active'
                      }`}
                    >
                      <WordIcon />
                    </button>
                    <button
                      onClick={() => {
                        dispatch(
                          confirmDialog.open({
                            // Nội dung của hộp thoại xác nhận
                            message:
                              'Change Type will delete your input, do you want to continue?',
                            // Hàm thực thi khi người dùng xác nhận hành động
                            onConfirm: () => {
                              handleChangeTypeEssay(1)
                              handleClearSelection(currentTabContent)
                            },
                          }),
                        )
                      }}
                      className={`${
                        currentTabContent.response_type === 1 && 'active'
                      }`}
                    >
                      <ExcelIcon />
                    </button>
                  </div>
                )}
              <button
                className="flex items-center justify-center gap-3 border border-gray-1 px-3 py-2 3xl:w-[150px]"
                onClick={() => {
                  handleFlagQuestion(currentPage)
                  trackGAEvent('Click Button Flag To Review Test')
                }}
              >
                <FlagIcon />
                <div className="hidden text-medium-sm font-medium lg:block">
                  Flag to Review
                </div>
              </button>
              <button
                disabled={currentTabContent?.is_viewed_answer}
                className={`flex items-center gap-3 border border-solid ${
                  !currentTabContent?.is_viewed_answer
                    ? 'border-gray-1 text-bw-1'
                    : 'border-default text-gray-2'
                } w-[150px] justify-center p-1 py-2`}
                onClick={() => {
                  handleClearSelection(currentTabContent)
                  trackGAEvent('Click Button Clear Selection Test')
                }}
              >
                <div className="text-medium-sm font-medium">
                  Clear Selection
                </div>
              </button>
              {/* )} */}
              {quizDetail?.grading_preference === 'AFTER_EACH_QUESTION' &&
              !currentTabContent?.is_viewed_answer &&
              quizDetail?.quiz_type !== 'ENTRANCE_TEST' ? (
                <button
                  className="flex w-45 items-center justify-center gap-3 border border-gray-1 px-3 py-2"
                  onClick={async () => {
                    const data = await getResult(currentTabContent)
                    handleSubmitAnswer('view-answer')
                    confirmAnswer(
                      data?.corrects,
                      data?.solution,
                      currentTabContent,
                      data?.isSelfReflection,
                      data?.requirements,
                    )
                    trackGAEvent('Click Button Submit & View Answer Test')
                  }}
                >
                  <div className="text-medium-sm font-medium">
                    Submit & View Answer
                  </div>
                </button>
              ) : (
                filteredTabs.findIndex((e: any) => e.id === currentPage) <
                  filteredTabs.length - 1 && (
                  <button
                    className="flex w-[150px] items-center justify-center gap-3 border border-gray-1 px-3 py-2"
                    onClick={async () => {
                      const index = filteredTabs.findIndex(
                        (e: any) => e.id === currentPage,
                      )
                      if (filteredTabs[index + 1].id) {
                        setScratchPads('')
                        handleSubmitAnswer('change-tab')
                        setEssayData(undefined)
                        handleChangeTab(filteredTabs[index + 1].id)
                      }
                    }}
                  >
                    <div className="text-medium-sm font-medium">
                      Next Question
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          <TestScratchPads
            currentPage={currentPage}
            exhibitData={exhibitData}
            scratchPads={scratchPads}
            setScratchPads={setScratchPads}
            onFocusingPad={onFocusingPad}
            setOnFocusingPad={setOnFocusingPad}
            handleCloseScratchPad={handleCloseScratchPad}
            openScratchPad={openScratchPad}
            exhibitText={exhibitText}
            scratchPadValues={scratchPadValues}
            setScratchPadValues={setScratchPadValues}
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
                    router.replace(`/entrance-test/test-result/${QuizResultId}`)
                  } else if (type === 'event-test') {
                    router.replace(`/event-test`)
                    // setSubmitEventTest(true)
                  } else {
                    if (
                      type !== 'entrance' &&
                      quizDetail?.quiz_type !== 'FINAL_TEST'
                    ) {
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
                    } else {
                      router.back()
                      setScoreQuestion(scoreFinalTest)
                      setSubmitTest(true)
                    }
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
              if (type === 'event-test') {
                router.replace(`/event-test`)
                // setSubmitEventTest(true)
              } else {
                router.back()
              }
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
      </CourseProvider>
    </FullScreenLayout>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default TestDetail
