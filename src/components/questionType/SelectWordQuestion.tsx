import EditorReader from '@components/base/editor/EditorReader'
import clsx from 'clsx'
import { replaceWhiteSpacePreWrapToNormal, runHighlight } from '@utils/index'
import { isNull, isUndefined, uniqueId } from 'lodash'
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
import { Divider } from 'antd'
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
  exhibitText?: string
  correctAnswerClass?: string
  explainClassname?: string
}

interface ChangeEvent extends Event {
  target: HTMLSelectElement
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
      exhibitText,
      correctAnswerClass,
      explainClassname,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const refEditor = useRef(null) as any
    const [questionContent, setQuestionContent] = useState<any>()
    const [answerContent, setAnswerContent] = useState<any>()
    const str = replaceWhiteSpacePreWrapToNormal(data?.question_content || '')
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
        const tooltip = document.createElement('div')
        tooltip.classList.add('tooltip-container')
        const answer =
          data.answers?.find(
            (answer: { id: string; value: string }) =>
              !isUndefined(defaultAnswer?.[index]) &&
              !isNull(defaultAnswer?.[index]) &&
              answer?.id === defaultAnswer?.[index],
          )?.answer || ''
        tooltip.innerHTML = `
          <div class="tooltip-text ${!!answer && answer.length > 10 ? 'block' : 'hidden'}">${answer}</div>
        `
        tooltip.appendChild(selectElement)
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
              ? '!border-[#397839]'
              : '!border-[#d35563]'
          const textClass = isCorrect ? 'text-success-600' : 'text-error'
          selectElement?.classList?.add(optionClass)
          selectElement?.classList?.add('sapp-select-confirmed')
          selectElement?.classList?.add(textClass)
          selectElement?.setAttribute('disabled', 'true')
          selectElement.innerHTML = `
        <option value="" disabled selected ></option>
        ${answerObj?.[+index + 1]?.map((e: any) => {
          const isSelected = e?.value === defaultAnswerValue
          const shortLabel =
            e?.label?.length > 10 ? e.label.slice(0, 10) + '...' : e?.label
          return `<option value="${e?.value}" ${
            isSelected ? 'selected' : ''
          } >${shortLabel}</option>`
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
        element.replaceWith(tooltip)
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
            inputClass = 'text-success-600'
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
    }, [defaultAnswer, data])

    const handleChangeElement = (event: Event, select: HTMLSelectElement) => {
      if (event.target instanceof HTMLSelectElement) {
        const sibling = select.previousElementSibling
        const answer =
          data?.answers?.find(
            (item: { id: string; answer: string }) =>
              (event?.target as HTMLSelectElement)?.value &&
              item.id === (event?.target as HTMLSelectElement)?.value,
          )?.answer || ''
        if (sibling) {
          sibling.innerHTML = answer || ''
          if (!!answer && answer.length > 7) {
            sibling.classList.remove('hidden')
            sibling.classList.add('block')
          } else {
            sibling.classList.remove('block')
            sibling.classList.add('hidden')
          }
        }
      }
    }

    useEffect(() => {
      const setupSelectListeners = () => {
        const selectList = document.querySelectorAll(
          'select.sapp-select--selectword-preview',
        )
        selectList.forEach((select) => {
          const htmlSelect = select as HTMLSelectElement
          if (!htmlSelect.dataset.listenerAttached) {
            htmlSelect.addEventListener('change', (event: Event) =>
              handleChangeElement(event, htmlSelect),
            )
            htmlSelect.dataset.listenerAttached = 'true'
          }
        })
      }
      const observer = new MutationObserver(() => {
        setupSelectListeners()
      })
      observer.observe(document.body, { childList: true, subtree: true })
      setupSelectListeners()

      return () => {
        observer.disconnect()
      }
    }, [data])
    return (
      <div ref={extenalRef}>
        {data?.question_topic?.exhibits &&
          !isHideExhibit &&
          data?.question_topic?.exhibits?.length > 0 && (
            <>
              {data?.question_topic?.description && (
                <div className="my-6 border border-b-[#DCDDDD]">
                  {data?.question_topic?.id}
                </div>
              )}
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
                      {exhibitText || 'Exhibit'} {i + 1}: {e?.name}
                    </div>
                  )
                })}
              </div>
              <div className="my-6 border border-b-[#DCDDDD]"></div>
            </>
          )}
        <EditorReader
          key={key}
          extenalRef={refEditor}
          className="sapp-questions sapp-editor-reader"
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
          <div className={correctAnswerClass}>
            <Divider className="my-8 bg-gray-300" />
            <SappTitleSolution title={`${MY_COURSES.correctAnswer}:`} />
            <EditorReader
              className="questions mt-2"
              text_editor_content={
                answerContent?.documentElement?.querySelector('body')
                  ?.innerHTML || ''
              }
            />
          </div>
        )}
        {solution && (
          <div className={explainClassname}>
            <Divider className="my-8 bg-gray-300" />
            <SappTitleSolution title={`${MY_COURSES.explanations}:`} />
            <EditorReader className="mt-4" text_editor_content={solution} />
          </div>
        )}
      </div>
    )
  },
)
SelectWord.displayName = 'SelectWord'
export default SelectWord
