import { useEffect, useRef, useState } from 'react'
import { Spin } from 'antd'
import { VALID_UPLOAD_EDITOR } from '@lms/core'
// import { useSappEditorImageUpload } from 'src/hooks/useSappEditorImageUpload' comment monorepo
import { SAPPEditorV2 } from 'sapp-common-package'
import { SAPPEditorHandle } from '@lms/core'
import { useSappEditorImageUpload } from '@lms/hooks'
interface IProps {
  onChange: (event: any) => void
  valueText?: string
  className?: string
  height?: number
  math?: boolean
  placeholder?: string
  getContent?: (e: string) => void
  acceptFiles?: { type: string; size: number }[]
  disabled?: boolean
  key?: number | string
  editorRef?: React.RefObject<SAPPEditorHandle>
}
export const convertMathHtmlToImage = async (html: string): Promise<string> => {
  if (!html) return html
  if (typeof window === 'undefined') return html
  if (!(window as any).com) return html

  const viewer = (window as any)?.com?.wiris?.js?.JsPluginViewer
  if (!viewer) return html

  // 👉 DOM tạm (không attach vào body)
  const container = document.createElement('div')
  container.innerHTML = html

  const mathElements = container.querySelectorAll('math')

  if (!mathElements.length) return html

  // Wiris cần element tồn tại trong DOM
  document.body.appendChild(container)
  container.style.position = 'absolute'
  container.style.left = '-99999px'
  container.style.top = '-99999px'

  try {
    await viewer.parseElement(container, true)
  } catch (err) {
    console.warn('Wiris convert failed', err)
  }

  const result = container.innerHTML

  document.body.removeChild(container)

  return result
}

const Editor = ({
  onChange,
  valueText,
  className = '',
  height,
  math,
  placeholder,
  getContent,
  acceptFiles = VALID_UPLOAD_EDITOR,
  disabled,
  key,
  editorRef,
}: IProps) => {
  const [editorContent, setEditorContent] = useState<string>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const run = async () => {
      if (!valueText) {
        setEditorContent(valueText)
        return
      }

      const converted = await convertMathHtmlToImage(valueText)

      if (mounted) {
        setEditorContent(converted)
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [valueText])

  if (!editorContent) return null
  // const { handleImageUpload } = useSappEditorImageUpload()
  return (
    <div key={key}>
      <Spin spinning={loading}>
        <SAPPEditorV2
          ref={editorRef}
          {...(key && { key: key })}
          content={editorContent}
          onChange={onChange}
          // handleImageUpload={(file) =>
          //   handleImageUpload(file, 'lms/library-editor')
          // }
          placeholder={placeholder}
          disabled={disabled}
        />
      </Spin>
    </div>
  )
}

export default Editor
