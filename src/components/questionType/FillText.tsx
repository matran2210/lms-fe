import React, { useEffect, useRef, useState } from 'react'
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
  defaultAnswer?: any
}
const AddWordPreview = ({
  data,
  action,
  handleSaveHighLight,
  highlighted,
  removeHighlight,
  allowHighLight,
  defaultAnswer,
}: IProps) => {
  const ref = useRef(null) as any
  const [questionContent, setQuestionContent] = useState<any>()
  const str = data?.question_content
  const parser = new DOMParser()

  useEffect(() => {
    if (data) {
      DeserializeHighlight(highlighted)
    }
  }, [data])
  useEffect(() => {
    const doc = parser.parseFromString(str, 'text/html')
    const elements = doc.querySelectorAll('.question-content-tag')
    elements.forEach((element, index) => {
      element.outerHTML = `<span> </span><input type="text" class="sapp-input-preview" id="${
        element.id
      }" stringHTML="true" value="${
        defaultAnswer?.[index] || ''
      }"/><span> </span>`
    })
    setQuestionContent(doc)
  }, [defaultAnswer])
  return (
    <div
      id="hightlight_area"
      onMouseUp={() =>
        runHighlight(handleSaveHighLight, allowHighLight || false)
      }
    >
      <EditorReader
        extenalRef={ref}
        className="sapp-questions"
        text_editor_content={
          questionContent?.documentElement.querySelector('body')?.innerHTML ||
          ''
        }
      />
    </div>
  )
}
export default AddWordPreview
