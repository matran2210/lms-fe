import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
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
}

interface ChangeEvent extends Event {
  target: HTMLSelectElement
}

// Constants
const DROPDOWN_STYLES = {
  container:
    'sapp-select--question relative inline-block w-[200px] border border-gray-300 rounded cursor-pointer',
  selectedText: 'px-3 py-2 flex items-center justify-between',
  options:
    'fixed z-50 min-w-[200px] max-w-[400px] bg-white border border-gray-300 rounded shadow-lg max-h-[300px] overflow-y-auto',
  option: 'px-3 py-2 hover:bg-[#e5e7eb] cursor-pointer',
  icon: 'ml-2 text-gray-500',
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
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    // Refs and State
    const refEditor = useRef(null) as any
    const [questionContent, setQuestionContent] = useState<any>()
    const [answerContent, setAnswerContent] = useState<any>()
    const [key, setKey] = useState<string>(uniqueId('key'))
    const isSelfReflection = data?.is_self_reflection
    const str = data?.question_content

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

      const textClass = isCorrect ? 'text-state-success' : 'text-state-error'
      const optionClass = isCorrect ? '!border-success' : '!border-danger'
      return `
        <div class="selected-text ${DROPDOWN_STYLES.selectedText} ${textClass}">
          <span class="truncate">${selectedAnswer?.label || 'Choose'}</span>
          <svg class="${DROPDOWN_STYLES.icon}" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="dropdown-options ${DROPDOWN_STYLES.options}" style="display: none;">
          ${answerObj?.[+index + 1]
            ?.map((e: any) => {
              if (e?.label?.length > 100) {
                return `
                <div class="option ${DROPDOWN_STYLES.option} ${e?.value === defaultAnswerValue ? 'bg-[#e5e5e5]' : ''}" 
                     data-value="${e?.value}">
                  ${e.label}
                </div>
              `
              }
              return `
              <div class="option ${DROPDOWN_STYLES.option} ${e?.value === defaultAnswerValue ? 'bg-[#e5e5e5]' : ''}" 
                   data-value="${e?.value}">
                ${e?.label}
              </div>
            `
            })
            .join('')}
        </div>
      `
    }

    // Imperative Handle
    useImperativeHandle(ref, () => ({
      handleReset() {
        const dropdowns = document?.querySelectorAll(
          '.sapp-select--question',
        ) as any
        dropdowns.forEach((dropdown: any) => {
          dropdown.setAttribute('data-value', '')
          const selectedText = dropdown.querySelector('.selected-text')
          if (selectedText) {
            selectedText.textContent = 'Choose'
          }
        })
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

        const defaultAnswerValue = defaultAnswer?.[index] || ''

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
            isCorrect ? 'text-state-success' : 'text-state-error',
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
        const answer =
          data.answers?.find(
            (answer: { id: string; value: string }) =>
              !isUndefined(defaultAnswer?.[index]) &&
              !isNull(defaultAnswer?.[index]) &&
              answer?.id === defaultAnswer?.[index],
          )?.answer || ''
        tooltip.innerHTML = `
                  <div class="tooltip-text ${!!answer && answer.length > 7 ? 'block' : 'hidden'}">${answer}</div>
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
                <span id="${element?.id}" class="text-base font-semibold text-state-success">
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
      const setupDropdownListeners = () => {
        const dropdowns = document.querySelectorAll('.sapp-select--question')
        dropdowns.forEach((dropdown) => {
          if (!dropdown.getAttribute('data-listener-attached')) {
            const selectedText = dropdown.querySelector('.selected-text')
            const options = dropdown.querySelector(
              '.dropdown-options',
            ) as HTMLElement

            // Toggle dropdown
            selectedText?.addEventListener('click', () => {
              if (!dropdown.getAttribute('disabled')) {
                const isOpen = dropdown.getAttribute('data-open') === 'true'
                dropdown.setAttribute('data-open', (!isOpen).toString())
                if (options) {
                  if (!isOpen) {
                    // Calculate position
                    const dropdownRect = dropdown.getBoundingClientRect()
                    const windowWidth = window.innerWidth
                    const windowHeight = window.innerHeight
                    const scrollTop =
                      window.pageYOffset || document.documentElement.scrollTop
                    const scrollLeft =
                      window.pageXOffset || document.documentElement.scrollLeft

                    // Set initial position
                    options.style.top = `${dropdownRect.bottom + scrollTop + 4}px`
                    options.style.left = `${dropdownRect.left + scrollLeft}px`

                    // Check if dropdown would overflow the right edge
                    if (dropdownRect.left + options.offsetWidth > windowWidth) {
                      options.style.left = `${windowWidth - options.offsetWidth - 16}px`
                    }
                    // Check if dropdown would overflow the bottom edge
                    if (dropdownRect.bottom + 300 + 4 > windowHeight) {
                      options.style.top = `${dropdownRect.top + scrollTop - 300 - 4}px`
                    }
                    // Remove highlight from all options
                    options.querySelectorAll('.option').forEach((option) => {
                      option.classList.remove('bg-[#e5e7eb]', 'selected')
                    })
                  }
                  options.style.display = isOpen ? 'none' : 'block'
                }
              }
            })

            // Add hover effect to options
            options?.querySelectorAll('.option').forEach((option) => {
              option.addEventListener('mouseenter', () => {
                // Remove highlight from all options
                options.querySelectorAll('.option').forEach((opt) => {
                  opt.classList.remove('bg-[#e5e7eb]', 'selected')
                })
                // Add highlight to hovered option
                option.classList.add('bg-[#e5e7eb]', 'selected')
              })
            })

            // Handle option selection
            options?.querySelectorAll('.option').forEach((option) => {
              option.addEventListener('click', () => {
                const value = option.getAttribute('data-value')
                const label = option.textContent
                if (value && label) {
                  dropdown.setAttribute('data-value', value)
                  dropdown.setAttribute('data-text', (label ?? '').trim())
                  if (selectedText) {
                    const displayText =
                      label.length > 50 ? label.substring(0, 50) + '...' : label
                    const textSpan = selectedText.querySelector('span')
                    if (textSpan) {
                      textSpan.textContent = displayText
                    }
                  }
                  if (options) {
                    options.style.display = 'none'
                    options.querySelectorAll('.option').forEach((opt) => {
                      if (opt.getAttribute('data-value') === value) {
                        opt.classList.add('bg-[#e5e7eb]')
                      } else {
                        opt.classList.remove('bg-[#e5e7eb]')
                      }
                    })
                  }
                  dropdown.setAttribute('data-open', 'false')
                }
              })
            })

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
              if (!dropdown.contains(e.target as Node)) {
                dropdown.setAttribute('data-open', 'false')
                if (options) {
                  options.style.display = 'none'
                  // Restore selected option highlight when closing
                  const selectedValue = dropdown.getAttribute('data-value')
                  options.querySelectorAll('.option').forEach((option) => {
                    if (option.getAttribute('data-value') === selectedValue) {
                      option.classList.add('bg-[#e5e7eb]')
                    } else {
                      option.classList.remove('bg-[#e5e7eb]')
                    }
                  })
                }
              }
            })
            dropdown.setAttribute('data-listener-attached', 'true')
          }
        })
      }

      const observer = new MutationObserver(setupDropdownListeners)
      observer.observe(document.body, { childList: true, subtree: true })
      setupDropdownListeners()
      return () => observer.disconnect()
    }, [data, defaultAnswer])

    // handle phần hiển thị tooltip khi lựa chọn câu trả lời
    useEffect(() => {
      const setupSelectListeners = () => {
        const selectList = document.querySelectorAll(
          'select.sapp-select--question',
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
