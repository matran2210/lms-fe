import EditorReader from '@components/base/editor/EditorReader'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { runHighlight } from '@utils/index'
import { Divider } from 'antd'
import clsx from 'clsx'
import { Element, HTMLReactParserOptions } from 'html-react-parser'
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { FieldValues, UseFormWatch } from 'react-hook-form'
import { SappTitleSolution } from 'src/common/SappTitleSolution'
import { MY_COURSES } from 'src/constants/lang'

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
  watch?: UseFormWatch<FieldValues>
  explainClassname?: string
}

const NewFilltext = forwardRef(
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
      watch,
      explainClassname,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const refEditor = useRef(null) as any
    const [questionContent, setQuestionContent] = useState<any>()
    const [answerContent, setAnswerContent] = useState<any>()
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

    const str = data?.question_content
    const parser = new DOMParser()
    const isSelfReflection = data?.is_self_reflection

    useImperativeHandle(ref, () => ({
      handleReset() {
        const doc = parser.parseFromString(str, 'text/html')
        const elements = doc.querySelectorAll('.question-content-tag')
        elements.forEach((_, index) => {
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

      elements.forEach((element, index) => {
        element.setAttribute('index', index.toString())
        const defaultValue = defaultAnswer?.[index] || ''
        setValue(`${name}.${index}`, defaultValue)
      })

      if (corrects) {
        elementCorrects.forEach((element, index) => {
          const inputId = element.id
          let inputClass = ''
          const correctAnswer = corrects?.filter(
            (ans) => ans.answer_position === index + 1,
          )
          if (correctAnswer) {
            inputClass = 'text-success-600'
            element.outerHTML = `
              <span>
                <span id="${inputId}" class="${inputClass}">
                  ${correctAnswer
                    .map((e, i) =>
                      i < correctAnswer.length - 1
                        ? e.answer + ' / '
                        : e.answer,
                    )
                    .join('')}
                </span>
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
        if ((domNode as Element).attribs?.class === 'question-content-tag') {
          const index = Number((domNode as Element).attribs.index)
          const inputValue =
            watch?.(`${name}.${index}`) ?? defaultAnswer?.[index] // Lấy từ watch nếu có

          if (!corrects) {
            return (
              <span
                className="relative my-0.5 inline-block border-b border-[#A1A1A1]"
                style={{
                  display: 'inline-block',
                  height: '34px',
                  width: '110px',
                }}
              >
                <div
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gray-100 text-sm font-normal text-[#A1A1A1] transition-opacity duration-150 ${
                    focusedIndex === index || inputValue
                      ? 'opacity-0'
                      : 'opacity-100'
                  }`}
                >
                  ({index + 1})
                </div>
                <HookFormTextField
                  control={control}
                  name={`${name}.${index}`}
                  inputClassName="border-none outline-none text-center"
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                />
              </span>
            )
          } else {
            let inputClass = ''
            const correctAnswer = corrects.find(
              (ans) =>
                ans.answer_position === index + 1 &&
                ans.answer?.trim()?.toLowerCase() ===
                  inputValue?.trim()?.toLowerCase(),
            )
            inputClass =
              correctAnswer || isSelfReflection
                ? ' inline-block !border-0 !bg-transparent text-success text-center !p-0 '
                : ' inline-block !border-0 !bg-transparent text-[#d35563] text-center !p-0'

            return (
              <span>
                {corrects.length > 0 ? (
                  <div
                    id={(domNode as Element).attribs.id}
                    className={inputClass}
                  >
                    {inputValue}
                  </div>
                ) : (
                  <input
                    disabled
                    type="text"
                    id={(domNode as Element).attribs.id}
                    className={`sapp-input-preview ${inputClass}`}
                    value={inputValue}
                  />
                )}
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
          }}
          extenalRef={refEditor}
          className="sapp-questions sapp-editor-reader"
          text_editor_content={
            questionContent?.documentElement?.querySelector('body')
              ?.innerHTML || ''
          }
          highlighted={highlighted}
          options={options}
        />

        {answerContent && (
          <>
            <Divider className="my-8" />
            <div className="mt-[38px] text-base font-semibold">
              Correct Answer:
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
          <>
            <Divider className="my-8 bg-gray-300" />
            <div className={explainClassname}>
              <SappTitleSolution title={`${MY_COURSES.solution}:`} />
              <EditorReader className="mt-4" text_editor_content={solution} />
            </div>
          </>
        )}
      </div>
    )
  },
)

NewFilltext.displayName = 'NewFilltext'
export default NewFilltext
