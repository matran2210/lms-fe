import { StreamPlayerApi } from '@cloudflare/stream-react'
import SappModal from '@components/base/modal/SappModal'
import SAPPRadio from '@components/base/radiobutton/SAPPRadio'
import SAPPVideo from '@components/base/video/SAPPVideo'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { IQuestion, IVideo } from 'src/type/course/Question'
import QuizComponent from './QuizComponent'

type Props = {
  videos?: IVideo[]
}

interface IQuestionRef {
  onSubmit: (data: any) => Promise<void>
}
const VideoDocument = ({ videos }: Props) => {
  const [currentVideo, setCurrentVideo] = useState<IVideo>()
  const quizTimed = useRef<{ [key: string]: IQuestion[] }>()
  const currentTimeRef = useRef(-1)
  const [currentListQuestion, setCurrentListQuestion] = useState<IQuestion[]>(
    [],
  )
  const [shuffleQuiz, setShuffleQuiz] = useState<IQuestion[]>([])
  const [activeQuestion, setActiveQuestion] = useState<IQuestion>()

  const { control: controlAnswer, handleSubmit, reset } = useForm()

  const questionRef = useRef<IQuestionRef | null>(null)
  const streamRef = useRef<StreamPlayerApi>()

  const [results, setResults] = useState<{
    results: IQuestion
    corrects?: { [key: string]: boolean }
  }>()

  useEffect(() => {
    if (videos?.[0]) {
      handleSetCurrentVideo(videos?.[0])
    }
  }, [videos])

  const handleSetCurrentVideo = async (v: IVideo) => {
    try {
      if (v.quiz?.id) {
        const question = await CourseActivityApi.getQuestions(v.quiz?.id)
        if (question.success) {
          setShuffleQuiz(question.data.questions)
        }
      }
    } catch (error) {}
    setCurrentVideo(v)
    quizTimed.current = [
      ...(v?.quiz?.constructed_questions || []),
      ...(v?.quiz?.multiple_choice_questions || []),
    ].reduce(
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

  const handleOpenModalQuestions = async ({
    id,
    listQuestion,
  }: {
    id: string
    open: boolean
    listQuestion: any[]
  }) => {
    try {
      const newCurrentQuiz = shuffleQuiz.find((e) => e.id === id)
      if (newCurrentQuiz) {
        setActiveQuestion(newCurrentQuiz)
        setCurrentListQuestion(listQuestion)
      } else {
        setActiveQuestion(undefined)
        setCurrentListQuestion([])
      }
    } catch (error) {}
  }

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

  const handleOnTimeUpdate = () => {
    const currentTime = Math.floor(streamRef.current?.currentTime || 0)
    if (currentTimeRef.current !== currentTime) {
      currentTimeRef.current = currentTime
      handleTrackTime(currentTime)
    }
  }

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

  const onSubmit = async (data: any) => {
    questionRef.current?.onSubmit(data)
  }

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-x-10 gap-y-2 flex-wrap">
        {videos?.map((v, i) => {
          return (
            <label
              className=" flex items-center gap-2 cursor-pointer"
              key={v.file.id}
            >
              <SAPPRadio
                onChange={() => handleSetCurrentVideo(v)}
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
      <div className="relative">
        <div>
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
              <QuizComponent
                ref={questionRef}
                activeQuestion={activeQuestion}
                controlAnswer={controlAnswer}
                {...results}
                setResults={setResults}
              ></QuizComponent>
            </div>
          </SappModal>
        </div>
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
