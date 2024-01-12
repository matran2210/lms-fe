import EditorReader from '@components/base/editor/EditorReader'
import { DeserializeHighlight, runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import React, {
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
const SelectWord = forwardRef(
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
    const [answerContent, setAnswerContent] = useState<any>()
    const str = data?.question_content
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
    const formatAnswer = (data: any) => {
      let objAnswer: any = {}
      for (let e of data?.answers) {
        if (!objAnswer[e.answer_position]) {
          objAnswer[e.answer_position] = []
        }
        objAnswer[e.answer_position].push({
          label: e.answer,
          value: e.id,
          result: e.is_correct,
        })
      }
      return objAnswer
    }
    const answerObj = formatAnswer(data)

    const parser = new DOMParser()

    useEffect(() => {
      const doc = parser.parseFromString(str, 'text/html')
      const elements = doc.querySelectorAll('.question-content-tag')
      const doc2 = parser.parseFromString(str, 'text/html')
      const elementCorrects = doc2.querySelectorAll('.question-content-tag')

      elements.forEach((element, index) => {
        const selectElement = document.createElement('select')
        selectElement.classList.add('sapp-select--selectword-preview')
        selectElement.setAttribute('required', 'true')
        selectElement.id = element.id

        const defaultAnswerValue = defaultAnswer?.[index] || ''

        let optionClass = ''

        if (corrects) {
          const isCorrect = corrects?.some(
            (correct) =>
              correct.answer_position === index + 1 &&
              correct.id === defaultAnswerValue &&
              correct.is_correct,
          )
          optionClass = isCorrect ? '!border-success' : '!border-danger'
          const textClass = isCorrect
            ? 'text-state-success'
            : 'text-state-error'
          selectElement.classList.add(optionClass)
          selectElement.classList.add('sapp-select-confirmed')
          selectElement.classList.add(textClass)
          selectElement.setAttribute('disabled', 'true')
          selectElement.innerHTML = `
        <option value="" disabled selected ></option>
        ${answerObj[+index + 1].map((e: any) => {
          const isSelected = e.value === defaultAnswerValue

          return `<option value="${e.value}" ${isSelected ? 'selected' : ''} >${
            e.label
          }</option>`
        })}
      `
        } else {
          selectElement.innerHTML = `
          <option value="" disabled selected >Choose</option>
          ${answerObj[+index + 1].map((e: any) => {
            const isSelected = e.value === defaultAnswerValue

            return `<option value="${e.value}" ${
              isSelected ? 'selected' : ''
            } >${e.label}</option>`
          })}
          `
        }

        element.replaceWith(selectElement)
      })
      if (corrects) {
        elementCorrects.forEach((element, index) => {
          const inputId = element.id
          const inputValue = defaultAnswer?.[index] || ''

          let inputClass
          // if (corrects) {
          const correctAnswer = corrects?.find(
            (ans: any) => ans.answer_position === index + 1 && ans.is_correct,
          )
          if (correctAnswer) {
            inputClass = 'text-base font-semibold text-state-success'
            // }

            element.outerHTML = `
                <span>
                <span id="${inputId}" class = "${inputClass}">${correctAnswer.answer} <span/>
                </span>
                `
          }
        })
        setAnswerContent(doc2)
      }

      setQuestionContent(doc)
    }, [defaultAnswer])

    useEffect(() => {
      if (data) {
        DeserializeHighlight(highlighted)
      }
    }, [data])
    return (
      <div>
        <EditorReader
          key={key}
          extenalRef={refEditor}
          className="sapp-questions"
          // style={{borderBottom: '1px solid  white'}}
          text_editor_content={
            questionContent?.documentElement.querySelector('body')?.innerHTML ||
            ''
          }
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
        {answerContent && (
          <>
            <div className="font-semibold text-base mt-5">Correct Answer:</div>
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
          <div className="bg-gray-4 mt-6 p-6 ">
            <div className="font-semibold text-base text-bw-1 ">Solution</div>
            <EditorReader className="mt-4" text_editor_content={solution} />
          </div>
        )}
      </div>
    )
  },
)
SelectWord.displayName = 'SelectWord'
export default SelectWord
