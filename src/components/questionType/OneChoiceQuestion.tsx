import EditorReader from '@components/base/editor/EditorReader'
import HookFormRadioGroup from '@components/base/radiobutton/HookFormRadioGroup'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { memo, useEffect, useMemo } from 'react'
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
  solution?: any
  allowUnHighLight?: boolean
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
  solution,
  allowUnHighLight,
}: IPreviewProp) => {
  useEffect(() => {
    if (defaultValues) {
      setValue(name, defaultValues)
    } else {
      setValue(name, '')
    }
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
  return (
    <div>
      <div
        id="hightlight_area"
        onMouseUp={(e: any) => {
          if (
            e.target.tagName.charAt(0) !== 'm' &&
            e.target.firstChild?.tagName !== 'math'
          ) {
            if (e) {
              if (allowHighLight) {
                runHighlight(
                  handleSaveHighLight,
                  allowHighLight || false,
                  'hightlight_area',
                )
              } else if (allowUnHighLight) {
                runHighlight(
                  handleSaveHighLight,
                  allowUnHighLight || false,
                  'hightlight_area',
                  { color: 'white' },
                )
              }
              // runHighlight(handleSaveHighLight, allowHighLight || false, "hightlight_area")
            }
          }
        }}
      >
        <EditorReader
          text_editor_content={data?.question_content}
          className="sapp-questions"
          highlighted={highlighted}
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
      {solution && (
        <div className="bg-gray-4 mt-6 p-6">
          <div className="font-semibold text-base text-bw-1 ">Solution</div>
          <EditorReader
            className="mt-4 text-bw-1"
            text_editor_content={solution}
          />
        </div>
      )}
    </div>
  )
}
export default OneChoiceQuestion
