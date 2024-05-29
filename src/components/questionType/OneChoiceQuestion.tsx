import EditorReader from '@components/base/editor/EditorReader'
import HookFormRadioGroup from '@components/base/radiobutton/HookFormRadioGroup'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { memo, useEffect, useMemo } from 'react'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
import { MY_COURSES } from 'src/constants/lang'
import { IExhibitData } from 'src/type/exhibit'
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
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
  isHideExhibit?: boolean
}

type IAnswers = {
  answer_position: number
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
  setOpenFile,
  isHideExhibit = true,
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
      const dataAnswers = [...data?.answers]
      dataAnswers.sort(
        (a: IAnswers, b: IAnswers) => a?.answer_position - b?.answer_position,
      )
      for (let e of dataAnswers) {
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
      {data?.question_topic.exhibits &&
        !isHideExhibit &&
        data?.question_topic?.exhibits?.length > 0 && (
          <>
            <div className="border border-b-gray-2 my-6"></div>
            <div className="flex items-center mb-4">
              <div className="font-semibold">
                Exhibits({data.question_topic?.exhibits?.length || 0})
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
                            description: e.description,
                            name: e.name,
                            index: i,
                            files: e.files,
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
          <SappTitleSolution title={MY_COURSES.explanations} />
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
