import SappModalVideo from '@components/base/modal/SappModalVideo'
import { useEffect, useRef, useState } from 'react'
import SappModalImage from '../modal/SappModalImage'

type Props = {
  text_editor_content?: string
  className?: string
}

const EditorReader = ({ text_editor_content, className }: Props) => {
  const refDocument = useRef<HTMLDivElement>(null)
  const [src, setSrc] = useState<string>()
  const [type, setType] = useState<'VIDEO' | 'IMG'>('VIDEO')
  useEffect(() => {
    refDocument.current?.addEventListener('click', handleOnclick)

    return () => {
      refDocument.current?.removeEventListener('click', handleOnclick)
    }
  }, [refDocument])

  const handleOnclick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'VIDEO') {
      setType('VIDEO')
      const source_src = target.querySelector('source')?.getAttribute('src')

      if (source_src) {
        const src =
          source_src
            .replace(
              'https://customer-qf43f9e6huohhr1o.cloudflarestream.com/',
              '',
            )
            .replace('/manifest/video.m3u8', '') || ''

        setSrc(src)
      } else {
        setSrc(undefined)
      }
    } else if (target.tagName === 'IMG') {
      setType('IMG')
      const imageSrc = target.getAttribute('src')
      if (imageSrc) {
        setSrc(imageSrc)
      }
    }
  }
  return (
    <>
      <div className={`${className} mb-32px editor-wrap`}>
        <div
          ref={refDocument}
          dangerouslySetInnerHTML={{ __html: text_editor_content || '' }}
        ></div>
      </div>
      {type === 'VIDEO' && (
        <SappModalVideo src={src} setSrc={setSrc}></SappModalVideo>
      )}
      {type === 'IMG' && (
        <SappModalImage src={src} setSrc={setSrc}></SappModalImage>
      )}
    </>
  )
}

export default EditorReader
