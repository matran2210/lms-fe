/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  confirmQuestion,
  courseActivityQuizReducer,
  fetchQuestionById,
  removeQuizFinished,
  saveAnswer,
  selectQuestions,
  submitQuiz,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz' // Import confirmQuestion from quizSlice

import {
  CircleArrowLeftIcon,
  CircleArrowRightIcon,
  ConfirmIcon,
  MaximumContentIcon,
  MinimumContentIcon,
} from '@assets/icons'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import SappButton from '@components/base/button/SappButton'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { IFocusQuiz } from '@pages/courses/[id]/activity/[activityId]'
import { isValidatedAnswer } from '@utils/answer'
import { trackGAEvent } from '@utils/google-analytics'
import { Tooltip } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { isNull, isUndefined } from 'lodash'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  ANIMATION,
  FINISHED_TEST_TITLE,
  GRADE_STATUS,
  GRADING_METHOD,
  PageLink,
  QUESTION_TYPES,
  RESPONSE_OPTION,
  SOCIAL_LINK,
} from 'src/constants'
import ConFirmSubmit from 'src/pages/test/conFirmSubmit'
import { showPopupCompletedCourse } from 'src/redux/slice/Popup/Result-test'
import { IQuizSetting } from 'src/type'
import {
  IQuestionResult,
  IQuestionResultResponse,
} from 'src/type/course/my-course/Activity'
import { IQuestion, IRequirment } from 'src/type/course/Question'
import { CoursesAPI } from '../../../../pages/api/courses/index'
import ModalExplanationPackage from '../ModalExplanationPackage'
import ModalResults from '../ModalResults'
import QuizComponent, { QuizComponentRef } from './QuizComponent'
import LoadingQuizDocument from './LoadingQuizDocument'
import { GradingPreference } from '@utils/constants'
import ButtonTextV2 from '@components/base/button/ButtonTextV2'
import ResetToAnswerTemplateModal from '@components/test/ResetToAnswerTemplateModal'
import ShowAnswerTemplate from '@components/test/ShowAnswerTemplate'

type Props = {
  questions: IQuestion[]
  activityId: string
  tabId: string
  quizId: string
  grading_preference: 'AFTER_EACH_QUESTION' | 'AFTER_ALL_QUESTIONS'
  document_id: string
  is_graded?: boolean
  setOpenFile?: any
  class_user_id?: string
  quizSetting?: IQuizSetting
  gradeStatus?: string
  quizName?: string
  reload: () => void
  grading_method?: string
  refreshTab: () => void
  exhibitText: string
  attemptId?: string
  isTeacher?: boolean
  focusOnlyQuiz: IFocusQuiz
  setFocusOnlyQuiz: React.Dispatch<React.SetStateAction<IFocusQuiz>>
  // Optional attempt limitation info
  is_limited?: boolean
  limit_count?: number
  number_of_attempts?: number
  isQuizFinished?: boolean
}

