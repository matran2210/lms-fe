import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

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
}
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
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const storageId = uniqueId('storage')
    const [answered, setAnswered] = useState<any>([])
    useEffect(() => {
      setAnswered(defaultAnswer)
    }, [defaultAnswer])
    function allowDrop(ev: any) {
      ev.preventDefault()
    }

    function drag(ev: any) {
      ev.dataTransfer.setData('text', ev.target.id)
      ev.dataTransfer.setData('questionId', data.id)
    }
    function drop(ev: any, dropId: string, dropItem?: boolean) {
      ev.preventDefault()
      const slotId = ev.target.id
      const slotElement = document.getElementById(slotId)
      const questionId = ev.dataTransfer.getData('questionId')
      const storage = document.querySelector(`.${storageId}`)
      if (questionId === dropId) {
        var data = ev.dataTransfer.getData('text')
        if (
          slotElement?.children.length === 0 &&
          ev.target.classList.contains('dropable') &&
          !dropItem
        ) {
          ev.target.appendChild(document.getElementById(data))
        } else if (dropItem) {
          const parent = ev.target.parentNode
          storage?.appendChild(ev.target)
          parent.appendChild(document.getElementById(data))
          return
        }
      } else return
    }

    const handleStorage = (event: any, id: string) => {
      // prevent the default behavior of the drop event
      event.preventDefault()
      // get the id of the dragged piece from the dataTransfer object
      const pieceId = event.dataTransfer.getData('text')
      const questId = event.dataTransfer.getData('questionId')

      // get the storage element from the DOM
      const storage = document.querySelector(`.${storageId}`)
      // append the piece element to the storage element
      if (event.target === storage && questId === id) {
        storage?.appendChild(document.getElementById(pieceId) as any)
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
      DeserializeHighlight(highlighted)
    }, [questionContent])
    useEffect(() => {
      const doc = parser.parseFromString(str, 'text/html')
      const doc2 = parser.parseFromString(str, 'text/html')
      // if (refContent?.current) {
      const elements = doc.querySelectorAll('.question-content-tag')
      const elementsCorrects = doc2.querySelectorAll('.question-content-tag')

      if (corrects) {
        elementsCorrects.forEach((element: any, index: number) => {
          element.outerHTML = `<span id="${element.id}" class="sapp-input-dragNDrop-answer corrects">
        <span id="${corrects[index].id}" class="flex justify-center w-full">${corrects[index].answer}</span>
        </span>`
        })
        elements.forEach((element: any, index: number) => {
          if (defaultAnswer?.length > 0) {
            if (defaultAnswer[index].value !== '') {
              element.outerHTML = `<span  id="${
                element.id
              }" class="sapp-input-dragNDrop-answer ${
                defaultAnswer[index].idAnswer === corrects[index].id
                  ? 'corrects'
                  : 'wrongs'
              }">
            <span id="${
              defaultAnswer[index].idAnswer
            }" class="flex justify-center w-full">${
              defaultAnswer[index].value
            }</span>
            </span>`
            } else {
              element.outerHTML = `<span id="${element.id}" class= "sapp-input-dragNDrop-answer wrongs">
              <span class="sapp-input-dragNDrop-empty"></span>
            </span>`
              //   })
            }
          } else {
            element.outerHTML = `<span id="${element.id}" class= "sapp-input-dragNDrop-answer wrongs">
            <span class="sapp-input-dragNDrop-empty"></span>
          </span>`
          }
        })
        setAnswerContent(doc2)
        setQuestionContent(doc)
      } else {
        elements.forEach((element: any, index: number) => {
          if (defaultAnswer?.length > 0) {
            if (defaultAnswer[index].value !== '') {
              element.outerHTML = `<span id="${
                element.id
              }" class="sapp-input-dragNDrop" indexBox="${index + 1}">
                <span class="answer-box" id="${
                  defaultAnswer[index].idAnswer
                }">${defaultAnswer[index].value}</span>
               </span>
              `
            } else {
              element.outerHTML = `<span id="${
                element.id
              }" class="sapp-input-dragNDrop" indexBox="${index + 1}"> </span>`
            }
          } else {
            element.outerHTML = `<span  id="${
              element.id
            }" class="sapp-input-dragNDrop" indexBox="${index + 1}"> </span>`
          }
        })
        setQuestionContent(doc)
      }
      // }
    }, [defaultAnswer, corrects])
    const options = {
      replace(domNode: any) {
        if (
          domNode.attribs &&
          domNode.attribs.class === 'sapp-input-dragNDrop'
        ) {
          if (domNode.children.length > 1) {
            const children = domNode.children[1]
            return (
              <span
                id={domNode.attribs.id}
                className="sapp-input-dragNDrop dropable"
                onDrop={() => drop(event, data.id)}
                onDragOver={allowDrop}
                {...{ indexBox: domNode.attribs.indexbox }}
              >
                <span
                  id={children.attribs.id}
                  className={children.attribs.class}
                  onDrop={() => drop(event, data.id, true)}
                  onDragOver={allowDrop}
                  draggable="true"
                  onDragStart={drag}
                >
                  {children?.children[0]?.data}
                </span>
              </span>
            )
          } else {
            return (
              <span
                id={domNode.attribs.id}
                className="sapp-input-dragNDrop dropable"
                onDrop={() => drop(event, data.id)}
                onDragOver={allowDrop}
                {...{ indexBox: domNode.attribs.indexbox }}
              ></span>
            )
          }
        }
        if (domNode.attribs && domNode.attribs.class === 'answer-box') {
          return (
            <span
              id={domNode.attribs.id}
              className={domNode.attribs.class}
              onDrop={() => drop(event, data.id)}
              onDragOver={allowDrop}
              draggable="true"
              {...{ indexBox: domNode.attribs.indexbox }}
            >
              {domNode?.data}
            </span>
          )
        }
      },
    }
    return (
      <div className="body-modal-white" key={key} ref={extenalRef || null}>
        {questionContent && (
          <>
            <div
              id="hightlight_area"
              onMouseUp={(e: any) => {
                if (
                  e.target.tagName.charAt(0) !== 'm' &&
                  e.target.firstChild?.tagName !== 'math'
                ) {
                  if (e) {
                    runHighlight(handleSaveHighLight, allowHighLight || false)
                  }
                }
              }}
            >
              <EditorReader
                className="questions"
                text_editor_content={
                  questionContent?.documentElement.querySelector('body')
                    ?.innerHTML || ''
                }
                options={options}
              />
            </div>
            {!corrects && (
              <div className="answer-area">
                <div
                  className={`border min-h-large sapp-store flex flex-wrap gap-5 p-5 w-full ${storageId}`}
                  onDrop={(ev) => handleStorage(ev, data?.id)}
                  onDragOver={allowDrop}
                  id="storage"
                >
                  {data?.answers?.map((e: any) => {
                    if (answered) {
                      for (let as of answered) {
                        if (as.idAnswer === e.id) {
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
                        onDrop={() => drop(event, data.id, true)}
                      >
                        {e.answer}
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
            <div className="font-semibold text-xl mt-5">Correct Answer:</div>
            <EditorReader
              className="questions mt-2"
              text_editor_content={
                answerContent?.documentElement.querySelector('body')
                  ?.innerHTML || ''
              }
            />
          </>
        )}
        {solution && (
          <div className="bg-gray-4 mt-6 p-6">
            <div className="font-semibold text-base text-bw-1 ">Solution</div>
            <EditorReader className="mt-4" text_editor_content={solution} />
          </div>
        )}
      </div>
    )
  },
)
DragNDropPreivew.displayName = 'DragNDropPreivew'
export default DragNDropPreivew
