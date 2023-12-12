import { DeserializeHighlight, runHighlight } from '@utils/index'
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
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const [answered, setAnswered] = useState<any>([])
    const refContent = useRef(null) as any

    function allowDrop(ev: any) {
      ev.preventDefault()
    }

    function drag(ev: any) {
      ev.dataTransfer.setData('text', ev.target.id)
    }

    const handleStorage = (event: any) => {
      // prevent the default behavior of the drop event
      event.preventDefault()
      // get the id of the dragged piece from the dataTransfer object
      const pieceId = event.dataTransfer.getData('text')
      // get the storage element from the DOM
      const storage = document.querySelector('.sapp-store')
      // append the piece element to the storage element
      if (event.target === storage) {
        storage?.appendChild(document.getElementById(pieceId) as any)
      } else return
    }
    const str = data?.question_content
    const parser = new DOMParser()

    const [questionContent, setQuestionContent] = useState<any>()
    const [key, setKey] = useState(1)
    useImperativeHandle(ref, () => ({
      handleReset() {
        setAnswered([])
        setKey((prev) => {
          const newKey = prev + 1
          return newKey
        })
        // setAnswered()
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
        if (answered.length > 0) {
          if (answered[index].value !== '') {
            element.outerHTML = `<span type="text" id="${element.id}" class="sapp-input-dragNDrop dropable" ondrop="drop(event)" ondragover="allowDrop(event)">
            <span class="answer-box" draggable="true" ondragstart="drag(event)" id="${answered[index].idAnswer}">${answered[index].value}</span>
            </span>`
          } else {
            element.outerHTML = `<span type="text" id="${element.id}" class="sapp-input-dragNDrop dropable" ondrop="drop(event)" ondragover="allowDrop(event)"> </span>`
            //   })
          }
        } else {
          element.outerHTML = `<span type="text" id="${element.id}" class="sapp-input-dragNDrop dropable" ondrop="drop(event)" ondragover="allowDrop(event)"> </span>`
          //   })
        }
      })
      setQuestionContent(doc)
      // }
    }, [answered, refContent?.current])

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
              onMouseUp={() =>
                runHighlight(handleSaveHighLight, allowHighLight || false)
              }
            />
            <div className="answer-area">
              <div
                className="border min-h-large sapp-store flex flex-wrap gap-5 p-5 w-full"
                onDrop={handleStorage}
                onDragOver={allowDrop}
                id="storage"
              >
                {data?.answers?.map((e: any) => {
                  for (let as of answered) {
                    if (as.idAnswer === e.id) {
                      return <></>
                    }
                  }
                  return (
                    <span
                      className="answer-box"
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
