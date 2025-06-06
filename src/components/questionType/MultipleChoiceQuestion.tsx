import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import EditorReader from '@components/base/editor/EditorReader'
import { getUppercaseByNumber, runHighlight } from '@utils/index'
import { useEffect, useMemo } from 'react'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
import { CircleInfoIcon } from '@assets/icons'
import WarningSection from './WarningSection'
import clsx from 'clsx'
import { IPreviewProp } from './OneChoiceQuestion'
import { MY_COURSES } from 'src/constants/lang'

interface IDataAnswer {
  data: {
    answers: Array<{ id: string }>
  }
}

const MultiChoiceQuestion = ({
  data,
  control,
  corrects,
  name,
  setValue,
  handleSaveHighLight,
  highlighted,
  allowHighLight,
  solution,
  allowUnHighLight,
  defaultValues,
  setOpenFile,
  isHideExhibit = true,
  getValue,
  tabs,
  currentPage,
  exhibitText = 'Exhibit',
  isShowWarning = false,
  explainClassname,
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
    const tab_current = tabs?.find((e) => e.id === currentPage) as
      | IDataAnswer
      | undefined

    if (tab_current && Array.isArray(getValue(name))) {
      const answer_ids = tab_current?.data?.answers?.map((e) => e.id)

      const filteredData = getValue(name)?.filter((e: string) =>
        answer_ids?.includes(e),
      )

      // Cập nhật lại giá trị sau khi lọc
      setValue(name, filteredData) // Cần hàm `setValue` để thay đổi giá trị getValue(name)
    }
  }, [tabs, currentPage, getValue, name, setValue])

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
          className="sapp-questions mb-6"
          highlighted={highlighted}
        />
        <WarningSection isShowWarning={isShowWarning} className="mb-4" />
        {data?.question_topic?.exhibits &&
          !isHideExhibit &&
          data?.question_topic?.exhibits?.length > 0 && (
            <>
              <div className="my-6 border border-b-[#DCDDDD]"></div>
              <div className="mb-4 flex items-center">
                <div className="font-semibold">
                  {exhibitText ? exhibitText + 's' : 'Exhibits'} (
                  {data?.question_topic?.exhibits?.length || 0})
                </div>
                <div className="ml-4">
                  <span className="text-error">* </span>
                  <span className="text-[#A1A1A1]">Click to view</span>
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
                      {exhibitText || 'Exhibit'} {i + 1}: {e.name}
                    </div>
                  )
                })}
              </div>
              <div className="my-6 border border-b-[#DCDDDD]"></div>
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
          className="mr-4 mt-0"
          corrects={corrects}
          defaultValue={defaultValues || ''}
          positionCheckBox="start"
        />
      </div>

      {solution && (
        <div className={clsx('bg-gray-4 mt-6 p-6', explainClassname)}>
          <SappTitleSolution title={`${MY_COURSES.solution}:`} />
          <EditorReader className="mt-4" text_editor_content={solution} />
        </div>
      )}
    </div>
  )
}
export default MultiChoiceQuestion
