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
  const [markers, setMarkers] = useState<string[]>()
  const [currentListQuiz, setCurrentListQuiz] = useState<IQuestion[]>([])
  const [playerRef, setPlayerRef] = useState<any>()

  useEffect(() => {
    setCurrentVideo(videos?.[0])
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
      <SAPPVideo
        options={{
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
  )
}

export default VideoDocument
