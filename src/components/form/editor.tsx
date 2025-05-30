import { useState } from 'react'
import { Spin } from 'antd'
import { VALID_UPLOAD_EDITOR } from 'src/constants'
import { useSappEditorImageUpload } from 'src/hooks/useSappEditorImageUpload'
import { SAPPEditor, SAPPCalendar } from 'sapp-common-package'
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
}: IProps) => {
  const { handleImageUpload } = useSappEditorImageUpload()
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Spin spinning={loading}>
        <SAPPEditor
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
