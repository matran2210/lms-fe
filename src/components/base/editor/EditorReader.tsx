import { DeserializeHighlight } from '@utils/index'
import parseHTML from 'html-react-parser'
import { useEffect, useRef, useState } from 'react'
import SappModalImage from '../modal/SappModalImage'
import { video_url } from '@utils/constants'
import 'src/utils/global.d.ts'

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
  className = '',
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
  const editorRef = useRef<HTMLDivElement>(null)

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
      for (let video of videos) {
        const src = video.querySelector('source')?.getAttribute('token')
        if (src && src !== 'null' && video.tagName === 'VIDEO') {
          var wrapper = document.createElement('div')
          var overLay = document.createElement('span')
          overLay.className = 'sapp_overlay_video'
          const _video = video.cloneNode(true) as HTMLVideoElement
          wrapper.append(_video)
          wrapper.className = 'relative w-fit overflow-clip'
          wrapper.style.cssText = `height:${video.getAttribute(
            'height',
          )}px; width:${video.getAttribute('width')}px`
          wrapper.append(overLay)
          _video.style.cssText = `width:${video.getAttribute(
            'width',
          )}px; height:${video.getAttribute(
            'height',
          )}px; border: 1px solid gray`
          video?.parentNode?.replaceChild(wrapper, video)
        }
      }
      setContent(doc?.documentElement.querySelector('body')?.innerHTML || '')
    } else {
      setContent(text_editor_content)
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

  const convertMathToImage = async (element: any) => {
    const viewer = com?.wiris?.js?.JsPluginViewer

    if (element && viewer) {
      try {
        await viewer.parseElement(element, true, function () {})
      } catch (error) {}
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (editorRef?.current) {
        const formElement = editorRef?.current
        convertMathToImage(formElement)
      }
    }, 1000)
  }, [editorRef?.current, text_editor_content])

  const handleOnclick = async (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.className === 'sapp_overlay_video') {
      // const overlay = target.nextSibling as any
      const video = target.previousSibling as any
      const src = video.querySelector('source')?.getAttribute('token')
      if (src && src !== 'null' && video.tagName === 'VIDEO') {
        var iframe = document.createElement('iframe')
        iframe.src = `${video_url}${src}/iframe?autoplay=true`
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
      const imageSrc = target.getAttribute('src')
      if (imageSrc) {
        setSrc(() => {
          setType('IMG')
          return imageSrc
        })
      }
    }
  }

  const preprocessContent = (htmlContent: any) => {
    return htmlContent
      .replace(/'Times New Roman'/g, `times-new-roman`)
      .replace(/'Courier New'/g, `courier-new`)
  }

  return (
    <>
      <div
        className={`${className} editor-wrap mce-content-body`}
        id={id || ''}
        onMouseUp={onMouseUp ? onMouseUp : () => {}}
        ref={editorRef}
      >
        <div ref={extenalRef || refDocument}>
          {parseHTML(preprocessContent(content || ''), options)}
        </div>
      </div>
      {type === 'IMG' && (
        <SappModalImage src={src} setSrc={setSrc}></SappModalImage>
      )}
    </>
  )
}

export default EditorReader
