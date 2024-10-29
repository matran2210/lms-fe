import {
  DeserializeHighlight,
  replaceTextAlignCenterToWebKitCenter,
} from '@utils/index'
import parseHTML, { Element } from 'html-react-parser'
import { useEffect, useRef, useState } from 'react'
import SappModalImage from '../modal/SappModalImage'
import { video_url } from '@utils/constants'
import 'src/utils/global.d.ts'
import clsx from 'clsx'
import SAPPVideo from '@components/base/video/SAPPVideo'
import React from 'react'

type Props = {
  text_editor_content: string | undefined
  className?: string
  extenalRef?: any
  id?: string
  onMouseUp?: any
  highlighted?: string
  options?: any
  highlighArea?: string
  pinned?: boolean
}

const EditorReader = ({
  text_editor_content = '',
  className = '',
  extenalRef,
  id,
  onMouseUp,
  highlighted,
  options,
  highlighArea = 'hightlight_area',
  pinned,
}: Props) => {
  const [src, setSrc] = useState<string>()
  const [type, setType] = useState<'VIDEO' | 'IMG'>('VIDEO')
  const [content, setContent] = useState<any>()
  const editorRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<Record<string, React.RefObject<HTMLVideoElement>>>(
    {},
  )

  useEffect(() => {
    if (highlighArea === 'hightlight_area_topic') {
      DeserializeHighlight(highlighted, highlighArea)
    } else if (highlighArea === 'hightlight_area_require') {
      DeserializeHighlight(highlighted, highlighArea)
    } else if (highlighArea === 'hightlight_area') {
      DeserializeHighlight(highlighted)
    }
  }, [content, highlighted])

  useEffect(() => {
    if (text_editor_content !== content) {
      setContent(text_editor_content)
    }
  }, [text_editor_content])

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
      const editor = editorRef?.current
      if (editor) {
        const mfencedElements = editor?.querySelectorAll('mfenced')
        mfencedElements.forEach((el: any) => {
          const openAttr = el?.getAttribute('open')
          const closeAttr = el?.getAttribute('close')
          if (openAttr !== null && closeAttr) {
            const replacements: { [key: string]: string } = {
              '|': '|',
              '||': '||',
              '>': '<',
              '}': '{',
              ']': '[',
              '&#62;': '&#60;',
            }
            if (replacements[closeAttr]) {
              el?.setAttribute('open', replacements[closeAttr])
            }
          }
        })

        // Replace quote in font family
        const mathElement = editor?.querySelectorAll('math')
        if (mathElement) {
          mathElement?.forEach((el: any) => {
            if (el?.hasAttribute('style')) {
              let styleValue = el?.getAttribute('style')
              styleValue = styleValue?.replaceAll('"', '')
              el?.setAttribute('style', styleValue)
            }
          })
          convertMathToImage(editor)
        }
      }
    }, 100)
  })

  const handleOnclick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e?.target as HTMLElement
    if (target.className === 'sapp_overlay_video') {
      // const overlay = target.nextSibling as any
      const video = target?.previousSibling as any
      const src = video?.querySelector('source')?.getAttribute('token')
      if (src && src !== 'null' && video.tagName === 'VIDEO') {
        var iframe = document.createElement('iframe')
        iframe.src = `${video_url}${src}/iframe?autoplay=true`
        iframe.id = video?.id
        iframe.className = video?.className
        iframe.style.cssText = video?.style.cssText
        iframe.allow =
          'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
        iframe.allowFullscreen = true
        video?.parentNode?.replaceChild(iframe, video)
        target?.classList.add('hidden')
        // target?.parentNode?.removeChild(target.nextSibling as Node)
      }
    } else if (target?.tagName === 'IMG') {
      const imageSrc = target?.getAttribute('src')
      if (imageSrc) {
        setSrc(() => {
          setType('IMG')
          return imageSrc
        })
      }
    }
  }

  /**
   * @description add class border theo editor khi border style khác none và hidden ở lần đầu component render
   */
  useEffect(() => {
    // Lấy tất cả các bảng trong tài liệu
    const tableElements = document?.querySelectorAll('table')

    tableElements?.forEach((tableElement) => {
      if (tableElement) {
        // Lấy kiểu border của bảng hiện tại
        const style = window?.getComputedStyle(tableElement)
        const newBorderStyle = style?.borderStyle

        // Lấy tất cả các ô (td) trong bảng hiện tại
        const tdElements = tableElement?.querySelectorAll('td')
        tdElements?.forEach((td) => {
          if (newBorderStyle !== 'none' && newBorderStyle !== 'hidden') {
            td?.classList?.add('border-[1px]')
          } else {
            td?.classList?.remove('border-[1px]')
          }
        })
      }
    })
  })

  return (
    <>
      <div
        className={`${className} editor-wrap mce-content-body`}
        id={id || ''}
        onMouseUp={onMouseUp ? onMouseUp : () => {}}
        ref={editorRef}
      >
        <div
          ref={extenalRef}
          className={clsx({ 'pt-2 text-white': pinned })}
          key={content}
          onClick={handleOnclick}
          translate="no"
        >
          {parseHTML(replaceTextAlignCenterToWebKitCenter(content || ''), {
            replace: (domNode) => {
              if (domNode.type === 'tag' && domNode.name === 'video') {
                const sourceChild = (domNode.children as Element[]).find(
                  (child) => child.name === 'source',
                )
                const videoToken = sourceChild?.attribs?.token
                if (videoToken) {
                  if (!videoRefs.current[videoToken]) {
                    videoRefs.current[videoToken] =
                      React.createRef<HTMLVideoElement>()
                  }
                  return (
                    <SAPPVideo
                      key={videoToken}
                      options={{
                        onTimeUpdate: () => {},
                        src: videoToken,
                      }}
                      streamRef={videoRefs.current[videoToken]}
                      pauseOnSeek={true}
                      thumbnail={{
                        '640x360': `${video_url}${videoToken}/thumbnails/thumbnail.jpg?time=1s&height=360`,
                        '770x435': `${video_url}${videoToken}/thumbnails/thumbnail.jpg?time=1s&height=435`,
                        '950x535': `${video_url}${videoToken}/thumbnails/thumbnail.jpg?time=1s&height=535`,
                      }}
                    />
                  )
                }
              }
            },
            ...options,
          })}
        </div>
      </div>
      {type === 'IMG' && (
        <SappModalImage src={src} setSrc={setSrc}></SappModalImage>
      )}
    </>
  )
}

export default EditorReader
