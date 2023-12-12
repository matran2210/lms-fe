import React, { useEffect } from 'react'
import { IPreviewProp } from './OneChoiceQuestion'
import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'

interface IProps {
  data: any
  action?: any
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
}
const AddWordPreview = ({
  data,
  action,
  handleSaveHighLight,
  highlighted,
  removeHighlight,
  allowHighLight,
}: IProps) => {
  const str = data?.question_content
  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')
  const elements = doc.querySelectorAll('.question-content-tag')
  elements.forEach((element) => {
    element.outerHTML = `<span> </span><input type="text" class="sapp-input-preview" id="${element.id}" stringHTML="true"/><span> </span>`
  })
  useEffect(() => {
    if (data) {
      DeserializeHighlight(highlighted)
    }
  }, [data])
  return (
    <div
      id="hightlight_area"
      onMouseUp={() =>
        runHighlight(handleSaveHighLight, allowHighLight || false)
      }
    >
      <EditorReader
        className="sapp-questions"
        text_editor_content={
          doc.documentElement.querySelector('body')?.innerHTML || ''
        }
      />
    </div>
  )
}
export default AddWordPreview
