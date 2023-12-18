import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

interface IProps {
  data: any
  action?: any
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
  defaultAnswer?: any
  done?: boolean
}
type IProp = {
  value: string
}

const MatchingQuestion = forwardRef(
  (
    {
      data,
      action,
      handleSaveHighLight,
      highlighted,
      removeHighlight,
      allowHighLight,
      defaultAnswer,
      done,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const [defaultValue, setDefaultValue] = useState<any>()
    const [answers, setAnswers] = useState<any>()
    function allowDrop(ev: any) {
      const slotId = ev.target.id
      const slotElement = document.getElementById(slotId)

      if (
        slotElement?.children.length === 0 &&
        ev.target.classList.contains('dropable')
      ) {
        ev.preventDefault()
      } else {
        return
      }
    }
    function allowDropStorage(ev: any) {
      if (ev.target.classList.contains('dropable')) {
        ev.preventDefault()
      } else {
        return
      }
    }

    function drag(ev: any) {
      ev.dataTransfer.setData('text', ev.target.id)
    }

    function drop(ev: any) {
      ev.preventDefault()
      const slotId = ev.target.id
      const slotElement = document.getElementById(slotId)
      var data = ev.dataTransfer.getData('text')
      if (
        slotElement?.children.length === 0 &&
        ev.target.classList.contains('dropable')
      ) {
        ev.target.appendChild(document.getElementById(data))
      } else {
        return
      }
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
    const [key, setKey] = useState<string>('1')

    useImperativeHandle(ref, () => ({
      handleReset() {
        // setAnswered([])
        setKey((prev) => {
          const newKey = uniqueId('key')
          return newKey
        })
        // setAnswered()
      },
    }))
    const QuestionCard = ({ value }: IProp) => {
      return <div className="sapp-arrowed-container">{value}</div>
    }
    useEffect(() => {
      if (data) {
        DeserializeHighlight(highlighted)
      }
    }, [data])

    useEffect(() => {
      let obj = {} as any
      let arr = []
      for (let quest of data?.question_matchings) {
        arr.push(quest.answer)
        if (defaultAnswer) {
          obj[quest.id] = data?.question_matchings.find(
            (el: any) =>
              el.answer?.id ===
              defaultAnswer.find((e: any) => e.question_id === quest.id)
                ?.answer_id,
          )
        }
      }
      if (defaultAnswer) {
        for (let e of defaultAnswer) {
          arr = arr.filter((el) => el.id !== e.answer_id)
        }
      }
      setAnswers(arr)
      setDefaultValue(obj)
    }, [defaultAnswer, data.question_matchings])
    return (
      <div key={key}>
        <div
          id="hightlight_area"
          onMouseUp={(e: any) => {
            if (
              e.target.tagName.charAt(0) !== 'm' &&
              e.target.firstChild?.tagName !== 'math'
            ) {
              // if(e){
              runHighlight(handleSaveHighLight, allowHighLight || false)
              // }
            }
          }}
        >
          <EditorReader
            className="sapp-questions"
            text_editor_content={data?.question_content}
          />
        </div>
        {/* {!done && ( */}
        <div className="flex flex-col gap-y-5">
          {data?.question_matchings.map((e: any) => {
            return (
              <div
                className="flex flex-wrap gap-x-8 justify-between"
                key={e?.id}
              >
                <QuestionCard value={e?.content} />
                <div
                  id={e?.id}
                  className="flex-1 sapp-match-result dropable"
                  onDrop={() => drop(event)}
                  onDragOver={() => allowDrop(event)}
                >
                  {defaultValue?.[e?.id]?.id && (
                    <div
                      // className="w-fit"
                      className="sapp-notched-container min-w-132px"
                      id={defaultValue[e?.id]?.answer.id}
                      draggable="true"
                      onDragStart={drag}
                      onDrop={() => {}}
                      onDragOver={() => {}}
                    >
                      {defaultValue[e?.id].answer?.answer}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div
            className="border min-h-large sapp-store flex flex-wrap gap-5 p-5 dropable"
            onDrop={handleStorage}
            onDragOver={allowDropStorage}
            id="storage"
          >
            {answers?.map((answer: any) => {
              return (
                <div
                  // className="w-fit"
                  key={answer?.id}
                  className="sapp-notched-container min-w-132px"
                  id={answer?.id}
                  draggable="true"
                  onDragStart={drag}
                  onDrop={() => {}}
                  onDragOver={() => {}}
                >
                  {answer?.answer}
                </div>
              )
            })}
          </div>
        </div>
        {/* )} */}
        {/* <button onClick={action}>Check Answer</button> */}
      </div>
    )
  },
)
MatchingQuestion.displayName = 'MatchingQuestion'
export default MatchingQuestion
