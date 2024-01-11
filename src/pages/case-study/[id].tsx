import {
  CalculatorIcon,
  CloseIcon,
  HelpIcon,
  HighlightIcon,
  ScratchPadIcon,
} from '@assets/icons'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import EditorReader from '@components/base/editor/EditorReader'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import MovableWindow from '@components/base/window'
import Calculator from '@components/calculator'
import { formatTime } from '@components/common/timer'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
import DragNDropPreivew from '@components/questionType/DragNDrop'
import AddWordPreview from '@components/questionType/FillText'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import { LAYOUT } from '@utils/constants'
import { runHighlight } from '@utils/index'
import { uniqueId } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { QUESTION_TYPES } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import {
  getTopicsCaseStudy,
  loadMoreQuestion,
} from 'src/redux/slice/Course/MyCourse/Case-study/CaseStudy'

const CaseStudyDetail = ({ questions }: any) => {
  const checkType = (
    e: any,
    index: number,
    data: any,
    type: string,
    currentTabID: string,
    defaultValue: any,
    corrects?: any,
    highlighted?: any,
    solution?: any,
    done?: boolean,
    requirement?: any,
    question_content?: any,
    ref?: any,
  ) => {
    switch (type) {
      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <OneChoiceQuestion
            data={data}
            control={control}
            name={`${index}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            corrects={corrects}
            handleSaveHighLight={() => {}}
            highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            // solution={solution}
          />
        )
      case QUESTION_TYPES.ONE_CHOICE:
        return (
          <OneChoiceQuestion
            data={data}
            control={control}
            name={`${index}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            corrects={corrects}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
          />
        )
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <MultiChoiceQuestion
            data={data}
            control={control}
            name={`${index}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            corrects={corrects}
          />
        )
      case QUESTION_TYPES.MATCHING:
        return (
          <MatchingQuestion
            data={data}
            // action={getAnswerMatching}
            // ref={ref}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            done={done}
            extenalRef={(el: any) => (ref.current[index || 0] = el)}
          />
        )
      case QUESTION_TYPES.FILL_WORD:
        return (
          <AddWordPreview
            data={data}
            // action={getValueFillText}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            extenalRef={(el: any) => (ref.current[index || 0] = el)}
          />
        )
      case QUESTION_TYPES.DRAG_DROP:
        return (
          <DragNDropPreivew
            data={data}
            // action={getAnswerDragNDrop}
            // ref={ref}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            extenalRef={(el: any) => (ref.current[index || 0] = el)}
          />
        )
      case QUESTION_TYPES.SELECT_WORD:
        return (
          <SelectWord
            data={data}
            // action={getValueSelectText}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
            extenalRef={(el: any) => (ref.current[index || 0] = el)}
          />
        )
      case QUESTION_TYPES.ESSAY:
        return (
          <EssayQuestionPreview
            data={requirement}
            question_content={question_content}
            index={1}
            question_data={data}
            control={control}
            handleSaveHighLight={() => {}}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            forCaseStudy={true}
            name={`${index}_answer`}
            setValue={setValue}
            defaultValue={defaultValue}
            fullData={data}
          />
        )
      default:
        return <div></div>
    }
  }
  const router = useRouter()
  const valueRef = useRef<any>([])
  const containerRef = useRef<any>(null)
  const { control, handleSubmit, getValues, setValue } = useForm()
  const { control: controlScratch } = useForm()
  const [allowHighLight, setAllowHighLight] = useState(false)
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const dispatch = useAppDispatch()
  const { topics, listFullQuestions, listQuestions, loading } = useAppSelector(
    (state) => state.caseStudyTestReducer,
  )
  const [quizAttempId, setQuizAttempId] = useState('')
  const [startTime, setStartTime] = useState(Date.now())
  useEffect(() => {
    if (router.query.id) {
      dispatch(
        getTopicsCaseStudy({
          id: router.query.id,
        }),
      )
    }
  }, [router.query.id])
  async function createAttempts(quiz_id: string, id: string) {
    const res = await CourseTestApi.createTopicAttempt(quiz_id, id)
    setQuizAttempId(res.data.id)
  }
  useEffect(() => {
    if (router.query.quiz_id && router.query.id) {
      createAttempts(router.query.quiz_id as string, router.query.id as string)
    }
  }, [router.query.id, router.query.quiz_id])
  const getValueFillText = (index: number) => {
    let value = []
    if (valueRef.current[index]) {
      const inputs = valueRef.current[index].querySelectorAll(
        'input[stringHTML="true"]',
      ) as any
      for (let e of inputs) {
        value.push(e.value)
      }
    } else {
      value.push('')
    }
    return value
  }
  const getValueSelectText = (index: number) => {
    let value = [] as any
    if (valueRef.current[index]) {
      const inputs = valueRef.current[index].querySelectorAll(
        'select.sapp-select--selectword-preview',
      ) as any

      for (let e of inputs) {
        value.push(e.value)
      }
    } else {
      value.push('')
    }
    return value
  }
  const getAnswerMatching = (index: number) => {
    let value = [] as any
    if (valueRef.current[index]) {
      const inputs = valueRef.current[index].querySelectorAll(
        '.sapp-match-result',
      ) as any
      for (let e of inputs) {
        const childId = e.querySelector('.sapp-notched-container')
        value.push({ question_id: e.id, answer_id: childId?.id || undefined })
      }
    } else {
      value.push({
        question_id: listFullQuestions[index].id,
        answer_id: '' || undefined,
      })
    }

    return value
  }
  const getAnswerDragNDrop = (index: number) => {
    let value = [] as any
    if (valueRef.current[index]) {
      const inputs = valueRef.current[index].querySelectorAll(
        '.sapp-input-dragNDrop',
      ) as any
      for (let e of inputs) {
        const idAnswer = e.querySelector('span')
        value.push({ id: e.id, value: e.innerText, idAnswer: idAnswer?.id })
      }
    } else {
      value.push({
        id: listFullQuestions[index].id,
        value: '',
        idAnswer: '',
      })
    }
    return value
  }
  const getAllValue = () => {
    let arrAnswer = []
    for (let i = 0; i < listQuestions.length; i++) {
      const question = Object.values(listQuestions[i])[0] as any
      if (
        question.qType === QUESTION_TYPES.ONE_CHOICE ||
        question.qType === QUESTION_TYPES.TRUE_FALSE ||
        question.qType === QUESTION_TYPES.MULTIPLE_CHOICE
      ) {
        arrAnswer.push({
          qType: question.qType,
          answer: getValues(`${i}_answer`),
          id: question.id,
          answers: question.answers,
        })
      } else if (question.qType === QUESTION_TYPES.MATCHING) {
        arrAnswer.push({
          qType: question.qType,
          answer: getAnswerMatching(i),
          id: question.id,
          answers: question.answers,
        })
      } else if (question.qType === QUESTION_TYPES.DRAG_DROP) {
        arrAnswer.push({
          qType: question.qType,
          answer: getAnswerDragNDrop(i),
          id: question.id,
          answers: question.answers,
        })
      } else if (question.qType === QUESTION_TYPES.SELECT_WORD) {
        arrAnswer.push({
          qType: question.qType,
          answer: getValueSelectText(i),
          id: question.id,
          answers: question.answers,
        })
      } else if (question.qType === QUESTION_TYPES.FILL_WORD) {
        arrAnswer.push({
          qType: question.qType,
          answer: getValueFillText(i),
          id: question.id,
          answers: question.answers,
        })
      } else if (question.qType == QUESTION_TYPES.ESSAY) {
        arrAnswer.push({
          qType: question.qType,
          answer: getValues(`${i}_answer`),
          id: question.id,
          answers: question.answers,
          response_option: question.response_option,
        })
      }
    }

    return arrAnswer
  }
  const handleSubmitQuestion = async () => {
    let allQuest = getAllValue()
    let quiz_position_mapping = []
    let answers = []
    let reformTabs: any[] = []
    for (let e of allQuest) {
      reformTabs.push({ ...e, done: true })
      if (e.answer || e.answer !== '') {
        if (
          e.qType === QUESTION_TYPES.ONE_CHOICE ||
          e.qType === QUESTION_TYPES.TRUE_FALSE
        ) {
          answers.push({
            question_id: e.id,
            question_answer_id: e.answer || '',
          })
        } else if (e.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
          let answer = []
          if (e.answer) {
            for (let el of e.answer) {
              answer.push({ answer_id: el })
            }
          } else {
            answer.push({ answer_id: '' })
          }
          answers.push({ question_id: e.id, answer })
        } else if (e.qType === QUESTION_TYPES.MATCHING) {
          answers.push({ question_id: e.id, answer: e.answer })
        } else if (e.qType === QUESTION_TYPES.DRAG_DROP) {
          let answer = []
          for (let i in e.answer) {
            if (e.answer[i].idAnswer) {
              answer.push({
                answer_id: e.answer[i].idAnswer,
                answer_position: +i + 1,
              })
            }
          }
          answers.push({ question_id: e.id, answer })
        } else if (e.qType === QUESTION_TYPES.SELECT_WORD) {
          let answer = []
          for (let i in e.answer) {
            if (e.answer[i] && e.answer[i] !== '') {
              answer.push({
                answer_id: e.answer[i],
                answer_position: +i + 1,
              })
            }
          }
          answers.push({ question_id: e.id, answer })
        } else if (e.qType === QUESTION_TYPES.FILL_WORD) {
          let answer = []
          for (let i in e.answer) {
            if (e.answer[i] && e.answer[i] !== '') {
              answer.push({
                answer_text: e.answer[i],
                answer_position: +i + 1,
              })
            }
          }
          answers.push({ question_id: e.id, answer })
        } else if (e.qType === QUESTION_TYPES.ESSAY) {
          answers.push({
            question_id: e.id,
            short_answers: e.answer || '',
            response_option: e.response_option ? e.response_option : 'WORD',
            active: 'NOT_GRADED',
          })
        }
      }
      quiz_position_mapping.push({
        question_id: e.id,
        answers: e?.answers,
      })
    }
    const total_attempt_time = Math.ceil((Date.now() - startTime) / 1000)
    if (quizAttempId) {
      await CourseTestApi.submitCaseStudy(quizAttempId as string, {
        answers: answers,
        quiz_position_mapping: quiz_position_mapping,
        total_attempt_time: total_attempt_time,
      })
    }
    return
  }
  const handleCloseScratchPad = (pad: any) => {
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      const newArr = arr.filter((e) => e.id !== pad.id)
      return newArr
    })
  }
  const handleOpenScratchPad = (type: string) => {
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      if (type === 'scratch_pad') {
        arr.push({ id: uniqueId('scratchPad'), type: type })
      } else if (type === 'calculator') {
        for (let e of arr) {
          if (e.type === 'calculator') {
            return arr
          }
        }
        arr.push({ id: 'calculator', type: 'calculator' })
      }
      return arr
    })
  }

  useEffect(() => {
    const handleBeforeUnload = async (event: any) => {
      event.preventDefault()
      await handleSubmitQuestion()
    }

    // Thêm lắng nghe sự kiện beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup khi component bị unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [listQuestions])
  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        try {
          handleSubmitQuestion()
          return true
        } catch (err) {
          return true
        }
        // Will run when leaving the current page; on back/forward actions
        // Add your logic here, like toggling the modal state
      }
      return true
    })

    return () => {
      router.beforePopState(() => true)
    }
  }, [listQuestions, router])
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden relative">
      {loading && (
        <div className="absolute w-screen h-screen backdrop-blur-sm flex justify-center items-center z-[1350]">
          Loading
        </div>
      )}
      {/* <div
        className={`absolute w-full bg-black h-[200px]`}
        style={{ top: 96 }}
      ></div> */}
      {/* Header */}
      <div className="h-full" ref={containerRef}>
        <div className="flex justify-between py-2 px-6 items-center bg-gray-3 ">
          <div className="text-bw-1 text-xl font-bold w-1/3 truncate">
            {topics.name}
          </div>
          <ButtonCancelSubmit
            className={'flex gap-4 flex-row-reverse w-1/3'}
            // color={color}
            submit={{
              title: 'Finish',
              size: 'medium',
              loading: false,
              disabled: false,
              onClick: () => {
                handleSubmitQuestion()
              },
            }}
            cancel={{
              title: 'Quit',
              size: 'medium',
              onClick: () => {
                router.back()
              },
              loading: false,
            }}
          ></ButtonCancelSubmit>
        </div>
        {/* End Header */}
        <div
          className="flex gap-5 h-[calc(100%-104px)] bg-gray-3"
          id={'preview-question'}
        >
          <div
            className="w-1/2 h-full overflow-auto bg-white p-6"
            id="hightlight_area_topic"
            onMouseUp={(e: any) => {
              if (
                e.target.tagName.charAt(0) !== 'm' &&
                e.target.firstChild?.tagName !== 'math'
              ) {
                if (e) {
                  runHighlight(
                    () => {},
                    allowHighLight || false,
                    'hightlight_area_topic',
                  )
                }
              }
            }}
          >
            {/* {topics} */}

            <div
              key={topics?.id}
              data-key={topics?.id}
              // className="min-h-[calc(100vh-104px)]"
            >
              <EditorReader
                className="editor-wrap"
                text_editor_content={topics?.description}
              />
            </div>
          </div>

          <div
            className="w-1/2 h-full overflow-auto bg-white py-6 "
            onScroll={(e) => {
              const { target } = e
              if (
                (target as any).scrollTop + (target as any).offsetHeight >=
                (target as any).scrollHeight
              ) {
                dispatch(loadMoreQuestion(''))
              }
            }}
          >
            <div
              className="px-6"
              id="hightlight_area"
              onMouseUp={(e: any) => {
                if (
                  e.target.tagName.charAt(0) !== 'm' &&
                  e.target.firstChild?.tagName !== 'math'
                ) {
                  if (e) {
                    runHighlight(
                      () => {},
                      allowHighLight || false,
                      'hightlight_area',
                    )
                  }
                }
              }}
            >
              {/* {topics.map((el: any) => { */}
              {listQuestions?.map((e: any, index: number) => {
                const question = Object.values(e)[0] as any
                const topicId = Object.keys(e)[0] as any
                return (
                  <div key={question?.id + index} topic-key={topicId}>
                    <div className="h-[1px] w-full bg-gray-4 mt-8 mb-8"></div>

                    {checkType(
                      question,
                      index,
                      question,
                      question?.qType,
                      question?.id,
                      undefined,
                      undefined,
                      undefined,
                      undefined,
                      undefined,
                      question?.requirements?.[0],
                      undefined,
                      valueRef,
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {openScratchPad.map((e, index: number) => {
          if (e.type === 'calculator') {
            return (
              <MovableWindow
                position={{
                  width: '400px',
                  height: '300px',
                  top: 'calc(50% - 150px)',
                  left: 'calc(50% - 200px)',
                }}
                key={e.id}
                onClick={() => setOnFocusingPad(e.id)}
                zIndex={
                  onFocusingPad === e.id
                    ? openScratchPad.length + 10
                    : index + 10
                }
              >
                <div className="absolute h-full w-full  top-0 left-0 border">
                  <div className="flex w-6-percent items-center bg-gray-2 w-full h-10 justify-between px-5">
                    <div>Calculator</div>
                    <button onClick={() => handleCloseScratchPad(e)}>
                      <CloseIcon />
                    </button>
                  </div>
                  {/* <div className='flex flex-'> */}
                  <Calculator />
                  {/* </div> */}
                </div>
              </MovableWindow>
            )
          } else if (e.type === 'scratch_pad') {
            return (
              <MovableWindow
                position={{
                  width: '400px',
                  height: '300px',
                  top: 'calc(50% - 150px)',
                  left: 'calc(50% - 200px)',
                }}
                key={e.id}
                onClick={() => setOnFocusingPad(e.id)}
                zIndex={
                  onFocusingPad === e.id
                    ? openScratchPad.length + 10
                    : index + 10
                }
              >
                <div className="absolute h-full w-full  top-0 left-0 border">
                  <div className="flex w-6-percent items-center bg-gray-2 w-full h-10 justify-between px-5">
                    <div>Scratch Pad</div>
                    {/* <CloseIcon */}
                    <button onClick={() => handleCloseScratchPad(e)}>
                      <CloseIcon />
                    </button>
                  </div>
                  {/* <div className='flex flex-'> */}
                  <HookFormTextArea
                    placeholder="Take a note..."
                    control={controlScratch}
                    name={e.id}
                    className="w-full h-[calc(100%-40px)] sapp-text-area p-5"
                  />
                  {/* </div> */}
                </div>
              </MovableWindow>
            )
          }
        })}
        <div className=" bg-gray-3 flex items-center justify-between shadow-question-footer h-[48px] relative">
          <div className="flex items-center h-full">
            <button className="h-full">
              <div className="flex items-center gap-3 ps-6 ">
                <HelpIcon />
                <div className="font-normal text-sm pe-6 border-r">Help</div>
              </div>
            </button>
            <button
              className={`h-full ${allowHighLight && 'bg-yellow-300'}`}
              onClick={() => setAllowHighLight(!allowHighLight)}
            >
              <div className="flex items-center gap-3 ps-6 ">
                <HighlightIcon />
                <div className="font-normal text-sm pe-6 border-r">
                  Highlight
                </div>
              </div>
            </button>
            <button
              className="h-full"
              onClick={() => handleOpenScratchPad('scratch_pad')}
            >
              <div className="flex items-center gap-3 ps-6 ">
                <ScratchPadIcon />
                <div className="font-normal text-sm pe-6 border-r">
                  Scratch Pad
                </div>
              </div>
            </button>
            <button
              className="h-full"
              onClick={() => handleOpenScratchPad('calculator')}
            >
              <div className="flex items-center gap-3 ps-6 ">
                <CalculatorIcon />
                <div className="font-normal text-sm pe-6 border-r">
                  Calculator
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default CaseStudyDetail
CaseStudyDetail.layout = LAYOUT.FULLSCREEN_LAYOUT

// export async function getServerSideProps(context: any) {
//   const { req, res, query } = context

//   // Lấy accessToken từ cookie
//   const accessToken = req.cookies.accessToken

//   // Kiểm tra accessToken
//   if (!accessToken) {
//     // Nếu không có accessToken, chuyển hướng đến trang đăng nhập
//     return {
//       redirect: {
//         destination: '/auth/login',
//         permanent: false,
//       },
//     }
//   }

//   try {
//     const { req } = context

//     // Parse cookies from the request headers
//     const cookies = parse(req.headers.cookie || '')
//     console.log(context?.query?.id);

//     if (!context?.query?.id) {
//       return {
//         notFound: true,
//       }
//     } else {
//       const topic = (await CourseTestApi.getQuestionCaseStudiesByIdServerSide(
//         context?.query?.id,
//         cookies.accessToken,
//         1,
//         5,
//       )) as any
//       return {
//         props: { questions: topic },
//       }
//     }
//   } catch (error: any) {
//     // console.log(error)

//     // Nếu có lỗi khi sử dụng accessToken, kiểm tra xem có phải là lỗi hết hạn không
//     if (error.response && error.response.status === 401) {
//       // Nếu là lỗi hết hạn, thực hiện cập nhật accessToken
//       const refreshToken = req.cookies.refreshToken

//       try {
//         const refreshResponse = await axios.post(
//           `${apiURL}/auth/rotate`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${refreshToken}`,
//             },
//           },
//         )

//         // Lưu accessToken mới vào cookie
//         res.setHeader(
//           'Set-Cookie',
//           `accessToken=${refreshResponse.data.accessToken}; HttpOnly`,
//         )

//         // Tiếp tục thực hiện yêu cầu API với accessToken mới
//         const topic = (await CourseTestApi.getQuestionCaseStudiesByIdServerSide(
//           context?.query?.id,
//           refreshResponse.data.accessToken,
//           1,
//           5,
//         )) as any
//         return {
//           props: { questions: topic },
//         }
//       } catch (refreshError) {
//         // Xử lý lỗi khi cập nhật accessToken từ refreshToken
//         // Chuyển hướng đến trang đăng nhập
//         return {
//           redirect: {
//             destination: '/auth/login',
//             permanent: false,
//           },
//         }
//       }
//     } else {
//       // Xử lý lỗi khác khi sử dụng accessToken
//       if (error.response && error.response.status === 403) {
//         // Chuyển hướng đến trang đăng nhập
//         return {
//           redirect: {
//             destination: '/auth/login',
//             permanent: false,
//           },
//         }
//       } else
//         return {
//           redirect: {
//             destination: '/404',
//             permanent: false,
//           },
//         }
//     }
//   }
// }
