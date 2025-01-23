import {
  CalculatorIcon,
  CloseIcon,
  ExhibitsIcon,
  HighlightIcon,
  ScratchPadIcon,
  UnHighLightIcon,
} from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import PDFViewer from '@components/base/pdf/pdf-viewer'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import MovableWindow from '@components/base/window'
import Calculator from '@components/calculator'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
import DragNDropPreivew from '@components/questionType/DragNDrop'
import AddWordPreview from '@components/questionType/FillText'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import useMousePosition from '@utils/hookMouseMove'
import { runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { QUESTION_TYPES } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { loadMoreQuestion } from 'src/redux/slice/Course/MyCourse/Case-study/CaseStudy'
import { IExhibit } from 'src/type/exhibit'
import SappButton from '@components/base/button/SappButton'
import { CoursesAPI } from 'src/pages/api/courses'
import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import {
  IAnswerResult,
  ICaseStudyResult,
  ICratchPad,
  IQuestionResult,
  IRequirement,
  ITopic,
} from 'src/type/case-study'
import { IFile } from 'preview-activity/dist/shared/interfaces'
import clsx from 'clsx'

const CaseStudyResult = () => {
  const router = useRouter()
  const containerRef = useRef(null)
  const { control, setValue } = useForm()
  const { control: controlScratch } = useForm()
  const [allowHighLight, setAllowHighLight] = useState(false)
  const [allowUnHighLight, setAllowUnHighLight] = useState(false)

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

  /**
   * Declare form to handle exhibit
   */
  const {
    control: controlExhibits,
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
          <MatchingQuestion
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
          <DragNDropPreivew
            data={data}
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
            handleSaveHighLight={() => {}}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            solution={solution}
          />
        )
      case QUESTION_TYPES.ESSAY:
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
            response_option_custom={0}
            solution={solution}
            setOpenPdf={handleOpenScratchPad}
            isShowContent={
              requirementIndex === 0 || data.requirements.length === 0
            }
          />
        )
      default:
        return <div></div>
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

  /**
   * handle go to next Topic
   */
  const handleNextTopic = () => {
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

  const backToPart = () => {
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
      setResult(res.data)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const exhibits = useMemo(() => {
    return (
      exhibitData?.map((exhibit, index: number) => ({
        label: `Exhibit ${+index + 1}`,
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
      const isAddedBorder =
        (requirementIndex === 0 && index !== 0) ||
        (index !== 0 && question.qType !== QUESTION_TYPES.ESSAY) ||
        (question?.requirements?.length === 0 && index !== 0)
      return (
        <div
          key={question?.id + index}
          topic-key={question?.question_topic?.id}
          className={`mb-8 ${clsx({ 'border-t pt-8': isAddedBorder })}`}
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

  return (
    <SappLoadingGlobal loading={loading}>
      <FullScreenLayout title="Case Study">
        <div
          className="relative flex h-screen flex-col overflow-hidden bg-white"
          onMouseUp={() => {
            setStartResize(false)
            setCurrentLeftWidth(leftWidth)
          }}
        >
          <div className="h-full" ref={containerRef}>
            <div className="flex items-center justify-between bg-gray-3 px-6 py-2 ">
              <div className="w-1/3 truncate text-lg-xl font-medium">
                {topics?.case_study_name} - {topics?.name}
              </div>
              <SappButton title="Quit" onClick={() => backToPart()} />
            </div>
            {/* End Header */}
            <div
              className="flex h-[calc(100%-104px)] bg-gray-3"
              id={'preview-question'}
            >
              <div
                className={`h-full overflow-auto bg-white p-6`}
                style={{ width: `calc(50% - ${leftWidth}px)` }}
              >
                <div
                  className="min-w-[700px]"
                  id="hightlight_area_topic"
                  onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => {
                    const element = e.target as Node
                    if (
                      element instanceof HTMLElement &&
                      element.tagName.charAt(0) !== 'm' &&
                      (element.firstChild instanceof HTMLElement
                        ? element.firstChild.tagName !== 'math'
                        : true)
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
                  <div key={topics?.id} data-key={topics?.id} className="mb-4">
                    <EditorReader
                      className="editor-wrap"
                      text_editor_content={topics?.description}
                    />
                  </div>
                  {topics?.files &&
                    topics?.files?.length > 0 &&
                    topics?.files.map((e: IFile, index: number) => {
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
                    })}
                </div>
              </div>
              <div
                className="h-full w-[20px] cursor-ew-resize bg-gray-3"
                onMouseDown={() => {
                  setStartResize(true)
                  setCurrentMousePos(x || 0)
                }}
                onMouseUp={() => setStartResize(false)}
              ></div>
              <div
                className={` h-full overflow-auto bg-white py-6 `}
                style={{ width: `calc(50% + ${leftWidth}px)` }}
                onScroll={(e) => {
                  const { target } = e
                  if (
                    (target as HTMLDivElement).scrollTop +
                      (target as HTMLDivElement).offsetHeight >=
                    (target as HTMLDivElement).scrollHeight
                  ) {
                    dispatch(loadMoreQuestion(''))
                  }
                }}
              >
                <div className="min-w-[700px]">
                  <div
                    className="px-6"
                    id="hightlight_area"
                    onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => {
                      const element = e.target as Node
                      if (
                        element instanceof HTMLElement &&
                        element.tagName.charAt(0) !== 'm' &&
                        (element.firstChild instanceof HTMLElement
                          ? element.firstChild.tagName !== 'math'
                          : true)
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
                      width: '400px',
                      height: 'fit-content',
                      top: 'calc(25% - 150px)',
                      left: 'calc(25% - 200px)',
                    }}
                    key={e?.id}
                    onClick={() => setOnFocusingPad(e?.id ?? '')}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute left-0 top-0  h-full w-full border">
                      <div className="flex h-10 w-full items-center justify-between bg-gray-2 px-5">
                        <div>Calculator</div>
                        <button onClick={() => handleCloseScratchPad(e)}>
                          <CloseIcon />
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
                      width: '400px',
                      height: '300px',
                      top: 'calc(50% - 150px)',
                      left: 'calc(50% - 200px)',
                    }}
                    key={e?.id}
                    onClick={() => setOnFocusingPad(e?.id ?? '')}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute left-0 top-0  h-full w-full border">
                      <div className="flex h-10 w-full items-center justify-between bg-gray-2 px-5">
                        <div>Scratch Pad</div>
                        <button onClick={() => handleCloseScratchPad(e)}>
                          <CloseIcon />
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
                        ) => handleChangeScratchPad(event, e?.id)}
                        className="sapp-text-area h-[calc(100%-40px)] w-full p-5"
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
                  <MovableWindow
                    position={{
                      width: '600px',
                      height: '400px',
                      top: 'calc(75% - 250px)',
                      left: 'calc(0%)',
                    }}
                    key={e?.id}
                    onClick={() => setOnFocusingPad(e?.id ?? '')}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute left-0 top-0  h-full w-full border">
                      <div className="flex h-10 w-6-percent w-full items-center justify-between bg-white px-5">
                        <div className="truncate">
                          <span className="text-base font-semibold ">{`Exhibit ${
                            (i ?? 0) + 1
                          }: `}</span>
                          {exhibitsDes?.name}
                        </div>
                        <button onClick={() => handleCloseScratchPad(e)}>
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="h-[calc(100%-40px)] overflow-auto bg-white p-5">
                        <EditorReader
                          text_editor_content={exhibitsDes?.description}
                          className=" w-full"
                        />
                        {exhibitsDes &&
                          exhibitsDes?.files?.length > 0 &&
                          exhibitsDes?.files?.map((e: IFile, index: number) => {
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
                    className="-translate-x-1/2 -translate-y-1/2 transform 2xl:!h-[842px]"
                    position={{
                      width: '595px',
                      height: '650px',
                      top: 'calc(50%)',
                      left: 'calc(50%)',
                    }}
                    key={e?.id}
                    onClick={() => setOnFocusingPad(e?.id ?? '')}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute left-0 top-0  h-full w-full border">
                      <div className="flex h-10 w-full items-center justify-between bg-gray-2 px-5">
                        <div className="truncate text-sm font-normal">
                          {e?.fileName}
                        </div>
                        <button onClick={() => handleCloseScratchPad(e)}>
                          <CloseIcon />
                        </button>
                      </div>
                      <div
                        className="overflow-auto bg-white p-4"
                        style={{ height: 'calc(100% - 40px' }}
                      >
                        <PDFViewer file={e?.file ?? ''} />
                      </div>
                    </div>
                  </MovableWindow>
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
                    setAllowUnHighLight(!allowUnHighLight),
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
                            {`Exhibits (${exhibits?.length})`}
                          </span>
                        </div>
                      </div>
                    </div>
                    {showListExhibits && (
                      <div className="absolute bottom-full z-[1400] flex h-fit max-w-max justify-center bg-gray-3 p-4 shadow-questions-exhibits 3xl:w-full 3xl:max-w-none">
                        <HookFormCheckBoxGroup
                          control={controlExhibits}
                          name="exhibits"
                          options={exhibits}
                          multiple
                          lowerOptions={true}
                          widthOptions="w-full"
                          seprateLine={true}
                          maxWidthContent
                        />
                      </div>
                    )}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-x-2 px-3  ">
                {result?.previous_topic && (
                  <button
                    className="flex w-[150px] items-center justify-center gap-3 border border-gray-1 px-3 py-2 "
                    onClick={handlePeriousTopic}
                  >
                    <div className="text-medium-sm font-medium">Previous</div>
                  </button>
                )}
                <button
                  className="flex w-[150px] items-center justify-center gap-3 border border-gray-1 px-3 py-2 "
                  onClick={handleNextTopic}
                >
                  <div className="text-medium-sm font-medium">
                    {result?.next_topic ? 'Next' : 'Finish'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </FullScreenLayout>
    </SappLoadingGlobal>
  )
}

export default CaseStudyResult
