import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import EditorReader from '@components/base/editor/EditorReader'
import { getUppercaseByNumber, runHighlight } from '@utils/index'
import { useEffect, useMemo } from 'react'
import { IPreviewProp } from './OneChoiceQuestion'
import { MY_COURSES } from 'src/constants/lang'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
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
  allowHighLight,
  solution,
  allowUnHighLight,
  setOpenFile,
  isHideExhibit = true,
}: IPreviewProp) => {
  const convertAnswer = useMemo(() => {
    let answers = []
    let number = 0
    if (data?.answers) {
      const oldData = [...data?.answers]
      const sorted = oldData?.sort(
        (a: any, b: any) => a?.answer_position - b?.answer_position,
      )
      for (let e of sorted) {
        number++
        answers.push({
          label: `${getUppercaseByNumber(number)}. ${e?.answer}`,
          value: e?.id,
        })
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
            e?.target?.tagName?.charAt(0) !== 'm' &&
            e?.target?.firstChild?.tagName !== 'math'
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
        {data?.question_topic?.exhibits &&
          !isHideExhibit &&
          data?.question_topic?.exhibits?.length > 0 && (
            <>
              <div className="border border-b-gray-2 my-6"></div>
              <div className="flex items-center mb-4">
                <div className="font-semibold">
                  Exhibits ({data?.question_topic?.exhibits?.length || 0})
                </div>
                <div className="ml-4">
                  <span className="text-state-error">* </span>
                  <span className="text-gray-1">Click to view</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {data?.question_topic?.exhibits?.map((e: any, i: number) => {
                  return (
                    <div
                      className="cursor-pointer hover:text-primary"
                      key={e.id}
                      onClick={(event) => {
                        setOpenFile &&
                          setOpenFile(
                            {
                              type: 'exhibits',
                              description: e?.description,
                              name: e?.name,
                              index: i,
                              files: e?.files,
                            },
                            null,
                            null,
                            event,
                          )
                      }}
                    >
                      Exhibit {i + 1}: {e.name}
                    </div>
                  )
                })}
              </div>
              <div className="border border-b-gray-2 my-6"></div>
            </>
          )}
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
          <SappTitleSolution title={MY_COURSES.explanations} />
          <EditorReader className="mt-4" text_editor_content={solution} />
        </div>
      )}
    </div>
  )
}
export default MultiChoiceQuestion
