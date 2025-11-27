
import { runHighlight } from '@lms/utils'
import { uniqueId } from 'lodash'
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react'
import { MY_COURSES } from '@lms/core'
import { DragDropAnswerItem } from '@lms/core'
import { IExhibitData } from '@lms/core'
import { EditorReader, SappDivider } from '../base'
import { SappTitleSolution } from '../common'

interface IProps {
  data?: any
  action?: any
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
  defaultAnswer?: any
  extenalRef?: any
  corrects?: any
  solution?: string
  resetDefaultAnswer?: boolean
  allowUnHighLight?: boolean
  uuid?: string
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
  isHideExhibit?: boolean
  exhibitText?: string
  handleGetData?: (data: DragDropAnswerItem) => void
  correctAnswerClass?: string
  explainClassname?: string
}

interface DragState {
  isDragging: boolean
  currentElement: HTMLElement | null
  initialX: number
  initialY: number
  currentX: number
  currentY: number
  offsetX: number
  offsetY: number
}

interface AnswerItem {
  idAnswer: string
  id: string
  answer: string
}

const DragNDropPreview = forwardRef(
  (
    {
      data,
      action,
      handleSaveHighLight,
      highlighted,
      allowHighLight,
      defaultAnswer,
      extenalRef,
      corrects,
      solution,
      resetDefaultAnswer = false,
      allowUnHighLight,
      uuid,
      setOpenFile,
      isHideExhibit = true,
      exhibitText,
      handleGetData,
      correctAnswerClass,
      explainClassname,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const storageId = uniqueId('storage')
    const [answered, setAnswered] = useState<any>([])
    const [isDropEnd, setIsDopEnd] = useState<string>('')
    const isSelfReflection = data?.is_self_reflection
    const [questionContent, setQuestionContent] = useState<any>()
    const [answerContent, setAnswerContent] = useState<any>()
    const [key, setKey] = useState(1)
    const [dragState, setDragState] = useState<DragState>({
      isDragging: false,
      currentElement: null,
      initialX: 0,
      initialY: 0,
      currentX: 0,
      currentY: 0,
      offsetX: 0,
      offsetY: 0,
    })

    useEffect(() => {
      const answerOfStudent = action ? action() : defaultAnswer

      // Xử lý trường hợp defaultAnswer thiếu ID
      const processAnswers = (answers: any[]) => {
        if (!answers || !answers.length) return []

        return answers
          .map((answer: any) => {
            // Tìm matching answer trong data.answers theo value
            const matchingAnswer = data?.answers?.find(
              (dataAnswer: any) => dataAnswer.answer === answer.value,
            )

            // Tìm default answer tương ứng với value
            const defaultAnswerItem = defaultAnswer?.find(
              (def: any) => def.value === answer.value,
            )

            if (!matchingAnswer || !defaultAnswerItem) return null

            return {
              ...defaultAnswerItem,
              id: matchingAnswer.id, // từ data.answers
            }
          })
          .filter(Boolean) // loại bỏ null
      }

      const filledAnswered =
        answerOfStudent && answerOfStudent.length
          ? processAnswers(answerOfStudent)
          : defaultAnswer && defaultAnswer.length
            ? processAnswers(defaultAnswer)
            : []

      setAnswered(filledAnswered)
    }, [defaultAnswer, data?.answers])

    useEffect(() => {
      if (isDropEnd) {
        handleGetData?.(action())
      } else {
      }
    }, [isDropEnd])

    // Desktop drag handlers
    function allowDrop(ev: React.DragEvent<HTMLElement>) {
      ev.preventDefault()
    }

    function drag(ev: React.DragEvent<HTMLElement>) {
      const target = ev.target as HTMLElement
      if (ev.dataTransfer) {
        ev?.dataTransfer?.setData('text', target.id)
        ev?.dataTransfer?.setData('questionId', data?.id || '')
      }
    }

    function drop(ev: React.DragEvent<HTMLElement>, dropId: string) {
      ev.preventDefault()
      const target = ev.target as HTMLElement
      const dataTransfer = ev.dataTransfer

      if (!dataTransfer) return

      const textData = dataTransfer.getData('text')
      const questionId = dataTransfer.getData('questionId')

      if (questionId !== dropId) return

      const draggingItem = document.getElementById(textData)
      if (!draggingItem) return

      // Nếu thả vào ô trống
      if (
        target.classList.contains('dropable') &&
        target.children.length === 0
      ) {
        target.appendChild(draggingItem)
      }
      // Nếu thả vào vùng chứa câu trả lời
      else if (target.classList.contains('sapp-store')) {
        target.appendChild(draggingItem)
      }
      // Nếu thả vào ô đã có câu trả lời, hoán đổi vị trí
      else if (target.classList.contains('drag-icon')) {
        const dropTarget = target.parentElement
        const dragParent = draggingItem.parentElement

        if (dropTarget && dragParent) {
          dropTarget.appendChild(draggingItem)
          dragParent.appendChild(target)
        }
      }
    }

    // Touch handlers
    useLayoutEffect(() => {
      // Tạo một style element để set touch-action
      const style = document.createElement('style')
      style.textContent = `
        .drag-icon, .dropable, .sapp-store {
          touch-action: none !important;
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
        }
      `
      document.head.appendChild(style)

      // Cleanup
      return () => {
        if (style.parentNode === document.head) {
          document.head.removeChild(style)
        }
      }
    }, [])

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLElement>) => {
      const target = e.target as HTMLElement
      if (!target.classList.contains('drag-icon')) return

      const touch = e.touches[0]
      const rect = target.getBoundingClientRect()

      // Clone element for dragging
      const clone = target.cloneNode(true) as HTMLElement
      clone.id = `${target.id}-clone`
      clone.style.position = 'fixed'
      clone.style.zIndex = '1000'
      clone.style.width = `${rect.width}px`
      clone.style.height = `${rect.height}px`
      clone.style.left = `${rect.left}px`
      clone.style.top = `${rect.top}px`
      clone.style.opacity = '0.8'
      clone.style.pointerEvents = 'none'
      document.body.appendChild(clone)

      // Hide original element
      target.style.opacity = '0.4'

      setDragState({
        isDragging: true,
        currentElement: target,
        initialX: touch.clientX,
        initialY: touch.clientY,
        currentX: rect.left,
        currentY: rect.top,
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      })
    }, [])

    const handleTouchMove = useCallback(
      (e: React.TouchEvent<HTMLElement>) => {
        if (!dragState.isDragging || !dragState.currentElement) return

        const touch = e.touches[0]
        const clone = document.getElementById(
          `${dragState.currentElement.id}-clone`,
        )

        if (clone) {
          const newX = touch.clientX - dragState.offsetX
          const newY = touch.clientY - dragState.offsetY
          clone.style.left = `${newX}px`
          clone.style.top = `${newY}px`
        }
      },
      [dragState],
    )

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent<HTMLElement>, dropId: string) => {
        if (!dragState.isDragging || !dragState.currentElement) return

        const clone = document.getElementById(
          `${dragState.currentElement.id}-clone`,
        )
        if (!clone) return

        const cloneRect = clone.getBoundingClientRect()
        const dropTargets = document.querySelectorAll('.dropable, .sapp-store')
        let validDrop = false

        dropTargets.forEach((target) => {
          const targetRect = target.getBoundingClientRect()
          const dropTarget = target as HTMLElement

          const isOverlapping = !(
            cloneRect.right < targetRect.left ||
            cloneRect.left > targetRect.right ||
            cloneRect.bottom < targetRect.top ||
            cloneRect.top > targetRect.bottom
          )

          if (isOverlapping && dragState.currentElement) {
            // Nếu thả vào ô trống
            if (
              dropTarget.classList.contains('dropable') &&
              dropTarget.children.length === 0
            ) {
              dropTarget.appendChild(dragState.currentElement)
              validDrop = true
            }
            // Nếu thả vào vùng chứa đáp án
            else if (dropTarget.classList.contains('sapp-store')) {
              dropTarget.appendChild(dragState.currentElement)
              validDrop = true
            }
            // Nếu thả vào ô đã có đáp án
            else {
              const existingAnswer = dropTarget.querySelector('.drag-icon')
              const dragParent = dragState.currentElement.parentElement

              if (existingAnswer && dragParent) {
                dropTarget.appendChild(dragState.currentElement)
                dragParent.appendChild(existingAnswer)
                validDrop = true
              }
            }
          }
        })

        // Restore original element visibility
        dragState.currentElement.style.opacity = ''

        // Remove clone
        if (clone.parentNode) {
          clone.parentNode.removeChild(clone)
        }

        // Reset state
        setDragState({
          isDragging: false,
          currentElement: null,
          initialX: 0,
          initialY: 0,
          currentX: 0,
          currentY: 0,
          offsetX: 0,
          offsetY: 0,
        })

        if (validDrop) {
          setIsDopEnd(Date.now().toString())
        }
      },
      [dragState],
    )

    const str = data?.question_content
    const parser = new DOMParser()

    useImperativeHandle(ref, () => ({
      handleReset() {
        setKey((prev) => prev + 1)
      },
    }))

    useEffect(() => {
      const doc = parser?.parseFromString(str, 'text/html')
      const doc2 = parser?.parseFromString(str, 'text/html')
      const elements = doc?.querySelectorAll('.question-content-tag')
      const elementsCorrects = doc2?.querySelectorAll('.question-content-tag')

      if (corrects) {
        elementsCorrects.forEach((element: any, index: number) => {
          element.outerHTML = `<span id="${element?.id}" class="sapp-input-dragNDrop-answer corrects">
            <span id="${corrects[index].id}" class="flex justify-center w-full">${corrects[index].answer}</span>
          </span>`
        })
        elements.forEach((element: any, index: number) => {
          if (defaultAnswer?.length > 0) {
            if (defaultAnswer?.[index]?.value !== '') {
              element.outerHTML = `<span id="${element?.id}" class="sapp-input-dragNDrop-answer ${
                defaultAnswer?.[index]?.idAnswer === corrects?.[index]?.id ||
                isSelfReflection
                  ? 'corrects'
                  : 'wrongs'
              }">
                <span id="${defaultAnswer?.[index]?.idAnswer}" class="flex justify-center w-full">${defaultAnswer?.[index]?.value}</span>
              </span>`
            } else {
              element.outerHTML = `<span id="${element?.id}" class="sapp-input-dragNDrop-answer ${isSelfReflection ? 'corrects' : 'wrongs'}">
                <span class="sapp-input-dragNDrop-empty"></span>
              </span>`
            }
          } else {
            element.outerHTML = `<span id="${element?.id}" class="sapp-input-dragNDrop-answer ${isSelfReflection ? 'corrects' : 'wrongs'}">
              <span class="sapp-input-dragNDrop-empty"></span>
            </span>`
          }
        })
        setAnswerContent(doc2)
        setQuestionContent(doc)
      } else {
        elements.forEach((element: any, index: number) => {
          if (defaultAnswer?.length > 0) {
            if (defaultAnswer?.[index]?.value !== '') {
              element.outerHTML = `<span id="${element?.id}" class="sapp-input-dragNDrop" indexBox="${
                index + 1
              }">
                <span class="answer-box drag-icon" id="${
                  defaultAnswer?.[index]?.id
                }">${defaultAnswer?.[index]?.value}</span>
               </span>
              `
            } else {
              element.outerHTML = `<span id="${element?.id}" class="sapp-input-dragNDrop" indexBox="${
                index + 1
              }"> </span>`
            }
          } else {
            element.outerHTML = `<span id="${element?.id}" class="sapp-input-dragNDrop" indexBox="${
              index + 1
            }"> </span>`
          }
        })
        setQuestionContent(doc)
      }
    }, [defaultAnswer, corrects, str, isSelfReflection])

    useEffect(() => {
      // Add touch event options to document
      const options = { passive: false }

      // Add touch-action CSS
      const style = document.createElement('style')
      style.textContent = `
        .sapp-input-dragNDrop, .sapp-store, .answer-box {
          touch-action: none !important;
        }
      `
      document.head.appendChild(style)

      // Add event listeners with options
      const preventTouch = (e: TouchEvent) => {
        if (dragState.isDragging) {
          e.preventDefault()
        }
      }

      document.addEventListener('touchmove', preventTouch, options)
      document.addEventListener('touchstart', preventTouch, options)

      return () => {
        document.removeEventListener('touchmove', preventTouch)
        document.removeEventListener('touchstart', preventTouch)
        document.head.removeChild(style)
      }
    }, [dragState.isDragging])

    const options = {
      replace: (domNode: any) => {
        if (domNode?.attribs?.class === 'sapp-input-dragNDrop') {
          const answerElement = domNode.children?.find((child: any) =>
            child.attribs?.class?.includes('answer-box'),
          )

          return (
            <span
              id={domNode?.attribs?.id}
              className="sapp-input-dragNDrop dropable"
              onDrop={(e) => drop(e, data?.id)}
              onDragOver={allowDrop}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, data?.id)}
              {...{ indexBox: domNode?.attribs?.indexbox }}
            >
              {answerElement && (
                <span
                  id={answerElement.attribs?.id}
                  className="answer-box drag-icon"
                  draggable="true"
                  onDragStart={drag}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={(e) => handleTouchEnd(e, data?.id)}
                >
                  {answerElement.children?.[0]?.data}
                </span>
              )}
            </span>
          )
        }
        if (domNode?.attribs?.class === 'answer-box drag-icon') {
          return (
            <span
              id={domNode?.attribs?.id}
              className={domNode?.attribs?.class}
              draggable="true"
              onDragStart={drag}
              onTouchStart={handleTouchStart}
              onTouchMove={(e) => {
                handleTouchMove(e)
              }}
            >
              {domNode?.data}
            </span>
          )
        }
      },
    }

    // Thêm useLayoutEffect để đăng ký event listeners sớm hơn
    useLayoutEffect(() => {
      const addNonPassiveEventListener = (element: HTMLElement) => {
        element.addEventListener('touchstart', (e) => e.preventDefault(), {
          passive: false,
        })
        element.addEventListener('touchmove', (e) => e.preventDefault(), {
          passive: false,
        })
        element.addEventListener('touchend', (e) => e.preventDefault(), {
          passive: false,
        })
      }

      // Thêm listeners cho tất cả các phần tử drag-drop
      const dragElements = document.querySelectorAll(
        '.drag-icon, .dropable, .sapp-store',
      )
      dragElements.forEach((el) =>
        addNonPassiveEventListener(el as HTMLElement),
      )

      return () => {
        dragElements.forEach((el) => {
          el.removeEventListener('touchstart', (e) => e.preventDefault())
          el.removeEventListener('touchmove', (e) => e.preventDefault())
          el.removeEventListener('touchend', (e) => e.preventDefault())
        })
      }
    }, [])

    return (
      <>
        <div className="body-modal-white -mt-2" key={key} id={`${uuid}`}>
          {questionContent && (
            <>
              <div
                id="hightlight_area"
                onMouseUp={(e: any) => {
                  if (
                    e?.target?.tagName?.charAt(0) !== 'm' &&
                    e?.target?.firstChild?.tagName !== 'math'
                  ) {
                    if (allowHighLight) {
                      runHighlight(
                        handleSaveHighLight,
                        allowHighLight,
                        'hightlight_area',
                      )
                    } else if (allowUnHighLight) {
                      runHighlight(
                        handleSaveHighLight,
                        allowUnHighLight,
                        'hightlight_area',
                        { color: 'white' },
                      )
                    }
                  }
                }}
              >
                {data?.question_topic?.exhibits &&
                  !isHideExhibit &&
                  data?.question_topic?.exhibits?.length > 0 && (
                    <>
                      {data?.question_topic?.description && (
                        <div className="my-6 border border-b-gray-300" />
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
                        {data?.question_topic?.exhibits?.map(
                          (e: any, i: number) => (
                            <div
                              className="cursor-pointer hover:text-primary"
                              key={e.id}
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
                          ),
                        )}
                      </div>
                      <div className="my-6 border border-b-gray-300" />
                    </>
                  )}
                <EditorReader
                  className="questions"
                  text_editor_content={
                    questionContent?.documentElement?.querySelector('body')
                      ?.innerHTML || ''
                  }
                  options={options}
                  highlighted={highlighted}
                />
              </div>
              {!corrects && (
                <div className="answer-area">
                  <div className="text-base font-medium">Drag your answer</div>
                  <div
                    className={`sapp-store flex flex-wrap gap-5 ${storageId}`}
                    id="storage"
                    onDrop={(e) => drop(e, data?.id)}
                    onDragOver={allowDrop}
                    onTouchEnd={(e) => handleTouchEnd(e, data?.id)}
                  >
                    {data?.answers?.map((e: any) => {
                      if (answered) {
                        for (const as of answered) {
                          if (as?.idAnswer === e?.id || as?.id === e?.id) {
                            return null
                          }
                        }
                      }
                      return (
                        <span
                          key={e?.id}
                          className="answer-box drag-icon"
                          id={e?.id}
                          draggable="true"
                          onDragStart={drag}
                          onTouchStart={handleTouchStart}
                          onTouchMove={(e) => {
                            handleTouchMove(e)
                          }}
                          onTouchEnd={(ev) => handleTouchEnd(ev, data?.id)}
                        >
                          {e?.answer}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
          {answerContent && (
            <div className={correctAnswerClass}>
              <SappDivider />
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
              <SappDivider />
              <SappTitleSolution title={`${MY_COURSES.explanations}:`} />
              <EditorReader className="mt-4" text_editor_content={solution} />
            </div>
          )}
        </div>
      </>
    )
  },
)
DragNDropPreview.displayName = 'DragNDropPreview'
export default DragNDropPreview
