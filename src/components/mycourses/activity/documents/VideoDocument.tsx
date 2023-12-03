import { StreamPlayerApi } from '@cloudflare/stream-react'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import SappModal from '@components/base/modal/SappModal'
import SAPPRadio from '@components/base/radiobutton/SAPPRadio'
import SAPPVideo from '@components/base/video/SAPPVideo'
import { useEffect, useRef, useState } from 'react'
import { IQuestion, IVideo } from 'src/type/course/Question'

type Props = {
  videos?: IVideo[]
}

const VideoDocument = ({ videos }: Props) => {
  const [currentVideo, setCurrentVideo] = useState<IVideo>()
  const quizTimed = useRef<{ [key: string]: IQuestion[] }>()
  const currentTimeRef = useRef(-1)
  const [markers, setMarkers] = useState<string[]>()
  const [currentListQuiz, setCurrentListQuiz] = useState<IQuestion[]>([])
  const [playerRef, setPlayerRef] = useState<any>()

  useEffect(() => {
    if (videos?.[0]) {
      handleSetCurrentVideo(videos?.[0])
    }
  }, [videos])

  const handleSetCurrentVideo = (v: IVideo) => {
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
    setMarkers(Object.keys(quizTimed.current || {}))
  }
  const streamRef = useRef<StreamPlayerApi>()

  const handleOpenModalQuestions = async ({
    id,
    listQuiz,
  }: {
    id: string
    open: boolean
    listQuiz: any[]
  }) => {
    // const newCurrentQuiz = await handleSetActiveQuiz(id)
    // if (newCurrentQuiz) {
    //   // setActiveQuiz(newCurrentQuiz)
    //   setCurrentListQuiz(listQuiz)
    // } else {
    //   // setActiveQuiz(undefined)
    //   setCurrentListQuiz([])
    // }
  }

  const handleTrackTime = (time: number) => {
    if (quizTimed.current?.[time]?.[0]?.id) {
      handleOpenModalQuestions({
        id: quizTimed.current?.[time][0].id || '',
        open: true,
        listQuiz: quizTimed.current?.[time],
      })
      setCurrentListQuiz(quizTimed.current?.[time])
      return true
    }
    setCurrentListQuiz([])
    return false
  }

  const handleOnTimeUpdate = () => {
    const currentTime = Math.floor(streamRef.current?.currentTime || 0)
    if (currentTimeRef.current !== currentTime) {
      currentTimeRef.current = currentTime
      handleTrackTime(currentTime)
    }
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
            open={true}
            customTitle={
              <div className="text-xl font-bold text-bw-1">Question</div>
            }
            okButtonCaption={'Submit'}
            cancelButtonCaption={'Skip'}
            buttonSize="small"
            size="max-w-[750px]"
            position="center"
            isInner={true}
            isBordered={true}
            okButtonClass="!w-20 h-8.5 !px-0"
            cancelButtonClass="!w-20 h-8.5 !px-0"
          >
            <div className="py-5">
              Question Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Magni adipisci numquam voluptatum est odio recusandae omnis
              incidunt ducimus, et sequi commodi, suscipit quas soluta. Atque
              cupiditate quos eius vel deserunt. Question Lorem ipsum dolor sit
              amet consectetur, adipisicing elit. Magni adipisci numquam
              voluptatum est odio recusandae omnis incidunt ducimus, et sequi
              commodi, suscipit quas soluta. Atque cupiditate quos eius vel
              deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt. Question Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Magni adipisci numquam voluptatum est odio
              recusandae omnis incidunt ducimus, et sequi commodi, suscipit quas
              soluta. Atque cupiditate quos eius vel deserunt. Question Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Magni adipisci
              numquam voluptatum est odio recusandae omnis incidunt ducimus, et
              sequi commodi, suscipit quas soluta. Atque cupiditate quos eius
              vel deserunt.
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
