import { useEffect, useRef, useState } from 'react'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import SappModalImage from '../modal/SappModalImage'
import SappModalVideo from '../modal/SappModalVideo'

type Props = {
  text_editor_content?: string
  className?: string
  extenalRef?: any
}

const EditorReader = ({
  text_editor_content,
  className,
  extenalRef,
}: Props) => {
  const refDocument = useRef<HTMLDivElement>(null)
  const [src, setSrc] = useState<string>()
  const [type, setType] = useState<'VIDEO' | 'IMG'>('VIDEO')
  // const [content, setContent] = useState<string | undefined>('')
  useEffect(() => {
    if (extenalRef) {
      extenalRef.current?.addEventListener('click', handleOnclick)

      return () => {
        extenalRef.current?.removeEventListener('click', handleOnclick)
      }
    } else {
      refDocument.current?.addEventListener('click', handleOnclick)

      return () => {
        refDocument.current?.removeEventListener('click', handleOnclick)
      }
    }
  }, [refDocument, extenalRef])
  // useEffect(() => {
  //   setContent(text_editor_content)
  // }, [text_editor_content])

  const handleOnclick = async (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'VIDEO') {
      setType('VIDEO')
      // const source_src = target.querySelector('source')?.getAttribute('src')
      const resource_id = target
        .querySelector('source')
        ?.getAttribute('resource_id')
      let url = ''
      if (resource_id) {
        url = (await CourseTestApi.getResource(resource_id || '')).data.url
      }
      if (url) {
        const src =
          url
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
          ref={extenalRef || refDocument}
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
