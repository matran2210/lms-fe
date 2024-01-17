import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import {
  ForwardedRef,
  forwardRef,
  memo,
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
  extenalRef?: any
  index?: number
  corrects?: any
  solution?: string
}
type IProp = {
  value: string
  className?: string
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
      extenalRef,
      corrects,
      solution,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const [defaultValue, setDefaultValue] = useState<any>()
    const [answers, setAnswers] = useState<any>()
    const [correctAnswer, setCorrectAnswer] = useState<any>()
    const [storageId, setStoreId] = useState(uniqueId('storage'))

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
      ev.dataTransfer.setData('questionId', data.id)
    }

    function drop(ev: any, dropId: string) {
      ev.preventDefault()
      const slotId = ev.target.id
      const slotElement = document.getElementById(slotId)
      const questionId = ev.dataTransfer.getData('questionId')
      if (questionId === dropId) {
        var data = ev.dataTransfer.getData('text')
        if (
          slotElement?.children.length === 0 &&
          ev.target.classList.contains('dropable')
        ) {
          ev.target.appendChild(document.getElementById(data))
        } else {
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
      handleGetResult() {
        // action()
      },
    }))
    const QuestionCard = ({
      value,
      className = 'sapp-arrowed-container',
    }: IProp) => {
      return <div className={`${className}`}>{value}</div>
    }
    useEffect(() => {
      if (data) {
        DeserializeHighlight(highlighted)
      }
    }, [data])
    function shuffleArray(array: Array<any>) {
      let currentIndex = array.length,
        randomIndex
      // While there remain elements to shuffle
      while (currentIndex > 0) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        // And swap it with the current element
        ;[array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ]
      }
      return array
    }
    useEffect(() => {
      let obj = {} as any
      let objCorrect = {} as any
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
      shuffleArray(arr)
      if (corrects) {
        for (let correct of corrects) {
          if (defaultAnswer) {
            objCorrect[correct.id] = correct.answer
          }
        }
        setCorrectAnswer(objCorrect)
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
      <div key={key} ref={extenalRef}>
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
            className="sapp-questions !mb-[32px]"
            text_editor_content={data?.question_content}
          />
        </div>
        {!corrects ? (
          <div className="flex flex-col gap-y-5 px-19">
            {data?.question_matchings.map((e: any) => {
              return (
                <div className="flex flex-nowrap gap-x-20 " key={e?.id}>
                  <QuestionCard value={e?.content} />
                  <div
                    id={e?.id}
                    className="flex-1 sapp-match-result dropable"
                    onDrop={() => drop(event, data.id)}
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
              className={`border min-h-large sapp-store flex flex-wrap gap-5 p-5 dropable ${storageId}`}
              onDrop={(ev) => handleStorage(ev, data?.id)}
              onDragOver={allowDropStorage}
              id="storage"
            >
              {answers?.map((answer: any) => {
                return (
                  <div
                    // className="w-fit"
                    key={answer?.id}
                    className="sapp-notched-container min-w-fit"
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
        ) : (
          <>
            <div className="flex flex-col gap-y-5 px-[123px]">
              {data?.question_matchings.map((e: any, index: number) => {
                return (
                  <div className="flex flex-nowrap justify-between" key={index}>
                    {defaultValue?.[e?.id]?.answer?.id ===
                    correctAnswer?.[e?.id]?.id ? (
                      <>
                        <QuestionCard
                          value={e?.content}
                          className="sapp-arrowed-container-incorrects !border-gray-6 before:!border-gray-6"
                        />
                        <div
                          // id={e?.id}
                          className="flex-1 sapp-match-result"
                        >
                          {defaultValue?.[e?.id]?.id && (
                            <div
                              // className="w-fit"
                              className="sapp-notched-container-incorrects min-w-132px !border-gray-6 before:!border-gray-6"
                              // id={defaultValue[e?.id]?.answer.id}
                            >
                              {defaultValue[e?.id]?.answer?.answer}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <QuestionCard
                          value={e?.content}
                          className="sapp-arrowed-container-incorrects text-state-error"
                        />
                        <div
                          // id={e?.id}
                          className="flex-1 sapp-match-result"
                        >
                          {defaultValue?.[e?.id]?.id && (
                            <div
                              // className="w-fit"
                              className="sapp-notched-container-incorrects min-w-132px text-state-error"
                              // id={defaultValue[e?.id]?.answer.id}
                            >
                              {defaultValue[e?.id].answer?.answer}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col gap-y-5 mt-28">
              <div className="text-bw-1 font-semibold text-base">
                Correct Answer
              </div>

              {data?.question_matchings.map((e: any, index: number) => {
                return (
                  <div
                    className="flex flex-nowrap justify-between px-[123px]"
                    key={index}
                  >
                    <QuestionCard
                      value={e?.content}
                      className="sapp-arrowed-container-corrects text-state-success"
                    />
                    <div className="flex-1 sapp-match-result">
                      {correctAnswer?.[e?.id]?.id && (
                        <div
                          // className="w-fit"
                          className="sapp-notched-container-corrects min-w-132px text-state-success"
                        >
                          {correctAnswer[e?.id].answer}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
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
MatchingQuestion.displayName = 'MatchingQuestion'
export default memo(MatchingQuestion)
