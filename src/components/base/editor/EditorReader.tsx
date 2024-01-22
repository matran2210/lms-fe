import React, { useEffect, useRef, useState } from 'react'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import SappModalImage from '../modal/SappModalImage'
import { DeserializeHighlight } from '@utils/index'
import parseHTML from 'html-react-parser'

type Props = {
  text_editor_content: string | undefined
  className?: string
  extenalRef?: any
  id?: string
  onMouseUp?: any
  highlighted?: string
  options?: any
  highlighArea?: string
}

const EditorReader = ({
  text_editor_content,
  className,
  extenalRef,
  id,
  onMouseUp,
  highlighted,
  options,
  highlighArea = 'hightlight_area',
}: Props) => {
  const refDocument = useRef<HTMLDivElement>(null)
  const [src, setSrc] = useState<string>()
  const [type, setType] = useState<'VIDEO' | 'IMG'>('VIDEO')
  const [content, setContent] = useState<any>()
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
  }, [refDocument?.current, extenalRef?.current])
  useEffect(() => {
    if (text_editor_content) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(text_editor_content, 'text/html')
      const videos = doc.querySelectorAll('video')
      let overLay = document.createElement('span')
      overLay.setAttribute('class', 'sapp_overlay_video')
      videos.forEach((el: any, index: number) => {
        const parent = el.parentNode
        parent?.append(overLay)
        parent.classList.add('relative')
        parent.classList.add('w-fit')
      })
      setContent(doc?.documentElement.querySelector('body')?.innerHTML || '')
    }
  }, [text_editor_content])

  useEffect(() => {
    if (highlighArea === 'hightlight_area_topic') {
      DeserializeHighlight(highlighted, highlighArea)
    } else if (highlighArea === 'hightlight_area_require') {
      DeserializeHighlight(highlighted, highlighArea)
    } else if (highlighArea === 'hightlight_area') {
      DeserializeHighlight(highlighted)
    }
  }, [content, highlighted])
  // useEffect(() => {
  //   setContent(text_editor_content)
  // }, [text_editor_content])

  const handleOnclick = async (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.className === 'sapp_overlay_video') {
      // const overlay = target.nextSibling as any
      const video = target.previousSibling as any
      const src = video.querySelector('source')?.getAttribute('token')
      if (src && src !== 'null' && video.tagName === 'VIDEO') {
        var iframe = document.createElement('iframe')
        iframe.src = `https://customer-qf43f9e6huohhr1o.cloudflarestream.com/${src}/iframe?autoplay=true`
        iframe.id = video.id
        iframe.className = video.className
        iframe.style.cssText = video.style.cssText
        iframe.allow =
          'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
        iframe.allowFullscreen = true
        video?.parentNode?.replaceChild(iframe, video)
        target?.classList.add('hidden')
        // target?.parentNode?.removeChild(target.nextSibling as Node)
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
        className={`${className} editor-wrap`}
        id={id || ''}
        onMouseUp={onMouseUp ? onMouseUp : () => {}}
      >
        <div ref={extenalRef || refDocument}>
          {parseHTML(content || '', options)}
        </div>
      </div>
      {type === 'IMG' && (
        <SappModalImage src={src} setSrc={setSrc}></SappModalImage>
      )}
    </>
  )
}

export default EditorReader
