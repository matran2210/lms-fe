import { QuizComponentRef } from '@components/mycourses/activity/documents/QuizComponent'
import { fetchQuestionById, IActivityStateQuestion } from '@lms/contexts'
import { IQuestion, ITestServiceAPI, IVideo } from '@lms/core'
import { SAPPVideo } from '@lms/ui'
import { CoursesAPI } from '@pages/api/courses'
import { debounce } from '@utils/helpers'
import { memo, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from 'src/redux/hook'
import QuizModal from './QuizModal'
import VideoSelector from './VideoSelector'
import VideoTimeline from './VideoTimeLine'

type Props = {
  videos?: IVideo[]
  activityId: string
  tabId: string
  streamRefProp?: React.RefObject<HTMLVideoElement>
  handleProcess?: (file_id: string, course_tab_document_id: string) => void
  document_id: string
  quizId: string
  grading_preference: 'AFTER_EACH_QUESTION' | 'AFTER_ALL_QUESTIONS'
  class_user_id?: string
}

const VideoSection = ({
  videos,
  activityId,
  tabId,
  streamRefProp,
  handleProcess,
  document_id,
  quizId,
  grading_preference,
}: Props) => {
  const [currentVideo, setCurrentVideo] = useState<IVideo>(
    videos && videos.length > 0 ? videos[0] : ({} as IVideo),
  )
  const quizTimed = useRef<{ [key: string]: IQuestion[] }>()
  const currentTimeRef = useRef(-1)
  const [currentListQuestion, setCurrentListQuestion] = useState<IQuestion[]>(
    [],
  )

  const questionRef = useRef<QuizComponentRef>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<IActivityStateQuestion>()
  const [isConfirmQuestion, setIsConfirmQuestion] = useState<boolean>(false)

  const { reset } = useForm()
  const internalRef = useRef<HTMLVideoElement>(null)
  const streamRef = streamRefProp?.current ? streamRefProp : internalRef
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (videos?.[0]) {
      debouncedHandleSetCurrentVideo?.current(videos?.[0])
    }
  }, [])

  useEffect(() => {
    if (handleProcess && streamRef?.current?.paused === false) {
      handleProcess(currentVideo?.file?.id, document_id)
    }
  }, [streamRef?.current?.paused])

  useEffect(() => {
    if (activeQuestion?.id) {
      dispatch(
        fetchQuestionById({
          api: TestServiceAPI,
          courseApi: CoursesAPI,
          activityId,
          tabId,
          quizId: currentVideo?.quiz?.id || '',
          questionId: activeQuestion?.id,
        }),
      )
        .unwrap()
        .then((e) => {
          if (e?.question) {
            setActiveQuestion(e.question as IActivityStateQuestion)
          }
        })
    }
  }, [isConfirmQuestion])

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

    setCurrentVideo(v)
    quizTimed.current = listQuestion.reduce(
      (obj, e) => {
        if (e?.time !== undefined && e?.id !== undefined) {
          if (!obj?.[e?.time]) {
            obj[e.time] = []
          }
          obj?.[e?.time]?.push(e)
        }
        return obj
      },
      {} as { [key: string]: IQuestion[] },
    )
  }
  const debouncedHandleSetCurrentVideo = useRef(
    debounce(handleSetCurrentVideo, 500),
  )

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
            api: TestServiceAPI,
            courseApi: CoursesAPI,
            activityId: activityId,
            tabId: tabId,
            quizId: currentVideo?.quiz?.id || '',
            questionId: id,
          }),
        )
          .unwrap()
          .then((e) => {
            if (e?.question) {
              setCurrentListQuestion(listQuestion)
              setActiveQuestion(e?.question as IActivityStateQuestion)
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

  const [hideVideo, setHideVideo] = useState(false)

  const handleTrackTime = (time: number, questionId?: string) => {
    const quizAtTime = quizTimed?.current?.[time]
    if (quizAtTime && quizAtTime?.length > 0) {
      let foundQuestion = null

      if (questionId) {
        foundQuestion = quizAtTime?.find(
          (question) => question?.id === questionId,
        )
      } else {
        foundQuestion = quizAtTime?.[0]
      }
      if (foundQuestion) {
        handleOpenModalQuestions({
          id: foundQuestion?.id || '',
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

  const handleOnTimeUpdate = () => {
    const currentTime = Math.floor(streamRef?.current?.currentTime || 0)
    if (currentTimeRef.current !== currentTime) {
      currentTimeRef.current = currentTime
      handleTrackTime(currentTime)
    }
  }

  const handleClose = ({
    questionId,
    listQuestion,
  }: {
    questionId?: string
    listQuestion: IQuestion[]
  }) => {
    if (questionId) {
      const currentIndex = listQuestion?.map((q) => q?.id)?.indexOf(questionId)
      const nextQuestionId = listQuestion?.[currentIndex + 1]?.id

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

    streamRef.current?.play()
    setCurrentListQuestion([])
    setIsConfirmQuestion(false)
    reset()
  }

  const onSubmit = async (isCorrect: boolean = false) => {
    try {
      if (isConfirmQuestion || isCorrect) {
        handleClose({
          questionId: activeQuestion?.id,
          listQuestion: currentListQuestion,
        })
      } else {
        questionRef?.current?.onSubmit({
          activityId: activityId,
          tabId: tabId,
          quizId: currentVideo?.quiz?.id || '',
          then: () => {
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

  const timeLine = [...(currentVideo?.file?.resource?.time_line || [])]?.sort(
    (a, b) => (Number(a?.time) || 0) - (Number(b.time) || 0),
  )

  const timeQuiz = Object.values(quizTimed?.current || [])

  const atLastQuestion =
    timeQuiz?.[timeQuiz?.length - 1]?.find(
      (quiz) => quiz?.id === activeQuestion?.id,
    )?.id === activeQuestion?.id

  const [finishAll, setFinishAll] = useState<boolean>(false)

  useEffect(() => {
    if (atLastQuestion && isConfirmQuestion) {
      setFinishAll(true)
    }
  }, [atLastQuestion, isConfirmQuestion])

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-x-10 gap-y-2 text-primary">
        <VideoSelector
          videos={videos || []}
          currentVideoId={currentVideo?.file?.id}
          onSelectVideo={debouncedHandleSetCurrentVideo.current}
        />
        <VideoTimeline timeLine={timeLine} onGoTimeline={handleGoTimeline} />
      </div>

      <div className="relative">
        <SAPPVideo
          streamRef={streamRef}
          options={{
            onTimeUpdate: handleOnTimeUpdate,
            src:
              currentVideo?.file?.resource?.url
                ?.replace(process.env.NEXT_PUBLIC_VIDEO_URL || '', '')
                .replace('/manifest/video.m3u8', '') || '',
          }}
          pauseOnSeek={true}
          hideVideo={hideVideo}
          openQuestion={modalOpen}
          timeQuiz={timeQuiz}
          thumbnail={currentVideo?.file?.resource?.thumbnail}
        >
          <QuizModal
            modalOpen={modalOpen}
            onSubmit={() => onSubmit(activeQuestion?.corrects ? true : false)}
            onCancel={() => {
              handleClose({
                questionId: activeQuestion?.id,
                listQuestion: currentListQuestion,
              })
            }}
            finishAll={finishAll}
            isConfirmQuestion={isConfirmQuestion}
            questionRef={questionRef}
            activeQuestion={activeQuestion}
            activityId={activityId}
            tabId={tabId}
            quizId={quizId}
            document_id={document_id}
            grading_preference={grading_preference}
          />
        </SAPPVideo>
      </div>
    </div>
  )
}

export default memo(VideoSection)
