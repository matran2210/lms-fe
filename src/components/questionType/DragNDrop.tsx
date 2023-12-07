import { useEffect, useRef, useState } from 'react'

interface IProps {
  data?: any
  action?: any
}
const DragNDropPreivew = ({ data, action }: IProps) => {
  const [answered, setAnswered] = useState([
    {
      id: '3908eb7b-ce32-44f5-b9ed-3d220a14103f',
      value: 'which group of individuals having a common dwelling',
      idAnswer: '5fd73cc0-4f05-4990-97d8-7850d2359065',
    },
    {
      id: '299f4b5b-79cc-4e57-a306-f47bb4a3364d',
      value: 'must',
      idAnswer: '39e0d9f6-0be3-4efd-9bd0-86d1aeba14cc',
    },
    {
      id: 'ec251658-90af-468c-830b-46080b411082',
      value: '',
    },
    {
      id: 'f71b5419-ac10-49cd-b27b-07b2a4eb45f4',
      value: '',
    },
    {
      id: '0340aa86-2985-4841-8f70-59d7412ed8c6',
      value: 'some',
      idAnswer: '6e84ab95-59df-48bb-8c23-ca1b382a1fc1',
    },
  ])
  const ref = useRef(null) as any
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
  const doc = parser.parseFromString(str, 'text/html')
  useEffect(() => {
    if (ref?.current) {
      const elements = ref?.current.querySelectorAll('.question-content-tag')
      elements.forEach((element: any, index: number) => {
        if (answered[index].value !== '') {
          element.outerHTML = `<span type="text" id="${element.id}" class="sapp-input-dragNDrop dropable" ondrop="drop(event)" ondragover="allowDrop(event)">
                <span class="answer-box" draggable="true" ondragstart="drag(event)" id="${answered[index].idAnswer}">${answered[index].value}</span>
                </span>`
        } else {
          element.outerHTML = `<span type="text" id="${element.id}" class="sapp-input-dragNDrop dropable" ondrop="drop(event)" ondragover="allowDrop(event)"> </span>`
          //   })
        }
      })
    }
  }, [answered, ref?.current])

  return (
    <div className="body-modal-white">
      <div
        className="questions"
        ref={ref}
        dangerouslySetInnerHTML={{
          __html: doc.documentElement.querySelector('body')?.innerHTML || '',
        }}
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
      {/* <button onClick={action}>Check Answer</button> */}
    </div>
  )
}
export default DragNDropPreivew
