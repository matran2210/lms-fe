import React, { useMemo } from 'react'
import { IPreviewProp } from './OneChoiceQuestion'
import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
// import {IPreviewProp} from '../true-false-question'

const MultiChociceQuestion = ({ data, control }: IPreviewProp) => {
  const convertAnswer = useMemo(() => {
    let answers = []
    if (data?.answers) {
      for (let e of data?.answers) {
        answers.push({ label: e.answer, value: e.answer })
      }
    }
    return answers
  }, [data])
  return (
    <div>
      <div
        className="sapp-questions"
        // style={{borderBottom: '1px solid  white'}}
        dangerouslySetInnerHTML={{ __html: data?.question_content }}
      />
      <div className="sapp-answer-wrapper" style={{ flexDirection: 'column' }}>
        <HookFormCheckBoxGroup
          options={convertAnswer || []}
          control={control}
          name="multiple"
          multiple
        />
      </div>
    </div>
  )
}
export default MultiChociceQuestion
