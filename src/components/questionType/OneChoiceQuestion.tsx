import HookFormRadioGroup from '@components/base/radiobutton/HookFormRadioGroup'
import { useMemo } from 'react'
export type IPreviewProp = {
  data: any
  control: any
}
const OneChoiceQuestion = ({ data, control }: IPreviewProp) => {
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
        className="questions"
        dangerouslySetInnerHTML={{ __html: data?.question_content }}
      ></div>
      <div
        className="answer-wrapper"
        style={{
          flexDirection: 'column',
        }}
      >
        <HookFormRadioGroup
          options={convertAnswer || []}
          control={control}
          name="answer"
        />
      </div>
    </div>
  )
}
export default OneChoiceQuestion
