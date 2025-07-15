import { useEffect, useRef, useState } from 'react'
import SappIcon from 'src/common/SappIcon'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
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
  CloseIcon,
  ConfirmIcon,
  MaximumContentIcon,
  MinimumContentIcon,
} from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import SappModal from '@components/base/modal/SappModal'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { isValidatedAnswer } from '@utils/answer'
import { trackGAEvent } from '@utils/google-analytics'
import dayjs from 'dayjs'
import { isNull } from 'lodash'
import { useRouter } from 'next/router'
import { QuizResultComponent } from 'quiz-result-package'
import toast from 'react-hot-toast'
import {
  ANIMATION,
  FINISHED_TEST_TITLE,
  GRADE_STATUS,
  GRADING_METHOD,
  QUESTION_TYPES,
  SOCIAL_LINK,
} from 'src/constants'
import ConFirmSubmit from 'src/pages/test/conFirmSubmit'
import { showPopupCompletedCourse } from 'src/redux/slice/Popup/Result-test'
import { IQuizSetting } from 'src/type'
import {
  IQuestionResult,
  IQuestionResultResponse,
} from 'src/type/course/my-course/Activity'
import { IQuestion } from 'src/type/course/Question'
import { CoursesAPI } from '../../../../pages/api/courses/index'
import ModalExplanationPackage from '../ModalExplanationPackage'
import QuizComponent, { QuizComponentRef } from './QuizComponent'
import { Tooltip } from 'antd'
import { IFocusQuiz } from '@pages/courses/[id]/activity/[activityId]'
import ModalResults from '../ModalResults'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'

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
  focusOnlyQuiz: IFocusQuiz
  setFocusOnlyQuiz: React.Dispatch<React.SetStateAction<IFocusQuiz>>
}

interface IAnswer {
  active: string
  id: string
  is_correct: false
  quiz_attempt_id: string
  time_spent: number
  topic_attempt_id: string
  question: {
    id: string
    qType: string
    question_content: string
    question_filter_id: {
      part: {
        name: string
      }
    }
  }
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
  focusOnlyQuiz,
  setFocusOnlyQuiz,
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
  const [resultId, setResultId] = useState<string>(attemptId || '')
  const [openGradedReport, setOpenGradedReport] = useState<boolean>(false)
  const [startWorkTime, setStartWorkTime] = useState(Date.now())

  const [modalResult, setModalResult] = useState<{
    status?: boolean
    questions?: any
    id?: string
  }>()

  const [quizComponentKey, setQuizComponentKey] = useState<number>(1)

  const [openFinishQuiz, setOpenFinishQuiz] = useState<boolean>(false)

  const [showQuestionResultDetail, setShowQuestionResultDetail] = useState<{
    id: string
    isOpen: boolean
  }>()
  const {
    control: controlAnswer,
    setValue,
    reset,
    getValues,
    watch,
  } = useForm({})

