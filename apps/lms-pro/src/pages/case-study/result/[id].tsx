import {
  CalculatorIconV2,
  DownloadIcon,
  FileTextIcon,
  ResizeIcon,
  ScratchPadIconV2,
} from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import MovableWindow from '@components/base/window'
import Calculator from '@components/calculator'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
import AddWordPreview from '@components/questionType/FillText'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectQuestion'
import useMousePosition from '@utils/hookMouseMove'
import { runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import {
  EXHIBIT_TEXT_REPLACE,
  PROGRAM,
  QUESTION_TYPES,
  RESPONSE_OPTION,
} from '@lms/core'
import { useAppDispatch } from 'src/redux/hook'
import { loadMoreQuestion } from 'src/redux/slice/Course/MyCourse/Case-study/CaseStudy'
import { IExhibit } from '@lms/core'
import { CoursesAPI } from 'src/pages/api/courses'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import {
  IAnswerResult,
  ICaseStudyResult,
  ICratchPad,
  IQuestionResult,
  IRequirement,
  ITopic,
} from '@lms/core'
import clsx from 'clsx'
import FileViewer from '@components/base/fileViewer/FileViewer'
import MatchQuizComponent from '@components/questionType/MatchQuiz/MatchQuiz'
import DragDropQuestion, {
  SlotValue,
} from '@components/questionType/NewDragNDropQuestion/NewDragNDrop'
import CloseModalIcon from '@assets/icons/CloseModalIcon'
import { Triangle } from '@components/icons/Triangle'
import CaseStudyWrapper from '@components/case-study/layout/CaseStudyWrapper'
import Popover from '@components/Popover'
import { download } from '@components/learning/activity/ActivityResource'
import { NotesOutline } from '@components/icons/Notes'
import PulsingExclamation from '@components/icons/PulsingExclamation'
import { Divider } from 'antd'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

const CaseStudyResult = () => {
  const editorRefs = useRef<any[]>([])
  const router = useRouter()
  const containerRef = useRef(null)
  const { control, setValue, getValues } = useForm()
  const { control: controlScratch } = useForm()
  const [allowHighLight, setAllowHighLight] = useState(false)
  const [allowUnHighLight, setAllowUnHighLight] = useState(false)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0)
  const questionsScrollRef = useRef<HTMLDivElement | null>(null)

  // handle show exhibit list
  const [showListExhibits, setShowListExhibits] = useState(false)
  const [exhibitData, setExhibitData] = useState<IExhibit[]>([])
  const [openScratchPad, setOpenScratchPad] = useState<Array<ICratchPad>>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const dispatch = useAppDispatch()

  const [startResize, setStartResize] = useState(false)
  const [currentMousePos, setCurrentMousePos] = useState(0)
  const [leftWidth, setLeftWidth] = useState(0)
  const [currentLeftWidth, setCurrentLeftWidth] = useState(0)

  const [result, setResult] = useState<ICaseStudyResult>()
  const [loading, setLoading] = useState<boolean>(false)
  const [topics, setTopics] = useState<ITopic>()
  const [scratchPadValues, setScratchPadValues] = useState<{ value: string }>({
    value: '',
  })
  const [exhibitText, setExhibitText] = useState<string>('')
  const [isClickExhibitOpen, setIsClickExhibitOpen] = useState(false)
  const [isFilesOpen, setIsFilesOpen] = useState(false)
  const [isScratchPadOpen, setIsScratchPadOpen] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [showWarning, setShowWarning] = useState(true)

  /**
   * Declare form to handle exhibit
   */
  const {
    getValues: getValuesExhibits,
    setValue: setValueExhibits,
    watch,
  } = useForm()

  /**
   * Function: handle Generate Question and answer
   */
  const checkType = (
    index: number,
    data: IQuestionResult,
    type: string,
    currentTabID: string,
    defaultValue: any,
    corrects?: any,
    highlighted?: any,
    solution?: string,
    done?: boolean,
    requirement?: IRequirement,
    question_content?: string,
    answerFile?: { file_key: string; file_name: string; url: string },
    requirementIndex?: number,
    requirementQuestion?: IRequirement,
  ) => {
    switch (type) {
      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <OneChoiceQuestion
            data={data}
            control={control}
            name={`${index}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            corrects={corrects}
            handleSaveHighLight={() => {}}
            highlighted={highlighted}
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
            name={`${index}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            corrects={corrects}
            handleSaveHighLight={() => {}}
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
            name={`${index}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            handleSaveHighLight={() => {}}
            allowUnHighLight={allowUnHighLight}
            corrects={corrects}
            solution={solution}
          />
        )
      case QUESTION_TYPES.MATCHING:
        return (
          <MatchQuizComponent
            data={data}
            highlighted={highlighted}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            done={done}
            corrects={corrects?.corrects}
            solution={solution}
            isAlwaysShowAnswer
          />
        )
      case QUESTION_TYPES.FILL_WORD:
        return (
          <AddWordPreview
            data={data}
            handleSaveHighLight={() => {}}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            solution={solution}
          />
        )
      case QUESTION_TYPES.DRAG_DROP:
        return (
          // <DragNDropPreview
          //   data={data}
          //   allowHighLight={allowHighLight}
          //   allowUnHighLight={allowUnHighLight}
          //   defaultAnswer={defaultValue}
          //   corrects={corrects?.corrects}
          //   solution={solution}
          // />
          <DragDropQuestion
            data={data as any}
            defaultValue={defaultValue}
            onChange={(data: SlotValue[]) => {
              setValue?.(`${index}_answer`, data)
            }}
            corrects={corrects?.corrects}
            solution={solution}
          />
        )
      case QUESTION_TYPES.SELECT_WORD:
        return (
          <SelectWord
            data={data}
            handleSaveHighLight={() => {}}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            solution={solution}
          />
        )
      case QUESTION_TYPES.ESSAY:
        if (!editorRefs.current[index]) {
          editorRefs.current[index] = React.createRef()
        }
        return (
          <EssayQuestionPreview
            data={{ ...requirementQuestion, ...requirement }}
            question_content={question_content ?? ''}
            index={requirementIndex === -1 ? 0 : requirementIndex}
            question_data={data}
            control={control}
            handleSaveHighLight={() => {}}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            forCaseStudy={true}
            name={`${data?.id}_${index}_answer`}
            setValue={setValue}
            defaultValue={defaultValue}
            fullData={{
              confirmed: true,
              done: true,
              ...data,
              answer_file: answerFile,
            }}
            response_option_custom={0}
            solution={solution}
            setOpenPdf={handleOpenScratchPad}
            isShowContent={true}
            externalRef={editorRefs.current[index]}
          />
        )
      default:
        return <div></div>
    }
  }

  const handleResetEssay = async (
    index: number,
    activeQuestion: any,
    defaultValue?: string,
  ) => {
    const essayRef = editorRefs.current[index]?.current

    if (!essayRef) return

    if (activeQuestion?.response_option === RESPONSE_OPTION.WORD) {
      essayRef.reset?.(defaultValue)
      await new Promise((resolve) => setTimeout(resolve, 10))
    } else if (activeQuestion?.response_option === RESPONSE_OPTION.SHEET) {
      essayRef.resetSheet?.()
    }
  }
  /**
   *
   * */
  const getIndexOfRequirement = (
    requirement?: IRequirement,
    questionId?: string,
  ) => {
    const order = result?.answers
      ?.filter((item) => item?.question_id === questionId)
      .findIndex((value) => value?.requirement_id === requirement?.id)
    if (order === undefined || order === null) return 0
    return order
  }

  const resetEssayBeforeAction = () => {
    result?.answers?.forEach((item: any, index: number) => {
      const question =
        item.question.qType === QUESTION_TYPES.ESSAY
          ? { ...item.question, response_option: item.response_option }
          : item.question
      const name = `${question?.id}_${index}_answer`
      const defaultValue = getValues(name)
      handleResetEssay(index, question, defaultValue)
    })
  }

  /**
   * handle go to next Topic
   */
  const handleNextTopic = () => {
    resetEssayBeforeAction()
    if (!result?.next_topic) {
      backToPart()
      return
    }
    if (result?.next_topic?.attempt) {
      router.replace(
        `/case-study/result/${result?.next_topic?.attempt.id}?class_user_id=${router.query.class_user_id}&class_id=${router?.query?.class_id}&course_section_id=${router?.query?.course_section_id}`,
      )
    } else {
      router.push(
        `/case-study/${result?.next_topic?.question_topic_id}?quiz_id=${result?.quiz_id}&class_user_id=${router?.query?.class_user_id}&class_id=${router?.query?.class_id}&course_section_id=${router?.query?.course_section_id}&caseStudyId=${result?.next_topic?.id}`,
      )
    }
  }

  /**
   * go to next Topic
   */
  const handlePeriousTopic = () => {
    resetEssayBeforeAction()
    if (result?.previous_topic?.attempt) {
      router.replace(
        `/case-study/result/${result?.previous_topic?.attempt.id}?class_user_id=${router.query.class_user_id}&class_id=${router?.query?.class_id}&course_section_id=${router?.query?.course_section_id}`,
      )
    } else {
      router.push(
        `/case-study/${result?.previous_topic?.question_topic_id}?quiz_id=${result?.quiz_id}&class_user_id=${router?.query?.class_user_id}&class_id=${router?.query?.class_id}&course_section_id=${router?.query?.course_section_id}&caseStudyId=${result?.previous_topic?.id}`,
      )
    }
  }

  const { x } = useMousePosition()

  useEffect(() => {
    if (startResize) {
      const temp = currentLeftWidth
      setLeftWidth(temp + (currentMousePos - (x || 0)))
    }
  }, [x, startResize])

  const getResult = (question: IQuestionResult) => {
    if (
      question.qType === QUESTION_TYPES.ONE_CHOICE ||
      question.qType === QUESTION_TYPES.TRUE_FALSE ||
      question.qType === QUESTION_TYPES.MULTIPLE_CHOICE
    ) {
      return question.answers?.reduce(
        (previousValue: any, currentValue: any) => {
          return {
            ...previousValue,
            [currentValue.id]: currentValue.is_correct,
          }
        },
        {} as { [key: string]: boolean },
      )
    } else if (
      question.qType === QUESTION_TYPES.FILL_WORD ||
      question.qType === QUESTION_TYPES.SELECT_WORD
    ) {
      return { corrects: [...question.answers] }
    } else if (question.qType === QUESTION_TYPES.MATCHING) {
      return { corrects: [...question.question_matchings] }
    } else if (question.qType === QUESTION_TYPES.DRAG_DROP) {
      return {
        corrects: [
          ...question.answers?.sort(
            (a: any, b: any) => a?.answer_position - b?.answer_position,
          ),
        ],
      }
    }
  }

  const formatAnswer = (data: IAnswerResult) => {
    if (
      data.question.qType === QUESTION_TYPES.ONE_CHOICE ||
      data.question.qType === QUESTION_TYPES.TRUE_FALSE
    ) {
      return data.question_answer_id
    }
    if (data.question.qType === QUESTION_TYPES.FILL_WORD) {
      return data.answer?.map(
        (item: { answer_position?: number; answer_text: string }) =>
          item.answer_text,
      )
    }
    if (data.question.qType === QUESTION_TYPES.SELECT_WORD) {
      return data.answer?.map(
        (item: { answer_position: number; answer_id: string }) =>
          item.answer_id,
      )
    }
    if (data.question.qType === QUESTION_TYPES.DRAG_DROP) {
      return data.answer?.map(
        (item: { answer_position: number; answer_id: string }) => {
          return {
            idAnswer: item.answer_id,
            position: item.answer_position,
            value: data?.question?.answers?.find(
              (ans: {
                id: string
                answer: string
                is_correct: boolean
                answer_position: number
              }) => ans.id === item.answer_id,
            )?.answer,
          }
        },
      )
    }
    if (data.question.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
      return data.answer?.map((item: { answer_id: string }) => item.answer_id)
    }
    if (data.question.qType === QUESTION_TYPES.ESSAY) {
      return data.short_answer
    }
    return data.answer
  }

  const handleExhibit = (data: IAnswerResult) => {
    if (data.question.question_topic) {
      setTopics(data.question.question_topic)
    }
    if (data?.question?.question_topic?.exhibits) {
      setExhibitData([...(data?.question?.question_topic?.exhibits ?? [])])
    }
  }

  /**
   * Check value of exhibit to open ScratchPad
   */
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
  }

  const backToPart = () => {
    resetEssayBeforeAction()
    if (router?.query?.class_id && router?.query?.course_section_id) {
      router.push(
        `/courses/${router?.query?.class_id}/section/${router?.query?.course_section_id}`,
      )
    } else {
      router.push(`/courses`)
    }
  }

  const fetchResult = async (id: string) => {
    setLoading(true)
    try {
      const res = await CoursesAPI.getCaseStudyAttemptsTable(id, 1, 10)
      res?.data?.answers && handleExhibit(res?.data?.answers?.[0])
      setExhibitText(
        res.data.program === PROGRAM.CMA
          ? EXHIBIT_TEXT_REPLACE.EXHIBIT_REPLACE
          : EXHIBIT_TEXT_REPLACE.EXHIBIT,
      )
      setResult(res.data)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const exhibits = useMemo(() => {
    return (
      exhibitData?.map((exhibit, index: number) => ({
        label: `${exhibitText} ${+index + 1}`,
        value: exhibit.id,
      })) ?? []
    )
  }, [exhibitData])

  const handleCloseScratchPad = (pad: ICratchPad) => {
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      const newArr = arr.filter((e) => e?.id !== pad.id)
      if (pad.type === 'exhibits') {
        setValueExhibits(
          'exhibits',
          getValuesExhibits('exhibits').filter((e: string) => e !== pad.id),
        )
      } else if (pad.type === 'scratch_pad') {
        setIsScratchPadOpen(false)
      } else if (pad.type === 'calculator') {
        setIsCalculatorOpen(false)
      }
      return newArr
    })
  }
  const handleOpenScratchPad = (
    type: string,
    file?: string,
    fileName?: string,
  ) => {
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      if (type === 'scratch_pad') {
        arr.push({ id: uniqueId('scratchPad'), type: type })
        setIsScratchPadOpen(true)
      } else if (type === 'calculator') {
        for (let e of arr) {
          if (e.type === 'calculator') {
            return arr
          }
        }
        arr.push({ id: 'calculator', type: 'calculator' })
        setIsCalculatorOpen(true)
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

  const handleChangeScratchPad = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    id?: string,
  ) => {
    const { value } = e.target
    setScratchPadValues((prevState: { value: string }) => ({
      ...prevState,
      value,
    }))
  }

  const checkCalExist = useMemo(() => {
    for (let i in openScratchPad) {
      if (openScratchPad[i].type === 'calculator') {
        return +i
      }
    }
    return -1
  }, [openScratchPad])

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
    !!router.query.id && fetchResult(router.query.id as string)
  }, [router.query.id])

  const questionRender = useMemo(() => {
    editorRefs.current = new Array(result?.answers?.length || 0).fill(null)

    return result?.answers?.map((item: any, index: number) => {
      const question =
        item.question.qType === QUESTION_TYPES.ESSAY
          ? { ...item.question, response_option: item.response_option }
          : item.question
      const solution =
        item.question.qType === QUESTION_TYPES.ESSAY
          ? item?.requirement?.explanation
          : item.question.solution
      const corrects = getResult(question)
      const requirementIndex = getIndexOfRequirement(
        item?.requirement,
        question.id,
      )
      const requirementQuestion = question?.requirements?.find(
        (req: IRequirement) => req.id === item?.requirement?.id,
      )

      return (
        <div
          id={`question-${index}`}
          key={question?.id + index}
          topic-key={question?.question_topic?.id}
          className={clsx(
            'mb-8 flex w-full flex-col gap-8 rounded-xl bg-gray-100 p-8',
            {
              'min-w-[350px] bg-white px-0 py-8':
                question?.data?.qType === QUESTION_TYPES.ESSAY,
              '!w-fit': question?.data?.qType === QUESTION_TYPES.MATCHING,
            },
          )}
        >
          {checkType(
            index,
            question,
            question?.qType,
            question?.id,
            formatAnswer(item),
            corrects,
            undefined,
            solution,
            true,
            item?.requirement,
            question?.question_content,
            item?.answer_file,
            requirementIndex,
            requirementQuestion,
          )}
        </div>
      )
    })
  }, [result])

  const scrollToQuestion = (index: number) => {
    const container = questionsScrollRef.current as any
    const target = document.getElementById(`question-${index}`)
    if (!container || !target) return
    const top = (target as any).offsetTop ?? 0
    container.scrollTo({ top: Math.max(top - 12, 0), behavior: 'smooth' })
    setActiveQuestionIndex(index)
  }

  const handleNextQuestion = () => {
    const total = questionRender?.length || 0
    if (total === 0) return
    const next = Math.min(activeQuestionIndex + 1, total - 1)
    scrollToQuestion(next)
  }

  const handlePrevQuestion = () => {
    const prev = Math.max(activeQuestionIndex - 1, 0)
    scrollToQuestion(prev)
  }

  const isScatchPadEnabled = useMemo(() => {
    return openScratchPad.some((item) => item.type === 'scratch_pad') || false
  }, [openScratchPad])

  const isShowIconButtonInBottom = [
    QUESTION_TYPES.FILL_WORD,
    QUESTION_TYPES.TRUE_FALSE,
    QUESTION_TYPES.ONE_CHOICE,
    QUESTION_TYPES.SELECT_WORD,
  ].includes(topics?.qType as QUESTION_TYPES)
  const { isDesktopView } = useTailwindBreakpoint()

  return (
    <SappLoadingGlobal loading={loading}>
      <CaseStudyWrapper
        onQuit={() => backToPart()}
        isResult
        title={`${topics?.case_study_name} - ${topics?.name}`}
        onNextQuestion={handleNextQuestion}
        onPrevQuestion={handlePrevQuestion}
        currentQuestion={activeQuestionIndex}
        totalQuestions={questionRender?.length || 0}
      >
        <div
          className="relative flex h-full flex-col overflow-hidden bg-white"
          onMouseUp={() => {
            setStartResize(false)
            setCurrentLeftWidth(leftWidth)
          }}
        >
          <div className="h-full" ref={containerRef}>
            <div className="flex h-full bg-[#F1F1F1]" id={'preview-question'}>
              <div
                className={`h-full overflow-auto bg-white p-6`}
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
                            () => {},
                            allowHighLight || false,
                            'hightlight_area_topic',
                          )
                        } else if (allowUnHighLight) {
                          runHighlight(
                            () => {},
                            allowUnHighLight || false,
                            'hightlight_area_topic',
                            { color: 'white' },
                          )
                        }
                      }
                    }
                  }}
                >
                  {/* {topics} */}

                  <div
                    key={topics?.id}
                    data-key={topics?.id}
                    // className="min-h-[calc(100vh-104px)]"
                    className="mb-4"
                  >
                    <EditorReader text_editor_content={topics?.description} />
                  </div>
                </div>
              </div>
              <div
                className="z-10 flex h-full w-[2px] cursor-ew-resize items-center justify-center bg-[#99A1B7]"
                onMouseDown={() => {
                  setStartResize(true)
                  setCurrentMousePos(x || 0)
                }}
                onMouseUp={() => setStartResize(false)}
              >
                <div className="h-8 w-8 rounded-full bg-white">
                  <ResizeIcon />
                </div>
              </div>
              <div
                className={`h-full overflow-auto bg-white py-6`}
                style={{ width: `calc(50% + ${leftWidth}px)` }}
                ref={questionsScrollRef}
                onScroll={(e) => {
                  const { target } = e
                  if (
                    (target as any).scrollTop + (target as any).offsetHeight >=
                    (target as any).scrollHeight
                  ) {
                    dispatch(loadMoreQuestion(''))
                  }
                }}
              >
                <div className="min-w-[700px]">
                  <div
                    className="px-6"
                    id="hightlight_area"
                    onMouseUp={(e: any) => {
                      if (
                        e.target.tagName.charAt(0) !== 'm' &&
                        e.target.firstChild?.tagName !== 'math'
                      ) {
                        if (e) {
                          if (allowHighLight) {
                            runHighlight(
                              () => {},
                              allowHighLight || false,
                              'hightlight_area_topic',
                            )
                          } else if (allowUnHighLight) {
                            runHighlight(
                              () => {},
                              allowUnHighLight || false,
                              'hightlight_area_topic',
                              { color: 'white' },
                            )
                          }
                        }
                      }
                    }}
                  >
                    {questionRender}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {openScratchPad?.map((e, index: number) => {
            if (e.type === 'calculator') {
              return (
                <MovableWindow
                  position={{
                    width: '344px',
                    height: 'fit-content',
                    top: 'calc(25% - 150px)',
                    left: 'calc(25% - 200px)',
                  }}
                  key={e?.id}
                  onClick={() => setOnFocusingPad(e?.id as string)}
                  zIndex={
                    onFocusingPad === e?.id
                      ? openScratchPad?.length + 500
                      : index + 500
                  }
                >
                  <div className="absolute left-0 top-0 h-full w-fit rounded-xl">
                    <div
                      className="flex h-fit w-full items-center justify-between rounded-t-xl border border-b-0 border-gray-300 bg-gray-100 px-4 py-3"
                      style={{
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div className="text-sm font-bold">Calculator</div>
                      <button onClick={() => handleCloseScratchPad(e)}>
                        <CloseModalIcon />
                      </button>
                    </div>
                    <Calculator />
                  </div>
                </MovableWindow>
              )
            } else if (e.type === 'scratch_pad') {
              return (
                <MovableWindow
                  position={{
                    width: '412px',
                    height: '312px',
                    top: 'calc(50% - 150px)',
                    left: 'calc(50% - 200px)',
                  }}
                  key={e?.id}
                  onClick={() => setOnFocusingPad(e?.id as string)}
                  zIndex={
                    onFocusingPad === e?.id
                      ? openScratchPad?.length + 500
                      : index + 500
                  }
                >
                  <div className="absolute left-0 top-0 h-full w-full overflow-hidden rounded-xl">
                    <div className="flex w-full items-center justify-between bg-gray-v2-100 px-4 py-3">
                      <div className="text-sm font-bold">Scratch Pad</div>
                      {/* <CloseIcon */}
                      <button onClick={() => handleCloseScratchPad(e)}>
                        <CloseModalIcon />
                      </button>
                    </div>
                    <HookFormTextArea
                      defaultValue={scratchPadValues?.value}
                      placeholder="Take a note..."
                      control={controlScratch}
                      name={e?.id as string}
                      onChange={(event) => handleChangeScratchPad(event, e?.id)}
                      className="sapp-text-area not-resizer h-full w-full rounded-b-xl rounded-t-none px-5 py-3 placeholder:text-sm placeholder:font-normal"
                    />
                    {/* </div> */}
                  </div>
                </MovableWindow>
              )
            } else if (e.type === 'exhibits') {
              const i = exhibitData?.findIndex(
                (el: IExhibit) => el?.id === e?.id,
              )
              const exhibitsDes = exhibitData?.find(
                (exhibit) => exhibit?.id === e?.id,
              )
              return (
                <ModalResizeable
                  key={e.id}
                  handleCloseScratchPad={() => handleCloseScratchPad(e)}
                  position="center left"
                  header={
                    <div className="modal-header modal-dragger flex w-full cursor-move items-center justify-between rounded-t-xl bg-gray-100 px-4 py-3">
                      <div className="text-sm font-semibold text-gray-800">
                        {`${exhibitText} ${(i ?? 0) + 1}: ${exhibitsDes?.name}`}
                      </div>
                      <button
                        className="text-icon"
                        onClick={() => handleCloseScratchPad(e)}
                      >
                        <CloseModalIcon />
                      </button>
                    </div>
                  }
                  modalIndex={i}
                  draggableFull
                >
                  <div className="h-full bg-white px-4 py-3">
                    <EditorReader
                      text_editor_content={exhibitsDes?.description}
                      className="w-full"
                    />
                    {exhibitsDes &&
                      exhibitsDes?.files?.length > 0 &&
                      exhibitsDes?.files?.map((e: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="h-full cursor-pointer overflow-auto bg-white"
                          >
                            <FileViewer
                              fileName={e?.resource?.name}
                              fileUrl={e?.resource?.url}
                            />
                          </div>
                        )
                      })}
                  </div>
                  <Triangle className="absolute bottom-2 right-2" />
                </ModalResizeable>
              )
            } else if (e.type === 'file') {
              return (
                <ModalResizeable
                  title={e?.fileName}
                  width={isDesktopView ? 650 : 400}
                  height={isDesktopView ? 750 : 400}
                  key={e.id}
                  handleCloseScratchPad={() => handleCloseScratchPad(e)}
                  position="center"
                  draggableFull
                >
                  <div
                    className="overflow-auto bg-white p-4"
                    style={{ height: 'calc(100% - 40px' }}
                  >
                    <FileViewer
                      fileName={e?.fileName as string}
                      fileUrl={e?.file as string}
                    />
                  </div>
                </ModalResizeable>
              )
            }
          })}
          <div className="fixed bottom-[232px] right-8 z-[1000] w-12">
            <div className="flex flex-col gap-3">
              {exhibitData && exhibitData?.length > 0 && (
                <Popover
                  placement="leftTop"
                  trigger="click"
                  open={isClickExhibitOpen}
                  onOpenChange={(open) => setIsClickExhibitOpen(open)}
                  content={
                    <div className="flex flex-col gap-2">
                      {exhibits?.map(
                        (
                          e: { label: string; value: string },
                          index: number,
                        ) => {
                          return (
                            <div
                              key={e?.value}
                              className={
                                'min-w-36 cursor-pointer rounded-md p-2 text-center hover:bg-[#0E1214]'
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
                      <div className="px-2">
                        <div className="text-sm">
                          {`${exhibitText} (${exhibitData?.length > 9 ? exhibitData?.length : `0${exhibitData?.length}`})`}
                        </div>
                      </div>
                    }
                    trigger="hover"
                    open={!isClickExhibitOpen ? undefined : false}
                    placement="left"
                  >
                    <div className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary hover:bg-blend-overlay">
                      <NotesOutline className="h-8 w-8 text-white" />
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

              {topics?.files && topics?.files?.length > 0 && (
                <Popover
                  className=""
                  placement="leftTop"
                  trigger="click"
                  open={isFilesOpen}
                  onOpenChange={(open) => setIsFilesOpen(open)}
                  getPopupContainer={() => document.body}
                  content={
                    <div className="flex flex-col gap-2">
                      {topics?.files?.map((e: any, index: number) => {
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
                                'min-w-36 max-w-96 cursor-pointer overflow-hidden text-ellipsis text-nowrap text-white underline',
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
                      })}
                    </div>
                  }
                  zIndex={1050}
                >
                  <Popover
                    content={
                      <div className="px-2">
                        <div className="text-sm">
                          {`Files (${topics?.files?.length > 9 ? topics?.files?.length : `0${topics?.files?.length}`})`}
                        </div>
                      </div>
                    }
                    trigger="hover"
                    open={!isFilesOpen ? undefined : false}
                    placement="left"
                  >
                    <div
                      className={clsx(
                        'grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-icon hover:bg-blend-overlay',
                      )}
                    >
                      <FileTextIcon />
                    </div>
                  </Popover>
                </Popover>
              )}
            </div>
            {((exhibitData && exhibitData?.length > 0) ||
              (topics?.files && topics?.files?.length > 0)) && (
              <Divider className="my-6" />
            )}
            <div className="flex flex-col gap-3">
              <Popover
                content={
                  <div className="px-2">
                    <div className="text-sm">Scratch Pad</div>
                  </div>
                }
                trigger="hover"
                open={!isScratchPadOpen ? undefined : false}
                placement="left"
              >
                <div
                  className={clsx(
                    'grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-icon hover:bg-blend-overlay',
                  )}
                  onClick={() => {
                    handleOpenScratchPad('scratch_pad')
                  }}
                >
                  <ScratchPadIconV2 isActive className="h-6 w-6" />
                </div>
              </Popover>
              <Popover
                content={
                  <div className="px-2">
                    <div className="text-sm">Calculator</div>
                  </div>
                }
                trigger="hover"
                open={!isCalculatorOpen ? undefined : false}
                placement="left"
              >
                <button
                  className={clsx(
                    'grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-icon hover:bg-blend-overlay',
                  )}
                  onClick={() => {
                    handleOpenScratchPad('calculator')
                  }}
                  disabled={checkCalExist > -1}
                >
                  <CalculatorIconV2 isActive className="h-6 w-6" />
                </button>
              </Popover>
            </div>
          </div>
        </div>
      </CaseStudyWrapper>
    </SappLoadingGlobal>
  )
}

export default CaseStudyResult
