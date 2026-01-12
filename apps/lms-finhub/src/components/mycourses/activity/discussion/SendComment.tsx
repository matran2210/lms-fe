import { IconSend, IconSendHover } from '@lms/assets'
import { useRef } from 'react'
import { useHover } from 'usehooks-ts'

const SendComment = () => {
  const ref = useRef(null)
  const isHoverIcon = useHover(ref)

  return <div ref={ref}>{!isHoverIcon ? <IconSend /> : <IconSendHover />}</div>
}

export default SendComment
