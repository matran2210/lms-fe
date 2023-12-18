import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import EditorReader from '@components/base/editor/EditorReader'
import { useEffect, useMemo } from 'react'
import { IPreviewProp } from './OneChoiceQuestion'
import { DeserializeHighlight, runHighlight } from '@utils/index'
// import {IPreviewProp} from '../true-false-question'

const MultiChoiceQuestion = ({
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
    setValue(name, defaultValues)
  }, [defaultValues])
  useEffect(() => {
    if (data) {
      DeserializeHighlight(highlighted)
    }
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
              runHighlight(handleSaveHighLight, allowHighLight || false)
            }
          }
        }}
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
        <HookFormCheckBoxGroup
          options={convertAnswer || []}
          control={control}
          name={name || 'multiples'}
          multiple
          corrects={corrects}
          defaultValue={defaultValues || ''}
        />
      </div>
    </div>
  )
}
export default MultiChoiceQuestion
