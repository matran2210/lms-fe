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

interface IAnswer {
  id: string
  answer: string
  answer_position?: number
}

interface IQuestionMatching {
  id: string
  content: string
}

interface IQuestionTopic {
  description?: string
  exhibits?: IExhibitData[]
}

interface IMatchingQuestionData {
  id: string
  question_content: string
  question_matchings: IQuestionMatching[]
  answers: IAnswer[]
  question_topic?: IQuestionTopic
  is_self_reflection?: boolean
}

interface IDefaultAnswer {
  question_id: string
  answer_id: string
}

interface ICorrectAnswer {
  id: string
  answer: IAnswer
}

interface IHighlightData {
  start: number
  end: number
  color: string
}

interface IMatchingQuestionRef {
  handleReset: () => void
  handleGetResult: () => Record<string, { id: string; answer: IAnswer }>
}

interface IProps {
  data: IMatchingQuestionData
  action?: () => Record<string, IQuestionMatching>
  handleSaveHighLight?: (highlight: IHighlightData) => void
  highlighted?: IHighlightData[]
  removeHighlight?: (highlight: IHighlightData) => void
  allowHighLight?: boolean
  defaultAnswer?: IDefaultAnswer[]
  done?: boolean
  extenalRef?: (element: HTMLDivElement | null) => void
  index?: number
  corrects?: ICorrectAnswer[]
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
  exhibitText?: string
}

type IProp = {
  value: string
  className?: string
}

