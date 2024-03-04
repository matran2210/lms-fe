import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { useEffect, useMemo } from 'react'
import { IPreviewProp } from './OneChoiceQuestion'
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
  solution,
  allowUnHighLight,
}: IPreviewProp) => {
  const convertAnswer = useMemo(() => {
    let answers = []
    if (data?.answers) {
      const oldData = [...data?.answers]
      const sorted = oldData.sort(
        (a: any, b: any) => a.answer_position - b.answer_position,
      )
      for (let e of sorted) {
        answers.push({ label: e.answer, value: e.id })
      }
    }
    return answers
  }, [data])
  useEffect(() => {
    if (defaultValues) {
      setValue(name, defaultValues)
    } else {
      setValue(name, '')
    }
  }, [defaultValues])
  // useEffect(() => {
  //   if (data) {
  //     DeserializeHighlight(highlighted)
  //   }
  // }, [data])
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
        <HookFormCheckBoxGroup
          options={convertAnswer || []}
          control={control}
          name={name || 'multiples'}
          multiple
          corrects={corrects}
          // defaultValue={defaultValues || ''}
          // justify='start'
          positionCheckBox="start"
        />
      </div>
      {solution && (
        <div className="bg-gray-4 mt-6 p-6">
          <div className="font-semibold text-base text-bw-1 ">Solution</div>
          <EditorReader className="mt-4" text_editor_content={solution} />
        </div>
      )}
    </div>
  )
}
export default MultiChoiceQuestion
