import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import React, { useEffect, useRef, useState } from 'react'
interface IProps {
  data: any
  action?: any
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
  defaultAnswer?: any
}
const SelectWord = ({
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
  const formatAnswer = (data: any) => {
    let objAnswer: any = {}
    for (let e of data?.answers) {
      if (!objAnswer[e.answer_position]) {
        objAnswer[e.answer_position] = []
      }
      objAnswer[e.answer_position].push({
        label: e.answer,
        value: e.id,
        result: e.is_correct,
      })
    }
    return objAnswer
  }
  const answerObj = formatAnswer(data)

  const parser = new DOMParser()

  useEffect(() => {
    const doc = parser.parseFromString(str, 'text/html')
    const elements = doc.querySelectorAll('.question-content-tag')
    elements.forEach((element, index) => {
      element.outerHTML = `
      <select class="sapp-select--selectword-preview" id="${element.id}">
      <option value="">Choose...</options>
      ${answerObj[+index + 1].map((e: any) => {
        return `<option value=${e.value} ${
          e.value === defaultAnswer?.[index] ? 'selected' : ''
        }>${e.label}</option>`
      })}
      </select>
      `
    })
    setQuestionContent(doc)
  }, [defaultAnswer])
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
        extenalRef={ref}
        className="questions"
        // style={{borderBottom: '1px solid  white'}}
        text_editor_content={
          questionContent?.documentElement.querySelector('body')?.innerHTML ||
          ''
        }
      />
    </div>
  )
}
export default SelectWord