  useEffect(() => {
    ;(async () => {
      if (questions?.[0]?.id) {
        setStartWorkTime(Date.now())
        // Load the first question when the component mounts
        try {
          dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: questions?.[0]?.id || '',
            }),
          )
        } catch (error) {}
      }
    })()
  }, [questions?.[0]?.id])

  useEffect(() => {
    if (runHandleFinishQuiz > 1) {
      setOpenFinishQuiz(true)
    }
  }, [runHandleFinishQuiz])

  const calculateWorkTime = () => {
    return activeQuestion?.confirmed
      ? (activeQuestion?.time_spent ?? 0)
      : activeQuestion?.time_spent !== 0
        ? Math.ceil((Date.now() - startWorkTime) / 1000) +
          activeQuestion?.time_spent
        : Math.ceil((Date.now() - startWorkTime) / 1000)
  }

  const handleNextQuestion = async () => {
    if (activeQuestionIndex < questions?.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1)
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

      questionRef?.current?.reset()
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

  const [isFinishQuiz, setIsFinishQuiz] = useState<boolean>(false)

  const handleQuizFinish = async () => {
    setActiveQuestionIndex(activeQuestionIndex + 1)
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
    setActiveQuestionIndex(activeQuestionIndex - 1)
  }

  const handlePrevQuestion = async () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1)
      handleSaveAnswer()
      // Load the previous question if it hasn't been loaded yet
      const prevQuestionId = questions?.[activeQuestionIndex - 1]?.id
      if (prevQuestionId) {
        try {
          await dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: prevQuestionId || '',
            }),
          )
          setStartWorkTime(Date.now())
        } catch (error) {}
      }

      questionRef.current?.reset()
    }
  }

  const handleConfirmQuestion = () => {
    setLoading(true)
    if (activeQuestion) {
      questionRef?.current?.onSubmit({
        activityId: activityId,
        tabId: tabId,
        quizId: quizId,
        time_spent: calculateWorkTime(),
        then: () => {
          setLoading(false)
        },
        onFinally: () => {
          setLoading(false)
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
          if (e?.progress?.is_completed) {
            setTimeout(() => {
              dispatch(showPopupCompletedCourse(e?.progress?.content))
            }, 2000)
          }
          getTable({ id: e.quizAttemptId, page_index: 1, page_size: 10 })
          dispatch(
            removeQuizFinished({
              activityId,
              tabId,
              quizId: quizId,
            }),
          )
          setQuizComponentKey((e) => e + 1)
          setActiveQuestionIndex(0)
          if (is_graded && grading_method === GRADING_METHOD.MANUAL) {
            setOpenGradedReport(true)
            return
          }
        })
    } catch (error: any) {
      if (error?.response?.status === 422) {
        toast.error('Có lỗi xảy ra khi gửi bình luận nộp bài!')
      }
    } finally {
      setLoading(false)
    }
  }

  const getTable = async ({
    id,
    page_index,
    page_size,
  }: {
    id?: string
    page_index: number
    page_size: number
  }) => {
    setLoading(true)
    try {
      // const checkId = id || modalResult?.id
      // if (checkId === resultId) return
      setResultId(id ?? modalResult?.id ?? '')
      const response = await CoursesAPI.getQuizAttemptsTable(
        id || modalResult?.id || '',
        {
          page_index,
          page_size,
        },
      )

      const newQuestionResponse: IQuestionResultResponse = {
        meta: response?.data?.metadata,
        data: (modalResult?.questions?.data ?? []).concat(
          response?.data?.answers?.map((answer) => {
            return {
              active: answer?.active,
              id: answer?.id,
              content: answer?.question?.question_content,
              section: answer?.question?.question_filter?.part?.name,
              type: answer?.question?.qType,
              is_correct: answer?.is_correct,
              time_spent: answer?.time_spent,
              question: answer?.question,
            }
          }) || [],
        ),
        attempt_info: response?.data?.attempt_info,
      }

      if (is_graded && grading_method === GRADING_METHOD.MANUAL) {
        setOpenGradedReport(true)
        return
      } else {
        setModalResult((e) => ({
          id: id || e?.id,
          status: true,
          questions: newQuestionResponse,
        }))
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleShowQuestionResultDetail = (data: IQuestionResult) => {
    setShowQuestionResultDetail({ id: data?.id, isOpen: true })
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
          <div className="sapp-questions editor-wrap mce-content-body">
            <div>
              <p>Câu hỏi số 1</p>
            </div>
          </div>
          <div className="body-modal-white -mt-2">
            <div id="hightlight_area">
              <div className="my-6 border border-b-[#DCDDDD]"></div>
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
              <div className="my-6 border border-b-[#DCDDDD]"></div>
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
                className="sapp-store storage2 min-h-large flex w-full flex-wrap gap-5 border p-5"
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
    return 'Submit'
  }

  const handleSubmit = () => {
    if (is_graded && grading_method === GRADING_METHOD.MANUAL) {
      if (gradeStatus === GRADE_STATUS.AWAITING_GRADING) {
        router.replace(`/courses/quiz/your-answers-detail/${resultId}`)
        return
      }
      if (gradeStatus === GRADE_STATUS.FINISHED_GRADING) {
        router.replace(`/courses/quiz/quiz-result/${resultId}`)
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

  return (
    <div
      className={clsx('rounded-xl bg-gray-100 p-4 md:p-8', {
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
                <div className="text-bw-13 text-sm md:text-base">
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
                className="hidden cursor-pointer justify-end text-icon md:flex"
                onClick={() =>
                  setFocusOnlyQuiz({
                    open: !focusOnlyQuiz.open,
                    id: !!focusOnlyQuiz.id ? '' : quizId,
                  })
                }
              >
                {focusOnlyQuiz.open ? (
                  <MinimumContentIcon />
                ) : (
                  <MaximumContentIcon />
                )}
                {/* {(isQuestionConfirmed ||
                grading_preference !== 'AFTER_EACH_QUESTION' ||
                (isQuestionConfirmed && isLastQuestion)) && (
                <SappButton
                  title={isLastQuestion ? 'Finish' : 'Next'}
                  full={false}
                  size={'small'}
                  onClick={() => {
                    if (loading) {
                      return
                    }
                    if (isLastQuestion) {
                      handleQuizFinish()
                      // handleSaveAnswer()
                      setRunHandleFinishQuiz((e) => e + 1)
                      trackGAEvent('Click Button Finish Quiz Activity')
                    } else {
                      handleNextQuestion()
                      trackGAEvent('Click Button Next Quiz Activity')
                    }
                  }}
                  color="primary"
                  loading={loading}
                />
              )}
              {!isQuestionConfirmed &&
                grading_preference === 'AFTER_EACH_QUESTION' && (
                  <SappButton
                    title={getButttonTitle()}
                    full={false}
                    size={'small'}
                    disabled={loading}
                    onClick={() => {
                      handleSubmit()
                    }}
                    color="primary"
                    loading={loading}
                  />
                )} */}
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

      <div className="flex flex-col gap-4 md:gap-8">
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
                showCorrect={isAFTEREACHQUESTION}
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
                }}
              />
            )}
        </div>
        {/* Confirm Button */}
        <div
          className={clsx('justify-end', {
            'hidden md:flex': activeQuestion?.qType === QUESTION_TYPES.ESSAY,
            flex: activeQuestion?.qType !== QUESTION_TYPES.ESSAY,
          })}
        >
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
                watch(`${activeQuestion?.id}_${document_id}_answer`).length > 0)
                ? null
                : 'You should select an answer before click'
            }
            classNames={{ root: 'max-w-72' }}
            getPopupContainer={(triggerNode) => triggerNode.parentElement!}
            trigger={'hover'}
          >
            <>
              {(isQuestionConfirmed ||
                isAFTERAllQUESTION ||
                (isQuestionConfirmed && isLastQuestion)) && (
                <SappButton
                  className="!rounded-lg !px-4 py-2"
                  title={
                    isLastQuestion
                      ? 'Finish'
                      : isAFTERAllQUESTION
                        ? 'Submit & Next'
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
                  title={getButttonTitle()}
                  full={false}
                  size={'small'}
                  disabled={loading}
                  onClick={() => {
                    handleSubmit()
                  }}
                  color="light-dark"
                  loading={loading}
                />
              )}
            </>
          </Tooltip>
        </div>
      </div>

      {modalResult?.status && (
        <ModalResults
          getTable={getTable}
          handleShowQuestionResultDetail={handleShowQuestionResultDetail}
          modalResult={modalResult}
          open={modalResult?.status}
          handleCancel={() => {
            refreshTab()
            setModalResult(undefined)
          }}
          loading={loading}
          handleOk={() => setModalResult(undefined)}
        />
      )}

      {showQuestionResultDetail?.isOpen && (
        <ModalExplanationPackage
          quizAttemptsAnswerId={showQuestionResultDetail?.id || ''}
          open={showQuestionResultDetail?.isOpen || false}
          setOpen={() => setShowQuestionResultDetail(undefined)}
        />
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
              router.replace(`/courses/quiz/your-answers-detail/${resultId}`)
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
    </div>
  )
}

export default QuizDocument
