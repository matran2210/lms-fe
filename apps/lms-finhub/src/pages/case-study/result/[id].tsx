import {
  CalculatorIcon,
  CloseIcon,
  CloseModalIcon,
  ExhibitsIcon,
  HighlightIcon,
  ResizeIcon,
  ScratchPadIcon,
  UnHighLightIcon,
} from '@lms/assets'

import { loadMoreQuestion } from '@lms/contexts'
import {
  EXHIBIT_TEXT_REPLACE,
  IAnswerResult,
  ICaseStudyResult,
  ICratchPad,
  IExhibit,
  IFile,
  IQuestionResult,
  IRequirement,
  ITopic,
  PROGRAM,
  QUESTION_TYPES,
  RESPONSE_OPTION,
  ROUTES,
} from '@lms/core'
import {
  useMousePosition,
  useSmartModalSize,
  useTailwindBreakpoint,
} from '@lms/hooks'
import {
  AddWordPreview,
  ButtonPrimary,
  ButtonText,
  Calculator,
  CaseStudyWrapper,
  EditorReader,
  EssayQuestionPreview,
  FileViewer,
  HookFormTextArea,
  MatchQuizComponent,
  ModalResizeable,
  MovableWindow,
  MultiChoiceQuestion,
  NewDragNDropQuestion,
  OneChoiceQuestion,
  SappLoadingGlobal,
  SelectWord,
  SlotValue,
} from '@lms/ui'
import { runHighlight } from '@lms/utils'
import clsx from 'clsx'
import { isNull, uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CoursesAPI } from 'src/pages/api/courses'
import { useAppDispatch } from 'src/redux/hook'

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
  const { width: widthFileViewer, height: heightFileViewer } =
    useSmartModalSize()

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
  // const [isClickExhibitOpen, setIsClickExhibitOpen] = useState(false)
  // const [showWarning, setShowWarning] = useState(true)
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
          <NewDragNDropQuestion
            data={data as any}
            defaultValue={defaultValue}
            onChange={(data: SlotValue[]) => {
              setValue?.(`${index}_answer`, data)
            }}
            corrects={corrects?.corrects}
            solution={solution}
            explainClassname="!mt-8 !p-0 !bg-transparent"
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
            name={`${index}_answer`}
            setValue={setValue}
            defaultValue={defaultValue}
            fullData={{
              confirmed: true,
              done: true,
              ...data,
              answer_file: answerFile,
            }}
            isShowContent={true}
            response_option_custom={0}
            solution={solution}
            setOpenPdf={handleOpenScratchPad}
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
      const name = `${index}_answer`
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
      return data.answer
    }
    if (data.question.qType === QUESTION_TYPES.DRAG_DROP) {
      return data.answer?.map(
        (item: { answer_position: number; answer_id: string }) => {
          return {
            id: item.answer_id,
            idAnswer: item.answer_id,
            value: data?.question?.answers?.find(
              (ans: {
                id: string
                answer: string
                is_correct: boolean
                answer_position: number
              }) => ans.id === item.answer_id,
            )?.answer,
            position: item.answer_position,
          }
        },
      )
    }
    if (data.question.qType === QUESTION_TYPES.MATCHING) {
      return data?.answer
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
    if (router?.query?.class_id) {
      if (router?.query?.is_from_activity) {
        router.push(
          ROUTES.ACTIVITY(
            router?.query?.class_id as string,
            router?.query?.course_section_id as string,
          ),
        )
      } else {
        router.push(ROUTES.COURSE_DETAIL(router?.query?.class_id as string))
      }
    } else {
      router.push(ROUTES.SHORT_COURSE)
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
      } else if (type === 'calculator') {
        for (let e of arr) {
          if (e.type === 'calculator') {
            return arr
          }
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

  const handleChangeScratchPad = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
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
                question?.qType === QUESTION_TYPES.ESSAY,
              '!w-fit': question?.qType === QUESTION_TYPES.MATCHING,
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

  // const isScatchPadEnabled = useMemo(() => {
  //   return openScratchPad.some((item) => item.type === 'scratch_pad') || false
  // }, [openScratchPad])

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
        footer={
          <div
            className={clsx(
              'flex items-center justify-end overflow-hidden px-8 py-4 transition-[height] duration-300 ease-in-out will-change-contents lg:h-[var(--footer-h)]',
            )}
            style={{
              ['--footer-h' as any]: '80px',
            }}
          >
            {/* <div className="hidden h-full w-[150px] items-center gap-1 lg:flex">
              <button
                className={`h-fit rounded-lg ${isScatchPadEnabled && 'bg-primary'
                  }`}
                onClick={() => {
                  handleOpenScratchPad('scratch_pad')
                }}
              >
                <ButtonContent
                  icon={<ScratchPadIcon isActive={isScatchPadEnabled} />}
                  content=""
                />
              </button>
              <button
                className={`h-fit rounded-lg ${checkCalExist > -1 && 'bg-primary'
                  }`}
                onClick={() => {
                  handleOpenScratchPad('calculator')
                }}
                disabled={checkCalExist > -1}
              >
                <ButtonContent
                  icon={<CalculatorIcon isActive={checkCalExist > -1} />}
                  content=""
                />
              </button>
            </div> */}
            <div className="flex items-center justify-center">
              {!isNull(result?.previous_topic) && (
                <ButtonText
                  title="Previous"
                  onClick={handlePeriousTopic}
                  className="me-6"
                />
              )}
              {!isNull(result?.next_topic) && (
                <ButtonPrimary title="Next" onClick={handleNextTopic} />
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
                  <TopicFiles
                    files={topics?.files ?? []}
                    onOpen={handleOpenScratchPad}
                  />
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
                    onClick={() => setOnFocusingPad(e?.id ?? '')}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 1001
                        : index + 1001
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
                    onClick={() => setOnFocusingPad(e?.id ?? '')}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 1001
                        : index + 1001
                    }
                  >
                    <div className="absolute left-0 top-0 h-full w-full overflow-hidden rounded-xl">
                      <div className="flex w-full items-center justify-between bg-gray-100 px-4 py-3">
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
                        name={e?.id ?? ''}
                        onChange={(
                          event: React.ChangeEvent<
                            HTMLTextAreaElement | HTMLInputElement
                          >,
                        ) => handleChangeScratchPad(event)}
                        className="sapp-text-area not-resizer h-[calc(100%-48px)] w-full rounded-b-xl rounded-t-none px-5 py-3 placeholder:text-sm placeholder:font-normal"
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
                    position="center"
                    header={({ requestClose }) => (
                      <div className="relative">
                        <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between bg-white px-5">
                          <div className="truncate">
                            <span className="text-base font-semibold ">{`${exhibitText} ${
                              (i ?? 0) + 1
                            }: `}</span>
                            {exhibitsDes?.name}
                          </div>
                        </div>
                        <button
                          className="absolute right-3 top-2"
                          onClick={() => {
                            requestClose()
                            setTimeout(() => handleCloseScratchPad(e), 300)
                          }}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    )}
                  >
                    <div className="h-[calc(100%-40px)] overflow-auto bg-white p-5">
                      {/* <EditorReader
                        text_editor_content={exhibitsDes?.description}
                        className=" w-full"
                      /> */}
                      {exhibitsDes &&
                        exhibitsDes?.files?.length > 0 &&
                        exhibitsDes?.files?.map((e: IFile, index: number) => {
                          return (
                            <div key={index} className="overflow-auto bg-white">
                              <FileViewer
                                fileName={e?.resource?.name ?? ''}
                                fileUrl={e?.resource?.url ?? ''}
                              />
                            </div>
                          )
                        })}
                    </div>
                  </ModalResizeable>
                )
              } else if (e.type === 'file') {
                return (
                  <ModalResizeable
                    title={e?.fileName}
                    width={widthFileViewer}
                    height={heightFileViewer}
                    minWidth={200}
                    minHeight={200}
                    key={e.id}
                    dragHandleClassName="modal-header"
                    handleCloseScratchPad={() => handleCloseScratchPad(e)}
                    position="center"
                  >
                    <div
                      className="overflow-auto bg-white p-4"
                      style={{ height: 'calc(100% - 40px' }}
                    >
                      <FileViewer
                        fileName={e?.fileName ?? ''}
                        fileUrl={e?.file ?? ''}
                      />
                    </div>
                  </ModalResizeable>
                )
              }
            })}
            <div className=" relative flex h-[48px] items-center justify-between bg-gray-3 shadow-question-footer">
              <div className="flex h-full items-center">
                <button
                  className={`h-full ${allowHighLight && 'bg-yellow-300'}`}
                  onClick={() => {
                    setAllowHighLight(!allowHighLight)
                    setAllowUnHighLight(false)
                  }}
                >
                  <div className="flex items-center gap-3 border-l px-4 3xl:pe-6 3xl:ps-6 ">
                    <HighlightIcon />
                    <div className="hidden text-sm font-normal 3xl:inline-block">
                      Highlight
                    </div>
                  </div>
                </button>
                <button
                  className={`h-full ${allowUnHighLight && 'bg-yellow-300'}`}
                  onClick={() => {
                    setAllowUnHighLight(!allowUnHighLight)
                    setAllowHighLight(false)
                  }}
                >
                  <div className="flex items-center gap-3 border-l px-4 3xl:pe-6 3xl:ps-6 ">
                    <UnHighLightIcon />
                    <div className="hidden text-sm font-normal 3xl:inline-block">
                      Unhighlight
                    </div>
                  </div>
                </button>
                <button
                  className="h-full"
                  onClick={() => handleOpenScratchPad('scratch_pad')}
                >
                  <div className="flex items-center gap-3 border-l px-4 3xl:pe-6 3xl:ps-6">
                    <ScratchPadIcon />
                    <div className="hidden text-sm font-normal 3xl:inline-block">
                      Scratch Pad
                    </div>
                  </div>
                </button>
                <button
                  className={`h-full ${
                    checkCalExist > -1 && 'sapp-disable-button'
                  }`}
                  onClick={() => handleOpenScratchPad('calculator')}
                  disabled={checkCalExist > -1}
                >
                  <div className="flex items-center gap-3 border-l px-4 3xl:px-6">
                    <CalculatorIcon />
                    <div className="hidden text-sm font-normal 3xl:inline-block">
                      Calculator
                    </div>
                  </div>
                </button>
                {exhibits.length > 0 && (
                  <button className="relative h-full">
                    <div
                      className="flex items-center gap-3 border-l px-4 3xl:px-6"
                      onClick={() => {
                        setShowListExhibits(!showListExhibits)
                      }}
                    >
                      <ExhibitsIcon />
                      <div className="flex items-center gap-3 text-sm font-normal">
                        <div>
                          <span className="hidden  lg:inline-block 3xl:me-1">
                            {`${exhibitText}s (${exhibits?.length})`}
                          </span>
                        </div>
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
                                className={`whitespace-nowrap p-3 ${exhibitText === EXHIBIT_TEXT_REPLACE.EXHIBIT_REPLACE ? 'min-w-[200px] ' : 'min-w-[100px] '} ${
                                  !watch('exhibits')?.includes(e?.value) &&
                                  'text-gray-1 '
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
              </div>
              {/* */}
            </div>
          </div>
        </div>
      </CaseStudyWrapper>
    </SappLoadingGlobal>
  )
}

const TopicFiles: React.FC<{
  files: IFile[]
  onOpen: (type: string, url: string, name: string) => void
}> = ({ files, onOpen }) => {
  if (!files || files.length === 0) return null

  return (
    <>
      {files.map((file, index) => (
        <div
          key={index}
          className="cursor-pointer text-state-info hover:underline"
          onClick={() =>
            onOpen('file', file?.resource?.url, file?.resource?.name)
          }
        >
          {file?.resource?.name}
        </div>
      ))}
    </>
  )
}

export default CaseStudyResult
