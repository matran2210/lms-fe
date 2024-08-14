import EditorReader from '@components/base/editor/EditorReader'
import { runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
import { MY_COURSES } from 'src/constants/lang'
import { IExhibitData } from 'src/type/exhibit'

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
  allowUnHighLight?: boolean
  uuid?: string
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
  isHideExhibit?: boolean
  isAlwaysShowAnswer?: boolean
}
type IProp = {
  value: string
  className?: string
}
let dragParentIdRef: string
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
      allowUnHighLight,
      uuid,
      setOpenFile,
      isHideExhibit = true,
      isAlwaysShowAnswer = false,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const [defaultValue, setDefaultValue] = useState<any>()
    const [answers, setAnswers] = useState<any>()
    const [correctAnswer, setCorrectAnswer] = useState<any>()
    const [storageId, setStoreId] = useState(uniqueId('storage'))
    const matchingQuestionRef = useRef<HTMLDivElement>(null)
    const isSelfReflection = data?.is_self_reflection

    function allowDrop(ev: any) {
      ev?.preventDefault()

      const slotElement = ev?.target
      slotElement?.classList?.add('dragging')

      const matchingQuestion = matchingQuestionRef?.current
      if (!matchingQuestion) return

      const rect = matchingQuestion?.getBoundingClientRect()

      // Lấy chiều dài của phần tử matchingQuestion
      const matchingQuestionHeight = matchingQuestion?.clientHeight

      // Lấy tọa độ y của con trỏ chuột tính từ đỉnh của phần tử matchingQuestion
      const mouseY = ev?.clientY - rect?.top

      // Thiết lập ngưỡng cho việc cuộn
      const threshold = 200

      // Kiểm tra nếu con trỏ chuột nằm ở phía trên ngưỡng
      if (mouseY < threshold) {
        matchingQuestion?.scrollBy(0, -10)
      }

      // Kiểm tra nếu con trỏ chuột nằm ở phía dưới ngưỡng
      if (mouseY > matchingQuestionHeight - threshold) {
        matchingQuestion?.scrollBy(0, 10)
      }
    }
    function allowDropStorage(ev: any) {
      if (ev?.target?.classList?.contains('dropable')) {
        ev?.preventDefault()
      } else {
        return
      }
    }

    function drag(ev: any) {
      ev?.dataTransfer?.setData('text', ev.target.id)
      ev?.dataTransfer?.setData('questionId', data.id)

      if (uuid) {
        dragParentIdRef = ev?.target?.closest(`#${uuid}`)?.id
      }
    }

    function drop(ev: any, dropId: string, dropItem?: boolean) {
      ev.preventDefault()

      const slotElement = ev?.target
      slotElement?.classList?.remove('dragging')

      if (uuid && (!dragParentIdRef || dragParentIdRef !== uuid)) {
        return
      }
      dragParentIdRef = ''

      const questionId = ev?.dataTransfer.getData('questionId')
      var data = ev?.dataTransfer?.getData('text')

      let draggingItem

      if (uuid) {
        draggingItem = slotElement
          .closest(`#${uuid}`)
          ?.querySelector(`[id="${data}"]`)
      } else {
        draggingItem = document?.getElementById(data)
      }

      const oldParent = draggingItem?.parentNode
      if (questionId === dropId) {
        if (
          slotElement?.children?.length === 0 &&
          ev?.target?.classList?.contains('dropable') &&
          !dropItem
        ) {
          ev?.target?.appendChild(draggingItem)
        } else if (dropItem) {
          const parent = ev?.target?.parentNode
          oldParent?.appendChild(ev?.target)
          parent.appendChild(draggingItem)
          return
        }
      } else return
    }
    const handleStorage = (event: any, id: string) => {
      // prevent the default behavior of the drop event
      event.preventDefault()
      // get the id of the dragged piece from the dataTransfer object
      const pieceId = event?.dataTransfer.getData('text')
      const questId = event?.dataTransfer.getData('questionId')
      // get the storage element from the DOM
      let storage
      if (uuid) {
        storage = event?.target
          ?.closest(`#${uuid}`)
          ?.querySelector(`.${storageId}`)
      } else {
        storage = document.querySelector(`.${storageId}`)
      }
      // append the piece element to the storage element
      if (event.target === storage && questId === id) {
        if (uuid) {
          storage?.appendChild(
            event?.target
              .closest(`#${uuid}`)
              ?.querySelector(`[id="${pieceId}"]`) as any,
          )
        } else {
          storage?.appendChild(document.getElementById(pieceId) as any)
        }
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
    // useEffect(() => {
    //   if (data) {
    //     DeserializeHighlight(highlighted)
    //   }
    // }, [data])
    function shuffleArray(array: Array<any>) {
      let currentIndex = array?.length,
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
        arr.push(quest?.answer)
        if (defaultAnswer) {
          obj[quest?.id] = data?.question_matchings.find(
            (el: any) =>
              el?.answer?.id ===
              defaultAnswer.find((e: any) => e?.question_id === quest?.id)
                ?.answer_id,
          )
        }
      }
      shuffleArray(arr)
      if (corrects) {
        for (let correct of corrects) {
          if (defaultAnswer || isAlwaysShowAnswer) {
            objCorrect[correct?.id] = correct?.answer
          }
        }
        setCorrectAnswer(objCorrect)
      }

      if (defaultAnswer) {
        for (let e of defaultAnswer) {
          arr = arr?.filter((el) => el?.id !== e?.answer_id)
        }
      }
      setAnswers(arr)
      setDefaultValue(obj)
    }, [defaultAnswer, data?.question_matchings])
    return (
      <div key={key} ref={extenalRef} id={`${uuid}`}>
        <div
          id="hightlight_area"
          onMouseUp={(e: any) => {
            if (
              e?.target?.tagName?.charAt(0) !== 'm' &&
              e?.target?.firstChild?.tagName !== 'math'
            ) {
              // if(e){
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
              // }
            }
          }}
        >
          {data?.question_topic?.exhibits &&
            !isHideExhibit &&
            data?.question_topic?.exhibits?.length > 0 && (
              <>
                {!!data?.question_topic?.description && (
                  <div className="my-6 border border-b-gray-2"></div>
                )}
                <div className="mb-4 flex items-center">
                  <div className="font-semibold">
                    Exhibits({data?.question_topic?.exhibits?.length || 0})
                  </div>
                  <div className="ml-4">
                    <span className="text-state-error">* </span>
                    <span className="text-gray-1">Click to view</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {data?.question_topic?.exhibits?.map((e: any, i: number) => {
                    return (
                      <div
                        className="cursor-pointer hover:text-primary"
                        key={e?.id ?? i}
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
                        Exhibit {i + 1}: {e?.name}
                      </div>
                    )
                  })}
                </div>
                <div className="my-6 border border-b-gray-2"></div>
              </>
            )}
          <EditorReader
            className="sapp-questions !mb-[32px]"
            text_editor_content={data?.question_content}
            highlighted={highlighted}
          />
        </div>
        {!corrects ? (
          <div
            className="flex flex-col gap-y-5 px-19"
            ref={matchingQuestionRef}
          >
            {data?.question_matchings?.map((e: any) => {
              return (
                <div className="flex flex-nowrap gap-x-20 " key={e?.id}>
                  <QuestionCard value={e?.content} />
                  <div
                    id={e?.id}
                    className="sapp-match-result dropable flex-1"
                    onDrop={() => drop(event, data?.id)}
                    onDragOver={() => allowDrop(event)}
                  >
                    {defaultValue?.[e?.id]?.id && (
                      <div
                        // className="w-fit"
                        className="sapp-notched-container min-w-132px"
                        id={defaultValue[e?.id]?.answer?.id}
                        draggable="true"
                        onDragStart={drag}
                        onDrop={() => drop(event, data?.id, true)}
                        onDragOver={() => allowDrop(event)}
                      >
                        {defaultValue[e?.id]?.answer?.answer}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <div
              className={`sapp-store dropable flex min-h-large flex-wrap gap-5 overflow-hidden border p-5 ${storageId}`}
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
                    onDrop={() => drop(event, data?.id, true)}
                    onDragOver={() => allowDrop(event)}
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
                      correctAnswer?.[e?.id]?.id ||
                    isSelfReflection === true ? (
                      <>
                        <QuestionCard
                          value={e?.content}
                          className="sapp-arrowed-container-corrects !border-gray-6 before:!border-gray-6"
                        />
                        <div
                          // id={e?.id}
                          className="sapp-match-result flex-1"
                        >
                          {defaultValue?.[e?.id]?.id && (
                            <div
                              // className="w-fit"
                              className="sapp-notched-container-corrects min-w-132px !border-gray-6 before:!border-gray-6"
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
                          className="sapp-match-result flex-1"
                        >
                          {defaultValue?.[e?.id]?.id && (
                            <div
                              // className="w-fit"
                              className="sapp-notched-container-incorrects min-w-132px text-state-error"
                              // id={defaultValue[e?.id]?.answer.id}
                            >
                              {defaultValue[e?.id]?.answer?.answer}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col gap-y-5 pt-[42px]">
              <div className=" text-base font-semibold">Correct Answer</div>

              {data?.question_matchings?.map((e: any, index: number) => {
                return (
                  <div
                    className="flex flex-nowrap justify-between px-[123px]"
                    key={index}
                  >
                    <QuestionCard
                      value={e?.content}
                      className="sapp-arrowed-container-corrects text-state-success"
                    />
                    <div className="sapp-match-result flex-1">
                      {correctAnswer?.[e?.id]?.id && (
                        <div
                          // className="w-fit"
                          className="sapp-notched-container-corrects min-w-132px text-state-success"
                        >
                          {correctAnswer?.[e?.id]?.answer}
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
          <div className="mt-6 bg-gray-4 p-6">
            <SappTitleSolution title={MY_COURSES.explanations} />
            <EditorReader className="mt-4 " text_editor_content={solution} />
          </div>
        )}
      </div>
    )
  },
)
MatchingQuestion.displayName = 'MatchingQuestion'
export default memo(MatchingQuestion)
