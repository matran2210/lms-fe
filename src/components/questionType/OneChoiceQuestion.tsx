import EditorReader from '@components/base/editor/EditorReader'
import HookFormRadioGroup from '@components/base/radiobutton/HookFormRadioGroup'
import { useMemo } from 'react'
export type IPreviewProp = {
  data: any
  control: any
  corrects?: { [key: string]: boolean }
}
const OneChoiceQuestion = ({ data, control, corrects }: IPreviewProp) => {
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
        <HookFormRadioGroup
          options={convertAnswer || []}
          control={control}
          name="answer"
          corrects={corrects}
        />
      </div>
    </div>
  )
}
export default OneChoiceQuestion