const MatchingQuestion = forwardRef(
  (
    {
      data,
      handleSaveHighLight,
      highlighted,
      allowHighLight,
      allowUnHighLight,
      defaultAnswer,
      extenalRef,
      corrects,
      solution,
      uuid,
      setOpenFile,
      isHideExhibit = true,
      isAlwaysShowAnswer = false,
      exhibitText = 'Exhibit',
    }: IProps,
    ref: ForwardedRef<IMatchingQuestionRef>,
  ) => {
    const [defaultValue, setDefaultValue] = useState<
      Record<string, { id: string; answer: IAnswer }>
    >({})
    const [answers, setAnswers] = useState<IAnswer[]>([])
    const [correctAnswer, setCorrectAnswer] = useState<Record<string, IAnswer>>(
      {},
    )
    const [key, setKey] = useState<string>('1')
    const isSelfReflection = data?.is_self_reflection
    const isProcessingRef = useRef(false)
    const hasLocalModifications = useRef(false)

    const findAnswerById = (answerId?: string): IAnswer | null => {
      if (!answerId) return null
      return data?.answers?.find((a) => a?.id === answerId) ?? null
    }

    const [dragging, setDragging] = useState<{ answerId: string } | null>(null)

    function handleDragStart(ev: React.DragEvent, answerId: string) {
      try {
        ev.dataTransfer?.setData('text/plain', String(answerId))
        ev.dataTransfer?.setData('parentQuestionId', String(data?.id))
        if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move'
      } catch (e) {}
      setDragging({ answerId })
    }

    function handleDragOver(ev: React.DragEvent) {
      ev.preventDefault()
    }

    function handleDropToMatch(ev: React.DragEvent, targetMatchId: string) {
      ev.preventDefault()
      ev.stopPropagation()

      if (isProcessingRef.current) return
      isProcessingRef.current = true

      const parentQuestionId =
        ev.dataTransfer?.getData('parentQuestionId') || String(data?.id)
      if (String(parentQuestionId) !== String(data?.id)) {
        setDragging(null)
        isProcessingRef.current = false
        return
      }

      const answerId =
        ev.dataTransfer?.getData('text/plain') || dragging?.answerId
      if (!answerId) {
        setDragging(null)
        isProcessingRef.current = false
        return
      }

      const sourceMatchId = Object.keys(defaultValue).find(
        (k) => defaultValue[k]?.answer?.id === answerId,
      )

      const draggedAnswerObj =
        answers.find((a) => String(a?.id) === String(answerId)) ||
        (sourceMatchId ? defaultValue[sourceMatchId]?.answer : null)

      if (!draggedAnswerObj) {
        setDragging(null)
        isProcessingRef.current = false
        return
      }

      const targetAnswerObj = defaultValue[targetMatchId]?.answer || null

      setDefaultValue((prev) => {
        const next = { ...prev }

        if (sourceMatchId && sourceMatchId !== targetMatchId) {
          const dragged = prev[sourceMatchId]
          next[targetMatchId] = { ...dragged, id: targetMatchId }

          if (targetAnswerObj) {
            const target = prev[targetMatchId]
            next[sourceMatchId] = { ...target, id: sourceMatchId }
          } else {
            delete next[sourceMatchId]
          }
        } else {
          const draggedMatching = {
            id: targetMatchId,
            answer: draggedAnswerObj,
          }
          next[targetMatchId] = draggedMatching
        }

        hasLocalModifications.current = true
        return next
      })

      setAnswers((prev) => {
        let next = prev.filter((a) => String(a?.id) !== String(answerId))
        if (!sourceMatchId && targetAnswerObj) {
          next = [...next, targetAnswerObj]
        }
        return next
      })

      setDragging(null)
      isProcessingRef.current = false
    }

    function handleDropToStorage(ev: React.DragEvent) {
      ev.preventDefault()

      const parentQuestionId =
        ev.dataTransfer?.getData('parentQuestionId') || String(data?.id)
      if (String(parentQuestionId) !== String(data?.id)) {
        setDragging(null)
        return
      }

      const answerId =
        ev.dataTransfer?.getData('text/plain') || dragging?.answerId
      if (!answerId) {
        setDragging(null)
        return
      }

      const sourceMatchId = Object.keys(defaultValue).find(
        (k) => defaultValue[k]?.answer?.id === answerId,
      )

      const draggedAnswerObj = sourceMatchId
        ? defaultValue[sourceMatchId]?.answer
        : answers.find((a) => String(a?.id) === String(answerId))

      if (!draggedAnswerObj) {
        setDragging(null)
        return
      }

      setAnswers((prev) => {
        if (prev.find((a) => a?.id === draggedAnswerObj?.id)) return prev
        return [...prev, draggedAnswerObj]
      })

      if (sourceMatchId) {
        setDefaultValue((prev) => {
          const next = { ...prev }
          delete next[sourceMatchId]
          return next
        })
      }

      setDragging(null)
    }

    useImperativeHandle(ref, () => ({
      handleReset() {
        setKey(uniqueId('key'))
        setAnswers(data?.answers ?? [])
        setDefaultValue({})
      },
      handleGetResult() {
        return defaultValue
      },
    }))

    const QuestionCard = ({
      value,
      className = 'sapp-arrowed-container',
    }: IProp) => {
      return <div className={`${className}`}>{value}</div>
    }

    function shuffleArray<T>(array: T[]): T[] {
      let currentIndex = array?.length,
        randomIndex
      while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        ;[array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ]
      }
      return array
    }

    useEffect(() => {
      let arr: IAnswer[] = data?.answers ? shuffleArray([...data.answers]) : []
      let obj: Record<string, { id: string; answer: IAnswer }> = {}
      let objCorrect: Record<string, IAnswer> = {}

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
          const foundAns = data?.answers?.find((a) => a.id === e.answer_id)
          if (foundAns)
            obj[e.question_id] = { id: e.question_id, answer: foundAns }
        }
        arr = arr.filter(
          (el) => !defaultAnswer.find((e) => e.answer_id === el.id),
        )
      }

      setAnswers(arr)
      setDefaultValue(obj)
    }, [defaultAnswer, data?.answers, corrects, isAlwaysShowAnswer])

    return (
      <div key={key} ref={extenalRef} id={`${uuid}`} data-matching-ref>
        <div
          id="hightlight_area"
          onMouseUp={(e: React.MouseEvent) => {
            const target = e?.target as HTMLElement
            if (
              target?.tagName?.charAt(0) !== 'm' &&
              (target?.firstChild as HTMLElement)?.tagName !== 'math'
            ) {
              if (allowHighLight) {
                runHighlight(handleSaveHighLight, true, 'hightlight_area')
              } else if (allowUnHighLight) {
                runHighlight(handleSaveHighLight, true, 'hightlight_area', {
                  color: 'white',
                })
              }
            }
          }}
        >
          <EditorReader
            className="sapp-questions !mb-[32px]"
            text_editor_content={data?.question_content}
            highlighted={highlighted as any}
          />
        </div>

        {!corrects ? (
          <div className="flex flex-col gap-y-5 px-19">
            {data?.question_matchings?.map((e: IQuestionMatching) => (
              <div className="flex flex-nowrap gap-x-20" key={e?.id}>
                <QuestionCard value={e?.content} />
                <div
                  id={e?.id}
                  className="sapp-match-result dropable min-h-[48px] flex-1"
                  onDragOver={handleDragOver}
                  onDrop={(ev) => handleDropToMatch(ev, e?.id)}
                >
                  {defaultValue?.[e?.id]?.answer && (
                    <div
                      className="sapp-notched-container min-w-132px"
                      id={String(defaultValue[e?.id]?.answer?.id)}
                      draggable
                      onDragStart={(ev) =>
                        handleDragStart(ev, defaultValue[e?.id]?.answer?.id)
                      }
                      onDragOver={handleDragOver}
                      onDrop={(ev) => handleDropToMatch(ev, e?.id)}
                    >
                      {defaultValue[e?.id]?.answer?.answer}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div
              className="sapp-store dropable flex min-h-large flex-wrap gap-5 overflow-hidden border p-5"
              onDragOver={handleDragOver}
              onDrop={handleDropToStorage}
              id="storage"
            >
              {answers?.map((answer: IAnswer) => (
                <div
                  key={answer?.id}
                  className="sapp-notched-container min-w-fit"
                  id={String(answer?.id)}
                  draggable
                  onDragStart={(ev) => handleDragStart(ev, answer?.id)}
                  onDragOver={handleDragOver}
                >
                  {answer?.answer}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-y-5 px-[123px]">
              {data?.question_matchings?.map(
                (e: IQuestionMatching, index: number) => (
                  <div className="flex flex-nowrap justify-between" key={index}>
                    {defaultValue?.[e?.id]?.answer?.id ===
                      correctAnswer?.[e?.id]?.id || isSelfReflection ? (
                      <>
                        <QuestionCard
                          value={e?.content}
                          className="sapp-arrowed-container-corrects !border-gray-6 before:!border-gray-6"
                        />
                        <div className="sapp-match-result flex-1">
                          {defaultValue?.[e?.id]?.answer && (
                            <div className="sapp-notched-container-corrects min-w-132px !border-gray-6 before:!border-gray-6">
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
                        <div className="sapp-match-result flex-1">
                          {defaultValue?.[e?.id]?.answer && (
                            <div className="sapp-notched-container-incorrects min-w-132px text-state-error">
                              {defaultValue[e?.id]?.answer?.answer}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ),
              )}
            </div>

            <div className="flex flex-col gap-y-5 pt-[42px]">
              <div className=" text-base font-semibold">Correct Answer</div>
              {data?.question_matchings?.map(
                (e: IQuestionMatching, index: number) => (
                  <div
                    className="flex flex-nowrap justify-between px-[123px]"
                    key={index}
                  >
                    <QuestionCard
                      value={e?.content}
                      className="sapp-arrowed-container-corrects text-state-success"
                    />
                    <div className="sapp-match-result flex-1">
                      {correctAnswer?.[e?.id] && (
                        <div className="sapp-notched-container-corrects min-w-132px text-state-success">
                          {correctAnswer?.[e?.id]?.answer}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </>
        )}

        {solution && (
          <div className="mt-6 bg-gray-4 p-6">
            <SappTitleSolution title={MY_COURSES.explanations} />
            <EditorReader className="mt-4" text_editor_content={solution} />
          </div>
        )}
      </div>
    )
  },
)

MatchingQuestion.displayName = 'MatchingQuestion'
export default memo(MatchingQuestion)
