import { SAPPVideo } from '@lms/ui'
import { useRef } from 'react'

export default function VideoBlock({ src }: { src: string }) {
  const streamRef = useRef<any>()
  return <SAPPVideo streamRef={streamRef} options={{ src }}></SAPPVideo>
}
