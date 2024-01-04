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
  data: any
  action?: any
  handleSaveHighLight?: any
  highlighted?: any
  removeHighlight?: any
  allowHighLight?: boolean
  defaultAnswer?: any
  corrects?: {
    id: string
    answer: string
    is_correct: boolean
    answer_position: number
  }[]
  extenalRef?: any
  solution?: string
}
const AddWordPreview = forwardRef(
  (
    {
      data,
      action,
      handleSaveHighLight,
      highlighted,
      removeHighlight,
      allowHighLight,
      defaultAnswer,
      corrects,
      extenalRef,
      solution,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const refEditor = useRef(null) as any
    const [questionContent, setQuestionContent] = useState<any>()
    const str = data?.question_content
    const parser = new DOMParser()
    const [key, setKey] = useState<string>(uniqueId('key'))
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

    useEffect(() => {
      const doc = parser.parseFromString(str, 'text/html')
      const elements = doc.querySelectorAll('.question-content-tag')

      elements.forEach((element, index) => {
        const inputId = element.id
        const inputValue = defaultAnswer?.[index] || ''

        let inputClass
        if (corrects) {
          const correctAnswer = corrects?.find(
            (ans: any) =>
              ans.answer_position === index + 1 && ans.answer === inputValue,
          )
          inputClass = correctAnswer
            ? 'border-success text-state-success'
            : 'border-danger text-danger'
        }

        element.outerHTML = `
        <span>
          <input ${
            corrects ? 'disabled' : ''
          } type="text" id="${inputId}" class="sapp-input-preview ${inputClass}" stringHTML="true" value="${inputValue}" />
        </span>
      `
      })

      setQuestionContent(doc)
    }, [defaultAnswer])

    // const checkError = () => {
    //   const data = getValueFillText()

    //   const answerMap = Object.fromEntries(
    //     activeQuestion?.answers?.map((item) => [
    //       `${item.answer_position}:${item.answer?.trim()}`,
    //       item.is_correct,
    //     ]) || [],
    //   )

    //   const elements = data?.map(
    //     (element) => answerMap[`${1}:${element?.trim()}`] || false,
    //   )

    //   const corrects = questionRef?.current?.querySelectorAll(
    //     '.sapp-input-preview',
    //   )

    //   if (corrects) {
    //     corrects.forEach((element, index) => {
    //       const isCorrect = elements?.[index]
    //       if (element instanceof HTMLElement) {
    //         element.classList.add(isCorrect ? 'border-success' : 'border-error')
    //       }
    //       element.classList.add('pointer-events-none')
    //     })
    //   }
    // }
    return (
      <div>
        <EditorReader
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
          key={key}
          extenalRef={refEditor}
          className="sapp-questions"
          text_editor_content={
            questionContent?.documentElement.querySelector('body')?.innerHTML ||
            ''
          }
          highlighted={highlighted}
        />
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
AddWordPreview.displayName = 'AddWordPreview'
export default AddWordPreview
