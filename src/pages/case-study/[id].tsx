import {
  CalculatorIcon,
  HelpIcon,
  HighlightIcon,
  ScratchPadIcon,
} from '@assets/icons'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import EditorReader from '@components/base/editor/EditorReader'
import { formatTime } from '@components/common/timer'
import { LAYOUT } from '@utils/constants'
import { parse } from 'cookie'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { QUESTION_TYPES } from 'src/constants'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
import DragNDropPreivew from '@components/questionType/DragNDrop'
import AddWordPreview from '@components/questionType/FillText'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import { apiURL } from 'src/redux/services/httpService'
import axios from 'axios'
const CaseStudyDetail = ({ questions }: any) => {
  const checkType = (
    e: any,
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
  ) => {
    // const OneChoiceQuestion = dynamic(()=>import())
    // const OneChoiceQuestion = dynamic(
    //   () => import('@components/questionType/OneChoiceQuestion'),
    //   {
    //     loading: () => <p>Loading...</p>,
    //   },
    // )
    // const MultiChoiceQuestion = dynamic(
    //   () => import('@components/questionType/MultipleChoiceQuestion'),
    //   {
    //     loading: () => <p>Loading...</p>,
    //   },
    // )
    // const MatchingQuestion = dynamic(
    //   () => import('@components/questionType/MatchingQuestion'),
    //   {
    //     loading: () => <p>Loading...</p>,
    //   },
    // )
    // const AddWordPreview = dynamic(
    //   () => import('@components/questionType/FillText'),
    //   {
    //     loading: () => <p>Loading...</p>,
    //   },
    // )
    // const SelectWord = dynamic(
    //   () => import('@components/questionType/SelectWordQuestion'),
    //   {
    //     loading: () => <p>Loading...</p>,
    //   },
    // )
    // const EssayQuestionPreview = dynamic(
    //   () => import('@components/questionType/ConstructedQuestion'),
    //   {
    //     loading: () => <p>Loading...</p>,
    //   },
    // )
    // const DragNDropPreivew = dynamic(
    //   () => import('@components/questionType/DragNDrop'),
    //   {
    //     loading: () => <p>Loading...</p>,
    //   },
    // )
    switch (type) {
      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <OneChoiceQuestion
            data={data}
            control={control}
            name={`${currentTabID}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            corrects={corrects}
            // handleSaveHighLight={handleSaveHighLight}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            // allowHighLight={allowHighLight}
            solution={solution}
          />
        )
      case QUESTION_TYPES.ONE_CHOICE:
        return (
          <OneChoiceQuestion
            data={data}
            control={control}
            name={`${currentTabID}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            corrects={corrects}
            // handleSaveHighLight={handleSaveHighLight}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            // allowHighLight={allowHighLight}
          />
        )
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <MultiChoiceQuestion
            data={data}
            control={control}
            name={`${currentTabID}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
            // handleSaveHighLight={handleSaveHighLight}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            // allowHighLight={allowHighLight}
            corrects={corrects}
          />
        )
      case QUESTION_TYPES.MATCHING:
        return (
          <MatchingQuestion
            data={data}
            // action={getAnswerMatching}
            // ref={ref}
            // handleSaveHighLight={handleSaveHighLight}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            // allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            done={done}
          />
        )
      case QUESTION_TYPES.FILL_WORD:
        return (
          <AddWordPreview
            data={data}
            // action={getValueFillText}
            // handleSaveHighLight={handleSaveHighLight}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            // allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
          />
        )
      case QUESTION_TYPES.DRAG_DROP:
        return (
          <DragNDropPreivew
            data={data}
            // action={getAnswerDragNDrop}
            // ref={ref}
            // handleSaveHighLight={handleSaveHighLight}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            // allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
          />
        )
      case QUESTION_TYPES.SELECT_WORD:
        return (
          <SelectWord
            data={data}
            // action={getValueSelectText}
            // handleSaveHighLight={handleSaveHighLight}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            // allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
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
            // handleSaveHighLight={handleSaveHighLight}
            // highlighted={highlighted}
            // removeHighlight={removeHighlight}
            // allowHighLight={allowHighLight}
          />
        )
      default:
        return <div></div>
    }
  }
  const router = useRouter()
  const [currentTopicQuestions, setCurrentTopicQuestions] = useState(
    questions[0]?.questions,
  )
  const [essayData, setEssayData] = useState<any>()
  const inputRef = useRef<any>([])
  const { control, handleSubmit, getValues, setValue } = useForm()

  const [topics, setTopics] = useState<any>([])
  const [topicItems, setTopicItems] = useState<any>([])
  const [listQuestions, setListQuestions] = useState<any>([])
  const [listFullQuestions, setListFullQuestions] = useState<any>([])
  const [index, setIndex] = useState(0)
  const [pageTopic, setPageTopic] = useState(1)
  useEffect(() => {
    if (questions) {
      let arr = [] as any
      let arr2 = [] as any
      for (let i in questions.topics) {
        // if (+i <= 5) {
        arr.push({ topicData: questions.topics[i] })
        // }
        for (let j = 0; j < questions.topics[i].questions.length; j++) {
          // if (i <= 5) {
          arr2.push({
            [questions.topics[i].question_topic.id]:
              questions.topics[i].questions[j],
          })
          // }
        }
      }

      setListFullQuestions(arr2)
      setListQuestions(arr2.slice(0, 25))
      setTopics(() => {
        // setTopicItems({ ...arr[0], viewed: true })

        return arr
      })
    }
  }, [])
  // useEffect(())

  const handleLoadMoreQuestion = () => {
    if (listQuestions.length < listFullQuestions.length) {
      const arr = [...listQuestions]
      // const last_index = topicItems.topicData.questions.findIndex(
      //   (e: any) => e.id === arr[arr.length - 1].id,
      // )
      for (let j = listQuestions.length; j < listFullQuestions.length; j++) {
        if (j <= 5 + listQuestions.length) {
          arr.push(listFullQuestions[j])
        }
      }
      setListQuestions([...arr])
    }
  }
  const handleChangeTopic = (index: number) => {
    setIndex(index)
    const arr = [...listQuestions]
    // for (let i = 0; i < topics.length; i++) {
    // if (topicItems[i].viewed) {
    const last_index = topicItems.topicData.questions.findIndex(
      (e: any) => e.id === arr[arr.length - 1].id,
    )
    for (
      let j = last_index;
      j < topicItems.topicData.questions.length - 1;
      j++
    ) {
      // if () {
      arr.push(topicItems.topicData.questions[j + 1])
      // }
    }
    // }
    // }
    for (let i = 0; i < topics[index].topicData.questions.length; i++) {
      if (i <= 5) {
        arr.push(topics[index].topicData.questions[i])
      } else {
        break
      }
    }
    setListQuestions([...arr])
    setTopicItems((prev: any) => {
      return topics[index]
    })
  }
  const handleLoadMoreTopic = async (page: number) => {
    if (router.query.id && page <= questions.meta.total_pages) {
      setPageTopic(page)
      const res = await CourseTestApi.getQuestionCaseStudiesById(
        router.query.id as string,
        page,
        5,
      )
      const arr = [...topics]
      const arrQuest = [...listFullQuestions]
      let arr2 = [] as any
      let listQuestNew = [] as any
      for (let e of res.data.topics) {
        arr2 = [...arr2]
        arr.push({ topicData: e })
        arr2 = arrQuest.concat(e.questions)
        listQuestNew.push(e.questions)
      }
      setListFullQuestions(arr2)
      // if (listQuestions.length === listFullQuestions.length) {
      setListQuestions((prev: any) => {
        const newArr = listFullQuestions.concat(listQuestNew.slice(0, 5))
        return newArr
      })
      // }
      setTopics(arr)
    }

    // let arr = [...topics] as any
    // for (let i = arr.length; i < questions.topics.data.length; i++) {
    //   if (i <= page * 5) {
    //     arr.push({ topicData: fake_data.data[i] })
    //   }
    // }
    // setTopics(arr)
  }
  useEffect(() => {}, [inputRef?.current?.[0]])

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <div className="h-full">
        <div className="flex justify-between py-4 px-6 items-center bg-gray-3 ">
          <div className="text-bw-1 text-xl font-bold w-1/3 truncate">Name</div>
          <div className="text-bw-1 text-xl font-bold w-1/3 justify-center flex">
            {formatTime(0)}
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
                if (index < topics.length - 1) {
                  handleChangeTopic(index + 1)
                }
              },
              //   full: fullWidthBtn,
            }}
            cancel={{
              title: 'Quit',
              size: 'medium',
              onClick: () => {},
              loading: false,
              //   full: fullWidthBtn,
            }}
          ></ButtonCancelSubmit>
        </div>
        {/* End Header */}
        <div
          className="flex gap-5 h-[calc(100%-168px)] bg-gray-3"
          id={'preview-question'}
        >
          <div
            className="w-1/2 h-full overflow-auto bg-white p-6"
            id="hightlight_area_topic"
            onScroll={(e) => {
              const { target } = e
              // console.log(inputRef.current?.[0]?.getBoundingClientRect())

              if (
                (target as any).scrollTop + (target as any).offsetHeight >=
                (target as any).scrollHeight
              ) {
                handleLoadMoreTopic(pageTopic + 1)
              }
            }}
          >
            {/* {topics} */}
            {topics?.map((e: any, index: number) => {
              return (
                <div
                  key={e?.topicData?.question_topic?.id}
                  ref={(el: any) => (inputRef.current[index] = el)}
                >
                  <EditorReader
                    // extenalRef={(el: any) => (inputRef.current[index] = el)}
                    className="editor-wrap"
                    text_editor_content={
                      e?.topicData?.question_topic?.description
                    }
                  />
                </div>
              )
            })}
          </div>

          <div
            className="w-1/2 h-full overflow-auto bg-white py-6 "
            onScroll={(e) => {
              const { target } = e
              if (
                (target as any).scrollTop + (target as any).offsetHeight >=
                (target as any).scrollHeight
              ) {
                handleLoadMoreQuestion()
              }
            }}
          >
            <div className="px-6">
              {/* {topics.map((el: any) => { */}
              {listQuestions.map((e: any, index: number) => {
                const question = Object.values(e)[0] as any
                return (
                  <div key={question?.id + index}>
                    <div className="h-[1px] w-full bg-gray-4 mt-8 mb-8"></div>

                    {checkType(
                      question,
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
                    )}
                  </div>
                )
              })}
              {/* {type !== QUESTION_TYPES.ESSAY ? ( */}

              {/* ) : (
                    <EssayQuestionPreview
                      data={essayData?.req}
                      question_content={data.question_content}
                      index={essayData?.index}
                      question_data={data}
                    />
                  )} */}
              {/* <OneChoiceQuestion data={data} control={control} /> */}
            </div>
          </div>
        </div>
        <div className=" bg-gray-3 flex items-center justify-between shadow-question-footer h-[96px] relative">
          <div className="flex items-center h-full">
            <button className="h-full">
              <div className="flex items-center gap-3 ps-6 ">
                <HelpIcon />
                <div className="font-normal text-sm pe-6 border-r">Help</div>
              </div>
            </button>
            <button className={`h-full `} onClick={() => {}}>
              <div className="flex items-center gap-3 ps-6 ">
                <HighlightIcon />
                <div className="font-normal text-sm pe-6 border-r">
                  Highlight
                </div>
              </div>
            </button>
            <button className="h-full" onClick={() => {}}>
              <div className="flex items-center gap-3 ps-6 ">
                <ScratchPadIcon />
                <div className="font-normal text-sm pe-6 border-r">
                  Scratch Pad
                </div>
              </div>
            </button>
            <button className="h-full" onClick={() => {}}>
              <div className="flex items-center gap-3 ps-6 ">
                <CalculatorIcon />
                <div className="font-normal text-sm pe-6 border-r">
                  Calculator
                </div>
              </div>
            </button>
          </div>
          <div className="flex items-center h-full gap-3 pe-6">
            <button
              className="flex items-center gap-3 border border-gray-1 justify-center p-3"
              onClick={() => {}}
            >
              <div className="font-normal text-sm">Confirm Answer</div>
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

export async function getServerSideProps(context: any) {
  const { req, res, query } = context

  // Lấy accessToken từ cookie
  const accessToken = req.cookies.accessToken

  // Kiểm tra accessToken
  if (!accessToken) {
    // Nếu không có accessToken, chuyển hướng đến trang đăng nhập
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }

  try {
    const { req } = context

    // Parse cookies from the request headers
    const cookies = parse(req.headers.cookie || '')

    if (!context?.query?.id) {
      return {
        notFound: true,
      }
    }
    const topic = (await CourseTestApi.getQuestionCaseStudiesByIdServerSide(
      context?.query?.id,
      cookies.accessToken,
      1,
      5,
    )) as any
    return {
      props: { questions: topic },
    }
  } catch (error: any) {
    // Nếu có lỗi khi sử dụng accessToken, kiểm tra xem có phải là lỗi hết hạn không
    if (error.response && error.response.status === 401) {
      // Nếu là lỗi hết hạn, thực hiện cập nhật accessToken
      const refreshToken = req.cookies.refreshToken

      try {
        const refreshResponse = await axios.post(
          `${apiURL}/auth/rotate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        )

        // Lưu accessToken mới vào cookie
        res.setHeader(
          'Set-Cookie',
          `accessToken=${refreshResponse.data.accessToken}; HttpOnly`,
        )

        // Tiếp tục thực hiện yêu cầu API với accessToken mới
        // const questions = await CourseTestApi.getQuestionTabsById(
        //   context?.query?.id,
        //   refreshResponse.data.accessToken,
        // )
        // return {
        //   props: { questions },
        // }

        // Xử lý dữ liệu từ API
        // const courses = newApiResponse.data?.data

        // Trả về props cho trang
        // return {
        //   props: {
        //     courses: courses,
        //   },
        // }
      } catch (refreshError) {
        // Xử lý lỗi khi cập nhật accessToken từ refreshToken
        // Chuyển hướng đến trang đăng nhập
        return {
          redirect: {
            destination: '/auth/login',
            permanent: false,
          },
        }
      }
    } else {
      // Xử lý lỗi khác khi sử dụng accessToken
      if (error.response && error.response.status === 403) {
        // Chuyển hướng đến trang đăng nhập
        return {
          redirect: {
            destination: '/auth/login',
            permanent: false,
          },
        }
      } else
        return {
          redirect: {
            destination: '/404',
            permanent: false,
          },
        }
    }
  }
}
