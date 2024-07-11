import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
import { MY_COURSES } from 'src/constants/lang'
import { IExhibitData } from 'src/type/exhibit'
interface IProps {
  data: any
  action?: any
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
  defaultAnswer?: any
  corrects?: {
    id: string
    answer: string
    is_correct: boolean
    answer_position: number
  }[]
  extenalRef?: any
  solution?: string
  allowUnHighLight?: boolean
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
  isHideExhibit?: boolean
}
const SelectWord = forwardRef(
  (
    {
      data,
      action,
      handleSaveHighLight,
      highlighted,
      removeHighlight,
      allowHighLight,
      defaultAnswer,
      corrects,
      extenalRef,
      solution,
      allowUnHighLight,
      setOpenFile,
      isHideExhibit = true,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const refEditor = useRef(null) as any
    const [questionContent, setQuestionContent] = useState<any>()
    const [answerContent, setAnswerContent] = useState<any>()
    const str = data?.question_content
    const [key, setKey] = useState<string>(uniqueId('key'))
    const isSelfReflection = data?.is_self_reflection

    useImperativeHandle(ref, () => ({
      handleReset() {
        const inputs = document?.querySelectorAll(
          'select.sapp-select--selectword-preview',
        ) as any
        for (let e of inputs) {
          e.value = ''
        }
      },
      handleGetResult() {
        // action()
      },
    }))
    const formatAnswer = (data: any) => {
      let objAnswer: any = {}
      for (let e of data?.answers) {
        if (!objAnswer?.[e?.answer_position]) {
          objAnswer[e?.answer_position] = []
        }
        objAnswer[e?.answer_position].push({
          label: e?.answer,
          value: e?.id,
          result: e?.is_correct,
        })
      }
      return objAnswer
    }
    const answerObj = formatAnswer(data)

    const parser = new DOMParser()

    useEffect(() => {
      const doc = parser?.parseFromString(str, 'text/html')
      const elements = doc?.querySelectorAll('.question-content-tag')
      const doc2 = parser?.parseFromString(str, 'text/html')
      const elementCorrects = doc2?.querySelectorAll('.question-content-tag')

      elements.forEach((element, index) => {
        const selectElement = document?.createElement('select')
        selectElement.classList?.add('sapp-select--selectword-preview')
        selectElement.setAttribute('required', 'true')
        selectElement.id = element?.id

        const defaultAnswerValue = defaultAnswer?.[index] || ''
        let optionClass = ''

        if (corrects) {
          const isCorrect = corrects?.some(
            (correct) =>
              correct?.answer_position === index + 1 &&
              correct?.id === defaultAnswerValue &&
              correct?.is_correct,
          )
          optionClass =
            isCorrect || isSelfReflection === true
              ? '!border-success'
              : '!border-danger'
          const textClass = isCorrect
            ? 'text-state-success'
            : 'text-state-error'
          selectElement?.classList?.add(optionClass)
          selectElement?.classList?.add('sapp-select-confirmed')
          selectElement?.classList?.add(textClass)
          selectElement?.setAttribute('disabled', 'true')
          selectElement.innerHTML = `
        <option value="" disabled selected ></option>
        ${answerObj?.[+index + 1]?.map((e: any) => {
          const isSelected = e?.value === defaultAnswerValue

          return `<option value="${e?.value}" ${
            isSelected ? 'selected' : ''
          } >${e?.label}</option>`
        })}
      `
        } else {
          selectElement.innerHTML = `
          <option value="" disabled selected >Choose</option>
          ${answerObj?.[+index + 1]?.map((e: any) => {
            const isSelected = e?.value === defaultAnswerValue
            if (e?.label?.length > 100) {
              let arr = []
              var start = 0 // Vị trí bắt đầu của phần tử
              var end = 0 // Vị trí kết thúc của phần tử
              while (start < e?.label?.length) {
                // Lặp cho đến khi hết chuỗi
                end = start + 50 // Tính vị trí kết thúc theo số lượng ký tự tối thiểu
                if (end < e?.label?.length) {
                  // Nếu vị trí kết thúc không vượt quá độ dài chuỗi
                  while (e?.label?.[end] != ' ') {
                    // Lặp cho đến khi tìm được khoảng trắng
                    end-- // Giảm vị trí kết thúc
                  }
                }
                var sub = e?.label?.slice(start, end)
                // Cắt một phần tử từ vị trí bắt đầu đến vị trí kết thúc
                arr?.push(sub) // Thêm phần tử vào mảng
                start = end + 1 // Cập nhật vị trí bắt đầu của phần tử tiếp theo
              }
              return arr
                ?.map((el, i) => {
                  if (i === 0) {
                    return `<option value="${e?.value}" ${
                      isSelected ? 'selected' : ''
                    } class="w-[50px] break-all">${el}</option>`
                  }
                  return `<option disabled value="${e?.value}" ${
                    isSelected ? 'selected' : ''
                  } class="w-[50px] break-all">${el}</option>`
                })
                ?.join('')

              // return arr
            } else {
              return `<option value="${e?.value}" ${
                isSelected ? 'selected' : ''
              } class="w-[50px] break-all">${e?.label}</option>
              `
            }
          })}
          `
        }

        element.replaceWith(selectElement)
      })
      if (corrects) {
        elementCorrects.forEach((element, index) => {
          const inputId = element?.id
          const inputValue = defaultAnswer?.[index] || ''

          let inputClass
          // if (corrects) {
          const correctAnswer = corrects?.find(
            (ans: any) => ans?.answer_position === index + 1 && ans?.is_correct,
          )
          if (correctAnswer) {
            inputClass = 'text-base font-semibold text-state-success'
            // }

            element.outerHTML = `
                <span>
                <span id="${inputId}" class = "${inputClass}">${correctAnswer?.answer} <span/>
                </span>
                `
          }
        })
        setAnswerContent(doc2)
      }

      setQuestionContent(doc)
    }, [defaultAnswer])

    // useEffect(() => {
    //   if (questionContent) {
    //     console.log("abc");

    //     DeserializeHighlight(highlighted)
    //   }
    // }, [questionContent])
    return (
      <div ref={extenalRef}>
        {data?.question_topic?.exhibits &&
          !isHideExhibit &&
          data?.question_topic?.exhibits?.length > 0 && (
            <>
              {data?.question_topic?.description && (
                <div className="border border-b-gray-2 my-6">{data?.question_topic?.id}</div>
              )}
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
                      key={e?.id ?? i}
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
                      Exhibit {i + 1}: {e?.name}
                    </div>
                  )
                })}
              </div>
              <div className="border border-b-gray-2 my-6"></div>
            </>
          )}
        <EditorReader
          key={key}
          extenalRef={refEditor}
          className="sapp-questions"
          // style={{borderBottom: '1px solid  white'}}
          text_editor_content={
            questionContent?.documentElement?.querySelector('body')
              ?.innerHTML || ''
          }
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
          highlighted={highlighted}
        />
        {answerContent && (
          <>
            <div className="font-semibold text-base pt-[18px]">
              Correct Answer
            </div>
            <EditorReader
              className="questions mt-2"
              text_editor_content={
                answerContent?.documentElement?.querySelector('body')
                  ?.innerHTML || ''
              }
            />
          </>
        )}
        {solution && (
          <div className="bg-gray-4 mt-6 p-6 ">
            <SappTitleSolution title={MY_COURSES.explanations} />
            <EditorReader
              className="mt-4 text-bw-1"
              text_editor_content={solution}
            />
          </div>
        )}
      </div>
    )
  },
)
SelectWord.displayName = 'SelectWord'
export default SelectWord
