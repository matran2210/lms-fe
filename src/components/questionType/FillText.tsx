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
  allowUnHighLight?: boolean
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
      allowUnHighLight,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const refEditor = useRef(null) as any
    const [questionContent, setQuestionContent] = useState<any>()
    const [answerContent, setAnswerContent] = useState<any>()
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
      const doc2 = parser.parseFromString(str, 'text/html')
      const elementCorrects = doc2.querySelectorAll('.question-content-tag')
      elements.forEach((element, index) => {
        const inputId = element.id
        const inputValue = defaultAnswer?.[index] || ''

        let inputClass
        if (corrects) {
          const correctAnswer = corrects?.find(
            (ans: any) =>
              ans.answer_position === index + 1 &&
              ans.answer.trim().toLowerCase() ===
                inputValue.trim().toLowerCase(),
          )
          inputClass = correctAnswer
            ? '!border-success text-state-success text-center !font-normal'
            : '!border-danger text-danger text center !font-normal'
        }

        element.outerHTML = `
        <span>
          <input ${
            corrects ? 'disabled' : ''
          } type="text" id="${inputId}" class="sapp-input-preview ${inputClass}" stringHTML="true" value="${inputValue}" />
        </span>
      `
      })
      if (corrects) {
        elementCorrects.forEach((element, index) => {
          const inputId = element.id
          const inputValue = defaultAnswer?.[index] || ''

          let inputClass
          // if (corrects) {
          const correctAnswer = corrects?.filter(
            (ans: any) => ans.answer_position === index + 1,
          )
          if (correctAnswer) {
            inputClass = 'text-base font-semibold text-state-success'
            // }
            element.outerHTML = `
                <span>
                <span id="${inputId}" class = "${inputClass}">${correctAnswer
                  .map((e, i) => {
                    if (i < correctAnswer.length - 1) {
                      return e.answer + ' / '
                    } else return e.answer
                  })
                  .join('')} <span/>
                </span>
                `
          }
        })
        setAnswerContent(doc2)
      }

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
      <div ref={extenalRef}>
        <EditorReader
          id="hightlight_area"
          onMouseUp={(e: any) => {
            if (
              e.target.tagName.charAt(0) !== 'm' &&
              e.target.firstChild?.tagName !== 'math'
            ) {
              if (e) {
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
        {answerContent && (
          <>
            <div className="font-semibold text-base pt-[22px]">
              Correct Answer
            </div>
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
AddWordPreview.displayName = 'AddWordPreview'
export default AddWordPreview
