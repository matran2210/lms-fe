import EditorReader from '@components/base/editor/EditorReader'
import HookFormRadioGroup from '@components/base/radiobutton/HookFormRadioGroup'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { useEffect, useMemo } from 'react'
export type IPreviewProp = {
  data: any
  control: any
  name?: string
  corrects?: { [key: string]: boolean }
  defaultValues?: any
  setValue?: any
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
}
const OneChoiceQuestion = ({
  data,
  control,
  corrects,
  name,
  defaultValues,
  setValue,
  handleSaveHighLight,
  highlighted,
  removeHighlight,
  allowHighLight,
}: IPreviewProp) => {
  useEffect(() => {
    setValue(name, defaultValues)
  }, [defaultValues])
  const convertAnswer = useMemo(() => {
    let answers = []
    if (data?.answers) {
      for (let e of data?.answers) {
        answers.push({ label: e.answer, value: e.id })
      }
    }
    return answers
  }, [data])
  useEffect(() => {
    if (data) {
      DeserializeHighlight(highlighted)
    }
  }, [data])
  return (
    <div>
      <div
        id="hightlight_area"
        onMouseUp={() =>
          runHighlight(handleSaveHighLight, allowHighLight || false)
        }
      >
        <EditorReader
          text_editor_content={data?.question_content}
          className="sapp-questions"
        />
      </div>
      <div
        className="sapp-answer-wrapper"
        style={{
          flexDirection: 'column',
        }}
      >
        <HookFormRadioGroup
          options={convertAnswer || []}
          control={control}
          name={name || 'answer'}
          corrects={corrects}
          defaultValue={defaultValues}
        />
      </div>
    </div>
  )
}
export default OneChoiceQuestion
