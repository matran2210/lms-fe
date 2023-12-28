import { useEffect, useRef, useState } from 'react'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import SappModalImage from '../modal/SappModalImage'
import { DeserializeHighlight } from '@utils/index'

type Props = {
  text_editor_content?: string
  className?: string
  extenalRef?: any
  id?: string
  onMouseUp?: any
  highlighted?: string
}

const EditorReader = ({
  text_editor_content,
  className,
  extenalRef,
  id,
  onMouseUp,
  highlighted,
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
  useEffect(() => {
    if (highlighted) {
      DeserializeHighlight(highlighted)
    }
  }, [text_editor_content, highlighted])
  // useEffect(() => {
  //   setContent(text_editor_content)
  // }, [text_editor_content])

  const handleOnclick = async (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'VIDEO') {
      const src = target.querySelector('source')?.getAttribute('videoUrl')
      if (src && target.tagName === 'VIDEO') {
        var iframe = document.createElement('iframe')
        iframe.src = src.replace(
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
      <div
        className={`${className} mb-32px editor-wrap`}
        id={id || ''}
        onMouseUp={onMouseUp ? onMouseUp : () => {}}
      >
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
