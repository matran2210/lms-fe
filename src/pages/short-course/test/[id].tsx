import {
  removeHighlights,
  serializeHighlights,
} from '@/../node_modules/@funktechno/texthighlighter/lib/index'
import useClickOutside from '@components/base/clickoutside/HookClick'
import EditorReader from '@components/base/editor/EditorReader'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import DragNDropPreivew from '@components/questionType/DragNDrop'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import NewFiltext from '@components/questionType/NewFillText'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import { CourseProvider, useCourseContext } from '@contexts/index'
import { runHighlight } from '@utils/index'
import { isEmpty, isUndefined, uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SappLoading from 'src/common/SappLoading'
import UnSubmitAnswerModal from 'src/components/UnSubmitAnswerModal'
import {
  DISPLAY_TYPE,
  EXHIBIT_TEXT_REPLACE,
  GRADING_METHOD,
  PageLink,
  PROGRAM,
  QUESTION_TYPES,
  TEST_TYPE,
} from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { disableUnsavedChange, loginSlice } from 'src/redux/slice/Login/Login'
import { IExhibit } from 'src/type/exhibit'

import { trackGAEvent } from '@utils/google-analytics'
import { showPopupCompletedCourse } from 'src/redux/slice/Popup/Result-test'
import { Requirement, ScratchPadValue } from 'src/type'
import { IRequirement } from 'src/type/case-study'
import { CoursesAPI } from '@pages/api/courses'
import { TestAPI } from '@pages/api/test'
import QuitTestModal from '@pages/courses/test/quit-test'
import { QuestionAPI } from '@pages/api/question'
import TestScratchPads from '@pages/test/TestScratchPads'
import TestTimeOutModal from '@pages/courses/test/test-timeout'
import ConFirmSubmit from '@pages/test/conFirmSubmit'
import LimitQuizModal from '@pages/test/limitQuizModal'
import SuccessSubmittedConstructorModal from '@pages/test/SuccessSubmittedConstructorModal'
import HeaderTest from '@components/courses/test/HeaderTest'
import ButtonIcon from '@components/courses/buttons/ButtonIcon'
import { Arrows, Calculator } from '@components/courses/icons'
import { Flag } from '@components/courses/icons/Flag'
import { Doc2 } from '@components/courses/icons/Doc2'
import {
  DragDropAnswer,
  EditorRefType,
  MatchingAnswer,
  QuestionTab,
  QuizDetail,
  RefType,
  ScratchPadItem,
  Tab,
  TabAnswer,
  TimerRefType,
  UploadState,
} from 'src/type/courses-3-level'
import TabSlide from '@components/courses/test/TabSlide'
import { IQuestion } from 'src/type/course'
import { NoMobile } from '@components/courses/icons/NoMobile'
import ButtonPrimaryV2 from '@components/base/button/ButtonPrimaryV2'
import ButtonSecondaryV2 from '@components/base/button/ButtonSecondaryV2'

const warningText =
  'You have unsaved changes - are you sure you wish to leave this page?'
const TestDetail = () => {
  const allowNavigationRef = useRef(false)
  const checkType = (
    data: IQuestion | undefined,
    type: string,
    currentTabID: string,
    defaultValue: TabAnswer | undefined,
    corrects?:
      | Record<string, boolean>
      | {
          corrects?: {
            id: string
            answer: string
            is_correct: boolean
            answer_position: number
          }[]
        },
    highlighted?: string,
    solution?: string,
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
            corrects={corrects as Record<string, boolean>}
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
            corrects={corrects as Record<string, boolean>}
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
            corrects={corrects as Record<string, boolean>}
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
            corrects={
              typeof corrects === 'object' &&
              'corrects' in corrects &&
              Array.isArray(corrects.corrects)
                ? corrects.corrects
                : undefined
            }
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
            corrects={
              typeof corrects === 'object' &&
              'corrects' in corrects &&
              Array.isArray(corrects.corrects)
                ? corrects.corrects
                : undefined
            }
            ref={ref}
            solution={solution}
          />
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
    answers?.map((item, index: number) => {
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

  const validateAnswer = (item: {
    answer: TabAnswer | undefined
    answer_file?: { file_key?: string; file_name?: string }
  }): boolean => {
    if (item?.answer_file?.file_key) return true

    if (typeof item.answer === 'string') {
      return item.answer.trim() !== ''
    }

    if (Array.isArray(item.answer)) {
      if (item.answer.length === 0) return false
      const emptyAnswer = item.answer.filter((el) => {
        if (typeof el === 'string') {
          return el.trim() === ''
        }

        if (typeof el === 'object' && el !== null) {
          if ('idAnswer' in el && !el.idAnswer) return true
          if ('answer_id' in el && !el.answer_id) return true
        }

        return false
      })

      return emptyAnswer.length === 0
    }

    return false
  }

  const router = useRouter()

  const useGetQuizDetail = () => {
    const [quizDetail, setQuizDetail] = useState<QuizDetail>()
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
    const [questions, setQuestionTabs] = useState<QuestionTab[] | undefined>(
      undefined,
    )
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

  const [currentPage, setCurrentPage] = useState<string>(
    questions?.[0]?.id || '',
  )

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
  const [openScratchPad, setOpenScratchPad] = useState<ScratchPadItem[]>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [tabs, setTabs] = useState<Tab[]>([])

  const [allowHighLight, setAllowHighLight] = useState(false)
  const [allowUnHighLight, setAllowUnHighLight] = useState(false)
  const [exhibitData, setExhibitData] = useState<IExhibit[]>()
  const [routeBack, setRouteBack] = useState(false)
  const [isQuizAttemptCreated, setIsQuizAttemptCreated] = useState(false)
  const [isCompletedCourse, setIsCompletedCourse] = useState({
    status: false,
    content: '',
  })
  const [quizAttempId, setQuizAttempId] = useState({
    id: '',
    number_of_attempts: 0,
    is_limited: false,
  })
  const [startTime, setStartTime] = useState(Date.now())
  const [activeShowAll, setActiveShowAll] = useState<boolean>(false)
  const timeRef = useRef<TimerRefType | null>(null)
  const dispatch = useAppDispatch()

  const [submited, setSubmited] = useState(false)
  const [openTimeOut, setOpenTimeOut] = useState(false)
  const [QuizResultId, setQuizResultId] = useState('')
  const [openSubmit, setOpenSubmit] = useState(false)
  const [openQuit, setOpenQuit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openLimit, setOpenLimit] = useState(false)
  const [startResize, setStartResize] = useState(false)
  const [currentMousePos, setCurrentMousePos] = useState(0)
  const [leftWidth, setLeftWidth] = useState(0)
  const [currentLeftWidth, setCurrentLeftWidth] = useState(0)
  const { unsavedChange } = useAppSelector((state) => state.loginReducer)
  const rightSideRef = useRef<HTMLDivElement | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [openUnSubmitAnswer, setUnSubmitAnswer] = useState(false)
  const [unSubmitAnswerData, setUnSubmitAnswerData] = useState<Array<number>>(
    [],
  )
  const [exhibitText, setExhibitText] = useState<string>('')
  const [openReportModal, setOpenReportModal] = useState({
    open: false,
    resultId: '',
  })

  const [scoreFinalTest, setScoreFinalTest] = useState(0)
  const [scratchPads, setScratchPads] = useState<string>('')

  const currentTabContent = useMemo(() => {
    if (tabs && tabs.length > 0) {
      return tabs.find((e) => e.id === currentPage)
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

  const isScatchPadEnabled = useMemo(() => {
    return openScratchPad.some((item) => item.type === 'scratch_pad') || false
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

  const handleFlagQuestion = (tabId: string) => {
    setTabs((prev) =>
      prev.map((item) => {
        if (tabId === item.id) {
          toast.success(
            item.flag
              ? 'The question has been unmarked!'
              : 'The question has been marked!',
          )
          return { ...item, flag: !item.flag }
        }
        return item
      }),
    )
  }

  const handleCloseScratchPad = (pad: ScratchPadItem) => {
    setOpenScratchPad((prev) => {
      const newArr = prev.filter((e) => e.id !== pad.id)
      if (pad.type === 'exhibits') {
        setValueExhibits(
          'exhibits',
          getValuesExhibits('exhibits').filter((e: string) => e !== pad.id),
        )
      }
      return newArr
    })
  }

  const [scratchPadValues, setScratchPadValues] = useState<ScratchPadValue[]>(
    [],
  )

  function removeHighlight() {
    const domEle = document.getElementById('hightlight_area') as HTMLElement
    removeHighlights(domEle)
    handleSaveHighLight(serializeHighlights(domEle))
  }

  const checkAnswered = (currentContent: Tab, isSubmit = false) => {
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
    }
  }
  const [filteredTabs, setFilterTabs] = useState<Tab[]>([])
  const [trigger, setTrigger] = useState(false)

  const ref = useRef<RefType>(null)
  const refEditor = useRef<EditorRefType>(null)

  // TODO: Implement this
  const getValueFillText = () => {}

  const getValueSelectText = (): string[] => {
    const selects = document.querySelectorAll<HTMLSelectElement>(
      'select.sapp-select--selectword-preview',
    )
    return Array.from(selects).map((select) => select.value)
  }

  const getAnswerMatching = (): MatchingAnswer => {
    const elements =
      document.querySelectorAll<HTMLElement>('.sapp-match-result')

    return Array.from(elements).map((element) => {
      const child = element.querySelector<HTMLElement>(
        '.sapp-notched-container',
      )
      return {
        question_id: element.id,
        answer_id: child?.id,
      }
    })
  }

  const getAnswerDragNDrop = (): DragDropAnswer => {
    const containers = document.querySelectorAll<HTMLElement>(
      '.sapp-input-dragNDrop',
    )

    return Array.from(containers).map((container) => {
      const answerEl = container.querySelector<HTMLElement>('.answer-box')
      return {
        id: container.id,
        value: container.innerText.trim(),
        idAnswer: answerEl?.id,
      }
    })
  }

  const getResult = async (currentTabContent: Tab) => {
    const res = await TestAPI.getQuestionAnswer(currentTabContent.id)
    let corrects:
      | Record<string, boolean>
      | {
          corrects: {
            id: string
            answer: string
            is_correct: boolean
            answer_position: number
          }[]
        }
      | undefined

    if (
      currentTabContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentTabContent.qType === QUESTION_TYPES.TRUE_FALSE ||
      currentTabContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
    ) {
      corrects = res?.data?.[0].answers?.reduce(
        (
          previousValue: Record<string, boolean>,
          currentValue: { id: string; is_correct: boolean },
        ) => ({
          ...previousValue,
          [currentValue.id]: currentValue.is_correct,
        }),
        {},
      )
    } else if (
      currentTabContent.qType === QUESTION_TYPES.FILL_WORD ||
      currentTabContent.qType === QUESTION_TYPES.SELECT_WORD ||
      currentTabContent.qType === QUESTION_TYPES.MATCHING ||
      currentTabContent.qType === QUESTION_TYPES.DRAG_DROP
    ) {
      corrects = { corrects: [...res?.data?.[0]?.answers] }
    }

    return {
      corrects,
      solution: res?.data?.[0]?.solution,
      isSelfReflection: res?.data?.[0]?.is_self_reflection,
      requirements: res?.data?.[0]?.requirements,
    }
  }

  const confirmAnswer = async (
    corrects:
      | Record<string, boolean>
      | {
          corrects: {
            id: string
            answer: string
            is_correct: boolean
            answer_position: number
          }[]
        }
      | undefined,
    solution: string | undefined,
    currentTabContent: Tab,
    isSelfReflection: boolean,
    requirements?: IRequirement[],
  ) => {
    setLoading(true)
    const newData = tabs.map((item) => {
      if (currentTabContent.id === item.id) {
        if (
          currentTabContent.qType !== QUESTION_TYPES.FILL_WORD &&
          currentTabContent.qType !== QUESTION_TYPES.SELECT_WORD
        ) {
          ref.current?.handleReset()
        }
        if (item.data?.requirements?.length) {
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
          corrects,
          solution,
          timeSpent: item.timeSpent
            ? Date.now() - startTime + item.timeSpent
            : Date.now() - startTime,
        }
      }
      return item
    })
    const newTabs = handleSaveCurrentAnswer(newData, currentTabContent)
    const currentQuestion = newTabs.find((e) => e.id === currentTabContent?.id)
    const answerItem = formatAnswerItem(currentQuestion as Tab)
    setTabs(newTabs)
    setLoading(false)
    const payload = {
      question_id: currentTabContent?.id,
      total_attempt_time:
        (quizDetail?.quiz_timed || 0) * 60 -
        (quizDetail?.quiz_timed ? timeRef?.current?.handleGetTime() || 0 : 0),
      scratch_pads: scratchPads || [],
      flag: currentTabContent?.flag,
      is_viewed_answer: currentTabContent?.is_viewed_answer,
      time_spent: Math.ceil((currentTabContent?.timeSpent || 0) / 1000),
      ...answerItem,
    }

    const res = await CoursesAPI.submitAnswer(
      quizAttempId?.id as string,
      payload,
    )
  }

  const handleSaveCurrentAnswer = (
    tabs: Tab[],
    currentContent: Tab | undefined,
  ): Tab[] => {
    if (!currentContent?.done) {
      if (
        currentContent?.qType === QUESTION_TYPES.ONE_CHOICE ||
        currentContent?.qType === QUESTION_TYPES.TRUE_FALSE ||
        currentContent?.qType === QUESTION_TYPES.MULTIPLE_CHOICE
      ) {
        const answers = handleSaveAnswer(
          getValues(`${currentPage}_answer`),
          currentPage,
          tabs,
        )
        return answers
      } else if (currentContent?.qType === QUESTION_TYPES.MATCHING) {
        const answers = handleSaveAnswer(
          getAnswerMatching(),
          currentContent?.id,
          tabs,
        )
        return answers
      } else if (currentContent?.qType === QUESTION_TYPES.DRAG_DROP) {
        const answers = handleSaveAnswer(
          getAnswerDragNDrop(),
          currentContent?.id,
          tabs,
        )
        return answers
      } else if (currentContent?.qType === QUESTION_TYPES.SELECT_WORD) {
        const answers = handleSaveAnswer(
          getValueSelectText(),
          currentContent?.id,
          tabs,
        )
        return answers
      } else if (currentContent?.qType === QUESTION_TYPES.FILL_WORD) {
        const answers = handleSaveAnswer(
          getValues(`${currentPage}_fillword`),
          currentPage,
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
    let question
    try {
      if (!isUndefined(quizDetail) && !isUndefined(questions)) {
        topicDescription = await CoursesAPI.getTopicDescription(
          questions[questions.findIndex((e) => e.id === currentPage)]
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

  const handleChangeTab = async (currentTab: string) => {
    setLoading(true)
    setScratchPads('')
    const currentContent = tabs?.find((e) => e.id === currentTab)
    setStartTime(Date.now())
    if (!currentContent?.viewed) {
      const { question, topicDescription } = await getDetail(currentTab)
      if (question) {
        const newData = tabs?.map((item) => {
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
          currentTabContent?.qType !== QUESTION_TYPES.FILL_WORD &&
          currentTabContent?.qType !== QUESTION_TYPES.SELECT_WORD
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
        currentTabContent?.qType !== QUESTION_TYPES.FILL_WORD &&
        currentTabContent?.qType !== QUESTION_TYPES.SELECT_WORD
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

  const handleSaveAnswer = (
    data: TabAnswer,
    tabId: string,
    tabs: Tab[],
  ): Tab[] => {
    return tabs.map((item) => {
      if (tabId === item.id) {
        return {
          ...item,
          answer: data,
          attempted: item.attempted || checkAnswered(item),
          timeSpent: !item.done
            ? item.timeSpent
              ? Date.now() - startTime + item.timeSpent
              : Math.max(0, Date.now() - startTime)
            : item.timeSpent,
        }
      }
      return item
    })
  }

  const { setScoreQuestion, setSubmitTest, courseType, setSubmitEventTest } =
    useCourseContext()

  const formatAnswerItem = (question: Tab) => {
    // Handle single choice and true/false questions
    if (
      question.qType === QUESTION_TYPES.ONE_CHOICE ||
      question.qType === QUESTION_TYPES.TRUE_FALSE
    ) {
      return {
        question_id: question.id,
        time_spent: Math.ceil((question.timeSpent || 0) / 1000),
        ...(question.answer !== '' && {
          question_answer_id: question.answer as string,
        }),
      }
    }

    // Handle multiple choice questions
    if (question.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
      const answer: { answer_id?: string }[] = []

      for (let el of question.answer || []) {
        if (typeof el === 'string') {
          answer.push({ answer_id: el })
        } else if (el && typeof el === 'object') {
          if ('answer_id' in el && typeof el.answer_id === 'string') {
            answer.push({ answer_id: el.answer_id })
          } else if ('idAnswer' in el && typeof el.idAnswer === 'string') {
            answer.push({ answer_id: el.idAnswer })
          }
        }
      }

      return {
        question_id: question.id,
        answer,
        time_spent: Math.ceil((question.timeSpent || 0) / 1000),
      }
    }

    // Handle matching questions
    if (question.qType === QUESTION_TYPES.MATCHING) {
      const answer = (question.answer as MatchingAnswer)?.map((item) => ({
        answer_id: item.answer_id,
      }))

      return {
        question_id: question.id,
        answer: answer,
        time_spent: Math.ceil((question.timeSpent || 0) / 1000),
      }
    }

    // Handle drag and drop questions
    if (question.qType === QUESTION_TYPES.DRAG_DROP) {
      const answer = (question.answer as DragDropAnswer)
        ?.map((item, index) => {
          if (item?.idAnswer) {
            return {
              answer_id: item.idAnswer,
              answer_position: index + 1,
            }
          }
          return null
        })
        .filter(
          (item): item is { answer_id: string; answer_position: number } =>
            item !== null,
        )

      return {
        question_id: question.id,
        answer,
        time_spent: Math.ceil((question.timeSpent || 0) / 1000),
      }
    }

    // Handle select word questions
    if (question.qType === QUESTION_TYPES.SELECT_WORD) {
      const answer = (question.answer as string[])
        ?.map((item, index) => {
          if (item && item !== '') {
            return {
              answer_id: item,
              answer_position: index + 1,
            }
          }
          return null
        })
        .filter(
          (item): item is { answer_id: string; answer_position: number } =>
            item !== null,
        )
      return {
        question_id: question.id,
        answer,
        time_spent: Math.ceil((question.timeSpent || 0) / 1000),
      }
    }

    // Handle fill word questions
    if (question.qType === QUESTION_TYPES.FILL_WORD) {
      const answer = (question.answer as string[])
        ?.map((text, index) => {
          if (text && text.trim() !== '') {
            return {
              answer_text: text,
              answer_position: index + 1,
            }
          }
          return null
        })
        .filter(
          (item): item is { answer_text: string; answer_position: number } =>
            item !== null,
        )

      return {
        question_id: question.id,
        answer,
        time_spent: Math.ceil((question.timeSpent || 0) / 1000),
      }
    }

    return null
  }

  const handleSubmitQuestion = async (type_submit: 'timeout' | 'submit') => {
    let allQuest = handleSaveCurrentAnswer(tabs, currentTabContent)
    let quiz_position_mapping = []
    let answers: {
      question_id: string
      question_answer_id?: string
      time_spent: number
      answer?: {
        answer_id?: string
        answer_position?: number
        answer_text?: string
      }[]
      short_answer?: string
      requirement_id?: string | number | null
      response_option?: string
      active?: string
      answer_file?: Requirement | null
    }[] = []
    let reformTabs: Tab[] = []
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
            time_spent: Math.ceil((e.timeSpent || 0) / 1000),
            ...(e.answer !== '' && { question_answer_id: e.answer as string }),
          })
        } else if (e.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
          let answer: { answer_id?: string }[] = []

          for (let el of e.answer || []) {
            if (typeof el === 'string') {
              answer.push({ answer_id: el })
            } else if (el && typeof el === 'object') {
              if ('answer_id' in el && typeof el.answer_id === 'string') {
                answer.push({ answer_id: el.answer_id })
              } else if ('idAnswer' in el && typeof el.idAnswer === 'string') {
                answer.push({ answer_id: el.idAnswer })
              }
            }
          }
          answers.push({
            question_id: e.id,
            answer,
            time_spent: Math.ceil((e.timeSpent || 0) / 1000),
          })
        } else if (e.qType === QUESTION_TYPES.MATCHING) {
          const answer = (e.answer as MatchingAnswer)?.map((item) => ({
            answer_id: item.answer_id,
          }))

          answers.push({
            question_id: e.id,
            answer: answer,
            time_spent: Math.ceil((e.timeSpent || 0) / 1000),
          })
        } else if (e.qType === QUESTION_TYPES.DRAG_DROP) {
          const answer = (e.answer as DragDropAnswer)
            ?.map((item, index) => {
              if (item?.idAnswer) {
                return {
                  answer_id: item.idAnswer,
                  answer_position: index + 1,
                }
              }
              return null
            })
            .filter(
              (item): item is { answer_id: string; answer_position: number } =>
                item !== null,
            )

          answers.push({
            question_id: e.id,
            answer,
            time_spent: Math.ceil((e.timeSpent || 0) / 1000),
          })
        } else if (e.qType === QUESTION_TYPES.SELECT_WORD) {
          const answer = (e.answer as string[])
            ?.map((item, index) => {
              if (item && item !== '') {
                return {
                  answer_id: item,
                  answer_position: index + 1,
                }
              }
              return null
            })
            .filter(
              (item): item is { answer_id: string; answer_position: number } =>
                item !== null,
            )

          answers.push({
            question_id: e.id,
            answer,
            time_spent: Math.ceil((e.timeSpent || 0) / 1000),
          })
        } else if (e.qType === QUESTION_TYPES.FILL_WORD) {
          const answer = (e.answer as string[])
            ?.map((text, index) => {
              if (text && text.trim() !== '') {
                return {
                  answer_text: text,
                  answer_position: index + 1,
                }
              }
              return null
            })
            .filter(
              (
                item,
              ): item is { answer_text: string; answer_position: number } =>
                item !== null,
            )

          answers.push({
            question_id: e.id,
            answer,
            time_spent: Math.ceil((e.timeSpent || 0) / 1000),
          })
        }
      }

      quiz_position_mapping.push({
        question_id: e.id,
        answers: e.data?.answers,
      })
    }

    if (type_submit === 'submit') {
      if (tabs.length > 0) {
        await handleChangeTab(tabs[0].id)
      }
      setTabs(reformTabs)
      dispatch(disableUnsavedChange())
      const res = await CoursesAPI.submitAllQuestion(
        quizAttempId?.id as string,
        {
          answers: answers,
          quiz_position_mapping: quiz_position_mapping,
          total_attempt_time:
            (quizDetail?.quiz_timed || 0) * 60 -
            (quizDetail?.quiz_timed
              ? timeRef?.current?.handleGetTime() || 0
              : 0),
          scratch_pads: scratchPads || [],
        },
      )
      if (res) {
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
            router.replace(`/short-course/test-result/${res?.data?.id}`)
          } else {
            if (
              courseType === 'FOUNDATION_COURSE' &&
              quizDetail?.quiz_type == 'FINAL_TEST'
            ) {
              router.push(localStorage.getItem('courseDetail') || '')
            } else {
              router.replace(`/short-course/test-result/${res?.data?.id}`)
            }
          }
        }
      }
    } else {
      if (tabs.length > 0) {
        await handleChangeTab(tabs[0].id)
      }
      setTabs(reformTabs)
      dispatch(disableUnsavedChange())
      const res = await CoursesAPI.submitAllQuestion(
        quizAttempId?.id as string,
        {
          answers: answers,
          quiz_position_mapping: quiz_position_mapping,
          total_attempt_time:
            (quizDetail?.quiz_timed || 0) -
            (quizDetail?.quiz_timed || 0
              ? timeRef?.current?.handleGetTime() || 0
              : 0),
        },
      )
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

  const handleClearSelection = (currentTabContent: Tab) => {
    const data = currentTabContent.data

    if (data && !currentTabContent.done) {
      setTabs((prev) => {
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
      setValue(`${currentTabContent?.id}_answer`, '')
      setValue(`${currentTabContent?.id}_fillword`, '')
    }
  }

  const handleSaveHighLight = (e: string | undefined) => {
    setTabs((prev) => {
      const newData = prev.map((item) => {
        if (currentPage === item.id) {
          return { ...item, hightlight: e }
        }
        return item
      })
      return newData
    })
  }

  const handleSaveHighLightTopic = (e: string) => {
    setTabs((prev) => {
      const newData = prev?.map((item) => {
        if (currentPage === item.id) {
          return { ...item, hightlightTopic: e }
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

    if (topics?.questions?.length) {
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
          tabs.filter((e) => e?.attempted === true || e?.done === true),
        )
        return
      } else if (filter === 'unattempted') {
        setFilterTabs(tabs.filter((e) => !e?.attempted && !e?.done))
        return
      } else if (filter === 'flag') {
        setFilterTabs(tabs.filter((e) => e?.flag === true))
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
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }

    const clickPosition = (ev: MouseEvent) => {
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

    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!unsavedChange) return
      e.preventDefault()
      return (e.returnValue = warningText)
    }

    const handleBrowseAway = () => {
      if (allowNavigationRef.current) {
        return
      }

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
    async function fetchTabs() {
      if (questions?.length && questions.length > 0) {
        const arr = []

        for (let i in questions) {
          let baseData = {
            ...questions[i],
            viewed: +i === 0,
            flag: false,
            done: false,
            index: +i,
            response_type: 0,
            is_viewed_answer: +i === 0,
          }
          if (+i === 0) {
            const { topicDescription, question } = await getDetail(
              questions?.[0]?.id,
            )
            baseData = {
              ...baseData,
              viewed: question ? true : false,
              is_viewed_answer: question ? true : false,
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
      setCurrentPage(questions?.[0]?.id || '')
    }
    if (questions) {
      fetchTabs()
    }
  }, [questions, router, quizDetail?.id])

  return (
    <FullScreenLayout
      title={checkTypeAndRenderTitle(quizDetail?.quiz_type || '')}
    >
      <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] flex flex-col items-center justify-center bg-white p-4 md:hidden">
        <NoMobile />
        <p className="mt-8 text-center text-lg font-semibold leading-7 text-bw-13">
          Sorry, page is not mobile friendly
        </p>
        <p className="my-6 text-center text-base text-bw-13">
          LMS Pro’s Testing can be difficult on a mobile device. You can use
          tablet or desktop device for better experience.
        </p>
        <ButtonPrimaryV2
          title="Back to homepage"
          size="medium"
          loading={false}
          disabled={false}
          className="bg-bw-17 text-white"
          onClick={() => {
            allowNavigationRef.current = true
            router.push(PageLink.SHORT_COURSE)
          }}
        />
      </div>
      <CourseProvider>
        <SappLoading
          className={loading || !currentTabContent?.id ? 'block' : 'hidden'}
        />
        <div
          className="relative hidden h-screen flex-col overflow-hidden bg-white md:flex"
          onMouseUp={() => {
            setStartResize(false)
            setCurrentLeftWidth(leftWidth)
          }}
        >
          {/** Header */}
          <HeaderTest
            quizDetail={{
              ...quizDetail!,
            }}
            openLimit={openLimit}
            handleSubmitQuestion={handleSubmitQuestion}
            timeRef={timeRef}
            quizAttempId={quizAttempId}
            setUnSubmitAnswer={setUnSubmitAnswer}
            checkUnSubmitAnswer={checkUnSubmitAnswer}
            setOpenQuit={setOpenQuit}
            setSubmitEventTest={setSubmitEventTest}
            type={type}
            submited={submited}
            setOpenSubmit={setOpenSubmit}
          />
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
                      onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => {
                        if (
                          e.target instanceof HTMLElement &&
                          e.target.tagName.charAt(0) !== 'm' &&
                          (e.target.firstChild as HTMLElement | null)
                            ?.tagName !== 'math'
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
                      {currentTabContent?.topicDescription?.files &&
                        currentTabContent?.topicDescription?.files?.length >
                          0 &&
                        currentTabContent?.topicDescription?.files?.map(
                          (e, index: number) => {
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
                        currentTabContent?.data?.qType as string,
                        currentTabContent?.id,
                        currentTabContent?.answer,
                        currentTabContent?.corrects,
                        currentTabContent?.hightlight,
                        currentTabContent?.solution,
                        currentTabContent?.done,
                      )}
                    </div>
                    <div className="m-auto flex w-full justify-end px-6">
                      {!currentTabContent?.done &&
                      quizDetail?.quiz_type !== 'ENTRANCE_TEST' ? (
                        <div className="flex gap-2 pt-6">
                          {!currentTabContent?.done && (
                            <ButtonSecondaryV2
                              title="Clear Selection"
                              size="medium"
                              loading={false}
                              disabled={false}
                              onClick={() => {
                                handleClearSelection(currentTabContent)
                                trackGAEvent(
                                  'Click Button Clear Selection Test',
                                )
                              }}
                              className="!rounded-md"
                            />
                          )}

                          <ButtonPrimaryV2
                            title="Confirm"
                            size="medium"
                            loading={false}
                            disabled={false}
                            onClick={async () => {
                              const data = await getResult(currentTabContent)
                              await confirmAnswer(
                                data?.corrects,
                                data?.solution,
                                currentTabContent,
                                data?.isSelfReflection,
                                data?.requirements,
                              )
                              trackGAEvent(
                                'Click Button Submit & View Answer Test',
                              )
                            }}
                            className="!rounded-md"
                          />
                        </div>
                      ) : (
                        filteredTabs.findIndex((e) => e.id === currentPage) <
                          filteredTabs.length - 1 && (
                          <ButtonIcon
                            title="Next Question"
                            onClick={async () => {
                              const index = filteredTabs.findIndex(
                                (e) => e.id === currentPage,
                              )
                              handleChangeTab(filteredTabs[index + 1].id)
                            }}
                            className="gap-2 pt-8 hover:text-primary"
                          >
                            <Arrows className="-rotate-180" />
                          </ButtonIcon>
                        )
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
                    onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => {
                      if (
                        e.target instanceof HTMLElement &&
                        e.target.tagName.charAt(0) !== 'm' &&
                        (e.target.firstChild as HTMLElement | null)?.tagName !==
                          'math'
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
                    className="editor-wrap m-auto mb-3 w-full max-w-[874px]"
                  >
                    <EditorReader
                      className="mb-4"
                      text_editor_content={
                        currentTabContent?.topicDescription?.description
                      }
                      highlighted={currentTabContent?.hightlightTopic}
                      highlighArea="hightlight_area_topic"
                    />
                    {currentTabContent?.topicDescription?.files &&
                      currentTabContent?.topicDescription?.files?.length > 0 &&
                      currentTabContent?.topicDescription?.files?.map(
                        (e, index: number) => {
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

                  <div className="m-auto w-full max-w-[874px] rounded-xl bg-gray-4 p-6">
                    <div className="">
                      {checkType(
                        currentTabContent?.data,
                        currentTabContent?.data?.qType as string,
                        currentTabContent?.id,
                        currentTabContent?.answer,
                        currentTabContent?.corrects,
                        currentTabContent?.hightlight,
                        currentTabContent?.solution,
                        currentTabContent?.done,
                      )}
                    </div>
                    <div className="m-auto flex w-full justify-end">
                      {!currentTabContent?.done &&
                      quizDetail?.quiz_type !== 'ENTRANCE_TEST' ? (
                        <div className="flex gap-2 pt-6">
                          {!currentTabContent?.done && (
                            <ButtonSecondaryV2
                              title="Clear Selection"
                              size="medium"
                              loading={false}
                              disabled={false}
                              onClick={() => {
                                handleClearSelection(currentTabContent)
                                trackGAEvent(
                                  'Click Button Clear Selection Test',
                                )
                              }}
                              className="!rounded-md"
                            />
                          )}

                          <ButtonPrimaryV2
                            title="Confirm"
                            size="medium"
                            loading={false}
                            disabled={false}
                            onClick={async () => {
                              const data = await getResult(currentTabContent)
                              await confirmAnswer(
                                data?.corrects,
                                data?.solution,
                                currentTabContent,
                                data?.isSelfReflection,
                                data?.requirements,
                              )
                              trackGAEvent(
                                'Click Button Submit & View Answer Test',
                              )
                            }}
                            className="!rounded-md"
                          />
                        </div>
                      ) : (
                        filteredTabs.findIndex((e) => e.id === currentPage) <
                          filteredTabs.length - 1 && (
                          <ButtonIcon
                            title="Next Question "
                            onClick={async () => {
                              const index = filteredTabs.findIndex(
                                (e) => e.id === currentPage,
                              )
                              handleChangeTab(filteredTabs[index + 1].id)
                            }}
                            className="gap-2 hover:text-primary"
                          >
                            <Arrows className="-rotate-180" />
                          </ButtonIcon>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/** End Question Content */}

          {/** Scratchpads */}
          <div className=" z-10 flex items-center justify-between gap-4 border-t border-gray-17 px-4 py-3 lg:gap-8 lg:px-8">
            <div className="flex h-full items-center">
              <div className="flex gap-1">
                <ButtonIcon
                  onClick={() => {
                    handleOpenScratchPad('scratch_pad')
                    trackGAEvent('Click Button ScratchPad Test')
                  }}
                  className={`!gap-0 rounded-md p-2 ${isScatchPadEnabled ? 'bg-primary text-white' : 'text-primary'}`}
                >
                  <Doc2 className="h-8 w-8" />
                </ButtonIcon>
                <ButtonIcon
                  onClick={() => {
                    handleOpenScratchPad('calculator')
                    trackGAEvent('Click Button Calculator Test')
                  }}
                  disabled={checkCalExist > -1}
                  className={`!gap-0 rounded-md p-2 ${checkCalExist > -1 ? 'bg-primary text-white' : 'text-primary'}`}
                >
                  <Calculator className="h-8 w-8" />
                </ButtonIcon>
              </div>
            </div>

            {/** Tabs */}
            {tabs?.length > 0 && (
              <div className="relative z-10 w-full px-6 py-2">
                <TabSlide
                  data={filteredTabs}
                  currentTab={currentPage}
                  setCurrentTab={setCurrentPage}
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

            <div className="flex h-full items-center">
              <ButtonIcon
                title="Flag to Review"
                onClick={() => {
                  handleFlagQuestion(currentPage)
                  trackGAEvent('Click Button Flag To Review Test')
                }}
                className="flex-row-reverse gap-2 pl-4"
                classTitle="text-nowrap underline"
              >
                <Flag className="text-badge-reject" />
              </ButtonIcon>
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
            exhibitText={exhibitText}
          />
          {/** End Scratchpads */}

          <TestTimeOutModal
            type={type}
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
                        `/short-course/test-result/${QuizResultId}`,
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
