import { useRef, useState } from 'react'
import { Spin } from 'antd'
import { VALID_UPLOAD_EDITOR } from '@lms/core'
import { useSappEditorImageUpload } from 'src/hooks/useSappEditorImageUpload'
import { SAPPEditor } from 'sapp-common-package'
import { SAPPEditorHandle } from '@lms/core'
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
  const { handleImageUpload } = useSappEditorImageUpload()
  const [loading, setLoading] = useState(false)
  return (
    <div key={key}>
      <Spin spinning={loading}>
        <SAPPEditor
          ref={editorRef}
          {...(key && { key: key })}
          content={valueText}
          onChange={onChange}
          handleImageUpload={(file) =>
            handleImageUpload(file, 'lms/library-editor')
          }
          placeholder={placeholder}
          disabled={disabled}
        />
      </Spin>
    </div>
  )
}

export default Editor
