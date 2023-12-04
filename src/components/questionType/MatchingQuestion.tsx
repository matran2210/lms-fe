import React from 'react'

interface IProps {
  data: any
  action?: any
}
type IProp = {
  value: string
}

const MatchingQuestion = ({ data, action }: IProps) => {
  function allowDrop(ev: any) {
    ev.preventDefault()
  }

  function drag(ev: any) {
    ev.dataTransfer.setData('text', ev.target.id)
  }

  function drop(ev: any) {
    ev.preventDefault()
    const slotId = ev.target.id
    const slotElement = document.getElementById(slotId)
    var data = ev.dataTransfer.getData('text')
    if (slotElement?.children.length === 0) {
      ev.target.appendChild(document.getElementById(data))
    } else return
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
  const QuestionCard = ({ value }: IProp) => {
    return <div className="sapp-arrowed-container">{value}</div>
  }
  return (
    <div>
      <div
        className="sapp-questions"
        dangerouslySetInnerHTML={{ __html: data?.question_content }}
      />
      <div className="flex flex-col gap-y-5">
        {data?.question_matchings.map((e: any) => {
          return (
            <div className="flex flex-wrap gap-x-8 justify-between" key={e?.id}>
              <QuestionCard value={e?.content} />
              <div
                id={e?.id}
                className="flex-1 sapp-match-result"
                onDrop={() => drop(event)}
                onDragOver={() => allowDrop(event)}
              ></div>
            </div>
          )
        })}
        <div
          className="border min-h-large sapp-store flex flex-wrap gap-5 p-5"
          onDrop={handleStorage}
          onDragOver={allowDrop}
          id="storage"
        >
          {data?.question_matchings.map((e: any) => {
            return (
              <div
                // className="w-fit"
                key={e?.answer?.id}
                className="sapp-notched-container min-w-132px"
                id={e?.answer?.id}
                draggable="true"
                onDragStart={drag}
                onDrop={() => {}}
                onDragOver={() => {}}
              >
                {e?.answer?.answer}
              </div>
            )
          })}
        </div>
      </div>
      {/* <button onClick={action}>Check Answer</button> */}
    </div>
  )
}
export default MatchingQuestion
