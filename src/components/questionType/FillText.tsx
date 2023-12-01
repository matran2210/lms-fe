import React, { useEffect } from 'react'
import { IPreviewProp } from './OneChoiceQuestion'

interface IProps {
  data: any
  action?: any
}
const AddWordPreview = ({ data, action }: IProps) => {
  const str = data?.question_content
  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')
  const elements = doc.querySelectorAll('.question-content-tag')
  elements.forEach((element) => {
    element.outerHTML = `<span> </span><input type="text" class="sapp-input-preview" id="${element.id}" stringHTML="true"/><span> </span>`
  })
  return (
    <div
      className="sapp-questions"
      dangerouslySetInnerHTML={{
        __html: doc.documentElement.querySelector('body')?.innerHTML || '',
      }}
    />
  )
}
export default AddWordPreview
