import React from 'react'
interface IProps {
  data: any
  action?: any
}
const SelectWord = ({ data, action }: IProps) => {
  const str = data?.question_content
  const formatAnswer = (data: any) => {
    let objAnswer: any = {}
    for (let e of data?.answers) {
      if (!objAnswer[e.answer_position]) {
        objAnswer[e.answer_position] = []
      }
      objAnswer[e.answer_position].push({
        label: e.answer,
        value: e.answer,
        result: e.is_correct,
      })
    }
    return objAnswer
  }
  const answerObj = formatAnswer(data)

  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')
  const elements = doc.querySelectorAll('.question-content-tag')
  elements.forEach((element, index) => {
    element.outerHTML = `
      <select class="sapp-select--selectword-preview">
      <option value="">Choose...</options>
      ${answerObj[+index + 1].map((e: any) => {
        return `<option value=${e.value}>${e.label}</option>`
      })}
      </select>
      `
  })

  return (
    <div className="body-modal-blue">
      <div
        className="questions"
        // style={{borderBottom: '1px solid  white'}}
        dangerouslySetInnerHTML={{
          __html: doc.documentElement.querySelector('body')?.innerHTML || '',
        }}
      />
    </div>
  )
}
export default SelectWord
