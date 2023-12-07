import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import EditorReader from '@components/base/editor/EditorReader'
import { useMemo } from 'react'
import { IPreviewProp } from './OneChoiceQuestion'
// import {IPreviewProp} from '../true-false-question'

const MultiChoiceQuestion = ({ data, control, corrects }: IPreviewProp) => {
  const convertAnswer = useMemo(() => {
    let answers = []
    if (data?.answers) {
      for (let e of data?.answers) {
        answers.push({ label: e.answer, value: e.id })
      }
    }
    return answers
  }, [data])

  return (
    <div>
      <EditorReader
        text_editor_content={data?.question_content}
        className="sapp-questions"
      />
      <div
        className="sapp-answer-wrapper"
        style={{
          flexDirection: 'column',
        }}
      >
        <HookFormCheckBoxGroup
          options={convertAnswer || []}
          control={control}
          name="multiple"
          multiple
          corrects={corrects}
        />
      </div>
    </div>
  )
}
export default MultiChoiceQuestion