const QuizDocument = ({
  questions,
  activityId,
  tabId,
  quizId,
  grading_preference,
  document_id,
  is_graded,
  setOpenFile,
  class_user_id,
  quizSetting,
  gradeStatus,
  quizName,
  grading_method,
  refreshTab,
  exhibitText,
  attemptId,
  isTeacher,
  focusOnlyQuiz,
  setFocusOnlyQuiz,
  is_limited,
  limit_count,
  number_of_attempts,
  isQuizFinished = false,
}: Props): JSX.Element => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityQuizReducer)
  const router = useRouter()

  const isAFTERAllQUESTION = grading_preference !== 'AFTER_EACH_QUESTION'
  const isAFTEREACHQUESTION = grading_preference === 'AFTER_EACH_QUESTION'
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const questionRef = useRef<QuizComponentRef>(null)

  const questionsList = selector[activityId]?.[tabId]?.[quizId]?.questions || []

  const activeQuestion = questionsList[activeQuestionIndex]
  const isLastQuestion = activeQuestionIndex === questions.length - 1
  const isQuestionConfirmed = activeQuestion?.confirmed

  const [runHandleFinishQuiz, setRunHandleFinishQuiz] = useState<number>(1)

  const [loading, setLoading] = useState<boolean>(false)
  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [resultId, setResultId] = useState<string>(attemptId || '')
  const [openGradedReport, setOpenGradedReport] = useState<boolean>(false)
  const [startWorkTime, setStartWorkTime] = useState(Date.now())

  const [quizComponentKey, setQuizComponentKey] = useState<number>(1)
  const [openFinishQuiz, setOpenFinishQuiz] = useState<boolean>(false)

  const {
    control: controlAnswer,
    setValue,
    reset,
    getValues,
    watch,
    resetField,
  } = useForm({})

  // Compute whether user still has attempts left
  const hasAttemptsLeft = (() => {
    // If backend already disallows attempts, block retake
    if (quizSetting && quizSetting.allow_attempt === false) return false
    // Use explicit limit rules if provided
    if (typeof is_limited === 'boolean') {
      if (!is_limited) return true
      const limit =
        typeof limit_count === 'number' ? limit_count : Number.POSITIVE_INFINITY
      const used =
        typeof number_of_attempts === 'number' ? number_of_attempts : 0
      return used < limit
    }
    // Fallback: allow retake when limits unknown
    return true
  })()

  useEffect(() => {
    ;(async () => {
      if (questions?.[0]?.id) {
        setStartWorkTime(Date.now())

        // Load corrects from sessionStorage if available (only for AFTER_ALL_QUESTIONS)
        if (grading_preference === 'AFTER_ALL_QUESTIONS') {
          // If finished, we'll restore answers and fetch corrects lazily per question on navigation
          setIsFinishQuiz(isQuizFinished)
        }

        // Load the first question when the component mounts
        try {
          await dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: questions?.[0]?.id || '',
              ...(isAFTERAllQUESTION && isFinishQuiz && { attemptId }),
            }),
          )

          // Restore corrects if available
          // No restore here; corrects fetched lazily per-question when finished
        } catch (error) {}
      }
    })()
  }, [questions, grading_preference, activityId, tabId, quizId, dispatch])

  useEffect(() => {
    if (runHandleFinishQuiz > 1) {
      setOpenFinishQuiz(true)
    }
  }, [runHandleFinishQuiz])

  // Corrects are not persisted; they are fetched lazily per question when finished

  // Lazy fetch corrects per question after finished
  useEffect(() => {
    const fetchAndConfirmQuestion = async () => {
      if (grading_preference !== 'AFTER_ALL_QUESTIONS') return
      if (!activeQuestion?.id) return

      if (!isFinishQuiz) return
      // Only call API if we haven't got corrects yet for this question
      const hasCorrects = !!activeQuestion.corrects
      if (!hasCorrects) {
        dispatch(
          confirmQuestion({
            activityId,
            tabId,
            quizId,
            questionId: activeQuestion.id,
            ...(isAFTERAllQUESTION && isFinishQuiz && { attemptId }),
            myAnswers: [],
            time_spent: 0,
          }) as any,
        )
      }
    }
    fetchAndConfirmQuestion()
  }, [
    grading_preference,
    activeQuestion?.id,
    // activeQuestion?.corrects,
    activityId,
    tabId,
    quizId,
    dispatch,
  ])

  const calculateWorkTime = () => {
    return activeQuestion?.confirmed
      ? (activeQuestion?.time_spent ?? 0)
      : activeQuestion?.time_spent !== 0
        ? Math.ceil((Date.now() - startWorkTime) / 1000) +
          activeQuestion?.time_spent
        : Math.ceil((Date.now() - startWorkTime) / 1000)
  }

  const handleNextQuestion = async () => {
    const name = `${activeQuestion?.id}_${activeQuestion?.requirements?.length ? activeQuestion?.requirements?.[0]?.id : document_id}_essay`
    const defaultValue =
      questionRef.current?.getValues?.(name) ||
      activeQuestion?.myAnswers?.[0]?.short_answer

    if (activeQuestion?.response_option === RESPONSE_OPTION.WORD) {
      await questionRef.current?.onResetWord(
        name,
        activeQuestion?.response_option,
        defaultValue,
      )
    }
    if (activeQuestionIndex < questions?.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1)
      handleSaveAnswer()
      // Load the next question if it hasn't been loaded yet
      const nextQuestionId = questions[activeQuestionIndex + 1]?.id
      if (nextQuestionId) {
        try {
          const nextQuestion = await dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: nextQuestionId || '',
              ...(isAFTERAllQUESTION && isFinishQuiz && { attemptId }),
            }),
          ).unwrap()
          setStartWorkTime(Date.now())
          const nextQuestionContent = nextQuestion?.question
          const name = `${nextQuestionContent?.id}_${nextQuestionContent?.requirements?.length ? nextQuestionContent?.requirements?.[0]?.id : document_id}_essay`
          const defaultValue =
            questionRef.current?.getValues(name) ||
            nextQuestionContent?.myAnswers?.[0]?.short_answer ||
            nextQuestionContent?.answer_template ||
            nextQuestionContent?.requirements?.[0]?.answer_template

          if (nextQuestionContent?.response_option === RESPONSE_OPTION.SHEET) {
            await questionRef.current?.onResetSheet(
              nextQuestionContent?.response_option,
            )
          } else {
            await questionRef.current?.onResetWord(
              name,
              nextQuestionContent?.response_option as RESPONSE_OPTION,
              defaultValue,
            )
          }
        } catch (error) {}
      }
      // // questionRef?.current?.reset()
    }
  }

  /**
   * Xử lý sự kiện khi người dùng hoàn thành một câu hỏi trong bài quiz.
   *
   * Chức năng này thực hiện các bước sau:
   * 1. Tăng chỉ mục câu hỏi hiện tại (`activeQuestionIndex`) để chuyển sang câu tiếp theo.
   * 2. Gọi `handleSaveAnswer()` để lưu câu trả lời của người dùng.
   * 3. Kiểm tra xem câu hỏi tiếp theo có tồn tại không:
   *    - Nếu có, gửi yêu cầu lấy dữ liệu câu hỏi tiếp theo từ API.
   *    - Sau khi tải thành công, cập nhật `startWorkTime` để đánh dấu thời điểm bắt đầu trả lời câu hỏi mới.
   *
   * @returns Không có giá trị trả về.
   */

  const [isFinishQuiz, setIsFinishQuiz] = useState<boolean>(isQuizFinished)

  const handleQuizFinish = async () => {
    const name = `${activeQuestion?.id}_${activeQuestion?.requirements?.length ? activeQuestion?.requirements?.[0]?.id : document_id}_essay`
    const defaultValue =
      questionRef.current?.getValues(name) ||
      activeQuestion?.myAnswers?.[0]?.short_answer
    if (activeQuestion?.response_option === RESPONSE_OPTION.SHEET) {
      // await questionRef.current?.onResetSheet(activeQuestion?.response_option)
    } else {
      await questionRef.current?.onResetWord(
        name,
        activeQuestion?.response_option,
        defaultValue,
      )
    }

    // Lần cuối thì không cần tăng nữa
    // setActiveQuestionIndex(activeQuestionIndex + 1)
    setIsFinishQuiz(true)
    handleSaveAnswer()
    // Load the next question if it hasn't been loaded yet
    const nextQuestionId = questions[activeQuestionIndex + 1]?.id
    if (nextQuestionId) {
      try {
        await dispatch(
          fetchQuestionById({
            activityId: activityId,
            tabId: tabId,
            quizId: quizId,
            questionId: nextQuestionId || '',
          }),
        )
        setStartWorkTime(Date.now())
      } catch (error) {}
    }
  }

  /**
   * Hủy bỏ xác nhận nộp bài
   */
  const handleCancelConfirmSubmit = () => {
    // Nếu chưa hoàn thành bài quiz, không thực hiện gì cả
    if (!isFinishQuiz) return
    // Trả lại chỉ mục câu hỏi hiện tại về trước 1 để người dùng có thể tiếp tục làm bài
    // setActiveQuestionIndex(activeQuestionIndex - 1)
    setIsFinishQuiz(false)
  }

  const handlePrevQuestion = async () => {
    const name = `${activeQuestion?.id}_${activeQuestion?.requirements?.length ? activeQuestion?.requirements?.[0]?.id : document_id}_essay`
    const defaultValue =
      questionRef.current?.getValues(name) ||
      activeQuestion?.myAnswers?.[0]?.short_answer

    if (activeQuestion?.response_option === RESPONSE_OPTION.WORD) {
      await questionRef.current?.onResetWord(
        name,
        activeQuestion?.response_option,
        defaultValue,
      )
    }
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1)
      handleSaveAnswer()
      // Load the previous question if it hasn't been loaded yet
      const prevQuestionId = questions?.[activeQuestionIndex - 1]?.id
      if (prevQuestionId) {
        try {
          const prevQuestion = await dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: prevQuestionId || '',
            }),
          ).unwrap()
          setStartWorkTime(Date.now())
          const preQuestionContent = prevQuestion?.question

          const name = `${preQuestionContent?.id}_${preQuestionContent?.requirements?.length ? preQuestionContent?.requirements?.[0]?.id : document_id}_essay`
          const defaultValue = preQuestionContent?.myAnswers?.[0]?.short_answer
          if (
            preQuestionContent &&
            preQuestionContent?.response_option === RESPONSE_OPTION.WORD
          ) {
            questionRef.current?.onResetWord(
              name,
              preQuestionContent?.response_option,
              defaultValue,
            )
          } else if (
            preQuestionContent &&
            preQuestionContent?.response_option === RESPONSE_OPTION.SHEET
          ) {
            questionRef.current?.onResetSheet(
              preQuestionContent?.response_option,
            )
          }
        } catch (error) {}
      }

      // questionRef.current?.reset()
    }
    // questionRef.current?.reset()
  }

  const handleConfirmQuestion = async () => {
    setLoading(true)
    setLoadingButton(true)
    if (activeQuestion) {
      questionRef?.current?.onSubmit({
        activityId: activityId,
        tabId: tabId,
        quizId: quizId,
        time_spent: calculateWorkTime(),
        then: async () => {
          setLoading(false)
          await new Promise((resolve) => setTimeout(resolve, 500))
          setLoadingButton(false)
        },
        onFinally: async () => {
          setLoading(false)
          await new Promise((resolve) => setTimeout(resolve, 500))
          setLoadingButton(false)
        },
      })
    }
  }
  /**
   * Function: Xử lý việc lưu đáp án lên store trước khi chuyển sang câu khác
   */
  const handleSaveAnswer = () => {
    const myAnswers = questionRef?.current?.onSaveAnswer(
      activeQuestion,
    ) as unknown
    if (!activeQuestion?.confirmed) {
      dispatch(
        saveAnswer({
          activityId,
          tabId,
          quizId,
          myAnswers,
          question: activeQuestion,
          time_spent: calculateWorkTime(),
        }),
      )
    }
  }

  const handleFinishQuiz = async () => {
    setOpenFinishQuiz(false)
    setLoading(true)
    const questions = selectQuestions(selector, activityId, tabId, quizId || '')

    if (grading_preference === 'AFTER_ALL_QUESTIONS') {
      // Mark finished to preserve state across popup
      setIsFinishQuiz(true)
    }

    // Handle: handle việc check xem đáp án đó đãn làm và có đáp án chưa chưa có thì sẽ return null
    const availableQuestions = questions?.map((item: any) => {
      if (isValidatedAnswer(item.myAnswers, item.qType)) {
        return item
      }
      return { ...item, myAnswers: null }
    })
    const {
      answers,
      quiz_position_mapping,
    }: { answers: any[]; quiz_position_mapping: any[] } =
      availableQuestions?.reduce(
        (acc: any, obj: any) => {
          if (obj?.myAnswers) {
            acc.answers = acc?.answers?.concat(...obj.myAnswers)
          }
          if (obj?.quiz_position_mapping) {
            acc.quiz_position_mapping = acc?.quiz_position_mapping?.concat(
              obj?.quiz_position_mapping,
            )
          }

          return acc
        },
        { answers: [] as any[], quiz_position_mapping: [] as any[] },
      )

    try {
      await dispatch(
        submitQuiz({
          id: quizId,
          data: { answers, quiz_position_mapping },
          class_user_id,
        }),
      )
        .unwrap()
        .then((e: any) => {
          const isCompletedCourse = e?.data?.progress
          if (!!isCompletedCourse?.is_completed) {
            setTimeout(() => {
              dispatch(
                showPopupCompletedCourse(isCompletedCourse?.content || ''),
              )
            }, 2000)
          }
          // getTable({ id: e.quizAttemptId, page_index: 1, page_size: 10 })
          if (is_graded && grading_method === GRADING_METHOD.MANUAL) {
            setResultId(e.quizAttemptId)
            setOpenGradedReport(true)
            return
          } else {
            const searchParams =
              is_limited && limit_count && number_of_attempts
                ? `attempt=${number_of_attempts + 1}/${limit_count}`
                : ''
            router.replace(
              `${isTeacher ? PageLink.TEACHER_MY_COURSE : '/courses'}/quiz/quiz-result/${e.quizAttemptId}?${searchParams}`,
            )
          }
          // dispatch(
          //   removeQuizFinished({
          //     activityId,
          //     tabId,
          //     quizId: quizId,
          //   }),
          // )
          setQuizComponentKey((e) => e + 1)
          // setActiveQuestionIndex(0)
        })
    } catch (error: any) {
      if (error?.response?.status === 422) {
        toast.error('Có lỗi xảy ra khi gửi bình luận nộp bài!')
      }
    } finally {
      setLoading(false)
    }
  }

  // const getTable = async ({
  //   id,
  //   page_index,
  //   page_size,
  // }: {
  //   id?: string
  //   page_index: number
  //   page_size: number
  // }) => {
  //   setLoading(true)
  //   try {
  //     // const checkId = id || modalResult?.id
  //     // if (checkId === resultId) return
  //     setResultId(id ?? modalResult?.id ?? '')
  //     const response = await CoursesAPI.getQuizAttemptsTable(
  //       id || modalResult?.id || '',
  //       {
  //         page_index,
  //         page_size,
  //       },
  //     )

  //     const newQuestionResponse: IQuestionResultResponse = {
  //       meta: response?.data?.metadata,
  //       data: (modalResult?.questions?.data ?? []).concat(
  //         response?.data?.answers?.map((answer) => {
  //           return {
  //             active: answer?.active,
  //             id: answer?.id,
  //             content: answer?.question?.question_content,
  //             section: answer?.question?.question_filter?.part?.name,
  //             type: answer?.question?.qType,
  //             is_correct: answer?.is_correct,
  //             time_spent: answer?.time_spent,
  //             question: answer?.question,
  //           }
  //         }) || [],
  //       ),
  //       attempt_info: response?.data?.attempt_info,
  //     }

  //     if (is_graded && grading_method === GRADING_METHOD.MANUAL) {
  //       setOpenGradedReport(true)
  //       return
  //     } else {
  //       setModalResult((e) => ({
  //         id: id || e?.id,
  //         status: true,
  //         questions: newQuestionResponse,
  //       }))
  //     }
  //   } catch (error) {
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const scrollToQuiz = (quizId: string) => {
    setTimeout(() => {
      const element = document.getElementById(quizId)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })
      }
    }, 100) // delay 1 chút để React render xong
  }

  const startTime = quizSetting?.start_time
  const endTime = quizSetting?.end_time
  const BluredNotification = () => (
    <>
      {!quizSetting?.allow_attempt && !isNull(quizSetting) && (
        <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          {quizSetting?.reason_for_reject === 'NOT_OPEN_YET' && (
            <p className="text-center">
              This Quiz will be opened at{' '}
              <span className="font-semi-bold text-primary">
                {dayjs(startTime).format('DD/MM/YYYY HH:mm')}{' '}
              </span>
              and closed at{' '}
              <span className="font-semi-bold text-primary">
                {dayjs(endTime).format('DD/MM/YYYY HH:mm')}{' '}
              </span>
            </p>
          )}
          {quizSetting?.reason_for_reject === 'EXPIRED' && (
            <p className="text-center">
              The time for this Quiz has ended, you can no longer submit
              answers. For further support, please contact SAPP Academy via{' '}
              <a
                href={SOCIAL_LINK.FACEBOOK}
                className="font-semi-bold text-primary"
                target="_blank"
                rel="noreferrer"
              >
                Facebook,
              </a>{' '}
              or hotline{' '}
              <span className="font-semi-bold text-primary">19002225</span>.
            </p>
          )}
        </div>
      )}
      <div className="absolute left-0 top-0 z-20 h-full w-full bg-white/30 backdrop-blur" />
      {/* Fake Question */}
      <div>
        <div>
          <div className="sapp-questions sapp-editor-reader editor-wrap mce-content-body">
            <div>
              <p>Câu hỏi số 1</p>
            </div>
          </div>
          <div className="body-modal-white -mt-2">
            <div id="hightlight_area">
              <div className="my-6 border border-b-gray-300"></div>
              <div className="mb-4 flex items-center">
                <div className="font-semibold">{exhibitText}s (6)</div>
                <div className="ml-4">
                  <span className="text-error">* </span>
                  <span className="text-[#A1A1A1]">Click to view</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="cursor-pointer hover:text-primary">
                  {exhibitText} 1: Quản lý nhân sự
                </div>
                <div className="cursor-pointer hover:text-primary">
                  {exhibitText} 2: email csv
                </div>
                <div className="cursor-pointer hover:text-primary">
                  {exhibitText} 3: csv semi
                </div>
                <div className="cursor-pointer hover:text-primary">
                  {exhibitText} 4: File Data mẫu
                </div>
                <div className="cursor-pointer hover:text-primary">
                  {exhibitText} 5: csv short
                </div>
              </div>
              <div className="my-6 border border-b-gray-300"></div>
              <div className="questions editor-wrap mce-content-body" id="">
                <div className="">
                  <p>
                    <span className="dropable"></span> 3{' '}
                    <span className="dropable"></span> 4
                  </p>
                </div>
              </div>
            </div>
            <div className="answer-area">
              <div
                className="sapp-store storage2 flex min-h-large w-full flex-wrap gap-5 border p-5"
                id="storage"
              >
                <span className="answer-box" draggable="true">
                  3
                </span>
                <span className="answer-box" draggable="true">
                  2
                </span>
                <span className="answer-box" draggable="true">
                  1
                </span>
                <span className="answer-box" draggable="true">
                  4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  /**
   *
   * @param status Trạng thái chấm điểm
   * @returns label
   */
  const getGradedLabel = (status?: string) => {
    switch (status) {
      case GRADE_STATUS.FINISHED_GRADING:
        return (
          <div className="rounded bg-[#3978391A] px-2 font-medium text-[#166534]">
            Finished Grading
          </div>
        )
      case GRADE_STATUS.AWAITING_GRADING:
        return (
          <div className="text-amber-400  rounded bg-[#FFB8001A] px-2 font-medium">
            Awaiting Grading
          </div>
        )
      default:
        return (
          <div className="whitespace-nowrap rounded bg-warning-50 px-2 py-[2px] text-center text-sm font-normal text-warning">
            Manual Grading
          </div>
        )
    }
  }

  /**
   *
   * @param status Trạng thái chấm điểm
   * @returns label
   */
  const getButttonTitle = () => {
    if (is_graded && grading_method === GRADING_METHOD.MANUAL) {
      if (gradeStatus === GRADE_STATUS.AWAITING_GRADING) {
        return 'Your Answers'
      }
      if (gradeStatus === GRADE_STATUS.FINISHED_GRADING) {
        return 'Result'
      }
    }
    return 'Submit & View Answer'
  }

  const handleSubmit = () => {
    if (is_graded && grading_method === GRADING_METHOD.MANUAL) {
      if (gradeStatus === GRADE_STATUS.AWAITING_GRADING) {
        router.replace(
          `${isTeacher ? PageLink.TEACHER_MY_COURSE : '/courses'}/quiz/your-answers-detail/${resultId}`,
        )
        return
      }
      if (gradeStatus === GRADE_STATUS.FINISHED_GRADING) {
        router.replace(
          `${isTeacher ? PageLink.TEACHER_MY_COURSE : '/courses'}/quiz/quiz-result/${resultId}`,
        )
        return
      }
    }

    if (!loading) handleConfirmQuestion()
    trackGAEvent('Click Button Confirm Quiz Activity')
  }

  const handleCalcelModalResult = () => {
    refreshTab()
    setOpenGradedReport(false)
  }
  const handleClearSelection = (activeQuestion: any) => {
    if (!isQuestionConfirmed) {
      setValue(`${activeQuestion?.id}_${document_id}_answer`, '')
    }
  }

  const handleRetakeQuestion = () => {
    // Reset toàn bộ trạng thái quiz trong redux (xóa myAnswers, corrects, confirmed, time_spent, ...)
    dispatch(
      removeQuizFinished({
        activityId,
        tabId,
        quizId,
      }),
    )
    // Clear form values and force remount to avoid showing previous selections
    reset({})
    setQuizComponentKey((e) => e + 1)
    setActiveQuestionIndex(0)
    setRunHandleFinishQuiz(1)
    setOpenFinishQuiz(false)
    setOpenGradedReport(false)
    setIsFinishQuiz(false)
  }
  const [openResetToTemplateModal, setOpenResetToTemplateModal] =
    useState(false)
  const onOpenResetToTemplateModal = () => {
    setOpenResetToTemplateModal(true)
  }
  const onCloseResetToTemplateModal = () => {
    setOpenResetToTemplateModal(false)
  }
  const isShowTemplate =
    activeQuestion?.answer_template ||
    activeQuestion?.requirements?.some(
      (req: IRequirment) => req?.answer_template,
    )

  return (
    <div
      className={clsx('rounded-xl bg-gray-100 p-4 md:p-8 lg:rounded-2xl', {
        'w-fit lg:w-full': activeQuestion?.qType === QUESTION_TYPES.MATCHING,
      })}
    >
      <ConFirmSubmit
        open={openFinishQuiz}
        setOpen={setOpenFinishQuiz}
        handleSubmit={handleFinishQuiz}
        handleCancel={handleCancelConfirmSubmit}
      />
      <div className={clsx({ 'mb-[10px]': is_graded })}>
        <div className="mb-8 flex items-center gap-3 rounded-md bg-white px-6 py-2">
          {((quizSetting?.allow_attempt && !isNull(quizSetting)) ||
            isNull(quizSetting)) && (
            <>
              <div className="mx-auto flex w-fit items-center gap-3">
                {questions?.length > 1 && (
                  <button
                    disabled={activeQuestionIndex === 0 || loading}
                    className={`cursor-pointer select-none  ${
                      activeQuestionIndex === 0 || loading ? 'opacity-50' : ''
                    }`}
                    onClick={() => {
                      if (loading) {
                        return
                      }
                      handlePrevQuestion()
                      trackGAEvent('Click Prev Question Quiz Activity')
                    }}
                  >
                    <span className="text-[#1C274C]">
                      <CircleArrowLeftIcon />
                    </span>
                  </button>
                )}
                <div className="text-sm text-bw-13 md:text-base">
                  Question: {activeQuestionIndex + 1} of{' '}
                  {questions?.length || 0}
                </div>
                {questions?.length > 1 && (
                  <button
                    disabled={isLastQuestion || loading}
                    className={`cursor-pointer select-none ${
                      isLastQuestion || loading ? 'opacity-50' : ''
                    }`}
                    onClick={() => {
                      if (loading) {
                        return
                      }
                      handleNextQuestion()
                      trackGAEvent('Click Next Question Quiz Activity')
                    }}
                  >
                    <span className="text-[#1C274C]">
                      <CircleArrowRightIcon />
                    </span>
                  </button>
                )}
              </div>
              <div
                id={`quiz-toggle-${quizId}`}
                className="hidden cursor-pointer justify-end text-icon md:flex"
                onClick={() => {
                  setFocusOnlyQuiz({
                    open: !focusOnlyQuiz.open,
                    id: !!focusOnlyQuiz.id ? '' : quizId,
                  })
                  scrollToQuiz(`quiz-toggle-${quizId}`)
                }}
              >
                {focusOnlyQuiz.open ? (
                  <MinimumContentIcon />
                ) : (
                  <MaximumContentIcon />
                )}
              </div>
            </>
          )}
        </div>

        {is_graded && (
          <div className="hidden flex-wrap items-center gap-3 md:flex">
            <div
              className={` ${is_graded || 'invisible'} whitespace-nowrap rounded bg-info-50 px-2 py-[2px] text-center text-sm font-normal text-info`}
            >
              Graded Activity
            </div>
            {is_graded &&
              grading_method === GRADING_METHOD.MANUAL &&
              getGradedLabel(gradeStatus)}
          </div>
        )}
      </div>

      {isUndefined(activeQuestion) || loading ? (
        <LoadingQuizDocument />
      ) : (
        <div
          className="flex flex-col gap-4 md:gap-8"
          data-aos={ANIMATION.DATA_AOS}
        >
          {/* Question */}
          <div
            className={`text-black-1 h-full ${!!gradeStatus ? 'pointer-events-none opacity-100' : ''} `}
            data-aos={ANIMATION.DATA_AOS}
          >
            {!quizSetting?.allow_attempt && !isNull(quizSetting) && (
              <BluredNotification />
            )}
            {activeQuestion &&
              ((quizSetting?.allow_attempt && !isNull(quizSetting)) ||
                isNull(quizSetting)) && (
                <QuizComponent
                  activityId={activityId}
                  tabId={tabId}
                  quizId={quizId}
                  showCorrect={isAFTEREACHQUESTION || isAFTERAllQUESTION}
                  activeQuestion={activeQuestion}
                  ref={questionRef}
                  key={quizComponentKey}
                  document_id={document_id}
                  setOpenFile={setOpenFile}
                  grading_preference={grading_preference}
                  showQuestionContent={false}
                  isHideExhibit={false}
                  saveAnswer={handleSaveAnswer}
                  exhibitText={exhibitText}
                  {...{
                    controlAnswer,
                    setValue,
                    reset,
                    getValues,
                    watch,
                    resetField,
                  }}
                />
              )}
          </div>

          {/* Confirm Button */}
          <div
            className={clsx('justify-end', {
              'hidden md:flex': activeQuestion?.qType === QUESTION_TYPES.ESSAY,
              flex: activeQuestion?.qType !== QUESTION_TYPES.ESSAY,
              'gap-3': isShowTemplate,
              'gap-2': !isShowTemplate,
            })}
          >
            {activeQuestion &&
              activeQuestion?.qType === QUESTION_TYPES.ESSAY &&
              isShowTemplate &&
              !activeQuestion?.confirmed && (
                <div className="flex items-center justify-end gap-3">
                  <ButtonTextV2
                    title="Reset to Answer Template"
                    onClick={onOpenResetToTemplateModal}
                    disabled={activeQuestion?.confirmed}
                    className="bg-transparent hover:!bg-transparent"
                  />
                  <ShowAnswerTemplate
                    {...{
                      currentTabContent: activeQuestion,
                      essayData: questionRef.current?.getEssayData() as any,
                    }}
                    isQuiz
                  />
                </div>
              )}
            {gradeStatus &&
              ![
                GRADE_STATUS.AWAITING_GRADING,
                GRADE_STATUS.FINISHED_GRADING,
              ].includes(gradeStatus) &&
              activeQuestion?.qType &&
              [
                QUESTION_TYPES.TRUE_FALSE,
                QUESTION_TYPES.ONE_CHOICE,
                QUESTION_TYPES.MULTIPLE_CHOICE,
              ].includes(activeQuestion.qType) &&
              !isQuestionConfirmed && (
                <ButtonSecondary
                  className="!px-4 !py-2 !text-sm"
                  size={'small'}
                  disabled={
                    ((activeQuestion?.qType === QUESTION_TYPES.TRUE_FALSE ||
                      activeQuestion?.qType === QUESTION_TYPES.ONE_CHOICE) &&
                      !watch(`${activeQuestion?.id}_${document_id}_answer`)) ||
                    (activeQuestion?.qType === QUESTION_TYPES.MULTIPLE_CHOICE &&
                      !watch(`${activeQuestion?.id}_${document_id}_answer`)
                        ?.length)
                  }
                  onClick={() => {
                    handleClearSelection(activeQuestion)
                    trackGAEvent('Click Button Clear Selection Test')
                  }}
                  title="Clear Selection"
                />
              )}
            <Tooltip
              title={
                isQuestionConfirmed ||
                isAFTERAllQUESTION ||
                (is_graded && grading_method === GRADING_METHOD.MANUAL) ||
                ![
                  QUESTION_TYPES.TRUE_FALSE,
                  QUESTION_TYPES.ONE_CHOICE,
                  QUESTION_TYPES.MULTIPLE_CHOICE,
                ].includes(activeQuestion?.qType) ||
                ((activeQuestion?.qType === QUESTION_TYPES.TRUE_FALSE ||
                  activeQuestion?.qType === QUESTION_TYPES.ONE_CHOICE) &&
                  watch(`${activeQuestion?.id}_${document_id}_answer`)) ||
                (activeQuestion?.qType === QUESTION_TYPES.MULTIPLE_CHOICE &&
                  watch(`${activeQuestion?.id}_${document_id}_answer`) &&
                  watch(`${activeQuestion?.id}_${document_id}_answer`).length >
                    0)
                  ? null
                  : 'You should select an answer before click'
              }
              classNames={{ root: 'max-w-72' }}
              trigger={'hover'}
            >
              <>
                {(isQuestionConfirmed ||
                  isAFTERAllQUESTION ||
                  (isQuestionConfirmed && isLastQuestion)) &&
                  !isFinishQuiz && (
                    <SappButton
                      className="!rounded-lg !px-4 py-2 text-sm"
                      classNameLoading="!rounded-lg !px-4 py-2 text-sm"
                      childClass="text-sm"
                      title={
                        isLastQuestion
                          ? 'Finish'
                          : isAFTERAllQUESTION
                            ? 'Next Question'
                            : 'Next'
                      }
                      full={false}
                      size={'small'}
                      onClick={() => {
                        if (loading) {
                          return
                        }
                        if (isLastQuestion) {
                          handleQuizFinish()
                          setRunHandleFinishQuiz((e) => e + 1)
                          trackGAEvent('Click Button Finish Quiz Activity')
                        } else {
                          handleNextQuestion()
                          trackGAEvent('Click Button Next Quiz Activity')
                        }
                      }}
                      color="light-dark"
                      loading={loading}
                    />
                  )}
                {!isQuestionConfirmed && isAFTEREACHQUESTION && (
                  <SappButton
                    className="!rounded-lg !px-4 py-2"
                    childClass="text-sm"
                    title={getButttonTitle()}
                    full={false}
                    size={'small'}
                    disabled={loading}
                    onClick={() => {
                      handleSubmit()
                    }}
                    color="light-dark"
                    classNameLoading="!rounded-lg !px-4 py-2"
                    loading={loadingButton || loading}
                  />
                )}
                {/* AFTER_ALL_QUESTIONS: show Retake only when all questions have corrects */}
                {isQuestionConfirmed &&
                  isAFTERAllQUESTION &&
                  isFinishQuiz &&
                  hasAttemptsLeft && (
                    <SappButton
                      className="!rounded-lg !px-4 !py-2"
                      childClass="text-sm"
                      title={'Retake'}
                      full={false}
                      size={'small'}
                      disabled={loading}
                      onClick={() => {
                        handleRetakeQuestion()
                      }}
                    />
                  )}
              </>
            </Tooltip>
          </div>
        </div>
      )}

      {openGradedReport && (
        <SappModalV3
          open={openGradedReport}
          okButtonCaption={
            is_graded && grading_method === GRADING_METHOD.MANUAL
              ? 'Review Answers'
              : 'Back'
          }
          showCancelButton={
            is_graded && grading_method === GRADING_METHOD.MANUAL
          }
          cancelButtonCaption={'Back'}
          handleCancel={handleCalcelModalResult}
          onOk={() => {
            if (is_graded && grading_method === GRADING_METHOD.MANUAL) {
              router.replace(
                `${isTeacher ? PageLink.TEACHER_MY_COURSE : '/courses'}/quiz/your-answers-detail/${resultId}`,
              )
              handleCalcelModalResult()
            } else {
              handleCalcelModalResult()
            }
          }}
          isMaskClosable={false}
          fullWidthBtn={true}
          buttonSize="extra"
          icon={<ConfirmIcon />}
          header={FINISHED_TEST_TITLE}
          content={`Congratulations on completing ${quizName}. The result will be sent to you via email after the grading is finished.`}
        />
      )}
      {openResetToTemplateModal && (
        <ResetToAnswerTemplateModal
          open={openResetToTemplateModal}
          handleReset={() =>
            questionRef?.current?.onResetAnswerEssayToTemplate()
          }
          handleClose={onCloseResetToTemplateModal}
        />
      )}
    </div>
  )
}

export default QuizDocument
