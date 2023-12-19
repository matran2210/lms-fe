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
  corrects?: {
    id: string
    answer: string
    is_correct: boolean
    answer_position: number
  }[]
  extenalRef?: any
}
const SelectWord = ({
  data,
  action,
  handleSaveHighLight,
  highlighted,
  removeHighlight,
  allowHighLight,
  defaultAnswer,
  corrects,
  extenalRef,
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
      const selectElement = document.createElement('select')
      selectElement.classList.add('sapp-select--selectword-preview')
      selectElement.id = element.id

      const defaultAnswerValue = defaultAnswer?.[index] || ''

      let optionClass = ''

      if (corrects) {
        const isCorrect = corrects?.some(
          (correct) =>
            correct.answer_position === index + 1 &&
            correct.id === defaultAnswerValue &&
            correct.is_correct,
        )
        optionClass = isCorrect ? 'border-success' : 'border-danger'

        selectElement.classList.add(optionClass)
        selectElement.setAttribute('disabled', 'true')
      }

      selectElement.innerHTML = `
        <option value="">Choose...</option>
        ${answerObj[+index + 1].map((e: any) => {
          const isSelected = e.value === defaultAnswerValue

          return `<option value="${e.value}" ${isSelected ? 'selected' : ''} >${
            e.label
          }</option>`
        })}
      `

      element.replaceWith(selectElement)
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
      onMouseUp={(e: any) => {
        if (
          e.target.tagName.charAt(0) !== 'm' &&
          e.target.firstChild?.tagName !== 'math'
        ) {
          if (e) {
            runHighlight(handleSaveHighLight, allowHighLight || false)
          }
        }
      }}
      ref={extenalRef || null}
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
