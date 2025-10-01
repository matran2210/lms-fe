import EditorReader from '@components/base/editor/EditorReader'
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

// Types
interface IProps {
  data: any
  handleSaveHighLight?: any
  highlighted?: any
  allowHighLight?: boolean
  defaultAnswer?: Array<{
    answer_id: string
    answer_position: number
  }>
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
  onChange?: (
    values: Array<{
      answer_id: string
      answer_position: number
    }>,
  ) => void
}

// Constants
const baseBox = 'border rounded border-gray-15 rounded-lg'
const sizeBox = 'w-[200px] min-w-[200px] max-w-[400px]'
const DROPDOWN_STYLES = {
  container: `sapp-select--question relative inline-block ${sizeBox} ${baseBox} cursor-pointer`,
  selectedText: 'px-3 py-2 flex items-center justify-between',
  options: `absolute !top-[44px] !left-0 -translate-x-px z-[9] ${sizeBox} bg-white ${baseBox} shadow-lg max-h-[300px] overflow-y-auto p-2`,
  option: 'px-3 py-2 cursor-pointer rounded',
  icon: 'ml-2 text-gray-500 min-w-[24px]',
}

const SelectWord = forwardRef(
  (
    {
      data,
      handleSaveHighLight,
      highlighted,
      allowHighLight,
      defaultAnswer,
      corrects,
      extenalRef,
      solution,
      allowUnHighLight,
      setOpenFile,
      isHideExhibit = true,
      exhibitText,
      onChange,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    // Refs and State
    const refEditor = useRef(null) as any
    const [questionContent, setQuestionContent] = useState<any>()
    const [answerContent, setAnswerContent] = useState<any>()
    const [key, setKey] = useState<string>(uniqueId('key'))
    const componentId = useRef<string>(uniqueId('select-question-'))
    const isSelfReflection = data?.is_self_reflection
    const str = replaceWhiteSpacePreWrapToNormal(data?.question_content)
    const [selectedValues, setSelectedValues] = useState<
      Record<number, string>
    >({})

    useEffect(() => {
      if (onChange) {
        // Lấy ra mảng với format mới: answer_id và answer_position
        const values = Object.keys(selectedValues)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => ({
            answer_id: selectedValues[Number(k)],
            answer_position: Number(k) + 1,
          }))
          .filter((item) => item.answer_id) // Chỉ lấy những item có answer_id
        onChange(values)
      }
    }, [selectedValues])

    // Đồng bộ selectedValues với defaultAnswer khi defaultAnswer thay đổi
    useEffect(() => {
      if (defaultAnswer && Array.isArray(defaultAnswer)) {
        const newSelected: Record<number, string> = {}
        defaultAnswer.forEach((item) => {
          if (item.answer_id && item.answer_position) {
            newSelected[item.answer_position - 1] = item.answer_id
          }
        })
        setSelectedValues(newSelected)
      }
    }, [defaultAnswer])

    // Methods
    const formatAnswer = (data: any) => {
      const objAnswer: any = {}
      data?.answers?.forEach((answer: any) => {
        if (!objAnswer?.[answer?.answer_position]) {
          objAnswer[answer?.answer_position] = []
        }
        objAnswer[answer?.answer_position].push({
          label: answer?.answer,
          value: answer?.id,
          result: answer?.is_correct,
        })
      })
      return objAnswer
    }

    const answerObj = formatAnswer(data)
    const createDropdownHTML = (
      index: number,
      defaultAnswerValue: string,
      isCorrect: boolean = false,
    ) => {
      const selectedAnswer = answerObj?.[+index + 1]?.find(
        (e: any) => e?.value === defaultAnswerValue,
      )

      const disabledClass = !corrects?.length
        ? ''
        : 'cursor-not-allowed pointer-events-none'
      return `
        <div class="selected-text ${DROPDOWN_STYLES.selectedText} ${disabledClass}" data-component-id="${componentId.current}">
          <span class="truncate">${selectedAnswer?.label || 'Choose'}</span>
            <svg class="${DROPDOWN_STYLES.icon} icon-dropdown" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z" fill="#1C274C"/>
            </svg>
        </div>
        <div class="dropdown-options ${DROPDOWN_STYLES.options}" style="display: none;" data-component-id="${componentId.current}">
          ${
            answerObj?.[+index + 1]?.length
              ? answerObj?.[+index + 1]
                  ?.map((e: any) => {
                    if (e?.label?.length > 100) {
                      return `
                <div class="option ${DROPDOWN_STYLES.option} ${e?.value === defaultAnswerValue ? 'bg-[#e5e5e5]' : ''}" 
                     data-value="${e?.value}" data-component-id="${componentId.current}">
                  ${e.label}
                </div>
              `
                    }
                    return `
              <div class="option ${DROPDOWN_STYLES.option} ${e?.value === defaultAnswerValue ? 'bg-[#e5e5e5]' : ''}" 
                   data-value="${e?.value}" data-component-id="${componentId.current}">
                ${e?.label}
              </div>
            `
                  })
                  .join('')
              : `<div class="option ${DROPDOWN_STYLES.option}" data-component-id="${componentId.current}">No options available</div>`
          }
        </div>
      `
    }

    // Imperative Handle
    useImperativeHandle(ref, () => ({
      handleReset() {
        const dropdowns = document?.querySelectorAll(
          `.sapp-select--question[data-component-id="${componentId.current}"]`,
        ) as any
        dropdowns.forEach((dropdown: any) => {
          dropdown.setAttribute('data-value', '')
          const selectedText = dropdown.querySelector(
            `.selected-text[data-component-id="${componentId.current}"]`,
          )
          if (selectedText) {
            selectedText.textContent = 'Choose'
          }
        })
        // Reset selectedValues state
        setSelectedValues({})
      },
      handleGetResult() {
        // action()
      },
    }))

    const handleChangeElement = (event: Event, select: any) => {
      if (event.target) {
        const sibling = select.previousElementSibling
        const answer =
          data?.answers?.find(
            (item: { id: string; answer: string }) =>
              (event?.target as HTMLSelectElement)?.value &&
              item.id === (event?.target as HTMLSelectElement)?.value,
          )?.answer || ''
        if (sibling) {
          sibling.innerHTML = answer || ''
          if (!!answer && answer.length > 18) {
            sibling.classList.remove('hidden')
            sibling.classList.add('block')
          } else {
            sibling.classList.remove('block')
            sibling.classList.add('hidden')
          }
        }
      }
    }

    // Effects
    useEffect(() => {
      const parser = new DOMParser()
      const doc = parser?.parseFromString(str, 'text/html')
      const elements = doc?.querySelectorAll('.question-content-tag')
      const doc2 = parser?.parseFromString(str, 'text/html')
      const elementCorrects = doc2?.querySelectorAll('.question-content-tag')

      // Process question content
      elements.forEach((element, index) => {
        const dropdownContainer = document?.createElement('div')
        dropdownContainer.classList?.add(
          ...DROPDOWN_STYLES.container.split(' '),
        )
        dropdownContainer.id = element?.id
        dropdownContainer.setAttribute('data-value', '')
        dropdownContainer.setAttribute('data-component-id', componentId.current)

        const defaultAnswerValue =
          defaultAnswer?.find((item) => item.answer_position === index + 1)
            ?.answer_id || ''

        if (corrects) {
          const isCorrect = corrects?.some(
            (correct) =>
              correct?.answer_position === index + 1 &&
              correct?.id === defaultAnswerValue &&
              correct?.is_correct,
          )

          dropdownContainer?.classList?.add(
            isCorrect || isSelfReflection
              ? '!border-success'
              : '!border-danger',
            'sapp-select-confirmed',
          )
          dropdownContainer?.setAttribute('disabled', 'true')
        }

        // Xử lý default của câu trả lời
        dropdownContainer.setAttribute('data-value', defaultAnswerValue ?? '')

        dropdownContainer.innerHTML = createDropdownHTML(
          index,
          defaultAnswerValue,
          corrects?.some(
            (correct) =>
              correct?.answer_position === index + 1 &&
              correct?.id === defaultAnswerValue &&
              correct?.is_correct,
          ),
        )

        // Xử lý hiện tooltip sẽ thêm vào mỗi select
        const tooltip = document.createElement('div')
        tooltip.classList.add('tooltip-container')
        tooltip.setAttribute('data-component-id', componentId.current)
        const answer =
          data.answers?.find(
            (answer: { id: string; value: string }) =>
              !isUndefined(
                defaultAnswer?.find(
                  (item) => item.answer_position === index + 1,
                )?.answer_id,
              ) &&
              !isNull(
                defaultAnswer?.find(
                  (item) => item.answer_position === index + 1,
                )?.answer_id,
              ) &&
              answer?.id ===
                defaultAnswer?.find(
                  (item) => item.answer_position === index + 1,
                )?.answer_id,
          )?.answer || ''
        const selectedAnswer = selectedValues[index]
          ? data.answers?.find(
              (answer: { id: string; value: string }) =>
                answer?.id === selectedValues[index],
            )?.answer
          : ''
        tooltip.innerHTML = `
  <div class="tooltip-text ${(!!answer && answer.length > 18) || (!!selectedAnswer && selectedAnswer.length > 18) ? 'block' : 'hidden'}" data-component-id="${componentId.current}">${selectedAnswer || answer}</div>
`
        tooltip.appendChild(dropdownContainer)

        element.replaceWith(tooltip)
      })

      // Process correct answers
      if (corrects) {
        elementCorrects.forEach((element, index) => {
          const correctAnswer = corrects?.find(
            (ans: any) => ans?.answer_position === index + 1 && ans?.is_correct,
          )
          if (correctAnswer) {
            element.outerHTML = `
              <span>
                <span id="${element?.id}" class="font-semibold text-state-success">
                  ${correctAnswer?.answer}
                </span>
              </span>
            `
          }
        })
        setAnswerContent(doc2)
      }
      setQuestionContent(doc)
    }, [defaultAnswer, data])

    useEffect(() => {
      const updateTooltips = () => {
        const dropdowns = document.querySelectorAll(
          `.sapp-select--question[data-component-id="${componentId.current}"]`,
        )
        dropdowns.forEach((dropdown) => {
          const dropdownIndex = Array.from(
            document.querySelectorAll(
              `.sapp-select--question[data-component-id="${componentId.current}"]`,
            ),
          ).indexOf(dropdown)
          const tooltipContainer = dropdown.closest(
            `.tooltip-container[data-component-id="${componentId.current}"]`,
          )
          if (tooltipContainer) {
            const tooltipText = tooltipContainer.querySelector(
              `.tooltip-text[data-component-id="${componentId.current}"]`,
            )
            if (tooltipText) {
              const selectedValue = selectedValues[dropdownIndex]
              if (selectedValue) {
                const answer =
                  data.answers?.find(
                    (answer: { id: string; value: string }) =>
                      answer?.id === selectedValue,
                  )?.answer || ''

                const isOpen = dropdown.getAttribute('data-open') === 'true'
                if (!isOpen) {
                  tooltipText.textContent = answer
                  tooltipText.classList.toggle('block', answer.length > 18)
                  tooltipText.classList.toggle('hidden', answer.length <= 18)
                } else {
                  tooltipText.classList.add('hidden')
                  tooltipText.classList.remove('block')
                }
              }
            }
          }
        })
      }

      // Tạo MutationObserver để theo dõi sự thay đổi của data-open
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-open'
          ) {
            const target = mutation.target as HTMLElement
            updateTooltips()
          }
        })
      })

      // Theo dõi tất cả các dropdown
      const dropdowns = document.querySelectorAll(
        `.sapp-select--question[data-component-id="${componentId.current}"]`,
      )
      dropdowns.forEach((dropdown) => {
        observer.observe(dropdown, {
          attributes: true,
          attributeFilter: ['data-open'],
        })
      })

      // Initial update
      updateTooltips()

      // Cleanup
      return () => {
        observer.disconnect()
      }
    }, [selectedValues, data.answers])

    useEffect(() => {
      const setupDropdownListeners = () => {
        const dropdowns = document.querySelectorAll(
          `.sapp-select--question[data-component-id="${componentId.current}"]`,
        )

        dropdowns.forEach((dropdown) => {
          if (!dropdown.getAttribute('data-listener-attached')) {
            const selectedText = dropdown.querySelector(
              `.selected-text[data-component-id="${componentId.current}"]`,
            )
            const options = dropdown.querySelector(
              `.dropdown-options[data-component-id="${componentId.current}"]`,
            ) as HTMLElement
            const iconDropDown = dropdown.querySelector(
              '.icon-dropdown',
            ) as HTMLElement

            // Toggle dropdown on click
            selectedText?.addEventListener('click', () => {
              if (!dropdown.getAttribute('disabled')) {
                const isNowOpen = !(
                  dropdown.getAttribute('data-open') === 'true'
                )
                dropdown.setAttribute('data-open', isNowOpen.toString())

                if (options) {
                  if (isNowOpen) {
                    // Calculate dropdown position
                    const dropdownRect = dropdown.getBoundingClientRect()
                    const windowWidth = window.innerWidth
                    const windowHeight = window.innerHeight
                    const scrollTop =
                      window.pageYOffset || document.documentElement.scrollTop
                    const scrollLeft =
                      window.pageXOffset || document.documentElement.scrollLeft

                    // Default position
                    options.style.top = `${dropdownRect.bottom + scrollTop + 4}px`
                    options.style.left = `${dropdownRect.left + scrollLeft}px`

                    // Adjust to prevent overflow
                    if (dropdownRect.left + options.offsetWidth > windowWidth) {
                      options.style.left = `${windowWidth - options.offsetWidth - 16}px`
                    }
                    if (dropdownRect.bottom + 300 + 4 > windowHeight) {
                      options.style.top = `${dropdownRect.top + scrollTop - 300 - 4}px`
                    }

                    // Clear highlights
                    options
                      .querySelectorAll(
                        `.option[data-component-id="${componentId.current}"]`,
                      )
                      .forEach((option) => {
                        option.classList.remove('bg-[#e5e7eb]', 'selected')
                      })

                    options.style.display = 'block'
                  } else {
                    options.style.display = 'none'
                  }

                  // Toggle UI styles
                  dropdown.classList.toggle('border-gray-200', isNowOpen)
                  iconDropDown?.classList.toggle('rotate-180', isNowOpen)
                }
              }
            })

            // Hover effect on options
            options
              ?.querySelectorAll(
                `.option[data-component-id="${componentId.current}"]`,
              )
              .forEach((option) => {
                option.addEventListener('mouseenter', () => {
                  options
                    .querySelectorAll(
                      `.option[data-component-id="${componentId.current}"]`,
                    )
                    .forEach((opt) =>
                      opt.classList.remove('bg-[#e5e7eb]', 'selected'),
                    )
                  option.classList.add('bg-[#e5e7eb]', 'selected')
                })
              })

            // Option selection
            options
              ?.querySelectorAll(
                `.option[data-component-id="${componentId.current}"]`,
              )
              .forEach((option) => {
                option.addEventListener('click', () => {
                  const value = option.getAttribute('data-value')
                  const label = option.textContent?.trim()

                  if (value && label) {
                    const dropdownIndex = Array.from(
                      document.querySelectorAll(
                        `.sapp-select--question[data-component-id="${componentId.current}"]`,
                      ),
                    ).indexOf(dropdown)

                    dropdown.setAttribute('data-value', value)
                    dropdown.setAttribute('data-text', label)

                    setSelectedValues((prev) => ({
                      ...prev,
                      [dropdownIndex]: value,
                    }))

                    const span = selectedText?.querySelector('span')
                    if (span) {
                      span.textContent =
                        label.length > 50 ? label.slice(0, 50) + '...' : label
                    }

                    // Highlight selected option
                    options
                      .querySelectorAll(
                        `.option[data-component-id="${componentId.current}"]`,
                      )
                      .forEach((opt) => {
                        opt.classList.toggle(
                          'bg-[#e5e7eb]',
                          opt.getAttribute('data-value') === value,
                        )
                      })

                    options.style.display = 'none'
                    dropdown.setAttribute('data-open', 'false')
                    iconDropDown?.classList.remove('rotate-180')
                    dropdown.classList.remove('border-gray-200')
                  }
                })
              })

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
              if (!dropdown.contains(e.target as Node)) {
                dropdown.setAttribute('data-open', 'false')
                if (options) {
                  options.style.display = 'none'

                  // Restore selected option highlight
                  const selectedValue = dropdown.getAttribute('data-value')
                  options
                    .querySelectorAll(
                      `.option[data-component-id="${componentId.current}"]`,
                    )
                    .forEach((option) => {
                      option.classList.toggle(
                        'bg-[#e5e7eb]',
                        option.getAttribute('data-value') === selectedValue,
                      )
                    })
                }
                iconDropDown?.classList.remove('rotate-180')
                dropdown.classList.remove('border-gray-200')
              }
            })

            dropdown.setAttribute('data-listener-attached', 'true')
          }
        })
      }

      // Observe new dropdowns being added to the DOM
      const observer = new MutationObserver(setupDropdownListeners)
      observer.observe(document.body, { childList: true, subtree: true })

      // Initial setup
      setupDropdownListeners()

      return () => observer.disconnect()
    }, [data, defaultAnswer])

    // handle phần hiển thị tooltip khi lựa chọn câu trả lời
    useEffect(() => {
      const setupSelectListeners = () => {
        const selectList = document.querySelectorAll(
          `select.sapp-select--question[data-component-id="${componentId.current}"]`,
        )
        selectList.forEach((element) => {
          const htmlSelect = element as HTMLDivElement
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

    // Render
    return (
      <div ref={extenalRef}>
        {/* Exhibits Section */}
        {data?.question_topic?.exhibits &&
          !isHideExhibit &&
          data?.question_topic?.exhibits?.length > 0 && (
            <>
              {data?.question_topic?.description && (
                <div className="my-6 border border-b-gray-2">
                  {data?.question_topic?.id}
                </div>
              )}
              <div className="mb-4 flex items-center">
                <div className="font-semibold">
                  {exhibitText ? exhibitText + 's' : 'Exhibits'} (
                  {data?.question_topic?.exhibits?.length || 0})
                </div>
                <div className="ml-4">
                  <span className="text-state-error">* </span>
                  <span className="text-gray-1">Click to view</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {data?.question_topic?.exhibits?.map((e: any, i: number) => (
                  <div
                    className="cursor-pointer hover:text-primary"
                    key={e?.id ?? i}
                    onClick={(event) => {
                      setOpenFile?.(
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
                ))}
              </div>
              <div className="my-6 border border-b-gray-2"></div>
            </>
          )}

        {/* Question Content */}
        <EditorReader
          key={key}
          extenalRef={refEditor}
          className="sapp-questions"
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

        {/* Correct Answer Section */}
        {answerContent && (
          <>
            <div className="pt-[18px] text-base font-semibold">
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

        {/* Solution Section */}
        {solution && (
          <div className="mt-6 bg-gray-4 p-6">
            <SappTitleSolution title={MY_COURSES.explanations} />
            <EditorReader className="mt-4" text_editor_content={solution} />
          </div>
        )}
      </div>
    )
  },
)

SelectWord.displayName = 'SelectWord'
export default SelectWord
