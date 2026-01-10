/* eslint-disable prefer-const */
"use client"
import {
  CalculatorIcon,
  CloseIcon,
  ExhibitsIcon,
  HighlightIcon,
  ScratchPadIcon,
  UnHighLightIcon,
} from '@lms/assets'
import {
  clearFileEssay,
  getTopicsCaseStudy,
  loadMoreQuestion,
  saveFileEssay,
  showPopupCompletedCourse,
  useAppDispatch,
  useAppSelector,
  UserType,
} from '@lms/contexts'
import {
  ESSAY_TYPE,
  EXHIBIT_TEXT_REPLACE,
  IExhibit,
  IRequirement,
  PROGRAM,
  QUESTION_TYPES,
} from '@lms/core'
import { CalculatorModal, ConFirmSubmit } from '@lms/feature-courses'
import { QuitTestModal } from '@lms/feature-test'
import UnSubmitAnswerModal from '@lms/feature-test/src/components/UnSubmitAnswerModal'
import { useMousePosition, useSmartModalSize } from '@lms/hooks'
import {
  EditorReader,
  FileViewer,
  FullScreenLayout,
  HookFormTextArea,
  ModalResizeable,
  MovableWindow,
  SappButton,
  SappLoadingGlobal,
} from '@lms/ui'
import EssayQuestionPreview from '@lms/ui/components/questionType/ConstructedQuestion'
import DragNDropPreivew from '@lms/ui/components/questionType/DragNDrop'
import AddWordPreview from '@lms/ui/components/questionType/FillText'
import MatchingQuestion from '@lms/ui/components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@lms/ui/components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@lms/ui/components/questionType/OneChoiceQuestion'
import SelectWord from '@lms/ui/components/questionType/SelectQuestion'
import ModalUploadFile from '@lms/ui/components/uploadFile/ModalUploadFile/ModalUploadFile'
import { runHighlight } from '@lms/utils'
import { TestServiceAPI } from 'src/api/test-api'
import clsx from 'clsx'
import { uniqueId } from 'lodash'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'
import LimitQuizModal from 'src/app/test/limitQuizModal'

