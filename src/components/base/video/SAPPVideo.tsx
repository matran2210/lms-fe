import { Stream, StreamPlayerApi, StreamProps } from '@cloudflare/stream-react'
import styles from '@styles/components/SappVideo.module.scss'
import { useRef } from 'react'
interface IProp {
  options: StreamProps
  pauseOnSeek?: boolean
}
const SAPPVideo = ({ options, pauseOnSeek = false }: IProp) => {
  const streamRef = useRef<StreamPlayerApi>()

  return (
    <div className={`group ${styles.wrapper}`}>
      <Stream
        {...options}
        key={options.src}
        streamRef={streamRef}
        controls
        responsive={false}
        className={`${styles.content}`}
        onSeeking={() => {
          if (streamRef.current && pauseOnSeek) {
            streamRef.current.pause()
          }
        }}
        autoplay={false}
      ></Stream>
    </div>
  )
}

export default SAPPVideo
