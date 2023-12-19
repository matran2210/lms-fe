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
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const storageId = uniqueId('storage')
    const [answered, setAnswered] = useState<any>([])
    const refContent = useRef(null) as any
    useEffect(() => {
      if (defaultAnswer) {
        setAnswered(defaultAnswer)
      }
    }, [])
    function allowDrop(ev: any) {
      ev.preventDefault()
    }

    function drag(ev: any) {
      ev.dataTransfer.setData('text', ev.target.id)
      ev.dataTransfer.setData('questionId', data.id)
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
      // if (refContent?.current) {
      const elements = doc.querySelectorAll('.question-content-tag')
      elements.forEach((element: any, index: number) => {
        if (defaultAnswer?.length > 0) {
          if (defaultAnswer[index].value !== '') {
            element.outerHTML = `<span type="text" id="${element.id}" class="sapp-input-dragNDrop dropable" ondrop="drop(event,'${data.id}')" ondragover="allowDrop(event,'${data.id}')">
            <span class="answer-box" draggable="true" ondragstart="drag(event, '${data.id}')" id="${defaultAnswer[index].idAnswer}">${defaultAnswer[index].value}</span>
            </span>`
          } else {
            element.outerHTML = `<span type="text" id="${element.id}" class="sapp-input-dragNDrop dropable ${data.id}" ondrop="drop(event,'${data.id}')" ondragover="allowDrop(event,'${data.id}')"> </span>`
            //   })
          }
        } else {
          element.outerHTML = `<span type="text" id="${element.id}" class="sapp-input-dragNDrop dropable ${data.id}" ondrop="drop(event,'${data.id}')" ondragover="allowDrop(event,'${data.id}')"> </span>`
          //   })
        }
      })
      setQuestionContent(doc)
      // }
    }, [defaultAnswer, refContent?.current])

    return (
      <div className="body-modal-white" key={key}>
        {questionContent && (
          <>
            <div
              className="questions"
              ref={refContent}
              dangerouslySetInnerHTML={{
                __html:
                  questionContent?.documentElement.querySelector('body')
                    ?.innerHTML || '',
              }}
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
            />
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
                    >
                      {e.answer}
                    </span>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* <button onClick={()=>{setKey(Math.random())}}>Check Answer</button> */}
      </div>
    )
  },
)
DragNDropPreivew.displayName = 'DragNDropPreivew'
export default DragNDropPreivew
