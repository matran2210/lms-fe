import { Stream, StreamPlayerApi, StreamProps } from '@cloudflare/stream-react'
import styles from '@styles/components/SAPPVideo.module.scss'
import { MutableRefObject, useEffect, useRef } from 'react'
interface IProp {
  options: StreamProps
  pauseOnSeek?: boolean
  streamRef?: any
  hideVideo?: boolean
}
const SAPPVideo = ({
  options,
  pauseOnSeek = false,
  streamRef,
  hideVideo = false,
}: IProp) => {
  const innerStreamRef = useRef<StreamPlayerApi>()

  streamRef = streamRef || innerStreamRef
  useEffect(() => {
    const handleFullScreenChange = () => {
      // Check if the document is in full screen mode
      if (document.fullscreenElement) {
        // Exit full screen mode
        document.exitFullscreen()
      }
    }
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
    }
  }, [])
  return (
    <>
      {options.src && (
        <div
          className={`group ${
            !hideVideo ? styles.wrapper : styles.hideWrapper
          }`}
        >
          <Stream
            {...options}
            // key={options.src}
            src={`https://customer-qf43f9e6huohhr1o.cloudflarestream.com/${options.src}/iframe?allowfullscreen=false`}
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
          {/* <iframe ref={streamRef} src={`https://customer-qf43f9e6huohhr1o.cloudflarestream.com/${options.src}/iframe?allowfullscreen=false`}></iframe> */}
        </div>
      )}
    </>
  )
}

export default SAPPVideo