const CaseStudyDetailTeacher = () => {
  const checkType = (
    e: any,
    index: number | string,
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
            extenalRef={(el: HTMLDivElement | null) =>
              (valueRef.current[index || 0] = el)
            }
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
            onChange={(
              value: Array<{
                answer_id: string
                answer_position: number
              }>,
            ) => setValue?.(`${index}_answer`, value)}
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
            fullData={{ data }}
            response_option_custom={0}
            openChooseFile={(e: any) =>
              setOpenUpload({
                status: true,
                question_id: data.id,
                requirementId: data?.requirements?.[0]?.id,
              })
            }
            handleClearFile={() =>
              dispatch(
                clearFileEssay({
                  question_id: data.id,
                  topic_id: id as string,
                  requirement_id: data?.requirements?.[0]?.id,
                }),
              )
            }
            setOpenPdf={handleOpenScratchPad}
            setUnsavedChanges={setUnsavedChanges}
            isShowContent={
              requirement?.requirementIndex === 0 ||
              data.requirements.length === 0
            }
          />
        )
      default:
        return <div></div>
    }
  }
  const router = useRouter()
  const searchParam = useSearchParams()
  const params = useParams();
  const { id } = params
  const query = Object.fromEntries(searchParam.entries())
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
  const [exhibitText, setExhibitText] = useState<string>('')

  const { width: widthFileViewer, height: heightFileViewer } =
    useSmartModalSize()
  /**
   * LIST DANH SÁCH CÁC CÂU CHƯA LÀM
   */
  const checkUnSubmitAnswer = () => {
    const result: number[] = []
    const questionList = listQuestions.map(
      (item: any) => Object.values(item)[0],
    )
    getAllValue().map((item, index) => {
      //** bỏ qua nếu là câu tự luận nếu có file */
      if (item?.answer_file?.file_key) return
      //** Ghi nhận chưa trả lời nếu trường answer rỗng */
      if (typeof item.answer === 'string' && item?.answer === '') {
        const questionIndex = questionList.findIndex(
          (q: { id: string }) => q.id === item.id,
        )
        questionIndex !== -1 &&
          !result.includes(questionIndex + 1) &&
          result.push(questionIndex + 1)
        return
      }
      //** check file sheet nếu có cellData thì nó đã trả lời  */
      //** Lúc nào cấu excel cũng trả về 1 array sheet nên kiểm tra từng cell data 1  */
      if (
        item?.response_option === ESSAY_TYPE.SHEET &&
        item.qType === QUESTION_TYPES.ESSAY
      ) {
        let hasAnswer = false
        const data = JSON.parse(item?.answer)
        for (const el of data) {
          if (el.celldata && el.celldata.length > 0) {
            hasAnswer = true
            break
          }
        }
        //** bỏ qua nếu là câu tự luận nếu có file */
        if (!hasAnswer) {
          const questionIndex = questionList.findIndex(
            (q: { id: string }) => q.id === item.id,
          )
          questionIndex !== -1 &&
            !result.includes(questionIndex + 1) &&
            result.push(questionIndex + 1)
          return
        }
      }
      //** Ghi nhận chưa trả lời nếu trường answer rỗng khi nó có nhiều đáp án */
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
          const questionIndex = questionList.findIndex(
            (q: { id: string }) => q.id === item.id,
          )
          questionIndex !== -1 &&
            !result.includes(questionIndex + 1) &&
            result.push(questionIndex + 1)
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
    if (id) {
      dispatch(
        getTopicsCaseStudy({
          api: TestServiceAPI,
          id: id,
          quiz_id: query.quiz_id,
        }),
      )
    }
  }, [id])
  async function createAttempts(
    quiz_id: string,
    id: string,
    class_user_id: string,
  ) {
    try {
      const res = await TestServiceAPI.createTopicAttempt(
        quiz_id,
        id,
        class_user_id,
        query.caseStudyId,
      )
      setExhibitText(
        res.data.program === PROGRAM.CMA
          ? EXHIBIT_TEXT_REPLACE.EXHIBIT_REPLACE
          : EXHIBIT_TEXT_REPLACE.EXHIBIT,
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
    if (query.quiz_id && id && query.class_user_id) {
      createAttempts(
        query.quiz_id as string,
        id as string,
        query.class_user_id as string,
      )
    }
  }, [id])

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
    const exhibitsOptions = []
    const exhibitTopic = topics?.exhibits?.map((exhibit: IExhibit) => exhibit)

    if (exhibitTopic?.length) {
      exhibitsOptions.push(...exhibitTopic)
    }
    if (topics?.questions && topics?.questions?.length > 0) {
      for (const question of topics?.questions) {
        if (question?.exhibits?.length) {
          exhibitsOptions.push(...question.exhibits)
        }
      }
    }

    setExhibitData(exhibitsOptions)

    return exhibitsOptions?.map((exhibit, index: number) => ({
      label: `${exhibitText} ${+index + 1}`,
      value: exhibit.id,
    }))
  }, [topics, exhibitText])

  /**
   * Check value of exhibit to open ScratchPad
   */
  useEffect(() => {
    if (watch('exhibits')) {
      setOpenScratchPad((prev) => {
        const arr = [...prev]
        const newArr = arr.filter((e) => {
          return e.type !== 'exhibits'
        })
        for (const e of watch('exhibits')) {
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
    router.replace(
      `${PageLink.TEACHER_MY_COURSE}/${query?.class_id}/section/${query?.course_section_id}`,
    )
  }

  const getValueFillText = (index: number) => {
    const value = []
    if (valueRef?.current?.[index]) {
      const inputs = valueRef?.current?.[index]?.querySelectorAll(
        'input[stringHTML="true"]',
      ) as any
      for (const e of inputs) {
        value.push(e?.value)
      }
    } else {
      value.push('')
    }
    return value
  }
  const getValueSelectText = (index: number) => {
    const value = [] as any
    if (valueRef?.current?.[index]) {
      const inputs = document.querySelectorAll(
        'div.sapp-select--question',
      ) as any

      for (const e of inputs) {
        value.push(e?.dataset.value)
      }
    } else {
      value.push('')
    }
    return value
  }
  const getAnswerMatching = (index: number) => {
    const value = [] as any
    if (valueRef.current?.[index]) {
      const inputs = valueRef?.current?.[index].querySelectorAll(
        '.sapp-match-result',
      ) as any
      for (const e of inputs) {
        const childId = e.querySelector('.sapp-notched-container')
        value.push({ question_id: e?.id, answer_id: childId?.id || undefined })
      }
    } else {
      value.push({
        question_id: listFullQuestions?.[index]?.id,
        answer_id: '',
      })
    }

    return value
  }
  const getAnswerDragNDrop = (index: number) => {
    const value = [] as any
    if (valueRef?.current?.[index]) {
      const inputs = valueRef?.current?.[index].querySelectorAll(
        '.sapp-input-dragNDrop',
      ) as any
      for (const e of inputs) {
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
    const arrAnswer = []
    for (let i = 0; i < questionData.length; i++) {
      const question = questionData?.[i]
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
          answer: getValues(`${i}_answer`),
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
          requirement_id: question?.requirements?.[0]?.id,
          answers: question?.answers,
          response_option: question?.response_option,
          answer_file:
            question?.requirements?.[0]?.answer_file ?? question?.answer_file,
        })
      }
    }

    return arrAnswer
  }

  const handleSubmitQuestion = async () => {
    const allQuest = getAllValue()
    const quiz_position_mapping = []
    const answers = []
    const reformTabs: any[] = []
    for (const e of allQuest) {
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
          const answer = []
          if (e?.answer) {
            for (const el of e?.answer) {
              if (el) {
                answer.push({ answer_id: el })
              }
            }
          }
          answers.push({ question_id: e?.id, answer })
        } else if (e?.qType === QUESTION_TYPES.MATCHING) {
          answers.push({ question_id: e?.id, answer: e?.answer })
        } else if (e?.qType === QUESTION_TYPES.DRAG_DROP) {
          const answer = []
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
          answers.push({ question_id: e?.id, answer: e?.answer || [] })
        } else if (e?.qType === QUESTION_TYPES.FILL_WORD) {
          const answer = []
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
            //** Kiểm tra đáp án cho câu không có response_option*/
            answers.push({
              question_id: e?.id,
              short_answer: e?.answer || '',
              response_option: e?.response_option ? e?.response_option : 'WORD',
              answer_file: e?.answer_file,
              active: 'SUBMITED',
            })
          } else {
            if (e?.response_option === 'SHEET') {
              //** Kiểm tra đáp án cho câu excel  */
              if (e?.answer) {
                if (e?.answer_file?.file_key) {
                  //** Nếu excel có file thì ghi nhận luôn  */
                  answers.push({
                    question_id: e?.id,
                    requirement_id: e?.requirement_id,
                    short_answer: e?.answer || '',
                    response_option: e?.response_option
                      ? e?.response_option
                      : 'WORD',
                    answer_file: e?.answer_file,
                    active: 'SUBMITED',
                  })
                } else {
                  const data = JSON.parse(e?.answer)
                  //** check qua từng cell của excel để xem có đáp án không  */
                  for (const el of data) {
                    if (el.celldata && el.celldata.length > 0) {
                      answers.push({
                        question_id: e?.id,
                        requirement_id: e?.requirement_id,
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
                }
                continue
              }
              continue
            } else {
              //** Lấy câu trả lời word nếu đã trả lời và có response_option*/
              answers.push({
                question_id: e?.id,
                short_answer: e?.answer || '',
                requirement_id: e?.requirement_id,
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
        const res = await TestServiceAPI.submitCaseStudy(
          quizAttempId as string,
          {
            answers: answers,
            quiz_position_mapping: quiz_position_mapping,
            total_attempt_time: total_attempt_time,
            topic_scratch_pad: scratchPadValues.value,
          },
        )
        toast.success('Submission successful')
        const isCompletedCourse = res?.data?.progress
        if (!!isCompletedCourse?.is_completed) {
          setTimeout(() => {
            dispatch(showPopupCompletedCourse(isCompletedCourse?.content || ''))
          }, 2000)
        }

        router.replace(
          `${PageLink.TEACHER_CASE_STUDY}/result/${quizAttempId}?class_user_id=${query.class_user_id}&class_id=${query.class_id}&course_section_id=${query.course_section_id}`,
        )
      } catch (err) {
        toast.error('Submission failed. Please try again.')
      } finally {
        // setUnsavedChanges(false)
      }
    }
    return
  }
  const handleCloseScratchPad = (pad: any) => {
    setOpenScratchPad((prev) => {
      const arr = [...prev]
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
      const arr = [...prev]
      if (type === 'scratch_pad') {
        arr.push({ id: uniqueId('scratchPad'), type: type })
      } else if (type === 'calculator') {
        for (const e of arr) {
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
    requirement_id: string,
  ) => {
    dispatch(
      saveFileEssay({
        question_id: question_id,
        file: file,
        topic_id: topic_id,
        requirement_id: requirement_id,
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
    // TODO: next14
    // const handleBrowseAway = () => {
    //   if (!unsavedChanges) return
    //   if (window.confirm(warningText)) return
    //   router.events.emit('routeChangeError')
    //   throw 'routeChange aborted.'
    // }
    window.addEventListener('beforeunload', handleWindowClose)
    // router.events.on('routeChangeStart', handleBrowseAway)
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      // router.events.off('routeChangeStart', handleBrowseAway)
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

  const questionData = useMemo(() => {
    const data: any[] = []
    listQuestions.map((item: any) => {
      const question = Object.values(item)[0] as any
      const topicId = Object.keys(item)[0] as string
      if (
        question.qType === QUESTION_TYPES.ESSAY &&
        question?.requirements?.length
      ) {
        question.requirements.map((req: IRequirement, index: number) => {
          data.push({
            ...question,
            requirements: [{ ...req, requirementIndex: index }],
            topic_id: topicId,
          })
        })
      } else {
        data.push({ ...question, topic_id: topicId })
      }
    })
    return data
  }, [listQuestions])

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
          {/* {startResize && (
        <div className="absolute w-screen h-screen z-[1350]"></div>
      )} */}
          {/* <div
        className={`absolute w-full bg-black h-[200px]`}
        style={{ top: 96 }}
      ></div> */}
          {/* Header */}
          <div className="h-full" ref={containerRef}>
            <div className="flex items-center justify-between bg-gray-3 px-6 py-2">
              <div className="w-1/3 truncate text-lg-xl font-medium">
                {topics?.case_study_name} - {topics?.name}
              </div>
              <SappButton
                title="Quit"
                onClick={() => {
                  setOpenQuit(true)
                  setUnsavedChanges(false)
                }}
              />
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
                    <EditorReader text_editor_content={topics?.description} />
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
                className="h-full w-[20px] cursor-ew-resize bg-gray-3"
                onMouseDown={() => {
                  setStartResize(true)
                  setCurrentMousePos(x || 0)
                }}
                onMouseUp={() => setStartResize(false)}
              ></div>
              <div
                className={`h-full overflow-auto bg-white py-6`}
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
                    {questionData?.map((question: any, index: number) => {
                      const isAddedBorder =
                        (index !== 0 &&
                          question.qType !== QUESTION_TYPES.ESSAY) ||
                        (question.qType === QUESTION_TYPES.ESSAY &&
                          question?.requirements?.[0]?.requirementIndex === 0 &&
                          index !== 0) ||
                        (question.qType === QUESTION_TYPES.ESSAY &&
                          question?.requirements?.length === 0 &&
                          index !== 0)

                      return (
                        <div
                          key={question?.id + index}
                          topic-key={question.topic_id}
                          className={`mb-8 ${clsx({
                            'border-t pt-8': isAddedBorder,
                          })}`}
                        >
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
                  <CalculatorModal
                    key={e.id}
                    onClick={() => setOnFocusingPad(e?.id)}
                    onClose={() => handleCloseScratchPad(e)}
                  />
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
                    <div className="absolute left-0 top-0 h-full w-full border">
                      <div className="flex h-10 w-full items-center justify-between bg-gray-2 px-5">
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
                  <ModalResizeable
                    key={e.id}
                    handleCloseScratchPad={() => handleCloseScratchPad(e)}
                    position="center left"
                    header={({ requestClose }) => (
                      <div className="relative">
                        <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between bg-white px-5">
                          <div className="truncate">
                            <span className="text-base font-semibold">{`${exhibitText} ${
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
                      <EditorReader
                        text_editor_content={exhibitsDes?.description}
                        className="w-full"
                      />
                      {exhibitsDes &&
                        exhibitsDes?.files?.length > 0 &&
                        exhibitsDes?.files?.map((e: any, index: number) => {
                          return (
                            <div key={index} className="overflow-auto bg-white">
                              <FileViewer
                                fileName={e?.resource?.name}
                                fileUrl={e?.resource?.url}
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
                    key={e.id}
                    handleCloseScratchPad={() => handleCloseScratchPad(e)}
                    position="center"
                  >
                    <div
                      className="overflow-auto bg-white p-4"
                      style={{ height: 'calc(100% - 40px' }}
                    >
                      <FileViewer fileName={e?.fileName} fileUrl={e?.file} />
                    </div>
                  </ModalResizeable>
                )
              }
            })}
            <div className="relative flex h-[48px] items-center justify-between bg-gray-3 shadow-question-footer">
              <div className="flex h-full items-center">
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
                  <div className="flex items-center gap-3 border-l px-4 3xl:pe-6 3xl:ps-6">
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
                  <div className="flex items-center gap-3 border-l px-4 3xl:pe-6 3xl:ps-6">
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
                          <span className="hidden lg:inline-block 3xl:me-1">
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
              </div>
              <div>
                <SappButton
                  className={`mr-2 h-full bg-primary py-3`}
                  title="View Answer"
                  onClick={() => {
                    setOpenScratchPad([])
                    if (checkUnSubmitAnswer().length) {
                      setUnSubmitAnswer(true)
                    } else {
                      setOpenSubmit(true)
                    }
                    setUnsavedChanges(false)
                  }}
                />
              </div>
            </div>
          </div>
          <ConFirmSubmit
            open={openSubmit}
            setOpen={setOpenSubmit}
            message="Do you want to confirm all the answers and view the total report?"
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
            content="If you quit at this time, the test results will not be saved."
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
              setOpenUpload({
                status: false,
                question_id: undefined,
                requirementId: undefined,
              })
            }}
            fileType={'ESSAY'}
            location={`question-answer/${openUpload?.question_id}`}
            setSelectedFile={(e: any) =>
              handleSaveFileEssay(
                e?.[0],
                openUpload?.question_id,
                id as string,
                openUpload.requirementId,
              )
            }
          />
        </div>
      </FullScreenLayout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.TEACHER])(CaseStudyDetailTeacher)
