import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  IActivityStateQuestion,
  courseActivityQuizReducer,
  fetchQuestionById,
  selectQuestions,
  submitQuestion,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz' // Import confirmQuestion from quizSlice

import { StreamPlayerApi } from '@cloudflare/stream-react'
import SappModal from '@components/base/modal/SappModal'
import SAPPRadio from '@components/base/radiobutton/SAPPRadio'
import SAPPVideo from '@components/base/video/SAPPVideo'
import { formatTime, htmlToRaw } from '@components/common/timer'
import { debounce } from '@utils/helpers'
import SappIcon from 'src/common/SappIcon'
import { IQuestion, IVideo } from 'src/type/course/Question'
import QuizComponent, { QuizComponentRef } from './QuizComponent'
import toast from 'react-hot-toast'

type Props = {
  videos?: IVideo[]
  activityId: string
  tabId: string
}

/**
 * VideoDocument component for displaying and interacting with videos and quiz questions.
 * @component
 * @param {Props} props - The properties of the component.
 * @param {IVideo[]} props.videos - List of videos to be displayed.
 */
const VideoDocument = ({ videos, activityId, tabId }: Props) => {
  const [currentVideo, setCurrentVideo] = useState<IVideo>()
  const quizTimed = useRef<{ [key: string]: IQuestion[] }>()
  const currentTimeRef = useRef(-1)
  const [currentListQuestion, setCurrentListQuestion] = useState<IQuestion[]>(
    [],
  )
  const [defaultListQuestion, setDefaultListQuestion] = useState<IQuestion[]>(
    [],
  )
  const selector = useAppSelector(courseActivityQuizReducer)
  // const questionsList = selector[activityId]?.[tabId]?.[quizId]?.questions || []
  const questionRef = useRef<QuizComponentRef>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<IActivityStateQuestion>()
  const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false)
  const { handleSubmit, reset } = useForm()
  const streamRef = useRef<StreamPlayerApi>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (videos?.[0]) {
      debouncedHandleSetCurrentVideo?.current(videos?.[0])
    }
  }, [])

  /**
   * Handles setting the current video and fetching quiz questions.
   * @param {IVideo} v - The selected video.
   * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
   */
  const handleSetCurrentVideo = async (v: IVideo): Promise<void> => {
    handleOpenModalQuestions({
      id: '',
      open: false,
      listQuestion: [],
    })
    setModalOpen(false)

    const listQuestion = [
      ...(v?.quiz?.constructed_questions || []),
      ...(v?.quiz?.multiple_choice_questions || []),
    ]
    setDefaultListQuestion(listQuestion)
    setCurrentVideo(v)
    quizTimed.current = listQuestion.reduce(
      (obj, e) => {
        if (e.time && e.id) {
          if (!obj[e.time]) {
            obj[e.time] = []
          }
          obj[e.time].push(e)
        }
        return obj
      },
      {} as { [key: string]: IQuestion[] },
    )
  }
  const debouncedHandleSetCurrentVideo = useRef(
    debounce(handleSetCurrentVideo, 500),
  )

  /**
   * Opens the modal with quiz questions based on the provided parameters.
   * @param {Object} params - Parameters for opening the modal.
   * @param {string} params.id - The ID of the quiz.
   * @param {boolean} params.open - Flag to open or close the modal.
   * @param {IQuestion[]} params.listQuestion - List of quiz questions with the same time.
   */
  const handleOpenModalQuestions = async ({
    id,
    open,
    listQuestion,
  }: {
    id: string
    open: boolean
    listQuestion: IQuestion[]
  }) => {
    try {
      if (open) {
        dispatch(
          fetchQuestionById({
            activityId: activityId,
            tabId: tabId,
            quizId: currentVideo?.quiz?.id || '',
            questionId: id,
          }),
        ).then((e: any) => {
          if (e.payload.question) {
            setCurrentListQuestion(listQuestion)
            setActiveQuestion(e.payload.question)
            setModalOpen(true)
          }
        })
      } else {
        setCurrentListQuestion([])
        setModalOpen(false)
      }
    } catch (error) {}
  }

  /**
   * Tracks the time of the video and opens the modal for quiz questions if necessary.
   * @param {number} time - The current time of the video.
   * @param {string} questionId - The ID of the quiz question to find.
   * @returns {boolean} - Returns true if a quiz question is opened; otherwise, false.
   */
  const handleTrackTime = (time: number, questionId?: string) => {
    const quizAtTime = quizTimed.current?.[time]

    if (quizAtTime && quizAtTime.length > 0) {
      let foundQuestion = null

      if (questionId) {
        foundQuestion = quizAtTime.find(
          (question) => question.id === questionId,
        )
      } else {
        foundQuestion = quizAtTime[0]
      }
      if (foundQuestion) {
        handleOpenModalQuestions({
          id: foundQuestion.id || '',
          open: true,
          listQuestion: questionId ? [foundQuestion] : quizAtTime,
        })
        streamRef.current?.pause()
        setCurrentListQuestion(quizAtTime)
        return true
      }
    }

    setCurrentListQuestion([])
    return false
  }

  /**
   * Handles the time update event of the video.
   */
  const handleOnTimeUpdate = () => {
    const currentTime = Math.floor(streamRef.current?.currentTime || 0)
    if (currentTimeRef.current !== currentTime) {
      currentTimeRef.current = currentTime
      handleTrackTime(currentTime)
    }
  }

  /**
   * Closes the modal and performs necessary actions based on the parameters.
   * @param {Object} params - Parameters for closing the modal.
   * @param {string} [params.quizId] - The ID of the quiz.
   * @param {IQuestion[]} params.listQuestion - List of quiz questions.
   */
  const handleClose = ({
    questionId,
    listQuestion,
  }: {
    questionId?: string
    listQuestion: IQuestion[]
  }) => {
    if (questionId) {
      const currentIndex = listQuestion.map((q) => q.id).indexOf(questionId)
      const nextQuestionId = listQuestion[currentIndex + 1]?.id

      // Close the modal
      handleOpenModalQuestions({
        id: '',
        open: false,
        listQuestion: [],
      })
      setModalOpen(false)

      if (nextQuestionId) {
        // Open the modal for the next question at the same time
        setTimeout(() => {
          handleOpenModalQuestions({
            id: nextQuestionId,
            open: true,
            listQuestion,
          })
          setModalOpen(true)
        }, 500)
        return
      }
    }

    // Close the modal and reset
    // setActiveQuestionIndex(-1)
    setCurrentListQuestion([])

    reset()
  }

  /**
   * Handles form submission.
   * @param {Object} data - Form data.
   */
  const onSubmit = async (data: any) => {
    questionRef.current?.onSubmit({
      activityId: activityId,
      tabId: tabId,
      quizId: currentVideo?.quiz?.id || '',
    })
  }

  const newQuestion = useMemo(() => {
    const questions = selectQuestions(
      selector,
      activityId,
      tabId,
      currentVideo?.quiz?.id || '',
    )
    const currentQuestion = questions?.find((e) => e.id === activeQuestion?.id)

    // Check if the current question is the last one
    const isLast =
      currentQuestion &&
      defaultListQuestion?.findIndex((e) => e.id === currentQuestion.id) ===
        (defaultListQuestion?.length || 0) - 1

    // Update isLastQuestion state
    setIsLastQuestion(isLast || false)

    return currentQuestion
  }, [selector, activeQuestion, activityId, tabId, currentVideo?.quiz?.id])

  const handleFinishQuiz = () => {
    const questions = selectQuestions(
      selector,
      activityId,
      tabId,
      currentVideo?.quiz?.id || '',
    )
    const {
      answers,
      quiz_position_mapping,
    }: { answers: any[]; quiz_position_mapping: any[] } = questions?.reduce(
      (acc: any, obj: any) => {
        if (obj?.myAnswers) {
          acc.answers = acc.answers.concat(obj.myAnswers)
        }

        if (obj?.quiz_position_mapping) {
          acc.quiz_position_mapping = acc.quiz_position_mapping.concat(
            obj.quiz_position_mapping,
          )
        }

        return acc
      },
      { answers: [] as any[], quiz_position_mapping: [] as any[] },
    )

    try {
      dispatch(
        submitQuestion({
          id: currentVideo?.quiz?.id || '',
          data: { answers, quiz_position_mapping },
        }),
      )
        .unwrap()
        .then(() => {
          toast.success('Nộp bài thành công!')
        })
    } catch (error) {}
  }

  return (
    <div>
      <div className="flex items-center justify-between text-primary gap-x-10 gap-y-2 mb-3">
        <div className="flex items-center gap-x-10 gap-y-2 flex-wrap">
          {videos?.map((v, i) => {
            return (
              <label
                className=" flex items-center gap-2 select-none cursor-pointer"
                key={v.file.id}
              >
                {/* Radio button for video selection */}
                <SAPPRadio
                  onChange={() => debouncedHandleSetCurrentVideo.current(v)}
                  {...(v.file.id === currentVideo?.file.id
                    ? {
                        checked: true,
                      }
                    : { checked: false })}
                  size={'small'}
                ></SAPPRadio>
                <span className="radio-item-label">Video {i + 1}</span>
              </label>
            )
          })}
        </div>
        <div className="flex items-center select-none cursor-pointer relative z-[9999] group">
          <span className="mr-2">Timeline</span>
          {/* Icon for course video timeline */}
          <SappIcon icon="course_video_timeline"></SappIcon>
          <div className="py-3 overflow-hidden animate-fade-in-overlay group-hover:block absolute bottom-0 w-[412px] max-w-[100$]: -right-[3px] bg-white translate-y-full shadow-single-dialog hidden">
            <div className="snap-y flex-1 overflow-y-auto bg-white h-full max-h-[412px]">
              {[
                ...(currentVideo?.quiz?.constructed_questions || []),
                ...(currentVideo?.quiz?.multiple_choice_questions || []),
              ]
                .sort((a, b) => (Number(a.time) || 0) - (Number(b.time) || 0))
                .map((e) => {
                  return (
                    <div
                      key={e.id}
                      className="gap-3 text-medium-sm flex px-6 py-3 hover:bg-primary-2"
                      onClick={() => {
                        handleOpenModalQuestions({
                          id: '',
                          open: false,
                          listQuestion: [],
                        })
                        setTimeout(() => {
                          handleTrackTime(Number(e.time), e.id)
                        }, 500)
                      }}
                    >
                      <div className="text-state-info flex-none">
                        {formatTime(e.time)}
                      </div>
                      <div className="text-bw-1 line-clamp-2 ">
                        {htmlToRaw(e.question_content)}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div>
          {/* Modal for quiz questions */}
          <SappModal
            open={modalOpen}
            customTitle={
              <div className="text-xl font-bold text-bw-1">Question</div>
            }
            okButtonCaption={`${
              newQuestion?.confirmed && isLastQuestion ? 'Finish' : 'Submit'
            }`}
            {...(newQuestion?.confirmed && !isLastQuestion
              ? {
                  cancelButtonCaption: 'Close',
                  confirmOnclose: false,
                  showOkButton: false,
                }
              : {
                  confirmOnclose: true,
                  showOkButton: true,
                  closeAfterSubmit: false,
                })}
            buttonSize="small"
            size="max-w-[750px]"
            position="center"
            isInner={true}
            isBordered={true}
            okButtonClass="!w-20 h-8.5 !px-0"
            cancelButtonClass="!w-20 h-8.5 !px-0"
            handleSubmit={
              newQuestion?.confirmed && isLastQuestion
                ? handleFinishQuiz
                : handleSubmit(onSubmit)
            }
            handleCancel={() =>
              handleClose({
                questionId: activeQuestion?.id,
                listQuestion: currentListQuestion,
              })
            }
            colorCancel="secondary"
          >
            <div className="py-5">
              <QuizComponent
                ref={questionRef}
                activeQuestion={activeQuestion}
              ></QuizComponent>
            </div>
          </SappModal>
        </div>
        {/* Video player component */}
        <SAPPVideo
          streamRef={streamRef}
          options={{
            onTimeUpdate: handleOnTimeUpdate,
            src:
              currentVideo?.file?.resource?.url
                .replace(
                  'https://customer-qf43f9e6huohhr1o.cloudflarestream.com/',
                  '',
                )
                .replace('/manifest/video.m3u8', '') || '',
          }}
          pauseOnSeek={true}
        ></SAPPVideo>
      </div>
    </div>
  )
}

export default VideoDocument
