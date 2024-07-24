import {
  CalculatorIcon,
  CloseIcon,
  ExhibitsIcon,
  HighlightIcon,
  ScratchPadIcon,
  UnHighLightIcon,
} from '@assets/icons'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
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
import ModalUploadFile from '@components/uploadFile/ModalUploadFile/ModalUploadFile'
import useMousePosition from '@utils/hookMouseMove'
import { runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import UnSubmitAnswerModal from 'src/components/UnSubmitAnswerModal'
import { QUESTION_TYPES } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  clearFileEssay,
  getTopicsCaseStudy,
  loadMoreQuestion,
  saveFileEssay,
} from 'src/redux/slice/Course/MyCourse/Case-study/CaseStudy'
import { IExhibit } from 'src/type/exhibit'
import { CoursesAPI } from '../api/courses/index'
import { TestAPI } from '../api/test'
import QuitTestModal from '../courses/test/quit-test'
import ConFirmSubmit from '../test/conFirmSubmit'
import LimitQuizModal from '../test/limitQuizModal'

const CaseStudyDetail = ({ questions }: any) => {
  const checkType = (
    e: any,
    index: number,
    data: any,
    type: string,
    currentTabID: string,
    defaultValue: any,
    corrects?: any,
    highlighted?: any,
    solution?: any,
    done?: boolean,
    requirement?: any,
    question_content?: any,
    ref?: any,
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
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            // solution={solution}
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
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
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
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            corrects={corrects}
          />
        )
      case QUESTION_TYPES.MATCHING:
        return (
          <MatchingQuestion
            data={data}
            // action={getAnswerMatching}
            // ref={ref}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            done={done}
            extenalRef={(el: any) => (valueRef.current[index || 0] = el)}
          />
        )
      case QUESTION_TYPES.FILL_WORD:
        return (
          <AddWordPreview
            data={data}
            // action={getValueFillText}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            extenalRef={(el: any) => {
              valueRef.current[index || 0] = el
            }}
          />
        )
      case QUESTION_TYPES.DRAG_DROP:
        return (
          <DragNDropPreivew
            data={data}
            // action={getAnswerDragNDrop}
            // ref={ref}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            extenalRef={(el: any) => (valueRef.current[index || 0] = el)}
          />
        )
      case QUESTION_TYPES.SELECT_WORD:
        return (
          <SelectWord
            data={data}
            // action={getValueSelectText}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            extenalRef={(el: any) => (valueRef.current[index || 0] = el)}
          />
        )
      case QUESTION_TYPES.ESSAY:
        return (
          <EssayQuestionPreview
            data={requirement}
            question_content={question_content}
            index={undefined}
            question_data={data}
            control={control}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            allowUnHighLight={allowUnHighLight}
            forCaseStudy={true}
            name={`${index}_answer`}
            setValue={setValue}
            defaultValue={defaultValue}
            fullData={data}
            response_option_custom={0}
            openChooseFile={(e: any) =>
              setOpenUpload({ status: true, question_id: data.id })
            }
            handleClearFile={() =>
              dispatch(
                clearFileEssay({
                  question_id: data.id,
                  topic_id: router.query.id as string,
                }),
              )
            }
            setOpenPdf={handleOpenScratchPad}
            setUnsavedChanges={setUnsavedChanges}
          />
        )
      default:
        return <div></div>
    }
  }
  const router = useRouter()
  const valueRef = useRef<any>([])
  const containerRef = useRef<any>(null)
  const { control, handleSubmit, getValues, setValue } = useForm()
  const { control: controlScratch } = useForm()
  const [allowHighLight, setAllowHighLight] = useState(false)
  const [allowUnHighLight, setAllowUnHighLight] = useState(false)
  // handle show exhibit list
  const [showListExhibits, setShowListExhibits] = useState(false)
  const [exhibitData, setExhibitData] = useState<IExhibit[]>()
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [openSubmit, setOpenSubmit] = useState(false)
  const [openQuit, setOpenQuit] = useState(false)
  const dispatch = useAppDispatch()
  const { topics, listFullQuestions, listQuestions, loading } = useAppSelector(
    (state) => state.caseStudyTestReducer,
  )
  const [quizAttempId, setQuizAttempId] = useState('')
  const [classId, setClassId] = useState('')
  const [startTime, setStartTime] = useState(Date.now())
  const [openUpload, setOpenUpload] = useState<any>({})
  const [openPdf, setOpenPdf] = useState<{ status: boolean; url: string }>()
  const [breadCrumb, setBreadCrumb] = useState<any>()
  const [unsavedChanges, setUnsavedChanges] = useState(true)
  const [openLimit, setOpenLimit] = useState(false)
  const [startResize, setStartResize] = useState(false)
  const [currentMousePos, setCurrentMousePos] = useState(0)
  const [leftWidth, setLeftWidth] = useState(0)
  const [currentLeftWidth, setCurrentLeftWidth] = useState(0)
  const [openUnSubmitAnswer, setUnSubmitAnswer] = useState(false)
  const [unSubmitAnswerData, setUnSubmitAnswerData] = useState<number[]>([])

  /**
   * handl confirm before submitting
   */
  const checkUnSubmitAnswer = () => {
    const result: number[] = []
    getAllValue().map((item, index) => {
      if (typeof item.answer === 'string' && item?.answer === '') {
        result.push(index + 1)
        return
      }
      if (Array.isArray(item.answer)) {
        const emptyAnswer = item?.answer?.filter((el) => {
          if (el.hasOwnProperty('idAnswer') && !el?.idAnswer) {
            return el
          }
          if (el.hasOwnProperty('answer_id') && !el?.answer_id) {
            return el
          }
        })
        const emptyEl = item.answer.filter(
          (el: string) => typeof el === 'string' && !el,
        )
        if (emptyAnswer?.length || emptyEl.length) {
          result.push(index + 1)
        }
        return
      }
    })
    setUnSubmitAnswerData(result)
    if (result.length === 0) {
      setOpenSubmit(true)
    } else {
      setUnSubmitAnswer(true)
    }
    return result
  }

  const { x } = useMousePosition()
  useEffect(() => {
    if (startResize) {
      const temp = currentLeftWidth
      setLeftWidth(temp + (currentMousePos - (x || 0)))
    }
  }, [x, startResize])
  useEffect(() => {
    if (router.query.id) {
      dispatch(
        getTopicsCaseStudy({
          id: router.query.id,
          quiz_id: router.query.quiz_id,
        }),
      )
    }
  }, [router.query.id])
  async function createAttempts(
    quiz_id: string,
    id: string,
    class_user_id: string,
  ) {
    try {
      const res = await TestAPI.createTopicAttempt(
        quiz_id,
        id,
        class_user_id,
        router.query.caseStudyId,
      )
      if (res?.success === false) {
        setBreadCrumb(res?.data?.breadcumb)
        setClassId(res?.data?.class_id)
        setUnsavedChanges(false)
        setOpenLimit(true)
      } else {
        setBreadCrumb(res?.data?.breadcumb)
        setClassId(res?.data?.class_id)
        setQuizAttempId(res.data.id)
      }
    } catch (err) {}
  }
  useEffect(() => {
    if (router.query.quiz_id && router.query.id && router.query.class_user_id) {
      createAttempts(
        router.query.quiz_id as string,
        router.query.id as string,
        router.query.class_user_id as string,
      )
    }
  }, [router.query.id])

  /**
   * Declare form to handle exhibit
   */
  const {
    control: controlExhibits,
    getValues: getValuesExhibits,
    setValue: setValueExhibits,
    watch,
    reset,
  } = useForm()

  /**
   * Handle generate exhibit selections for exhibit button
   */
  const exhibits = useMemo(() => {
    let exhibitsOptions = []
    const exhibitTopic = topics?.exhibits?.map((exhibit: IExhibit) => exhibit)

    if (exhibitTopic?.length) {
      exhibitsOptions.push(...exhibitTopic)
    }
    if (topics?.questions && topics?.questions?.length > 0) {
      for (let question of topics?.questions) {
        if (question?.exhibits?.length) {
          exhibitsOptions.push(...question.exhibits)
        }
      }
    }

    setExhibitData(exhibitsOptions)

    return exhibitsOptions?.map((exhibit, index: number) => ({
      label: `Exhibit ${+index + 1}`,
      value: exhibit.id,
    }))
  }, [topics])

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
    router.replace(
      `/courses/${router?.query?.class_id}/section/${router?.query?.course_section_id}`,
    )
  }

  const getValueFillText = (index: number) => {
    let value = []
    if (valueRef?.current?.[index]) {
      const inputs = valueRef?.current?.[index]?.querySelectorAll(
        'input[stringHTML="true"]',
      ) as any
      for (let e of inputs) {
        value.push(e?.value)
      }
    } else {
      value.push('')
    }
    return value
  }
  const getValueSelectText = (index: number) => {
    let value = [] as any
    if (valueRef?.current?.[index]) {
      const inputs = valueRef?.current?.[index]?.querySelectorAll(
        'select.sapp-select--selectword-preview',
      ) as any

      for (let e of inputs) {
        value.push(e.value)
      }
    } else {
      value.push('')
    }
    return value
  }
  const getAnswerMatching = (index: number) => {
    let value = [] as any
    if (valueRef.current?.[index]) {
      const inputs = valueRef?.current?.[index].querySelectorAll(
        '.sapp-match-result',
      ) as any
      for (let e of inputs) {
        const childId = e.querySelector('.sapp-notched-container')
        value.push({ question_id: e?.id, answer_id: childId?.id || undefined })
      }
    } else {
      value.push({
        question_id: listFullQuestions?.[index]?.id,
        answer_id: '' || undefined,
      })
    }

    return value
  }
  const getAnswerDragNDrop = (index: number) => {
    let value = [] as any
    if (valueRef?.current?.[index]) {
      const inputs = valueRef?.current?.[index].querySelectorAll(
        '.sapp-input-dragNDrop',
      ) as any
      for (let e of inputs) {
        const idAnswer = e.querySelector('span')
        value.push({ id: e?.id, value: e?.innerText, idAnswer: idAnswer?.id })
      }
    } else {
      value.push({
        id: listFullQuestions?.[index]?.id,
        value: '',
        idAnswer: '',
      })
    }
    return value
  }
  const getAllValue = () => {
    let arrAnswer = []
    for (let i = 0; i < listQuestions.length; i++) {
      const question = Object.values(listQuestions[i])[0] as any
      if (
        question?.qType === QUESTION_TYPES.ONE_CHOICE ||
        question?.qType === QUESTION_TYPES.TRUE_FALSE ||
        question?.qType === QUESTION_TYPES.MULTIPLE_CHOICE
      ) {
        arrAnswer.push({
          qType: question?.qType,
          answer: getValues(`${i}_answer`),
          id: question?.id,
          answers: question?.answers,
        })
      } else if (question?.qType === QUESTION_TYPES.MATCHING) {
        arrAnswer.push({
          qType: question?.qType,
          answer: getAnswerMatching(i),
          id: question?.id,
          answers: question?.answers,
        })
      } else if (question?.qType === QUESTION_TYPES.DRAG_DROP) {
        arrAnswer.push({
          qType: question?.qType,
          answer: getAnswerDragNDrop(i),
          id: question?.id,
          answers: question?.answers,
        })
      } else if (question?.qType === QUESTION_TYPES.SELECT_WORD) {
        arrAnswer.push({
          qType: question?.qType,
          answer: getValueSelectText(i),
          id: question?.id,
          answers: question?.answers,
        })
      } else if (question?.qType === QUESTION_TYPES.FILL_WORD) {
        arrAnswer.push({
          qType: question?.qType,
          answer: getValueFillText(i),
          id: question?.id,
          answers: question?.answers,
        })
      } else if (question?.qType == QUESTION_TYPES.ESSAY) {
        arrAnswer.push({
          qType: question?.qType,
          answer: getValues(`${i}_answer`),
          id: question?.id,
          answers: question?.answers,
          response_option: question?.response_option,
          answer_file: question?.answer_file,
        })
      }
    }

    return arrAnswer
  }

  const handleSubmitQuestion = async () => {
    let allQuest = getAllValue()
    let quiz_position_mapping = []
    let answers = []
    let reformTabs: any[] = []
    for (let e of allQuest) {
      reformTabs.push({ ...e, done: true })
      if (e?.answer || e?.answer !== '') {
        if (
          e?.qType === QUESTION_TYPES.ONE_CHOICE ||
          e?.qType === QUESTION_TYPES.TRUE_FALSE
        ) {
          answers.push({
            question_id: e?.id,
            question_answer_id: e?.answer || '',
          })
        } else if (e?.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
          let answer = []
          if (e?.answer) {
            for (let el of e?.answer) {
              if (el) {
                answer.push({ answer_id: el })
              }
            }
          }
          answers.push({ question_id: e?.id, answer })
        } else if (e?.qType === QUESTION_TYPES.MATCHING) {
          answers.push({ question_id: e?.id, answer: e?.answer })
        } else if (e?.qType === QUESTION_TYPES.DRAG_DROP) {
          let answer = []
          for (let i in e?.answer) {
            if (e?.answer[i].idAnswer) {
              answer.push({
                answer_id: e?.answer[i].idAnswer,
                answer_position: +i + 1,
              })
            }
          }
          answers.push({ question_id: e?.id, answer })
        } else if (e?.qType === QUESTION_TYPES.SELECT_WORD) {
          let answer = []
          for (let i in e?.answer) {
            if (e?.answer[i] && e?.answer[i] !== '') {
              answer.push({
                answer_id: e?.answer[i],
                answer_position: +i + 1,
              })
            }
          }
          answers.push({ question_id: e?.id, answer })
        } else if (e?.qType === QUESTION_TYPES.FILL_WORD) {
          let answer = []
          for (let i in e?.answer) {
            if (e?.answer[i] && e?.answer[i] !== '') {
              answer.push({
                answer_text: e?.answer[i],
                answer_position: +i + 1,
              })
            }
          }
          answers.push({ question_id: e?.id, answer })
        }
      }
      if (e?.qType === QUESTION_TYPES.ESSAY) {
        if (
          (e?.answer !== undefined && e?.answer !== '') ||
          e?.answer_file?.file_key
        ) {
          if (!e?.response_option) {
            answers.push({
              question_id: e?.id,
              short_answer: e?.answer || '',
              response_option: e?.response_option ? e?.response_option : 'WORD',
              answer_file: e?.answer_file,
              active: 'SUBMITED',
            })
          } else {
            if (e?.response_option === 'SHEET') {
              if (e?.answer) {
                const data = JSON.parse(e?.answer)
                for (let el of data) {
                  if (el.celldata && el.celldata.length > 0) {
                    answers.push({
                      question_id: e?.id,
                      short_answer: e?.answer || '',
                      response_option: e?.response_option
                        ? e?.response_option
                        : 'WORD',
                      answer_file: e?.answer_file,
                      active: 'SUBMITED',
                    })
                    break
                  }
                }
                continue
              }
              continue
            } else {
              answers.push({
                question_id: e?.id,
                short_answer: e?.answer || '',
                response_option: e?.response_option
                  ? e?.response_option
                  : 'WORD',
                answer_file: e?.answer_file,
                active: 'SUBMITED',
              })
            }
          }
        } else {
          continue
        }
      }

      quiz_position_mapping.push({
        question_id: e?.id,
        answers: e?.answers,
      })
    }

    const total_attempt_time = Math.ceil((Date.now() - startTime) / 1000)
    if (quizAttempId) {
      try {
        await CoursesAPI.submitCaseStudy(quizAttempId as string, {
          answers: answers,
          quiz_position_mapping: quiz_position_mapping,
          total_attempt_time: total_attempt_time,
          topic_scratch_pad: scratchPadValues.value,
        })
        toast.success('Submitted successfully')
        router.replace(
          `/case-study/table-result/${quizAttempId}?class_user_id=${router.query.class_user_id}`,
        )
      } catch (err) {
        toast.error('submit failed')
      } finally {
        // setUnsavedChanges(false)
      }
    }
    return
  }
  const handleCloseScratchPad = (pad: any) => {
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
  const handleSaveFileEssay = (
    file: any,
    question_id: string,
    topic_id: string,
  ) => {
    dispatch(
      saveFileEssay({
        question_id: question_id,
        file: file,
        topic_id: topic_id,
      }),
    )
  }
  const checkCalExist = useMemo(() => {
    for (let i in openScratchPad) {
      if (openScratchPad[i].type === 'calculator') {
        return +i
      }
    }
    return -1
    // if (!arr.includes('calculator')) {
  }, [openScratchPad])
  const warningText =
    'You have unsaved changes - are you sure you wish to leave this page?'
  useEffect(() => {
    const handleWindowClose = (e: any) => {
      if (!unsavedChanges) return
      e.preventDefault()
      return (e.returnValue = warningText)
    }
    const handleBrowseAway = () => {
      if (!unsavedChanges) return
      if (window.confirm(warningText)) return
      router.events.emit('routeChangeError')
      throw 'routeChange aborted.'
    }
    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [unsavedChanges])
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
  const [scratchPadValues, setScratchPadValues] = useState<any>({})
  const handleChangeScratchPad = (e: any, id: any) => {
    const { value } = e.target
    setScratchPadValues((prevState: any) => ({
      ...prevState,
      value,
    }))
  }

  return (
    <SappLoadingGlobal loading={loading}>
      <FullScreenLayout title="Case Study">
        <div
          className="h-screen flex flex-col bg-white overflow-hidden relative"
          onMouseUp={() => {
            setStartResize(false)
            setCurrentLeftWidth(leftWidth)
          }}
        >
          {/* {startResize && (
        <div className="absolute w-screen h-screen z-[1350]"></div>
      )} */}
          {/* <div
        className={`absolute w-full bg-black h-[200px]`}
        style={{ top: 96 }}
      ></div> */}
          {/* Header */}
          <div className="h-full" ref={containerRef}>
            <div className="flex justify-between py-2 px-6 items-center bg-gray-3 ">
              <div className="text-lg-xl font-medium w-1/3 truncate">
                {topics?.case_study_name} - {topics?.name}
              </div>
              <ButtonCancelSubmit
                className={'flex gap-4 flex-row-reverse w-1/3'}
                // color={color}
                submit={{
                  title: 'Finish',
                  size: 'small',
                  loading: false,
                  disabled: false,
                  onClick: () => {
                    setOpenScratchPad([])
                    if (checkUnSubmitAnswer().length) {
                      setUnSubmitAnswer(true)
                    } else {
                      setOpenSubmit(true)
                    }
                    setUnsavedChanges(false)
                  },
                }}
                cancel={{
                  title: 'Quit',
                  size: 'small',
                  onClick: () => {
                    setOpenQuit(true)
                    setUnsavedChanges(false)
                  },
                  loading: false,
                  //   full: fullWidthBtn,
                }}
              ></ButtonCancelSubmit>
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
                    <EditorReader
                      className="editor-wrap"
                      text_editor_content={topics?.description}
                    />
                  </div>
                  <>
                    {topics?.files?.length > 0 &&
                      topics?.files.map((e: any, index: number) => {
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
                  </>
                </div>
              </div>
              <div
                className="w-[20px] h-full bg-gray-3 cursor-ew-resize"
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
                    {/* {topics.map((el: any) => { */}
                    {listQuestions?.map((e: any, index: number) => {
                      const question = Object.values(e)[0] as any
                      const topicId = Object.keys(e)[0] as any
                      return (
                        <div
                          key={question?.id + index}
                          topic-key={topicId}
                          className={`${
                            index === 0 ? 'mb-8' : 'pt-8 mb-8 border-t'
                          }`}
                        >
                          {/*<div className="h-[1px] w-full bg-gray-4 mt-8 mb-8"></div>*/}

                          {checkType(
                            question,
                            index,
                            question,
                            question?.qType,
                            question?.id,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            question?.requirements?.[0],
                            question?.question_content,
                            valueRef,
                          )}
                        </div>
                      )
                    })}
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
                      height: '300px',
                      top: 'calc(25% - 150px)',
                      left: 'calc(25% - 200px)',
                    }}
                    key={e?.id}
                    onClick={() => setOnFocusingPad(e?.id)}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute h-full w-full  top-0 left-0 border">
                      <div className="flex w-6-percent items-center bg-gray-2 w-full h-10 justify-between px-5">
                        <div>Calculator</div>
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
                    key={e?.id}
                    onClick={() => setOnFocusingPad(e?.id)}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute h-full w-full  top-0 left-0 border">
                      <div className="flex w-6-percent items-center bg-gray-2 w-full h-10 justify-between px-5">
                        <div>Scratch Pad</div>
                        {/* <CloseIcon */}
                        <button onClick={() => handleCloseScratchPad(e)}>
                          <CloseIcon />
                        </button>
                      </div>
                      {/* <div className='flex flex-'> */}
                      <HookFormTextArea
                        defaultValue={scratchPadValues?.value}
                        placeholder="Take a note..."
                        control={controlScratch}
                        name={e?.id}
                        onChange={(event) =>
                          handleChangeScratchPad(event, e?.id)
                        }
                        className="w-full h-[calc(100%-40px)] sapp-text-area p-5"
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
                    onClick={() => setOnFocusingPad(e?.id)}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute h-full w-full  top-0 left-0 border">
                      <div className="flex w-6-percent items-center bg-white w-full h-10 justify-between px-5">
                        <div className="truncate">
                          <span className="font-semibold text-base ">{`Exhibit ${
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
                                className="cursor-pointer text-state-info hover:underline"
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
                    key={e?.id}
                    onClick={() => setOnFocusingPad(e?.id)}
                    zIndex={
                      onFocusingPad === e?.id
                        ? openScratchPad?.length + 500
                        : index + 500
                    }
                  >
                    <div className="absolute h-full w-full  top-0 left-0 border">
                      <div className="flex items-center bg-gray-2 w-full h-10 justify-between px-5">
                        <div className="text-sm font-normal truncate">
                          {e?.fileName}
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
                        <PDFViewer file={e?.file} />
                      </div>
                    </div>
                  </MovableWindow>
                )
              }
            })}
            <div className=" bg-gray-3 flex items-center justify-between shadow-question-footer h-[48px] relative">
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
                  }}
                >
                  <div className="flex items-center gap-3 px-4 3xl:ps-6 3xl:pe-6 border-l ">
                    <HighlightIcon />
                    <div className="hidden font-normal text-sm 3xl:inline-block">
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
                  <div className="flex items-center gap-3 px-4 3xl:ps-6 3xl:pe-6 border-l ">
                    <UnHighLightIcon />
                    <div className="hidden font-normal text-sm 3xl:inline-block">
                      Unhighlight
                    </div>
                  </div>
                </button>
                <button
                  className="h-full"
                  onClick={() => handleOpenScratchPad('scratch_pad')}
                >
                  <div className="flex items-center gap-3 px-4 3xl:ps-6 3xl:pe-6 border-l">
                    <ScratchPadIcon />
                    <div className="hidden font-normal text-sm 3xl:inline-block">
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
                  <div className="flex items-center gap-3 px-4 3xl:px-6 border-l">
                    <CalculatorIcon />
                    <div className="hidden font-normal text-sm 3xl:inline-block">
                      Calculator
                    </div>
                  </div>
                </button>
                {exhibits.length > 0 && (
                  <button className="h-full relative">
                    <div
                      className="flex items-center gap-3 px-4 3xl:px-6 border-l"
                      onClick={() => {
                        setShowListExhibits(!showListExhibits)
                      }}
                    >
                      <ExhibitsIcon />
                      <div className="font-normal flex text-sm items-center gap-3">
                        <div>
                          <span className="hidden  lg:inline-block 3xl:me-1">
                            {`Exhibits (${exhibits?.length})`}
                          </span>
                        </div>
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
                          widthOptions="w-full"
                          seprateLine={true}
                          maxWidthContent
                        />
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <ConFirmSubmit
            open={openSubmit}
            setOpen={setOpenSubmit}
            handleSubmit={() => {
              handleSubmitQuestion()
              setOpenSubmit(false)
            }}
            handleCancel={() => setUnsavedChanges(true)}
          />
          <UnSubmitAnswerModal
            open={openUnSubmitAnswer}
            setOpen={setUnSubmitAnswer}
            data={unSubmitAnswerData}
            handleSubmit={() => {
              handleSubmitQuestion()
              setUnSubmitAnswer(false)
            }}
            handleCancel={() => setUnSubmitAnswer(false)}
          />
          <QuitTestModal
            open={openQuit}
            setOpen={setOpenQuit}
            handleQuit={() => backToPart()}
            handleCancel={() => setUnsavedChanges(true)}
          />
          <LimitQuizModal
            open={openLimit}
            setOpen={setOpenLimit}
            handleQuit={() => backToPart()}
          />
          <ModalUploadFile
            open={openUpload.status}
            isMultiple={false}
            handleClose={() => {
              setOpenUpload({ status: false, question_id: undefined })
            }}
            fileType={'ESSAY'}
            location={`question-answer/${openUpload?.question_id}`}
            setSelectedFile={(e: any) =>
              handleSaveFileEssay(
                e?.[0],
                openUpload?.question_id,
                router.query.id as string,
              )
            }
          />
          {/* <PopupViewPdf
        open={openPdf?.status || false}
        setOpen={setOpenPdf}
        url={openPdf?.url || ''}
      /> */}
        </div>
      </FullScreenLayout>
    </SappLoadingGlobal>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default CaseStudyDetail
