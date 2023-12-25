import { Stream, StreamPlayerApi, StreamProps } from '@cloudflare/stream-react'
import styles from '@styles/components/SAPPVideo.module.scss'
import { MutableRefObject, useRef } from 'react'
interface IProp {
  options: StreamProps
  pauseOnSeek?: boolean
  streamRef?: MutableRefObject<StreamPlayerApi | undefined>
}
const SAPPVideo = ({ options, pauseOnSeek = false, streamRef }: IProp) => {
  const innerStreamRef = useRef<StreamPlayerApi>()

  streamRef = streamRef || innerStreamRef

  return (
    <>
      {options.src && (
        <div className={`group ${styles.wrapper}`}>
          <Stream
            {...options}
            key={options.src}
            streamRef={streamRef}
            controls={false}
            responsive={false}
            className={`${styles.content} relative`}
            onSeeking={() => {
              if (streamRef?.current && pauseOnSeek) {
                streamRef.current.pause()
              }
            }}
            autoplay={false}
          ></Stream>
          <div className="absolute w-full h-4 bg-bw-1 z-[99999999999999999999999999999] bottom-[64px]"></div>
        </div>
      )}
    </>
  )
}

export default SAPPVideo
