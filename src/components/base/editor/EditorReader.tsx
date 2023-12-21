import { useEffect, useRef, useState } from 'react'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import SappModalImage from '../modal/SappModalImage'

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
      const src = target.getAttribute('resource_id')
      if (src && target.tagName === 'VIDEO') {
        const res = await CourseTestApi.getResource(src)
        var iframe = document.createElement('iframe')
        iframe.src = res.data.url.replace(
          '/manifest/video.m3u8',
          '/iframe?autoplay=true',
        )
        iframe.id = target.id
        iframe.className = target.className
        iframe.style.cssText = target.style.cssText
        iframe.allow =
          'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
        iframe.allowFullscreen = true
        target?.parentNode?.replaceChild(iframe, target)
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
      {type === 'IMG' && (
        <SappModalImage src={src} setSrc={setSrc}></SappModalImage>
      )}
    </>
  )
}

export default EditorReader
