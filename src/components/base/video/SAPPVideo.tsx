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
            controls
            responsive={false}
            className={`${styles.content}`}
            onSeeking={() => {
              if (streamRef?.current && pauseOnSeek) {
                streamRef.current.pause()
              }
            }}
            autoplay={false}
          ></Stream>
        </div>
      )}
    </>
  )
}

export default SAPPVideo
