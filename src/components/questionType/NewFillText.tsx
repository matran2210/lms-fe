import EditorReader from '@components/base/editor/EditorReader'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { runHighlight } from '@utils/index'
import { Element, HTMLReactParserOptions } from 'html-react-parser'
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
  control: any
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
  name?: string
  setValue?: any
}
const NewFiltext = forwardRef(
  (
    {
      control,
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
      name,
      setValue,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    // useEffect(() => {
    //   if (defaultAnswer) {
    //     defaultAnswer.forEach((e: any, i: number) => {
    //       if (e) {
    //         setValue(`${name}.${i}`, e)
    //       } else {
    //         setValue(`${name}.${i}`, '')
    //       }
    //     })
    //   } else {
    //     setValue(name, '')
    //   }
    // }, [defaultAnswer])
    const refEditor = useRef(null) as any
    const [questionContent, setQuestionContent] = useState<any>()
    const [answerContent, setAnswerContent] = useState<any>()
    const str = data?.question_content
    const parser = new DOMParser()
    useImperativeHandle(ref, () => ({
      handleReset() {
        const doc = parser.parseFromString(str, 'text/html')
        const elements = doc.querySelectorAll('.question-content-tag')
        elements.forEach((element: globalThis.Element, index: number) => {
          setValue(`${name}.${index}`, '')
        })
      },
      handleGetResult() {
        // return getValues()
      },
    }))
    useEffect(() => {
      const doc = parser.parseFromString(str, 'text/html')
      const elements = doc.querySelectorAll('.question-content-tag')
      const doc2 = parser.parseFromString(str, 'text/html')
      const elementCorrects = doc2.querySelectorAll('.question-content-tag')
      elements.forEach((element: globalThis.Element, index: number) => {
        element.setAttribute('index', index.toString())
        if (defaultAnswer?.[index]) {
          setValue(`${name}.${index}`, defaultAnswer[index])
        } else {
          setValue(`${name}.${index}`, '')
        }
      })
      if (corrects) {
        elementCorrects.forEach((element, index) => {
          const inputId = element.id
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
    }, [str, corrects, defaultAnswer])
    const options: HTMLReactParserOptions = {
      replace(domNode) {
        if (!corrects) {
          if (
            (domNode as Element).attribs &&
            (domNode as Element).attribs.class === 'question-content-tag'
          ) {
            return (
              <span
                style={{
                  display: 'inline-block',
                  height: ' 35px',
                  width: '110px',
                }}
              >
                <HookFormTextField
                  control={control}
                  name={`${name}.${Number((domNode as Element).attribs.index)}`}
                  inputClassName="!h-[35px]"
                />
              </span>
            )
          }
        } else {
          if (
            (domNode as Element).attribs &&
            (domNode as Element).attribs.class === 'question-content-tag'
          ) {
            const index = Number((domNode as Element).attribs.index)
            const inputValue = defaultAnswer?.[index]
            let inputClass
            if (corrects) {
              const correctAnswer = corrects?.find(
                (ans: any) =>
                  ans.answer_position === index + 1 &&
                  ans.answer?.trim()?.toLowerCase() ===
                    inputValue?.trim()?.toLowerCase(),
              )
              inputClass = correctAnswer
                ? '!border-success text-state-success text-center !font-normal'
                : '!border-danger text-danger text center !font-normal'
            }
            return (
              <span>
                <input
                  disabled
                  type="text"
                  id={(domNode as Element).attribs.id}
                  className={'sapp-input-preview ' + inputClass}
                  value={inputValue}
                />
              </span>
            )
          }
        }
      },
    }
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
          extenalRef={refEditor}
          className="sapp-questions"
          text_editor_content={
            questionContent?.documentElement?.querySelector('body')
              ?.innerHTML || ''
          }
          highlighted={highlighted}
          options={options}
        />
        {answerContent && (
          <>
            <div className="font-semibold text-base mt-5">Correct Answer</div>
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
NewFiltext.displayName = 'AddWordPreview'
export default NewFiltext
