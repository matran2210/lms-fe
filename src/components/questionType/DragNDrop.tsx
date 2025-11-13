import EditorReader from '@components/base/editor/EditorReader'
import { runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { SappTitleSolution } from '@components/common/SappTitleSolution'
import { MY_COURSES } from 'src/constants/lang'
import { DragDropAnswerItem } from 'src/type'
import { IExhibitData } from 'src/type/exhibit'
import SappDivider from '@components/common/SappDivider'

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
}
let dragParentIdRef: string
const DragNDropPreivew = forwardRef(
  (
    {
      data,
      action,
      handleSaveHighLight,
      highlighted,
      removeHighlight,
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
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const storageId = uniqueId('storage')
    const [answered, setAnswered] = useState<any>([])
    const [isDropEnd, setIsDopEnd] = useState<string>('')
    const isSelfReflection = data?.is_self_reflection

    useEffect(() => {
      const answerOfStudent = action ? action() : defaultAnswer
      const filledAnswered =
        answerOfStudent && answerOfStudent?.length
          ? answerOfStudent
          : defaultAnswer
      setAnswered(filledAnswered)
    }, [defaultAnswer])

    useEffect(() => {
      if (isDropEnd) {
        handleGetData?.(action())
      } else {
      }
    }, [isDropEnd])

    function allowDrop(ev: any) {
      ev.preventDefault()

      // Lấy tọa độ của sự kiện kéo
      const x = ev.clientX // Tọa độ ngang
      const y = ev.clientY // Tọa độ dọc

      // Giới hạn tọa độ tối đa
      const maxX = 535
      const maxY = 160

      // Kiểm tra tọa độ có trong giới hạn
      if (x <= maxX && y <= maxY) {
      } else {
        ev.stopPropagation() // Ngăn sự kiện nếu không chấp thuận
      }
    }

    function drag(ev: any) {
      ev?.dataTransfer?.setData('text', ev?.target?.id)
      ev?.dataTransfer?.setData('questionId', data?.id)

      if (uuid) {
        dragParentIdRef = ev?.target?.closest(`#${uuid}`)?.id
      }
    }
    function drop(ev: any, dropId: string, dropItem?: boolean) {
      ev.preventDefault()
      setIsDopEnd(crypto.randomUUID())

      const slotElement = ev?.target

      if (uuid && (!dragParentIdRef || dragParentIdRef !== uuid)) {
        return
      }
      dragParentIdRef = ''

      const questionId = ev?.dataTransfer?.getData('questionId')

      let storage
      if (uuid) {
        storage = slotElement
          ?.closest(`#${uuid}`)
          ?.querySelector(`.${storageId}`)
      } else {
        storage = document?.querySelector(`.${storageId}`)
      }

      if (questionId === dropId) {
        var data = ev.dataTransfer.getData('text')

        let draggingItem

        if (uuid) {
          draggingItem = slotElement
            ?.closest(`#${uuid}`)
            ?.querySelector(`[id="${data}"]`)
        } else {
          draggingItem = document?.getElementById(data)
        }

        if (
          slotElement?.children?.length === 0 &&
          ev?.target?.classList?.contains('dropable') &&
          !dropItem
        ) {
          ev?.target?.appendChild(draggingItem)
        } else if (dropItem) {
          const parent = ev?.target?.parentNode
          storage?.appendChild(ev?.target)
          parent.appendChild(draggingItem)
          return
        }
      } else return
    }

    const handleStorage = (event: any, id: string) => {
      // prevent the default behavior of the drop event
      event.preventDefault()
      // get the id of the dragged piece from the dataTransfer object
      const pieceId = event?.dataTransfer?.getData('text')
      const questId = event?.dataTransfer?.getData('questionId')

      // get the storage element from the DOM
      let storage
      if (uuid) {
        storage = event?.target
          ?.closest(`#${uuid}`)
          ?.querySelector(`.${storageId}`)
      } else {
        storage = document?.querySelector(`.${storageId}`)
      }
      // append the piece element to the storage element
      if (event?.target === storage && questId === id) {
        if (uuid) {
          storage?.appendChild(
            event?.target
              ?.closest(`#${uuid}`)
              ?.querySelector(`[id="${pieceId}"]`) as any,
          )
        } else {
          storage?.appendChild(document?.getElementById(pieceId) as any)
        }
      } else return
    }

    const str = data?.question_content
    const parser = new DOMParser()

    const [questionContent, setQuestionContent] = useState<any>()
    const [answerContent, setAnswerContent] = useState<any>()
    const [key, setKey] = useState(1)
    useImperativeHandle(ref, () => ({
      handleReset() {
        setKey((prev) => {
          const newKey = prev + 1
          return newKey
        })
      },
    }))

    useEffect(() => {
      const doc = parser?.parseFromString(str, 'text/html')
      const doc2 = parser?.parseFromString(str, 'text/html')
      // if (refContent?.current) {
      const elements = doc?.querySelectorAll('.question-content-tag')
      const elementsCorrects = doc2?.querySelectorAll('.question-content-tag')
      if (corrects) {
        elementsCorrects.forEach((element: any, index: number) => {
          element.outerHTML = `<span id="${element?.id}" class="sapp-input-dragNDrop-answer corrects ">
        <span id="${corrects[index].id}" class="flex justify-center w-full">${corrects[index].answer}</span>
        </span>`
        })
        elements.forEach((element: any, index: number) => {
          if (defaultAnswer?.length > 0) {
            if (defaultAnswer?.[index]?.value !== '') {
              element.outerHTML = `<span  id="${element?.id}" class="sapp-input-dragNDrop-answer  ${
                defaultAnswer?.[index]?.idAnswer === corrects?.[index]?.id ||
                isSelfReflection === true
                  ? 'corrects'
                  : 'wrongs'
              }">
            <span id="${
              defaultAnswer?.[index]?.idAnswer
            }" class="flex justify-center w-full min-w-[100px]">${
              defaultAnswer?.[index]?.value
            }</span>
            </span>`
            } else {
              element.outerHTML = `<span id="${element?.id}" class= "sapp-input-dragNDrop-answer min-w-[100px] ${
                isSelfReflection === true ? 'corrects' : 'wrongs'
              }">
              <span class="sapp-input-dragNDrop-empty"></span>
            </span>`
              //   })
            }
          } else {
            element.outerHTML = `<span id="${element?.id}" class= "sapp-input-dragNDrop-answer ${
              isSelfReflection === true ? 'corrects' : 'wrongs'
            }">
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
                <span class="answer-box" id="${
                  defaultAnswer?.[index]?.idAnswer
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
      // }
    }, [defaultAnswer, corrects, str])

    const options = {
      replace(domNode: any) {
        if (
          domNode?.attribs &&
          domNode?.attribs?.class === 'sapp-input-dragNDrop'
        ) {
          if (domNode.children.length > 1) {
            const children = domNode?.children?.[1]
            return (
              <span
                id={domNode?.attribs?.id}
                className="sapp-input-dragNDrop dropable"
                onDrop={() => drop(event, data?.id)}
                onDragOver={allowDrop}
                {...{ indexBox: domNode?.attribs?.indexbox }}
              >
                <span
                  id={children?.attribs?.id}
                  className={children?.attribs?.class}
                  onDrop={() => drop(event, data?.id, true)}
                  onDragOver={allowDrop}
                  draggable="true"
                  onDragStart={drag}
                >
                  {children?.children?.[0]?.data}
                </span>
              </span>
            )
          } else {
            return (
              <span
                id={domNode?.attribs?.id}
                className="sapp-input-dragNDrop dropable"
                onDrop={() => drop(event, data?.id)}
                onDragOver={allowDrop}
                {...{ indexBox: domNode?.attribs?.indexbox }}
                style={{
                  height: '60px',
                }}
              ></span>
            )
          }
        }
        if (domNode?.attribs && domNode?.attribs?.class === 'answer-box') {
          return (
            <span
              id={domNode?.attribs?.id}
              className={domNode?.attribs?.class}
              onDrop={() => drop(event, data?.id)}
              onDragOver={allowDrop}
              draggable="true"
              {...{ indexBox: domNode?.attribs?.indexbox }}
            >
              {domNode?.data}
            </span>
          )
        }
      },
    }
    return (
      <div
        className="body-modal-white -mt-2"
        key={key}
        ref={extenalRef || null}
        id={`${uuid}`}
      >
        {questionContent && (
          <>
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
              {data?.question_topic?.exhibits &&
                !isHideExhibit &&
                data?.question_topic?.exhibits?.length > 0 && (
                  <>
                    {data?.question_topic?.description && (
                      <div className="my-6 border border-b-gray-2"></div>
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
                      {data?.question_topic?.exhibits?.map(
                        (e: any, i: number) => {
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
                              {exhibitText || 'Exhibit'} {i + 1}: {e?.name}
                            </div>
                          )
                        },
                      )}
                    </div>
                    <div className="my-6 border border-b-gray-2"></div>
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
                <div
                  className={`sapp-store flex min-h-large w-full flex-wrap gap-5 border p-5 ${storageId}`}
                  onDrop={(ev) => handleStorage(ev, data?.id)}
                  onDragOver={allowDrop}
                  id="storage"
                >
                  {data?.answers?.map((e: any) => {
                    if (answered) {
                      for (let as of answered) {
                        if (as?.idAnswer === e?.id) {
                          return null
                        }
                      }
                    }
                    return (
                      <span
                        className={`answer-box`}
                        key={e?.id}
                        id={e?.id}
                        draggable="true"
                        onDragStart={drag}
                        onDrop={() => drop(event, data?.id, true)}
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
          <>
            <SappDivider />
            <div className="text-base font-semibold">Correct Answer</div>
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
          <>
            <SappDivider />
            <SappTitleSolution title={MY_COURSES.explanations} />
            <EditorReader className="mt-4" text_editor_content={solution} />
          </>
        )}
      </div>
    )
  },
)
DragNDropPreivew.displayName = 'DragNDropPreivew'
export default DragNDropPreivew
