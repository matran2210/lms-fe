import { memo, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  IActivityStateQuestion,
  courseActivityQuizReducer,
  fetchQuestionById,
  selectQuestions,
  submitQuiz,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz' // Import confirmQuestion from quizSlice

import SappModal from '@components/base/modal/SappModal'
import SAPPRadio from '@components/base/radiobutton/SAPPRadio'
import SAPPVideo from '@components/base/video/SAPPVideo'
import { formatTime, htmlToRaw } from '@components/common/timer'
import { debounce } from '@utils/helpers'
import {
  IQuestionResult,
  IQuestionResultResponse,
} from 'quiz-result-package/dist/type'
import SappIcon from 'src/common/SappIcon'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { IQuestion, IVideo } from 'src/type/course/Question'
import QuizComponent, { QuizComponentRef } from './QuizComponent'
import { video_url } from '@utils/constants'

type Props = {
  videos?: IVideo[]
  activityId: string
  tabId: string
  streamRefProp?: any
  handleProcess?: () => void
  document_id: string
  quizId: string
  grading_preference: 'AFTER_EACH_QUESTION' | 'AFTER_ALL_QUESTIONS'
  class_user_id?: string
}

/**
 * VideoDocument component for displaying and interacting with videos and quiz questions.
 * @component
 * @param {Props} props - The properties of the component.
 * @param {IVideo[]} props.videos - List of videos to be displayed.
 */
const VideoDocument = ({
  videos,
  activityId,
  tabId,
  streamRefProp,
  handleProcess,
  document_id,
  quizId,
  grading_preference,
  class_user_id,
}: Props) => {
  const [currentVideo, setCurrentVideo] = useState<IVideo>()
  const quizTimed = useRef<{ [key: string]: IQuestion[] }>()
  const currentTimeRef = useRef(-1)
  const [currentListQuestion, setCurrentListQuestion] = useState<IQuestion[]>(
    [],
  )
  const selector = useAppSelector(courseActivityQuizReducer)
  const questionRef = useRef<QuizComponentRef>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<IActivityStateQuestion>()
  const [isConfirmQuestion, setIsConfirmQuestion] = useState<boolean>(false)
  const [lastQuestion, setLastQuestion] = useState<IQuestion>()
  const { handleSubmit, reset } = useForm()
  const internalRef = useRef<any>()
  const streamRef = streamRefProp?.current ? streamRefProp : internalRef
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (videos?.[0]) {
      debouncedHandleSetCurrentVideo?.current(videos?.[0])
    }
  }, [])

  useEffect(() => {
    if (handleProcess && streamRef?.current?.paused === false) {
      handleProcess()
    }
  }, [streamRef?.current?.paused])

  useEffect(() => {
    if (activeQuestion?.id) {
      dispatch(
        fetchQuestionById({
          activityId: activityId,
          tabId: tabId,
          quizId: currentVideo?.quiz?.id || '',
          questionId: activeQuestion?.id,
        }),
      )
        .unwrap()
        .then((e: any) => {
          if (e.question) {
            setActiveQuestion(e.question)
          }
        })
    }
  }, [isConfirmQuestion])

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

    if (listQuestion.length) {
      setLastQuestion(listQuestion[listQuestion.length - 1])
    }
    // setDefaultListQuestion(listQuestion)
    setCurrentVideo(v)
    quizTimed.current = listQuestion.reduce(
      (obj, e) => {
        if (e.time !== undefined && e.id !== undefined) {
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
        await dispatch(
          fetchQuestionById({
            activityId: activityId,
            tabId: tabId,
            quizId: currentVideo?.quiz?.id || '',
            questionId: id,
          }),
        )
          .unwrap()
          .then((e: any) => {
            if (e.question) {
              setCurrentListQuestion(listQuestion)
              setActiveQuestion(e.question)
              setModalOpen(true)
              setHideVideo(true)
            }
          })
      } else {
        setCurrentListQuestion([])
        setModalOpen(false)
        setHideVideo(false)
      }
    } catch (error) {}
  }

  /**
   * Tracks the time of the video and opens the modal for quiz questions if necessary.
   * @param {number} time - The current time of the video.
   * @param {string} questionId - The ID of the quiz question to find.
   * @returns {boolean} - Returns true if a quiz question is opened; otherwise, false.
   */
  const [hideVideo, setHideVideo] = useState(false)
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
    streamRef.current?.play()
    setCurrentListQuestion([])
    setIsConfirmQuestion(false)
    reset()
  }

  /**
   * Handles form submission.
   * @param {boolean} isCorrect - Check the correct or incorrect answers.
   */
  const onSubmit = async (isCorrect: boolean = false) => {
    try {
      if (isConfirmQuestion || isCorrect) {
        handleClose({
          questionId: activeQuestion?.id,
          listQuestion: currentListQuestion,
        })
      } else {
        questionRef.current?.onSubmit({
          activityId: activityId,
          tabId: tabId,
          quizId: currentVideo?.quiz?.id || '',
          then: (event: any) => {
            setIsConfirmQuestion(true)
          },
        })
      }
    } catch (error) {}
  }

  const handleGoTimeline = (time: number) => {
    if (streamRef.current) {
      streamRef.current.currentTime = time
    }
  }

  const timeLine = [...(currentVideo?.file?.resource?.time_line || [])].sort(
    (a, b) => (Number(a.time) || 0) - (Number(b.time) || 0),
  )

  const timeQuiz = Object.values(quizTimed?.current || [])

  return (
    <div>
      <div className="flex items-center justify-between text-primary gap-x-10 gap-y-2 mb-2.5">
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
                <span
                  className={`radio-item-label  ${
                    v.file.id === currentVideo?.file.id
                      ? 'text-bw-1'
                      : 'text-gray-1'
                  }`}
                >
                  Video {i + 1}
                </span>
              </label>
            )
          })}
        </div>
        <div className="flex items-center select-none cursor-pointer relative z-30 group">
          {(currentVideo?.file?.resource?.time_line?.length as number) > 0 ? (
            <>
              <span className="mr-2 text-bw-1 group-hover:text-primary">
                Timeline
              </span>
              {/* Icon for course video timeline */}
              <SappIcon
                className="fill-bw-1 group-hover:fill-primary"
                icon="course_video_timeline"
              ></SappIcon>
            </>
          ) : (
            <></>
          )}

          <div className="py-3 overflow-hidden animate-fade-in-overlay group-hover:block absolute bottom-0 w-[412px] max-w-[100px]: -right-[3px] bg-white translate-y-full shadow-single-dialog hidden">
            <div className="snap-y flex-1 overflow-y-auto bg-white h-full max-h-[412px]">
              {timeLine.map((e, i) => {
                return (
                  <div
                    key={i}
                    className="hover:bg-gray-4 mx-3 gap-3 text-medium-sm grid p-3 hover:text-primary-2 text-bw-1 grid-cols-[1.3fr,6fr]"
                    onClick={() => {
                      handleGoTimeline(e.time)
                    }}
                  >
                    <div className="text-state-info mim-w-[62px]">
                      {formatTime(e.time)}
                    </div>
                    <div className="text-bw-1 line-clamp-2 text-inherit">
                      {htmlToRaw(e.text)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <SAPPVideo
          streamRef={streamRef}
          options={{
            onTimeUpdate: handleOnTimeUpdate,
            src:
              currentVideo?.file?.resource?.url
                ?.replace(video_url || '', '')
                .replace('/manifest/video.m3u8', '') || '',
          }}
          pauseOnSeek={true}
          hideVideo={hideVideo}
          openQuestion={modalOpen}
          timeQuiz={timeQuiz}
        >
          {/* Modal for quiz questions */}
          <SappModal
            open={modalOpen}
            customTitle={
              <div className="!text-xl font-bold text-bw-1">Question</div>
            }
            parentChildClass="snap-y flex-1 overflow-y-scroll bg-white -mr-4.5"
            okButtonCaption={`${
              isConfirmQuestion || activeQuestion?.corrects
                ? lastQuestion?.id === activeQuestion?.id
                  ? 'Finish'
                  : 'Next'
                : 'Confirm'
            }`}
            buttonSize="small"
            size="max-w-full"
            position="center"
            isInner={true}
            isBordered={true}
            okButtonClass="!w-20 h-8.5 !px-0"
            cancelButtonClass="!w-20 h-8.5 !px-0 !w-fit"
            footerButtonClassName="!justify-between flex"
            handleSubmit={handleSubmit((e) =>
              onSubmit(activeQuestion?.corrects ? true : false),
            )}
            handleCancel={() => {
              handleClose({
                questionId: activeQuestion?.id,
                listQuestion: currentListQuestion,
              })
            }}
            closeAfterSubmit={false}
            colorCancel="textUnderline"
            cancelButtonCaption="Skip"
          >
            <div className="py-5">
              <QuizComponent
                activityId={activityId}
                tabId={tabId}
                quizId={quizId}
                ref={questionRef}
                activeQuestion={activeQuestion}
                showCorrect={true}
                document_id={document_id}
                grading_preference={grading_preference}
              ></QuizComponent>
            </div>
          </SappModal>
        </SAPPVideo>
      </div>
    </div>
  )
}

export default memo(VideoDocument)
