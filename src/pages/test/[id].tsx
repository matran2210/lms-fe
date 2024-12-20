import {
  removeHighlights,
  serializeHighlights,
} from '@/../node_modules/@funktechno/texthighlighter/lib/index'
import {
  ArrowUpIcon,
  CalculatorIcon,
  ConfirmIcon,
  ExcelIcon,
  ExhibitsIcon,
  FlagIcon,
  HighlightIcon,
  ScratchPadIcon,
  TextSquareIcon,
  UnHighLightIcon,
  WordIcon,
} from '@assets/icons'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
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
import { debounce, isEmpty, isUndefined, uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SappLoading from 'src/common/SappLoading'
import UnSubmitAnswerModal from 'src/components/UnSubmitAnswerModal'
import {
  DISPLAY_TYPE,
  ESSAY_TYPE,
  FINISHED_TEST_TITLE,
  GRADING_METHOD,
  PageLink,
  QUESTION_TYPES,
  RESPONSE_OPTION,
  TEST_TYPE,
} from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import { disableUnsavedChange, loginSlice } from 'src/redux/slice/Login/Login'
import { IExhibit } from 'src/type/exhibit'
import { CoursesAPI } from '../api/courses'
import { TestAPI } from '../api/test'
import QuitTestModal from '../courses/test/quit-test'
import TestTimeOutModal from '../courses/test/test-timeout'
import ConFirmSubmit from './conFirmSubmit'
import LimitQuizModal from './limitQuizModal'

import SappModalV3 from '@components/base/modal/SappModalV3'
import ButtonContent from '@components/mycourses/test/ButtonContent'
import { trackGAEvent } from '@utils/google-analytics'
import { showPopupCompletedCourse } from 'src/redux/slice/Popup/Result-test'
import {
  Answer,
  AnswerList,
  Requirement,
  ScratchPad,
  ScratchPadValue,
  TabItem,
} from 'src/type'
import { IRequirement } from 'src/type/case-study'
import { QuestionAPI } from '../api/question'
import Countdown from './countdown'
import TestScratchPads from './TestScratchPads'

declare global {
  interface Window {
    userAgreed: any
  }
}

const warningText =
  'You have unsaved changes - are you sure you wish to leave this page?'
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
            defaultValue={getValues(
              `${currentTabID}_${essayData?.index}_answer`,
            )}
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
      } else if (
        !item.done &&
        !validateAnswer({ answer: item.answer, answer_file: item?.answer_file })
      ) {
        result.push(index + 1)
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

  const router = useRouter()

  const useGetQuizDetail = () => {
    const [quizDetail, setQuizDetail] = useState<any>(undefined)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
      const fetchQuizDetail = async () => {
        if (router.query.id) {
          try {
            setLoading(true)
            const response = await CoursesAPI.getDetailQuizById(router.query.id)
            setQuizDetail(response.data)
          } catch (err) {
          } finally {
            setLoading(false)
          }
        }
      }

      fetchQuizDetail()
    }, [router.query.id]) // Dependency on router.query.id

    return { quizDetail, loading }
  }

  const useGetQuestionTabs = () => {
    const [questions, setQuestionTabs] = useState<any>(undefined)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
      const fetchQuestionTabs = async () => {
        if (router.query.id) {
          try {
            setLoading(true)
            const response = await CoursesAPI.getQuestionTabsById(
              router.query.id,
            )
            setQuestionTabs(response.data)
          } catch (err) {
          } finally {
            setLoading(false)
          }
        }
      }

      fetchQuestionTabs()
    }, [router.query.id]) // Dependency on router.query.id

    return { questions, loading }
  }

  const { quizDetail } = useGetQuizDetail()
  const { questions } = useGetQuestionTabs()
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
  const [quizAttempId, setQuizAttempId] = useState({
    id: '',
    number_of_attempts: 0,
    is_limited: false,
  })
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
  const [openReportModal, setOpenReportModal] = useState(false)

  const [scoreFinalTest, setScoreFinalTest] = useState(0)
  const [scratchPads, setScratchPads] = useState<ScratchPad[]>([])

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
      return tabs.find((e: any) => e.id === currentPage)
    } else return undefined
  }, [currentPage, tabs])

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

  const handleFlagQuestion = (tab: any) => {
    setTabs((prev: any) => {
      const newData = prev.map((item: any) => {
        if (tab === item.id) {
          if (!item.flaged) {
            toast.success('The question has been marked!')
          } else {
            toast.success('The question has been unmaked!')
          }
          return { ...item, flaged: !item.flaged }
        }
        return item
      })
      return newData
    })
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

  const [scratchPadValues, setScratchPadValues] = useState<
    ScratchPadValue | null | undefined
  >()

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
      for (let e of getAnswerDragNDrop()) {
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
  const getValueFillText = () => {}

  const getValueSelectText = () => {
    let value = [] as any
    const inputs = document.querySelectorAll(
      'select.sapp-select--selectword-preview',
    ) as any

    for (let e of inputs) {
      value.push(e?.value)
    }
    return value
  }

  const getAnswerMatching = () => {
    let value = [] as any
    const inputs = document.querySelectorAll('.sapp-match-result') as any
    for (let e of inputs) {
      const childId = e.querySelector('.sapp-notched-container')
      value.push({ question_id: e.id, answer_id: childId?.id || undefined })
    }

    return value
  }

  const getAnswerDragNDrop = () => {
    let value = [] as any
    const inputs = document.querySelectorAll('.sapp-input-dragNDrop') as any
    for (let e of inputs) {
      const idAnswer = e.querySelector('.answer-box')
      value.push({ id: e?.id, value: e?.innerText, idAnswer: idAnswer?.id })
    }
    return value
  }

  const getResult = async (currentTabContent: any) => {
    const res = await TestAPI.getQuestionAnswer(currentTabContent.id)
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
    if (!currentContent?.done) {
      if (
        currentContent.qType === QUESTION_TYPES.ONE_CHOICE ||
        currentContent.qType === QUESTION_TYPES.TRUE_FALSE ||
        currentContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
      ) {
        const answers = handleSaveAnswer(
          getValues(`${currentPage}_answer`),
          currentPage,
          tabs,
        )
        return answers
      } else if (currentContent.qType === QUESTION_TYPES.MATCHING) {
        const answers = handleSaveAnswer(
          getAnswerMatching(),
          currentContent?.id,
          tabs,
        )
        return answers
      } else if (currentContent.qType === QUESTION_TYPES.DRAG_DROP) {
        const answers = handleSaveAnswer(
          getAnswerDragNDrop(),
          currentContent?.id,
          tabs,
        )
        return answers
      } else if (currentContent.qType === QUESTION_TYPES.SELECT_WORD) {
        const answers = handleSaveAnswer(
          getValueSelectText(),
          currentContent?.id,
          tabs,
        )
        return answers
      } else if (currentContent.qType === QUESTION_TYPES.FILL_WORD) {
        const answers = handleSaveAnswer(
          getValues(`${currentPage}_fillword`),
          currentPage,
          tabs,
        )
        return answers
      } else if (currentContent.qType === QUESTION_TYPES.ESSAY) {
        const answers = handleSaveAnswer(
          getValues(`${currentPage}_${essayData?.index}_answer`),
          currentContent?.id,
          tabs,
        )
        return answers
      } else return tabs
    } else {
      return tabs
    }
  }

  async function getDetail(currentPage: string) {
    let topicDescription
    try {
      if (!isUndefined(quizDetail) && !isUndefined(questions)) {
        topicDescription = await CoursesAPI.getTopicDescription(
          questions[questions.findIndex((e: any) => e.id === currentPage)]
            ?.question_topic_id,
          quizDetail?.id,
        )
      }
      const res = await QuestionAPI.getQuestionDetail(currentPage)
      return { topicDescription, question: res.data }
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
    setScratchPadValues(null)
  }

  const handleSaveAnswer = (data: any, tabId: any, tabs: any) => {
    setStartTime(Date.now())
    let newData = [] as any
    for (let item of tabs) {
      if (tabId === item?.id) {
        var newItem = {
          ...item,
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

        newData.push(newItem)
      } else {
        newData.push(item)
      }
    }
    return newData
  }

  const handleSaveFileEssay = (file: any, requirementIndex: number | null) => {
    setTabs((prev: any) => {
      let _tabs = [...prev]
      let newData = [] as any
      for (let item of _tabs) {
        if (currentPage === item.id) {
          let newItem = { ...item }
          if (
            requirementIndex !== null &&
            item.data.requirements &&
            essayData?.req !== undefined
          ) {
            newItem = {
              ...item,
              data: {
                ...item.data,
                requirements: (item?.data?.requirements || [])?.map(
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
          } else {
            newItem = {
              ...item,
              answer_file: {
                file_key: file?.file_key,
                file_name: file?.name,
              },
            }
          }
          newData.push(newItem)
        } else {
          newData.push(item)
        }
      }
      return newData
    })
  }

  const handleChangeTypeEssay = (value: number) => {
    setTabs((prev: any) => {
      const arr = [...prev]
      const index = arr.findIndex((e) => e.id === currentPage)
      arr[index] = { ...arr[index], response_type: value }
      return arr
    })
  }

  const answerListRef = useRef<AnswerList>({})

  const setAnswerListValue = debounce((requirementId: number) => {
    answerListRef.current[requirementId] =
      getValues(`${currentPage}_${essayData?.index}_answer`) || ''
  }, 200)

  const { setScoreQuestion, setSubmitTest, courseType, setSubmitEventTest } =
    useCourseContext()

  const handleSubmitQuestion = async (type_submit: 'timeout' | 'submit') => {
    let allQuest = handleSaveCurrentAnswer(tabs, currentTabContent)
    let quiz_position_mapping = []
    let answers: {
      question_id: any
      question_answer_id?: any
      time_spent: number
      answer?: any
      short_answer?: any
      requirement_id?: any
      response_option?: any
      active?: string
      answer_file?: any
    }[] = []
    let reformTabs: any[] = []
    setLoading(true)
    setSubmited(true)
    for (let e of allQuest) {
      reformTabs.push({ ...e, done: true })
      if (e.answer) {
        if (
          e.qType === QUESTION_TYPES.ONE_CHOICE ||
          e.qType === QUESTION_TYPES.TRUE_FALSE
        ) {
          answers.push({
            question_id: e.id,
            question_answer_id: e.answer,
            time_spent: Math.ceil(e.timeSpent / 1000),
          })
        } else if (e.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
          let answer = []
          for (let el of e.answer) {
            answer.push({ answer_id: el })
          }
          answers.push({
            question_id: e.id,
            answer,
            time_spent: Math.ceil(e.timeSpent / 1000),
          })
        } else if (e.qType === QUESTION_TYPES.MATCHING) {
          answers.push({
            question_id: e.id,
            answer: e.answer,
            time_spent: Math.ceil(e.timeSpent / 1000),
          })
        } else if (e.qType === QUESTION_TYPES.DRAG_DROP) {
          let answer = []
          for (let i in e.answer) {
            if (e?.answer?.[i].idAnswer) {
              answer.push({
                answer_id: e?.answer?.[i]?.idAnswer,
                answer_position: +i + 1,
              })
            }
          }
          answers.push({
            question_id: e.id,
            answer,
            time_spent: Math.ceil(e.timeSpent / 1000),
          })
        } else if (e.qType === QUESTION_TYPES.SELECT_WORD) {
          let answer = []
          for (let i in e.answer) {
            if (e.answer[i] && e.answer[i] !== '') {
              answer.push({
                answer_id: e.answer[i],
                answer_position: +i + 1,
              })
            }
          }
          answers.push({
            question_id: e.id,
            answer,
            time_spent: Math.ceil(e.timeSpent / 1000),
          })
        } else if (e.qType === QUESTION_TYPES.FILL_WORD) {
          let answer = []
          for (let i in e.answer) {
            if (e.answer[i] && e.answer[i] !== '') {
              answer.push({
                answer_text: e.answer[i],
                answer_position: +i + 1,
              })
            }
          }
          answers.push({
            question_id: e.id,
            answer,
            time_spent: Math.ceil(e.timeSpent / 1000),
          })
        }
      }
      if (e.qType === QUESTION_TYPES.ESSAY) {
        if (checkAnswered(e, true)) {
          const requirements = e?.data?.requirements?.length
            ? e?.data?.requirements
            : [null]
          if (requirements?.length) {
            requirements?.forEach((requirement: Requirement | null) => {
              answers.push({
                question_id: e.id,
                short_answer:
                  answerListRef?.current?.[requirement?.id || ''] ??
                  (requirement?.id ? '' : e?.answer || ''),
                requirement_id: requirement?.id || null,
                response_option:
                  e?.data?.response_option ??
                  (e?.response_type === 0 ? 'WORD' : 'SHEET'),
                time_spent: Math.ceil(e?.timeSpent / 1000),
                active: 'SUBMITED',
                answer_file: requirement?.answer_file || e?.answer_file || null,
              })
            })
          } else {
            answers.push({
              question_id: e.id,
              short_answer: e?.answer || '',
              requirement_id: null,
              response_option:
                e?.data?.response_option ??
                (e?.response_type === 0 ? ESSAY_TYPE.WORD : ESSAY_TYPE.SHEET),
              time_spent: Math.ceil(e?.timeSpent / 1000),
              active: 'SUBMITED',
              answer_file: e?.answer_file || null,
            })
          }
        }
      }
      quiz_position_mapping.push({
        question_id: e.id,
        answers: e.data?.answers,
      })
    }

    if (type_submit === 'submit') {
      setTabs(async () => {
        await handleChangeTab(tabs[0].id)
        // ref.setKey
        return reformTabs
      })
      dispatch(disableUnsavedChange())
      const res = await CoursesAPI.submitQuestion(quizAttempId?.id as string, {
        answers: answers,
        quiz_position_mapping: quiz_position_mapping,
        total_attempt_time:
          quizDetail?.quiz_timed * 60 -
          (quizDetail?.quiz_timed ? timeRef?.current?.handleGetTime() || 0 : 0),
        scratch_pads: scratchPads || [],
      })
      if (res) {
        if (isCompletedCourse.status) {
          setTimeout(() => {
            dispatch(showPopupCompletedCourse(isCompletedCourse.content))
          }, 2000)
        }

        if (
          quizDetail?.is_graded &&
          quizDetail?.grading_method === GRADING_METHOD.MANUAL
        ) {
          setOpenReportModal(true)
          return
        }
        if (type === 'entrance') {
          router.replace(`/entrance-test/test-result/${res?.data?.id}`)
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
      }
    } else {
      setTabs(async () => {
        // ref.setKey
        handleChangeTab(tabs[0].id)
        return reformTabs
      })
      dispatch(disableUnsavedChange())
      const res = await CoursesAPI.submitQuestion(quizAttempId?.id as string, {
        answers: answers,
        quiz_position_mapping: quiz_position_mapping,
        total_attempt_time:
          quizDetail.quiz_timed * 60 -
          (quizDetail.quiz_timed ? timeRef?.current?.handleGetTime() || 0 : 0),
      })
      if (res) {
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

    // clearInterval(intervalRef.current)
    setLoading(false)
    return
  }

  const handleClearSelection = (currentTabContent: any) => {
    const data = currentTabContent.data

    if (data && !currentTabContent.done) {
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
    setTabs((prev: TabItem[]) => {
      const newData = prev.map((item: TabItem) => {
        if (currentPage === item.id) {
          return {
            ...item,
            answer_file: undefined,
            data: {
              ...item.data,
              requirements: item.data.requirements.map(
                (req: Requirement, idx: number) => {
                  if (idx === requirementIndex) {
                    return { ...req, answer_file: undefined }
                  }
                  return req
                },
              ),
            },
          }
        }
        return item
      })
      return newData
    })
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

  const checkTypeAndRenderTitle = (type: string) => {
    let pageTitle = ''
    switch (type) {
      case TEST_TYPE.MID_TERM_TEST:
        return (pageTitle = 'Midterm Test')
      case TEST_TYPE.FINAL_TEST:
        return (pageTitle = 'Final Test')
      case TEST_TYPE.TOPIC_TEST:
        return (pageTitle = 'Topic Test')
      case TEST_TYPE.CHAPTER_TEST:
        return (pageTitle = 'Chapter Test')
      case TEST_TYPE.PART_TEST:
        return (pageTitle = 'Part Test')
      case TEST_TYPE.ENTRANCE_TEST:
        return (pageTitle = 'Entrance Test')
      case TEST_TYPE.ENTRANCE_TEST:
        return (pageTitle = 'Event Test')
      default:
        return pageTitle
    }
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
      label: `Exhibit ${+index + 1}`,
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
        setFilterTabs(tabs.filter((e: any) => e?.flaged === true))
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
    async function createQuizAttempt() {
      try {
        const res = await CoursesAPI.createQuizAttempt(
          router.query.id as string,
          router.query.class_user_id as string,
        )
        if (res?.data?.progress?.is_completed) {
          setIsCompletedCourse({
            status: res?.data?.progress?.is_completed,
            content: res?.data?.progress?.content,
          })
        }
        setQuizAttempId(res.data)
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
    if (router.query.id) {
      createQuizAttempt()
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
    if (currentTabContent?.data?.requirements) {
      setEssayData({
        req: currentTabContent?.data?.requirements?.[0],
        index: 0,
      })
    }
  }, [currentTabContent?.id])

  useEffect(() => {
    async function fetchTabs() {
      if (questions?.length > 0) {
        const arr = []

        for (let i in questions) {
          let baseData = {
            ...questions[i],
            viewed: +i === 0,
            flaged: false,
            done: false,
            index: +i,
            response_type: 0,
          }
          if (+i === 0) {
            const { topicDescription, question } = await getDetail(
              questions?.[0]?.id,
            )
            baseData = {
              ...baseData,
              viewed: question ? true : false,
              ...(question && {
                data: question,
                topicDescription: topicDescription?.data,
              }),
            }
          }
          arr.push(baseData)
        }
        setTabs(arr)
      } else {
        router.push(PageLink.PAGE_NOT_FOUND)
      }
      setCurrentPage(questions?.[0]?.id)
    }
    if (questions) {
      fetchTabs()
    }
  }, [questions, router])

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
            <div className="relative z-50 flex items-center justify-between bg-gray-3 px-6 py-2">
              <div className="w-2/6 truncate text-lg-xl font-medium">
                {quizDetail?.name}
              </div>
              {quizDetail?.quiz_timed && (
                <Countdown
                  remainTime={quizDetail?.quiz_timed}
                  onTimeOut={() => {
                    if (!openLimit) {
                      dispatch(disableUnsavedChange())
                      handleSubmitQuestion('timeout')
                    }
                  }}
                  ref={timeRef}
                />
              )}

              <div className="flex w-2/6 items-center justify-end">
                {!['ENTRANCE_TEST', 'EVENT_TEST'].includes(
                  quizDetail?.quiz_type,
                ) && (
                  <div className="mr-6 text-medium-sm text-bw-1">
                    Attempt: {quizAttempId?.number_of_attempts}
                    {quizDetail?.is_limited
                      ? `/${quizDetail?.limit_count}`
                      : ''}
                  </div>
                )}
                <ButtonCancelSubmit
                  className={'flex flex-row-reverse gap-4'}
                  submit={{
                    title: 'Finish',
                    size: 'small',
                    loading: false,
                    disabled: submited,
                    className: 'border border-bw-1',
                    color: 'secondary',
                    onClick: () => {
                      if (checkUnSubmitAnswer()?.length > 0) {
                        setUnSubmitAnswer(true)
                      } else {
                        setOpenSubmit(true)
                      }
                      dispatch(disableUnsavedChange())
                    },
                  }}
                  cancel={{
                    title: 'Quit',
                    size: 'small',
                    className: 'border border-bw-1 !w-[109px]',
                    color: 'secondary',
                    onClick: () => {
                      setOpenQuit(true)
                      dispatch(disableUnsavedChange())
                      if (type === 'event-test') {
                        setSubmitEventTest(true)
                      }
                    },
                    loading: false,
                    //   full: fullWidthBtn,
                  }}
                ></ButtonCancelSubmit>
              </div>
            </div>

            {/** Tabs */}
            {tabs?.length > 0 && (
              <div className="relative z-10 w-full bg-gray-4 px-6 py-2 shadow-pagination">
                <TabSlide
                  data={filteredTabs}
                  currentTab={currentPage}
                  setCurrentTab={setCurrentPage}
                  optionShowAll={<OptionShowAll />}
                  handleChangeTab={async (id?: string) => {
                    id && handleChangeTab(id)
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
                  </div>
                  <div
                    className="h-full w-[20px] cursor-ew-resize bg-gray-3"
                    onMouseDown={() => {
                      setStartResize(true)
                    }}
                    onMouseUp={() => setStartResize(false)}
                  ></div>
                  <div
                    className="h-full overflow-auto bg-white py-6 "
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
          <div className=" z-10 flex h-[48px]  items-center justify-between bg-gray-3 shadow-question-footer">
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
                          {`Exhibits (${exhibitData?.length || 0})`}
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
                              className={`p-3 ${
                                !watch('exhibits')?.includes(e?.value) &&
                                'min-w-[100px] text-gray-1'
                              }`}
                              onClick={() => handleOpenExhibit(e?.value)}
                            >{`Exhibit ${index + 1}`}</button>
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
                        (e: any, index: number) => {
                          return (
                            <button
                              key={e.id}
                              className={`p-3 ${
                                essayData.index !== index && 'text-gray-1'
                              }`}
                              onClick={() => {
                                setEssayData({ req: e, index: index })
                                rightSideRef?.current &&
                                  rightSideRef.current.scrollTo({
                                    top: 0,
                                    behavior: 'smooth',
                                  })
                              }}
                            >{`Requirement (${index + 1})`}</button>
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
                    <div className="hidden 3.5xl:block ">
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
                className="flex items-center justify-center gap-3 border border-gray-1 px-3 py-2 3xl:w-[150px] "
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
                disabled={currentTabContent?.done}
                className={`flex items-center gap-3 border border-solid ${
                  !currentTabContent?.done
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
              !currentTabContent?.done &&
              quizDetail?.quiz_type !== 'ENTRANCE_TEST' ? (
                <button
                  className="flex w-[150px] items-center justify-center gap-3 border border-gray-1 px-3 py-2 "
                  onClick={async () => {
                    const data = await getResult(currentTabContent)
                    confirmAnswer(
                      data?.corrects,
                      data?.solution,
                      currentTabContent,
                      data?.isSelfReflection,
                      data?.requirements,
                    )
                    trackGAEvent('Click Button View Answer Test')
                  }}
                >
                  <div className="text-medium-sm font-medium">View Answer</div>
                </button>
              ) : (
                filteredTabs.findIndex((e: any) => e.id === currentPage) <
                  filteredTabs.length - 1 && (
                  <button
                    className="flex w-[150px] items-center justify-center gap-3 border border-gray-1 px-3 py-2 "
                    onClick={async () => {
                      const index = filteredTabs.findIndex(
                        (e: any) => e.id === currentPage,
                      )
                      handleChangeTab(filteredTabs[index + 1].id)
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
            scratchPadValues={scratchPadValues}
            setScratchPadValues={setScratchPadValues}
            scratchPads={scratchPads}
            setScratchPads={setScratchPads}
            onFocusingPad={onFocusingPad}
            setOnFocusingPad={setOnFocusingPad}
            handleCloseScratchPad={handleCloseScratchPad}
            openScratchPad={openScratchPad}
          />
          {/** End Scratchpads */}

          <TestTimeOutModal
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
                    setSubmitEventTest(true)
                  } else {
                    if (
                      type !== 'entrance' &&
                      quizDetail?.quiz_type !== 'FINAL_TEST'
                    ) {
                      router.replace(
                        `/courses/test/test-result/${QuizResultId}`,
                      )
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
                setSubmitEventTest(true)
              } else {
                router.back()
              }
            }}
            handleCancel={() =>
              dispatch(loginSlice.actions.enableUnsavedChange())
            }
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
              if (type === 'event-test') {
                router.replace(`/event-test`)
                setSubmitEventTest(true)
              } else {
                setOpenSubmit(false)
              }
              handleSubmitQuestion('submit')
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
              if (type === 'event-test') {
                router.replace(`/event-test`)
                setSubmitEventTest(true)
              } else {
                setUnSubmitAnswer(false)
              }
              handleSubmitQuestion('submit')
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

          <SappModalV3
            open={openReportModal}
            okButtonCaption="Back"
            handleCancel={() => {}}
            onOk={() => {
              setOpenReportModal(false)
              router.back()
            }}
            fullWidthBtn={true}
            buttonSize="extra"
            icon={<ConfirmIcon />}
            header={FINISHED_TEST_TITLE}
            content={`Congratulations on completing ${quizDetail?.name}. The result will be sent to you via email after the grading is finished.`}
          />
        </div>
      </CourseProvider>
    </FullScreenLayout>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default TestDetail
