import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  courseActivityQuizReducer,
  fetchQuestionById,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz' // Import confirmQuestion from quizSlice

import { StreamPlayerApi } from '@cloudflare/stream-react'
import SappModal from '@components/base/modal/SappModal'
import SAPPRadio from '@components/base/radiobutton/SAPPRadio'
import SAPPVideo from '@components/base/video/SAPPVideo'
import { debounce } from '@utils/helpers'
import SappIcon from 'src/common/SappIcon'
import { IQuestion, IVideo } from 'src/type/course/Question'
import QuizComponent from './QuizComponent'

type Props = {
  videos?: IVideo[]
  activityId: string
  tabId: string
  quizId: string
}

/**
 * VideoDocument component for displaying and interacting with videos and quiz questions.
 * @component
 * @param {Props} props - The properties of the component.
 * @param {IVideo[]} props.videos - List of videos to be displayed.
 */
const VideoDocument = ({ videos, activityId, tabId, quizId }: Props) => {
  const [currentVideo, setCurrentVideo] = useState<IVideo>()
  const quizTimed = useRef<{ [key: string]: IQuestion[] }>()
  const currentTimeRef = useRef(-1)
  const [currentListQuestion, setCurrentListQuestion] = useState<IQuestion[]>(
    [],
  )
  const [activeQuestion, setActiveQuestion] = useState<IQuestion>()

  const { control: controlAnswer, handleSubmit, reset, setValue } = useForm()

  const streamRef = useRef<StreamPlayerApi>()

  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityQuizReducer)
  const questionsList = selector[activityId]?.[tabId]?.[quizId]?.questions || []

  const [results, setResults] = useState<{
    results: IQuestion
    corrects?: { [key: string]: boolean }
  }>()

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
    const listQuestion = [
      ...(v?.quiz?.constructed_questions || []),
      ...(v?.quiz?.multiple_choice_questions || []),
    ]
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
   * @param {IQuestion[]} params.listQuestion - List of quiz questions.
   */
  const handleOpenModalQuestions = async ({
    id,
    listQuestion,
  }: {
    id: string
    open: boolean
    listQuestion: any[]
  }) => {
    try {
      try {
        if (listQuestion?.[0]) {
          dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: listQuestion?.[0].id || '',
            }),
          ).then((e: any) => {
            if (e.payload.question) {
              setActiveQuestion(e.payload.question)
              setCurrentListQuestion(listQuestion)
            } else {
              setActiveQuestion(undefined)
              setCurrentListQuestion([])
            }
          })
        }
      } catch (error) {}
    } catch (error) {}
  }

  /**
   * Tracks the time of the video and opens the modal for quiz questions if necessary.
   * @param {number} time - The current time of the video.
   * @returns {boolean} - Returns true if a quiz question is opened; otherwise, false.
   */
  const handleTrackTime = (time: number) => {
    if (quizTimed.current?.[time]?.[0]?.id) {
      handleOpenModalQuestions({
        id: quizTimed.current?.[time][0].id || '',
        open: true,
        listQuestion: quizTimed.current?.[time],
      })
      streamRef.current?.pause()
      setCurrentListQuestion(quizTimed.current?.[time])
      return true
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
    quizId,
    listQuestion,
  }: {
    quizId?: string
    listQuestion: IQuestion[]
  }) => {
    if (quizId) {
      var elementPos = listQuestion
        ?.map(function (x) {
          return x.id
        })
        .indexOf(quizId)
      const nextQuestionId = listQuestion[elementPos + 1]?.id
      if (nextQuestionId) {
        handleOpenModalQuestions({
          id: '',
          open: false,
          listQuestion: [],
        })
        setTimeout(() => {
          handleOpenModalQuestions({
            id: nextQuestionId,
            open: true,
            listQuestion,
          })
        }, 500)
        return
      }
    }

    handleOpenModalQuestions({
      id: '',
      open: false,
      listQuestion: [],
    })
    setResults(undefined)
    reset()
  }

  /**
   * Handles form submission.
   * @param {Object} data - Form data.
   */
  const onSubmit = async (data: any) => {
    // questionRef.current?.onSubmit(data)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-primary gap-x-10 gap-y-2 flex-wrap">
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
        <div className="flex items-center select-none cursor-pointer">
          <span className="mr-2">Timeline</span>
          {/* Icon for course video timeline */}
          <SappIcon icon="course_video_timeline"></SappIcon>
        </div>
      </div>
      <div className="relative">
        <div>
          {/* Modal for quiz questions */}
          <SappModal
            open={!!activeQuestion}
            customTitle={
              <div className="text-xl font-bold text-bw-1">Question</div>
            }
            okButtonCaption="Submit"
            {...(results
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
            handleSubmit={handleSubmit(onSubmit)}
            handleCancel={() =>
              handleClose({
                quizId: activeQuestion?.id,
                listQuestion: currentListQuestion,
              })
            }
            colorCancel="secondary"
          >
            <div className="py-5">
              {/* Quiz component for displaying and interacting with quiz questions */}
              <QuizComponent
                activeQuestion={activeQuestion}
                controlAnswer={controlAnswer}
                setValue={setValue}
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
