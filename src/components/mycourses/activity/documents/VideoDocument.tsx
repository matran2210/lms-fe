import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  confirmQuestion,
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
import { formatTime, htmlToRaw } from '@components/common/timer'

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

  const selector = useAppSelector(courseActivityQuizReducer)

  const {
    control: controlAnswer,
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm()

  const streamRef = useRef<StreamPlayerApi>()

  const dispatch = useAppDispatch()
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
      if (!id) {
        setActiveQuestion(undefined)
        setCurrentListQuestion([])
      }
      try {
        if (listQuestion?.[0]) {
          dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: id,
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
   * @param {string} questionId - The ID of the quiz question to find.
   * @returns {boolean} - Returns true if a quiz question is opened; otherwise, false.
   */
  const handleTrackTime = (time: number, questionId?: string) => {
    const quizAtTime = quizTimed.current?.[time]

    if (quizAtTime && quizAtTime.length > 0) {
      const foundQuestion = questionId
        ? quizAtTime.find((question) => question.id === questionId)
        : quizAtTime[0]

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
    if (activeQuestion?.id) {
      dispatch(
        confirmQuestion({
          activityId: activityId,
          tabId: tabId,
          quizId: quizId,
          questionId: activeQuestion?.id,
          myAnswers: getValues(),
        }),
      ).then((e: any) => {
        setActiveQuestion(e.payload.question)
        // handleClose({
        //   quizId: activeQuestion?.id,
        //   listQuestion: currentListQuestion,
        // })
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between text-primary gap-x-10 gap-y-2 flex-wrap">
        {videos?.map((v, i) => {
          return (
            <label
              className=" flex items-center gap-2 select-none cursor-pointer mb-3"
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
              <QuizComponent activeQuestion={activeQuestion}></QuizComponent>
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
