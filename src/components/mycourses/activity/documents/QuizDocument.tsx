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

import { CloseIcon, ConfirmIcon } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import SappModal from '@components/base/modal/SappModal'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { isValidatedAnswer } from '@utils/answer'
import { trackGAEvent } from '@utils/google-analytics'
import dayjs, { Dayjs } from 'dayjs'
import { QuizResultComponent } from 'quiz-result-package'
import {
  IQuestionResult,
  IQuestionResultResponse,
} from 'quiz-result-package/dist/type'
import toast from 'react-hot-toast'
import {
  ANIMATION,
  FINISHED_TEST_TITLE,
  GRADE_STATUS,
  GRADING_METHOD,
  SOCIAL_LINK,
} from 'src/constants'
import ConFirmSubmit from 'src/pages/test/conFirmSubmit'
import { showPopup } from 'src/redux/slice/Popup/Result-test'
import { IQuizSetting } from 'src/type'
import { IQuestion } from 'src/type/course/Question'
import { CoursesAPI } from '../../../../pages/api/courses/index'
import ModalExplanationPackage from '../ModalExplanationPackage'
import QuizComponent, { QuizComponentRef } from './QuizComponent'

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

interface IAnswers {
  answers: IAnswer[]
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
  reload,
  grading_method,
  refreshTab,
}: Props): JSX.Element => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityQuizReducer)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const questionRef = useRef<QuizComponentRef>(null)

  const questionsList = selector[activityId]?.[tabId]?.[quizId]?.questions || []

  const activeQuestion = questionsList[activeQuestionIndex]
  const isLastQuestion = activeQuestionIndex === questions.length - 1
  const isQuestionConfirmed = activeQuestion?.confirmed

  const [runHandleFinishQuiz, setRunHandleFinishQuiz] = useState<number>(1)

  const [loading, setLoading] = useState<boolean>(false)
  const [resultId, setResultId] = useState<string>('')
  const [openGradedReport, setOpenGradedReport] = useState<boolean>(false)

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

  useEffect(() => {
    ;(async () => {
      if (questions?.[0]) {
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
  }, [questions, dispatch])

  useEffect(() => {
    if (runHandleFinishQuiz > 1) {
      setOpenFinishQuiz(true)
    }
  }, [runHandleFinishQuiz])

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
        } catch (error) {}
      }

      questionRef?.current?.reset()
    }
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
        } catch (error) {}
      }

      questionRef.current?.reset()
    }
  }

  const handleConfirmQuestion = (isFinish: boolean = false) => {
    setLoading(true)
    if (activeQuestion) {
      questionRef?.current?.onSubmit({
        activityId: activityId,
        tabId: tabId,
        quizId: quizId,
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
          if (e?.data?.class_user_score) {
            setTimeout(() => {
              dispatch(showPopup(e.data.class_user_score))
            }, 4000)
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

  // Test Unopend or Expired
  const getType = (startTime: Dayjs, endTime: Dayjs) => {
    if (startTime && dayjs().isBefore(startTime)) return 'unopened'
    if (endTime && dayjs().isAfter(dayjs(endTime))) return 'expired'
    return null
  }

  const type = getType(startTime, endTime)

  const BluredNotification = () => (
    <>
      {type !== null && (
        <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          {type === 'unopened' && (
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
          {type === 'expired' && (
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
          <div className="sapp-questions editor-wrap mce-content-body" id="">
            <div className="">
              <p>Câu hỏi số 1</p>
            </div>
          </div>
          <div className="body-modal-white -mt-2">
            <div id="hightlight_area">
              <div className="my-6 border border-b-gray-2"></div>
              <div className="mb-4 flex items-center">
                <div className="font-semibold">Exhibits (6)</div>
                <div className="ml-4">
                  <span className="text-state-error">* </span>
                  <span className="text-gray-1">Click to view</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="cursor-pointer hover:text-primary">
                  Exhibit 1: Quản lý nhân sự
                </div>
                <div className="cursor-pointer hover:text-primary">
                  Exhibit 2: email csv
                </div>
                <div className="cursor-pointer hover:text-primary">
                  Exhibit 3: csv semi
                </div>
                <div className="cursor-pointer hover:text-primary">
                  Exhibit 4: File Data mẫu
                </div>
                <div className="cursor-pointer hover:text-primary">
                  Exhibit 5: csv short
                </div>
              </div>
              <div className="my-6 border border-b-gray-2"></div>
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
          <div className="rounded bg-blur-green px-2 font-medium text-green-800">
            Finished Grading
          </div>
        )
      case GRADE_STATUS.AWAITING_GRADING:
        return (
          <div className="rounded  bg-blur-yellow px-2 font-medium text-amber-400">
            Awaiting Grading
          </div>
        )
      default:
        return (
          <div className="rounded bg-gray-200 px-2 font-medium text-gray-400">
            Manual Grading
          </div>
        )
    }
  }

  return (
    <div className="">
      <ConFirmSubmit
        open={openFinishQuiz}
        setOpen={setOpenFinishQuiz}
        handleSubmit={handleFinishQuiz}
        handleCancel={() => {}}
      />

      <div
        className={`text-black-1 h-[500px] select-none overflow-auto border border-gray-2 p-6 ${!!gradeStatus ? 'pointer-events-none opacity-100' : ''} `}
        data-aos={ANIMATION.DATA_AOS}
      >
        {type !== null && <BluredNotification />}
        {activeQuestion && type === null && (
          <QuizComponent
            activityId={activityId}
            tabId={tabId}
            quizId={quizId}
            showCorrect={grading_preference === 'AFTER_EACH_QUESTION'}
            activeQuestion={activeQuestion}
            ref={questionRef}
            key={quizComponentKey}
            document_id={document_id}
            setOpenFile={setOpenFile}
            grading_preference={grading_preference}
            showQuestionContent={false}
            isHideExhibit={false}
            saveAnswer={handleSaveAnswer}
          />
        )}
      </div>
      <div className="grid min-h-[50px] grid-cols-3 items-center gap-3 bg-gray-3 px-6 py-2">
        <div className="col-span-1 flex flex-wrap items-center gap-2">
          <div
            className={`${
              is_graded || 'invisible'
            } whitespace-nowrap   rounded bg-state-info bg-opacity-10 px-2 text-center  font-medium text-state-info`}
          >
            Graded Activity
          </div>
          {is_graded &&
            grading_method === GRADING_METHOD.MANUAL &&
            getGradedLabel(gradeStatus)}
        </div>

        {type === null && (
          <>
            <div className="col-span-1 mx-auto flex w-fit items-center gap-3">
              <button
                disabled={activeQuestionIndex === 0 || loading}
                className={`cursor-pointer select-none ${
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
                <SappIcon icon="arrow_left" />
              </button>
              Question: {activeQuestionIndex + 1} of {questions?.length || 0}
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
                <SappIcon icon="arrow_right" />
              </button>
            </div>
            <div className="col-span-1 flex flex-wrap items-center justify-end gap-2">
              {(isQuestionConfirmed ||
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
                      setRunHandleFinishQuiz((e) => e + 1)
                      handleSaveAnswer()
                      trackGAEvent('Click Button Finish Quiz Activity')
                      return
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
                    title={'View Answer'}
                    full={false}
                    size={'small'}
                    disabled={
                      (grading_method === GRADING_METHOD.MANUAL &&
                        !!gradeStatus) ||
                      loading
                    }
                    onClick={() => {
                      if (!loading) {
                        handleConfirmQuestion(false)
                      }
                      trackGAEvent('Click Button Confirm Quiz Activity')
                    }}
                    color="primary"
                    loading={loading}
                  />
                )}
            </div>
          </>
        )}
      </div>
      <SappModal
        open={modalResult?.status}
        okButtonCaption={'Yes'}
        cancelButtonCaption={'No'}
        handleCancel={() => setModalResult(undefined)}
        handleSubmit={() => setModalResult(undefined)}
        setOpen={() => setModalResult(undefined)}
        size="max-w-xxl"
        position="center"
        showFooter={false}
        isFullScreen={true}
        refClass="h-full md:px-6 px-5 pb-5 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all z-[100000]"
        showHeader={false}
      >
        <div className="m-auto max-w-screen-lg overflow-x-auto overflow-y-hidden px-6">
          <div
            className="absolute right-6 top-5  ml-auto cursor-pointer"
            onClick={() => {
              refreshTab()
              setModalResult(undefined)
            }}
          >
            <CloseIcon className="transform stroke-bw-1 transition-all duration-300 ease-in-out group-hover:stroke-primary" />
          </div>
          <QuizResultComponent
            questionResponse={modalResult?.questions || []}
            getTable={getTable}
            onShowDetail={handleShowQuestionResultDetail}
            loading={loading}
          />
        </div>
      </SappModal>

      <ModalExplanationPackage
        quizAttemptsAnswerId={showQuestionResultDetail?.id || ''}
        open={showQuestionResultDetail?.isOpen || false}
        setOpen={() => setShowQuestionResultDetail(undefined)}
      />
      <SappModalV3
        open={openGradedReport}
        okButtonCaption="Back"
        handleCancel={() => {}}
        onOk={() => {
          refreshTab()
          setOpenGradedReport(false)
        }}
        isMaskClosable={false}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<ConfirmIcon />}
        header={FINISHED_TEST_TITLE}
        content={`Congratulations on completing ${quizName}. The result will be sent to you via email after the grading is finished.`}
      />
    </div>
  )
}

export default QuizDocument
