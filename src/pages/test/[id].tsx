import {
  removeHighlights,
  serializeHighlights,
} from '@/../node_modules/@funktechno/texthighlighter/lib/index'
import {
  ArrowUpIcon,
  CalculatorIcon,
  CloseIcon,
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
import PDFViewer from '@components/base/pdf/pdf-viewer'
import TabSlide from '@components/base/tabSlide/TabSlide'
import MovableWindow from '@components/base/window'
import Calculator from '@components/calculator'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
import DragNDropPreivew from '@components/questionType/DragNDrop'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import NewFiltext from '@components/questionType/NewFillText'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import ModalUploadFile from '@components/uploadFile/ModalUploadFile/ModalUploadFile'
import { runHighlight, useGetDataQuery } from '@utils/index'
import { uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  DISPLAY_TYPE,
  PageLink,
  QUESTION_TYPES,
  RESPONSE_OPTION,
  TEST_TYPE,
} from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import { disableUnsavedChange, loginSlice } from 'src/redux/slice/Login/Login'
import QuitTestModal from '../courses/test/quit-test'
import TestTimeOutModal from '../courses/test/test-timeout'
import ConFirmSubmit from './conFirmSubmit'
import LimitQuizModal from './limitQuizModal'
import SappLoading from 'src/common/SappLoading'
import toast from 'react-hot-toast'
import ScratchPatch from './scratchPatch'
import { CoursesAPI } from '../api/courses'
import { TestAPI } from '../api/test'
import Countdown from 'react-countdown'
import { renderer, useCountdown } from 'src/hooks/useCountdown'
import { CourseProvider, useCourseContext } from '@contexts/index'
import { IExhibit } from 'src/type/exhibit'
import UnSubmitAnswerModal from 'src/components/UnSubmitAnswerModal'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import { debounce } from 'lodash'

interface Answer {
  answer: string | string[] | Object[]
  attempted?: boolean
  done?: boolean
  flaged?: boolean
  id?: string
  index?: string
  qType?: string
  question_topic_id?: string
  response_type?: number
  timeSpent?: number
  viewed?: boolean
}

import { QuestionAPI } from '../api/question'
import { trackGAEvent } from '@utils/google-analytics'
import { showPopup } from 'src/redux/slice/Popup/Result-test'

// type Window = {
//   userAgreed: any
// }
interface ScratchPadValue {
  id: string
  value: string
}
interface ScratchPad {
  question_id: string
  id: string
  scratch_pad: string
}

declare global {
  interface Window {
    userAgreed: any
  }
}
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
            // control={control}
            // setValue={setValue}
            // name={`${currentTabID}_fillword`}
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
            data={essayData?.req}
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
      if (!item.done && !validateAnswer({ answer: item.answer })) {
        result.push(index + 1)
      }
    })
    setUnSubmitAnswerData(result)
    return result
  }

  // Validate các câu hỏi xem đã trả lời chưa
  const validateAnswer = (item: { answer: string | Object[] | string[] }) => {
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

  const useGetQuizDetail = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => CoursesAPI.getDetailQuizById(router.query.id),
      router.query.id !== undefined,
    )
  }

  const useGetQuestionTabs = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => CoursesAPI.getQuestionTabsById(router.query.id),
      router.query.id !== undefined,
    )
  }

  // Sử dụng hook useGetQuizDetail trong component
  const { data: quizDetail } = useGetQuizDetail('quiz-detail', {})

  // Sử dụng hook useGetQuestionTabs trong component
  const { data: questions } = useGetQuestionTabs('question-detail', {})

  const type = router.query.type

  const [currentPage, setCurrentPage] = useState<any>(questions?.[0]?.id)

  // const [filteredTabs, setFilterdTabs] = useState<any>([])
  // const [currentTabContent, setCurrentTabContent] = useState<any>()
  const { control: controlScratch } = useForm()
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch: watchEssay,
  } = useForm()
  const {
    control: controlFilter,
    watch: watchFilter,
    setValue: setValueFilter,
  } = useForm()
  const {
    control: controlExhibits,
    getValues: getValuesExhibits,
    setValue: setValueExhibits,
    watch,
    reset,
  } = useForm()
  const [essayData, setEssayData] = useState<any>()
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [openExhibits, setOpenExhibits] = useState<Array<any>>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [tabs, setTabs] = useState<any>([])
  const [showListExhibits, setShowListExhibits] = useState(false)
  const [showListRequirement, setShowLisRequirement] = useState(false)
  const [allowHighLight, setAllowHighLight] = useState(false)
  const [allowUnHighLight, setAllowUnHighLight] = useState(false)
  const [exhibitData, setExhibitData] = useState<IExhibit[]>()
  const [routeBack, setRouteBack] = useState(false)
  const [isQuizAttemptCreated, setIsQuizAttemptCreated] = useState(false)
  const dropUpRef = useRef(null)
  const dropUpRequire = useRef(null)
  const [quizAttempId, setQuizAttempId] = useState('')
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
  // const { x } = useMousePosition()
  const { unsavedChange } = useAppSelector((state) => state.loginReducer)
  const rightSideRef = useRef<any>(null)
  const [mousePosition, setMousePosition] = useState({ x: null, y: null })
  const [openUnSubmitAnswer, setUnSubmitAnswer] = useState(false)
  const [unSubmitAnswerData, setUnSubmitAnswerData] = useState<Array<number>>(
    [],
  )

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
  useClickOutside({
    ref: dropUpRef,
    callback: () => setShowListExhibits(false),
  })
  useClickOutside({
    ref: dropUpRequire,
    callback: () => setShowLisRequirement(false),
  })
  const [onMount, setOnMount] = useState(true)
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
    // if (!arr.includes('calculator')) {
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
        // for (let i in arr) {
        if (checkCalExist > -1) {
          const cal = { ...arr[checkCalExist] }
          arr.splice(checkCalExist, 1)
          arr.push(cal)
          return arr
        }
        // }
        // if (!arr.includes('calculator')) {
        arr.push({ id: 'calculator', type: 'calculator' })
        // }
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
  const checkAnswered = (currentContent: any) => {
    if (
      currentContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentContent.qType === QUESTION_TYPES.TRUE_FALSE
    ) {
      if (getValues(`${currentContent?.id}_answer`)) {
        return true
      }
      return false
    } else if (currentContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
      if (
        getValues(`${currentContent?.id}_answer`) &&
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
          if (req?.answer_file?.file_key) {
            return true
          }
        }
      }
      if (currentContent?.answer_file?.file_key) {
        return true
      }
      const value = getValues(
        `${currentContent?.id}_${essayData?.index}_answer`,
      )
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
          if (value !== undefined) {
            return true
          }
          return false
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
          if (value !== undefined) {
            return true
          }
          return false
        }
      }
    }
  }
  const [filteredTabs, setFilterTabs] = useState<any[]>([])
  const [trigger, setTrigger] = useState(false)
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
  const ref = useRef(null) as any
  const refEditor = useRef(null) as any
  const getValueFillText = () => {
    // let value = []
    // const inputs = document.querySelectorAll('input[stringHTML="true"]') as any
    // for (let e of inputs) {
    //   value.push(e.value)
    // }
    // return value
  }
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
    }
  }
  const confirmAnswer = async (
    corrects: any,
    solution: any,
    currentTabContent: any,
    isSelfReflection: boolean,
  ) => {
    setLoading(true)
    // setStartTime(Date.now())
    const newData = tabs?.map((item: any) => {
      if (currentTabContent?.id === item?.id) {
        // setCurrentTabContent({
        //   ...item,
        //   done: true,
        //   corrects: corrects,
        //   solution: res.data[0].solution,
        //   answer: getCurrentAnswer(item),
        // })
        if (
          currentTabContent.qType !== QUESTION_TYPES.FILL_WORD &&
          currentTabContent.qType !== QUESTION_TYPES.SELECT_WORD
        ) {
          ref.current?.handleReset()
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
  const handleConfirmEssay = () => {
    const newData = tabs.map((item: any) => {
      if (currentTabContent?.id === item?.id) {
        // setCurrentTabContent({
        //   ...item,
        //   done: true,
        //   corrects: corrects,
        //   solution: res.data[0].solution,
        //   answer: getCurrentAnswer(item),
        // })
        ref?.current?.handleReset()
        return {
          ...item,
          done: true,
          attempted: true,
          timeSpent: item?.timeSpent
            ? Date.now() - startTime + item?.timeSpent
            : Date.now() - startTime,
        }
      }
      return item
    })
    const newTabs = handleSaveCurrentAnswer(newData, currentTabContent)
    setTabs(newTabs)
  }
  const handleConfirmAndNext = async (currentTab: any, nextTab: any) => {
    setLoading(true)
    const currentContent = tabs?.find((e: any) => e.id === nextTab)
    const previousContent = tabs?.find((e: any) => e.id === currentTab)
    setStartTime(Date.now())
    if (!currentContent?.viewed) {
      const { topicDescription, question } = await getDetail(nextTab)
      const newData = tabs?.map((item: any) => {
        if (nextTab === item.id) {
          if (item.viewed) {
            // setCurrentTabContent({ ...item })
            return { ...item }
          } else {
            return {
              ...item,
              data: question,
              topicDescription: topicDescription?.data,
              viewed: true,
            }
          }
        } else if (currentTab === item?.id) {
          return {
            ...item,
            viewed: true,
            done: true,
            attempted: true,
            timeSpent: item?.timeSpent
              ? Date.now() - startTime + item?.timeSpent
              : Date.now() - startTime <= 0
                ? 0
                : Date.now() - startTime,
          }
        }
        return item
      })
      ref.current?.handleReset()
      refEditor?.current?.reset()
      const savedAnswer = handleSaveCurrentAnswer(newData, previousContent)
      setCurrentPage(nextTab)
      setOpenScratchPad([])
      setAllowHighLight(false)
      setAllowUnHighLight(false)
      setTabs(savedAnswer)
    } else {
      const newData = tabs?.map((item: any) => {
        if (currentTab === item?.id) {
          ref.current?.handleReset()
          return {
            ...item,
            done: true,
            attempted: true,
            timeSpent: item?.timeSpent
              ? Date.now() - startTime + item?.timeSpent
              : Date.now() - startTime <= 0
                ? 0
                : Date.now() - startTime,
          }
        }
        return item
      })
      ref.current?.handleReset()
      refEditor?.current?.reset()
      const savedAnswer = handleSaveCurrentAnswer(newData, previousContent)
      setCurrentPage(nextTab)
      setOpenScratchPad([])
      setAllowHighLight(false)
      setAllowUnHighLight(false)
      setTabs(savedAnswer)
    }
    setLoading(false)
    // setTabs((prev: any) => {
    //   handleChangeTab(currentTab)
    //   return newTabs
    // })
    // setLoading(false)
  }
  const getResultAll = async (currentTabContent: any) => {
    const res = await TestAPI.getQuestionAnswer(currentTabContent.id)
    let corrects = {} as any
    if (
      currentTabContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentTabContent.qType === QUESTION_TYPES.TRUE_FALSE ||
      currentTabContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
    ) {
      corrects = res.data[0].answers?.reduce(
        (previousValue: any, currentValue: any) => {
          return {
            ...previousValue,
            [currentValue?.id]: currentValue?.is_correct,
          }
        },
        {} as { [key: string]: boolean },
      )
    } else if (
      currentTabContent.qType === QUESTION_TYPES.FILL_WORD ||
      currentTabContent.qType === QUESTION_TYPES.SELECT_WORD
    ) {
      corrects = { corrects: [...res?.data?.[0]?.answers] }
    }
    return {
      ...currentTabContent,
      done: true,
      corrects: corrects,
      solution: res?.data?.[0]?.solution,
    }
  }
  const handleSaveCurrentAnswer = (tabs: any, currentContent: any) => {
    if (!currentContent.done) {
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
    try {
      const topicDescription = await CoursesAPI.getTopicDescription(
        questions[questions.findIndex((e: any) => e.id === currentPage)]
          ?.question_topic_id,
        quizDetail?.id,
      )
      const res = await QuestionAPI.getQuestionDetail(currentPage)
      return { topicDescription, question: res.data }
    } catch (err) {
      return { topicDescription: { data: {} }, question: null }
    }
  }

  const handleChangeTab = async (currentTab: any) => {
    setLoading(true)
    setScratchPadValues(null)
    const currentContent = tabs?.find((e: any) => e.id === currentTab)
    setStartTime(Date.now())
    if (!currentContent?.viewed) {
      const { topicDescription, question } = await getDetail(currentTab)
      const newData = tabs?.map((item: any) => {
        if (currentTab === item.id) {
          if (item.viewed) {
            // setCurrentTabContent({ ...item })
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

    // if (currentPage) {
    //   getDetail()
    // }
    // setTabs((prev: any) => {
    //   return handleSaveCurrentAnswer(tabs)
    // })
  }
  const handleSaveAnswer = (data: any, tabId: any, tabs: any) => {
    setStartTime(Date.now())
    let newData = [] as any
    for (let item of tabs) {
      if (tabId === item?.id) {
        // if (quizDetail.grading_preference === 'AFTER_EACH_QUESTION') {
        //   var result = await getResult(item)
        //   var newItem = {
        //     ...item,
        //     done: true,
        //     corrects: result.corrects,
        //     solution: result.solution,
        //     answer: data,
        //     timeSpent: !item.done
        //       ? item?.timeSpent
        //         ? currentTime - startTime + item?.timeSpent
        //         : currentTime - startTime <= 0
        //           ? 0
        //           : currentTime - startTime
        //       : item?.timeSpent,
        //   }
        // } else {
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
        // }

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
                requirements: item.data.requirements.map(
                  (req: any, idx: number) => {
                    if (idx === requirementIndex) {
                      return {
                        ...req,
                        answer_file: {
                          file_key: file.file_key,
                          file_name: file.name,
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
                file_key: file.file_key,
                file_name: file.name,
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
  const answerListRef = useRef<string[]>([])

  const setRequirementValue = (requirementId: string | number) => {
    const existingAnswer =
      answerListRef.current[requirementId as unknown as number]
    if (existingAnswer) {
      setValue(`${currentPage}_${essayData?.index}_answer`, existingAnswer)
    }
  }

  const setAnswerListValue = debounce((requirementId: number) => {
    answerListRef.current[requirementId] =
      getValues(`${currentPage}_${essayData?.index}_answer`) || ''
  }, 200)

  const { setScoreQuestion, setSubmitTest, courseType } = useCourseContext()

  const [scoreFinalTest, setScoreFinalTest] = useState(0)

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
        if (checkAnswered(e)) {
          const requirements = e?.data?.requirements?.length
            ? e?.data?.requirements
            : [null]
          requirements?.forEach((requirement: any) => {
            answers.push({
              question_id: e.id,
              short_answer: answerListRef?.current?.[requirement?.id]
                ? answerListRef?.current?.[requirement?.id]
                : requirement?.id
                  ? ''
                  : e?.answer,
              requirement_id: requirement?.id || null,
              response_option: e?.data?.response_option
                ? e?.data?.response_option
                : e?.response_type === 0
                  ? 'WORD'
                  : 'SHEET',
              time_spent: Math.ceil(e?.timeSpent / 1000),
              active: 'SUBMITED',
              answer_file: requirement?.answer_file || e?.answer_file || null,
            })
          })
        }
      }
      quiz_position_mapping.push({
        question_id: e.id,
        answers: e.data?.answers,
      })
    }

    if (type_submit === 'submit') {
      setTabs(() => {
        // ref.setKey
        handleChangeTab(tabs[0].id)
        return reformTabs
      })
      dispatch(disableUnsavedChange())
      const res = await CoursesAPI.submitQuestion(quizAttempId as string, {
        answers: answers,
        quiz_position_mapping: quiz_position_mapping,
        total_attempt_time:
          quizDetail?.quiz_timed * 60 -
          (quizDetail?.quiz_timed ? timeRef?.current?.handleGetTime() || 0 : 0),
        scratch_pads: scratchPads || [],
      })
      if (res) {
        if (res?.data?.class_user_score) {
          dispatch(showPopup(res?.data?.class_user_score))
        }
        if (type === 'entrance') {
          router.replace(`/entrance-test/test-result/${res?.data?.id}`)
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
      setTabs(() => {
        // ref.setKey
        handleChangeTab(tabs[0].id)
        return reformTabs
      })
      dispatch(disableUnsavedChange())
      const res = await CoursesAPI.submitQuestion(quizAttempId as string, {
        answers: answers,
        quiz_position_mapping: quiz_position_mapping,
        total_attempt_time:
          quizDetail.quiz_timed * 60 -
          (quizDetail.quiz_timed ? timeRef?.current?.handleGetTime() || 0 : 0),
      })
      if (res) {
        if (res?.data?.class_user_score) {
          dispatch(showPopup(res?.data?.class_user_score))
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
  const [scratchPadValues, setScratchPadValues] = useState<
    ScratchPadValue | null | undefined
  >()

  const handleChangeScratchPad = (
    e: ChangeEvent<HTMLInputElement>,
    id?: string,
  ) => {
    const { value } = e.target
    setScratchPadValues((prevState: any) => ({
      ...prevState,
      id,
      value,
    }))
  }
  const [scratchPads, setScratchPads] = useState<ScratchPad[]>([])
  useEffect(() => {
    if (currentPage) {
      const currentPageScratchPadValues = scratchPadValues?.value ?? ''
      const currentPageScratchPadId = scratchPadValues?.id ?? ''
      if (currentPageScratchPadValues) {
        const index = scratchPads.findIndex(
          (item: ScratchPad) => item.question_id === currentPage,
        )
        if (index !== -1) {
          setScratchPads((prevScratchPads: any) => {
            const newScratchPads = [...prevScratchPads]
            newScratchPads[index].scratch_pad = currentPageScratchPadValues
            return newScratchPads
          })
        } else {
          setScratchPads((prevScratchPads: any) => [
            ...prevScratchPads,
            {
              question_id: currentPage,
              id: currentPageScratchPadId,
              scratch_pad: currentPageScratchPadValues,
            },
          ])
        }
      }
    }
  }, [currentPage, scratchPadValues])
  const handleClearSelection = (currentTabContent: any) => {
    const data = currentTabContent.data
    if (!currentTabContent.done) {
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
                (req: any) => ({
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
    setTabs((prev: any) => {
      const newData = prev.map((item: any) => {
        if (currentPage === item.id) {
          return {
            ...item,
            answer_file: undefined,
            data: {
              ...item.data,
              requirements: item.data.requirements.map(
                (req: any, idx: number) => {
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
          // setCurrentTabContent({ ...item, hightlight: e })

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

  useEffect(() => {
    if (currentTabContent?.data?.requirements) {
      setEssayData({
        req: currentTabContent?.data?.requirements?.[0],
        index: 0,
      })
    }
  }, [currentTabContent?.id])
  // useEffect(()=>{
  //   // if (currentTabContent?.hightlightTopic) {

  //     DeserializeHighlight(
  //       currentTabContent?.hightlightTopic,
  //       'hightlight_area_topic',
  //     )
  //   // }
  // },[currentTabContent?.id])
  useEffect(() => {
    async function fetchTabs() {
      if (questions?.length > 0) {
        const arr = []

        for (let i in questions) {
          if (+i === 0) {
            const { topicDescription, question } = await getDetail(
              questions?.[0]?.id,
            )
            arr.push({
              ...questions[i],
              viewed: true,
              flaged: false,
              done: false,
              index: +i,
              data: question,
              topicDescription: topicDescription?.data,
              response_type: 0,
            })
          } else {
            arr.push({
              ...questions[i],
              viewed: false,
              flaged: false,
              done: false,
              index: +i,
              response_type: 0,
            })
          }
        }
        // setCurrentTabContent(arr[0])
        setTabs(arr)
      } else {
        router.push(PageLink.PAGE_NOT_FOUND)
      }
      setCurrentPage(questions?.[0]?.id)
    }
    if (questions) {
      fetchTabs()
    }
  }, [questions])

  // useEffect(() => {

  // }, [currentPage])
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
        setQuizAttempId(res.data.id)
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
  const warningText =
    'You have unsaved changes - are you sure you wish to leave this page?'
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

  const firstExhibitFiles = currentTabContent?.data?.exhibits?.[0]?.files?.[0]

  /**
   * @description sử dụng hook countdown
   */
  const { data, onStart, onComplete } = useCountdown(quizDetail?.quiz_timed)

  const ButtonContent = ({
    icon,
    content,
  }: {
    icon: JSX.Element
    content: string
  }) => (
    <div className="flex items-center gap-3 px-4 3xl:ps-6 3xl:pe-6 border-l ">
      {icon}
      <div className="hidden font-normal text-sm lg:inline-block">
        {content}
      </div>
    </div>
  )

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
      default:
        return pageTitle
    }
  }

  return (
    <FullScreenLayout title={checkTypeAndRenderTitle(quizDetail?.quiz_type)}>
      <CourseProvider>
        {loading || !currentTabContent?.id ? (
          <SappLoading />
        ) : (
          <div
            className="h-screen flex flex-col bg-white overflow-hidden relative"
            onMouseUp={() => {
              setStartResize(false)
              setCurrentLeftWidth(leftWidth)
            }}
          >
            {/* Header */}
            {/* {startResize && (
        <div className="absolute w-screen h-screen z-[1350]"></div>
      )} */}
            <div>
              <div className="flex justify-between py-2 px-6 items-center bg-gray-3 relative z-50">
                <div className="text-lg-xl font-medium w-1/3 truncate">
                  {quizDetail?.name}
                </div>
                {quizDetail?.quiz_timed && (
                  // <CountDown
                  //   remainTime={quizDetail?.quiz_timed}
                  //   onTimeOut={() => {
                  //     if (!openLimit) {
                  //       dispatch(disableUnsavedChange())
                  //       handleSubmitQuestion('timeout')
                  //       // setOpenTimeOut(true)
                  //     }
                  //   }}
                  //   ref={timeRef}
                  // />
                  <Countdown
                    date={data?.date + data?.delay}
                    renderer={renderer}
                    onStart={onStart}
                    onComplete={() => {
                      if (!openLimit) {
                        dispatch(disableUnsavedChange())
                        handleSubmitQuestion('timeout')
                        // setOpenTimeOut(true)
                      }
                      onComplete()
                    }}
                  />
                )}
                <ButtonCancelSubmit
                  className={'flex gap-4 flex-row-reverse w-1/3'}
                  // color={color}
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
                    //   full: fullWidthBtn,
                  }}
                  cancel={{
                    title: 'Quit',
                    size: 'small',
                    className: 'border border-bw-1 !w-[109px]',
                    color: 'secondary',
                    onClick: () => {
                      setOpenQuit(true)
                      dispatch(disableUnsavedChange())
                    },
                    loading: false,
                    //   full: fullWidthBtn,
                  }}
                ></ButtonCancelSubmit>
              </div>
              {/* End Header */}
              {tabs?.length > 0 && (
                <div className="px-6 bg-gray-4 shadow-pagination relative py-2 w-full z-10">
                  <TabSlide
                    data={filteredTabs}
                    currentTab={currentPage}
                    setCurrentTab={setCurrentPage}
                    optionShowAll={<OptionShowAll />}
                    handleChangeTab={(e: any) => {
                      handleChangeTab(e)
                    }}
                    activeShowAll={activeShowAll}
                    setActiveShowAll={setActiveShowAll}
                    setValueFilter={setValueFilter}
                  />
                  {/* </div> */}
                </div>
              )}
            </div>
            {/* <div className=''> */}
            {currentTabContent?.data?.display_type === DISPLAY_TYPE.VERTICAL ? (
              <div
                className={`flex bg-gray-3 flex-1 overflow-auto`}
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
                  className="w-[20px] h-full bg-gray-3 cursor-ew-resize"
                  onMouseDown={() => {
                    setStartResize(true)
                    // setCurrentMousePos(mousePosition.x || 0)
                  }}
                  onMouseUp={() => setStartResize(false)}
                ></div>
                <div
                  className="h-full overflow-auto bg-white py-6 "
                  style={{ width: `calc(50% + ${leftWidth}px)` }}
                  ref={rightSideRef}
                >
                  <div className="px-6 min-w-[700px]">
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
                className={`overflow-auto py-6 px-6 flex-1`}
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
                  className="editor-wrap mb-3 max-w-[950px] w-full m-auto"
                >
                  {/* <div className="mb-4">
                  {currentTabContent?.topicDescription?.name}
                </div> */}
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
                            onClick={
                              () =>
                                handleOpenScratchPad(
                                  'file',
                                  e?.resource?.url,
                                  e?.resource?.name,
                                )
                              // setOpenPdf({ status: true, url: e.resource.url })
                            }
                            key={index}
                          >
                            {e?.resource?.name}
                          </div>
                        )
                      },
                    )}
                </div>

                {/* {type !== QUESTION_TYPES.ESSAY ? ( */}
                <div className="max-w-[950px] w-full m-auto">
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
            {openScratchPad.map((e, index: number) => {
              if (e.type === 'calculator') {
                return (
                  <MovableWindow
                    position={{
                      width: '400px',
                      height: '300px',
                      top: 'calc(25% - 150px)',
                      left: 'calc(25% - 200px)',
                    }}
                    key={e.id}
                    onClick={() => setOnFocusingPad(e.id)}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute h-full w-full  top-0 left-0 border">
                      <div className="flex items-center bg-gray-2 w-full h-10 justify-between px-5">
                        <div className="text-sm font-normal">Calculator</div>
                        <button onClick={() => handleCloseScratchPad(e)}>
                          <CloseIcon />
                        </button>
                      </div>
                      {/* <div className='flex flex-'> */}
                      <Calculator />
                      {/* </div> */}
                    </div>
                  </MovableWindow>
                )
              } else if (e.type === 'scratch_pad') {
                return (
                  <MovableWindow
                    position={{
                      width: '400px',
                      height: '300px',
                      top: 'calc(50% - 150px)',
                      left: 'calc(50% - 200px)',
                    }}
                    key={currentPage}
                    onClick={() => {
                      setOnFocusingPad(e?.id)
                    }}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute h-full w-full  top-0 left-0 border">
                      <div className="flex items-center bg-gray-2 w-full h-10 justify-between px-5">
                        <div className="text-sm font-normal">Scratch Pad</div>
                        {/* <CloseIcon */}
                        <button onClick={() => handleCloseScratchPad(e)}>
                          <CloseIcon />
                        </button>
                      </div>
                      <ScratchPatch
                        scratchPadValues={scratchPadValues}
                        control={controlScratch}
                        scratchPads={scratchPads.find(
                          (item: ScratchPad) => item?.id === currentPage,
                        )}
                        handleChangeScratchPad={(
                          event: ChangeEvent<HTMLInputElement>,
                        ) => handleChangeScratchPad(event, currentPage)}
                      />
                    </div>
                  </MovableWindow>
                )
              } else if (e.type === 'exhibits') {
                const i = exhibitData?.findIndex((el: any) => el?.id === e?.id)
                const exhibitsDes = exhibitData?.find(
                  (exhibit) => exhibit?.id === e?.id,
                )
                return (
                  <MovableWindow
                    position={{
                      width: '600px',
                      height: '400px',
                      top: 'calc(75% - 250px)',
                      left: 'calc(0%)',
                    }}
                    key={e.id}
                    onClick={() => {
                      setOnFocusingPad(e?.id)
                    }}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500 + 2
                        : index + 500
                    }
                  >
                    <div className="absolute h-full w-full  top-0 left-0 border">
                      <div className="flex w-6-percent items-center bg-white w-full h-10 justify-between px-5">
                        <div className="truncate">
                          <span className="font-semibold text-base">{`Exhibit ${
                            (i ?? 0) + 1
                          }: `}</span>
                          {exhibitsDes?.name}
                        </div>
                        <button onClick={() => handleCloseScratchPad(e)}>
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="bg-white h-[calc(100%-40px)] overflow-auto p-5">
                        <EditorReader
                          text_editor_content={exhibitsDes?.description}
                          className=" w-full"
                        />
                        {exhibitsDes &&
                          exhibitsDes?.files?.length > 0 &&
                          exhibitsDes?.files?.map((e: any, index: number) => {
                            return (
                              <div
                                key={index}
                                className="overflow-auto bg-white"
                              >
                                <PDFViewer file={e?.resource?.url} />
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </MovableWindow>
                )
              } else if (e.type === 'file') {
                return (
                  <MovableWindow
                    className="transform -translate-x-1/2 -translate-y-1/2 2xl:!h-[842px]"
                    position={{
                      width: '595px',
                      height: '650px',
                      top: 'calc(50%)',
                      left: 'calc(50%)',
                    }}
                    key={e.id}
                    onClick={() => setOnFocusingPad(e.id)}
                    zIndex={
                      onFocusingPad === e.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                    // not_resizable
                    // className='pointer-events-none'
                  >
                    <div className="absolute h-full w-full  top-0 left-0 border">
                      <div className="flex items-center bg-gray-2 w-full h-10 justify-between px-5">
                        <div className="text-sm font-normal truncate">
                          {e.fileName}
                        </div>
                        {/* <CloseIcon */}
                        <button onClick={() => handleCloseScratchPad(e)}>
                          <CloseIcon />
                        </button>
                      </div>
                      <div
                        className="overflow-auto p-4 bg-white"
                        style={{ height: 'calc(100% - 40px' }}
                      >
                        {/* <div className='flex flex-'> */}
                        <PDFViewer file={e?.file} />
                      </div>
                      {/* </div> */}
                    </div>
                  </MovableWindow>
                )
              }
            })}
            {/* </div> */}
            <div className=" bg-gray-3 flex items-center  justify-between shadow-question-footer h-[48px] z-10">
              <div className="flex items-center h-full">
                {/* <button className="h-full">
                <div className="flex items-center gap-3 px-4 3xl:ps-6 3xl:pe-6 ">
                  <HelpIcon />
                  <div className="hidden font-normal text-sm 3xl:inline-block">
                    Help
                  </div>
                </div>
              </button> */}
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
                  <ButtonContent
                    icon={<ScratchPadIcon />}
                    content="ScratchPad"
                  />
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
                  <ButtonContent
                    icon={<CalculatorIcon />}
                    content="Calculator"
                  />
                </button>
                {exhibitData && exhibitData?.length > 0 && (
                  <button className="h-full relative" ref={dropUpRef}>
                    <div
                      className="flex items-center gap-3 px-4 3xl:px-6 border-l"
                      onClick={() => {
                        setShowListExhibits(!showListExhibits)
                        // handleOpenScratchPad(
                        //   'file',
                        //   firstExhibitFiles?.resource?.url,
                        //   firstExhibitFiles?.resource?.name,
                        // )
                      }}
                    >
                      <ExhibitsIcon />
                      <div className="font-normal flex text-sm items-center gap-3">
                        <div>
                          <span className="hidden xl:inline-block 3xl:me-1">
                            {`Exhibits (${exhibitData?.length || 0})`}
                          </span>
                          {/* <span>{`(${currentTabContent?.data?.exhibits?.length})`}</span> */}
                        </div>
                        {/* {`Exhibits (${currentTabContent?.data?.exhibits?.length})`} */}
                        {/* <ArrowUpIcon /> */}
                      </div>
                    </div>
                    {showListExhibits && (
                      <div className="bg-gray-3 absolute h-fit max-w-max 3xl:w-full 3xl:max-w-none bottom-full shadow-questions-exhibits p-4 flex justify-center z-[1400]">
                        <HookFormCheckBoxGroup
                          control={controlExhibits}
                          name="exhibits"
                          options={exhibits}
                          multiple
                          lowerOptions={true}
                          // gap="0"
                          widthOptions="w-full"
                          seprateLine={true} // classNameTitle='text-gray-2'
                          maxWidthContent
                        />
                      </div>
                    )}
                  </button>
                )}
                {currentTabContent?.data?.qType === QUESTION_TYPES.ESSAY && (
                  <button className="h-full relative" ref={dropUpRequire}>
                    <div
                      className="flex items-center gap-3 px-4 3xl:px-6 border-l"
                      onClick={() => {
                        setShowLisRequirement(!showListRequirement)
                      }}
                    >
                      <TextSquareIcon />
                      <div className="font-normal flex text-sm items-center gap-3">
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
                      <div className="bg-gray-3 absolute h-fit bottom-full shadow-questions-exhibits justify-center sapp-separateLine 3xl:w-full">
                        {currentTabContent?.data?.requirements?.map(
                          (e: any, index: number) => {
                            return (
                              <button
                                key={e.id}
                                className={`p-3 ${
                                  essayData.index !== index && 'text-gray-1'
                                }`}
                                onClick={() => {
                                  setRequirementValue(e.id)
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
              <div className="flex items-center h-full gap-3 pe-6">
                {currentTabContent?.data?.response_option === null &&
                  currentTabContent?.data?.qType === QUESTION_TYPES.ESSAY &&
                  !currentTabContent.done && (
                    <div className="flex gap-1">
                      <div className="hidden 3.5xl:block ">
                        Choose response option:
                      </div>
                      <button
                        onClick={() => {
                          // handleChangeTypeEssay(0)
                          // handleClearSelection(currentTabContent)
                          // if (confirmOnclose) {
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
                          // } else {
                          //   // Nếu confirmOnclose là false, thì không cần xác nhận
                          //   // Gọi hàm callHandleCancel
                          //   callHandleCancel()
                          // }
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
                  className="flex items-center gap-3 border border-gray-1 justify-center px-3 py-2 3xl:w-[150px] "
                  onClick={() => {
                    handleFlagQuestion(currentPage)
                    trackGAEvent('Click Button Flag To Review Test')
                  }}
                >
                  <FlagIcon />
                  <div className="font-medium text-medium-sm hidden lg:block">
                    Flag to Review
                  </div>
                </button>
                <button
                  disabled={currentTabContent?.done}
                  className={`flex items-center gap-3 border border-solid ${
                    !currentTabContent?.done
                      ? 'border-gray-1 text-bw-1'
                      : 'border-default text-gray-2'
                  } justify-center p-1 w-[150px] py-2`}
                  onClick={() => {
                    handleClearSelection(currentTabContent)
                    trackGAEvent('Click Button Clear Selection Test')
                  }}
                >
                  <div className="font-medium text-medium-sm">
                    Clear Selection
                  </div>
                </button>
                {/* )} */}
                {quizDetail?.grading_preference === 'AFTER_EACH_QUESTION' &&
                !currentTabContent?.done &&
                quizDetail?.quiz_type !== 'ENTRANCE_TEST' ? (
                  currentTabContent?.data?.qType !== QUESTION_TYPES.ESSAY ? (
                    <button
                      className="flex items-center gap-3 border border-gray-1 justify-center px-3 w-[150px] py-2 "
                      onClick={async () => {
                        const data = await getResult(currentTabContent)
                        confirmAnswer(
                          data?.corrects,
                          data?.solution,
                          currentTabContent,
                          data?.isSelfReflection,
                        )
                        trackGAEvent('Click Button Confirm Answer Test')
                      }}
                    >
                      <div className="font-medium text-medium-sm">
                        Confirm Answer
                      </div>
                    </button>
                  ) : filteredTabs.findIndex((e: any) => e.id === currentPage) <
                    filteredTabs.length - 1 ? (
                    <button
                      className="flex items-center gap-3 border border-gray-1 justify-center px-3 w-[150px] py-2 "
                      onClick={() => {
                        const index = filteredTabs?.findIndex(
                          (e: any) => e.id === currentPage,
                        )
                        handleConfirmAndNext(
                          currentPage,
                          filteredTabs[index + 1].id,
                        )
                        trackGAEvent('Click Button Confirm & Next Test')
                      }}
                    >
                      <div className="font-medium text-medium-sm">
                        Confirm & Next
                      </div>
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-3 border border-gray-1 justify-center px-3 py-2 w-[150px] "
                      onClick={() => {
                        handleConfirmEssay()
                        trackGAEvent('Click Button Confirm Test')
                      }}
                    >
                      <div className="font-medium text-medium-sm">Confirm</div>
                    </button>
                  )
                ) : (
                  filteredTabs.findIndex((e: any) => e.id === currentPage) <
                    filteredTabs.length - 1 && (
                    <button
                      className="flex items-center gap-3 border border-gray-1 justify-center px-3 py-2 w-[150px] "
                      onClick={() => {
                        const index = filteredTabs.findIndex(
                          (e: any) => e.id === currentPage,
                        )
                        handleChangeTab(filteredTabs[index + 1].id)
                      }}
                    >
                      <div className="font-medium text-medium-sm">
                        Next Question
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>
            <TestTimeOutModal
              open={openTimeOut}
              setOpen={setOpenTimeOut}
              handleSubmit={() => {
                dispatch(disableUnsavedChange())
                  .unwrap()
                  .then(() => {
                    if (type === 'entrance') {
                      router.replace(
                        `/entrance-test/test-result/${QuizResultId}`,
                      )
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
              handleQuit={() => router.back()}
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
                handleSubmitQuestion('submit')
                setOpenSubmit(false)
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
                handleSubmitQuestion('submit')
                setUnSubmitAnswer(false)
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
            {/* <PopupViewPdf
        open={openPdf?.status || false}
        setOpen={setOpenPdf}
        url={openPdf?.url || ''}
      /> */}
          </div>
        )}
      </CourseProvider>
    </FullScreenLayout>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default TestDetail
