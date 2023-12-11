import {
  ArrowUpIcon,
  CalculatorIcon,
  CloseIcon,
  ExhibitsIcon,
  FlagIcon,
  HelpIcon,
  HighlightIcon,
  ScratchPadIcon,
} from '@assets/icons'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import useClickOutside from '@components/base/clickoutside/HookClick'
import EditorReader from '@components/base/editor/EditorReader'
import TabSlide from '@components/base/tabSlide/TabSlide'
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
import axios from 'axios'
import { parse } from 'cookie'
import { uniqueId } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DISPLAY_TYPE, QUESTION_TYPES } from 'src/constants'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import { apiURL } from 'src/redux/services/httpService'
const TestDetail = ({ questions }: any) => {
  const checkType = (
    data: any,
    type: string,
    currentTabID: string,
    defaultValue: any,
  ) => {
    switch (type) {
      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <OneChoiceQuestion
            data={data}
            control={control}
            name={`${currentTabID}_answer`}
            defaultValues={defaultValue}
            setValue={setValue}
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
          />
        )
      case QUESTION_TYPES.MATCHING:
        return (
          <MatchingQuestion data={data} action={getAnswerMatching} ref={ref} />
        )
      case QUESTION_TYPES.FILL_WORD:
        return <AddWordPreview data={data} action={getValueFillText} />
      case QUESTION_TYPES.DRAG_DROP:
        return (
          <DragNDropPreivew data={data} action={getAnswerDragNDrop} ref={ref} />
        )
      case QUESTION_TYPES.SELECT_WORD:
        return <SelectWord data={data} action={getValueSelectText} />
      case QUESTION_TYPES.ESSAY:
        return (
          <EssayQuestionPreview
            data={essayData?.req}
            question_content={currentTabContent?.data?.question_content}
            index={essayData?.index}
            question_data={currentTabContent?.data}
            control={control}
          />
        )
      default:
        return <div></div>
    }
  }
  const [currentPage, setCurrentPage] = useState<any>(questions?.[0]?.id)
  const [currentTabContent, setCurrentTabContent] = useState<any>()
  const { control, handleSubmit, getValues, setValue } = useForm()
  const { control: controlFilter } = useForm()
  const {
    control: controlExhibits,
    getValues: getValuesExhibits,
    setValue: setValueExhibits,
    watch,
  } = useForm()
  const [essayData, setEssayData] = useState<any>()
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [openExhibits, setOpenExhibits] = useState<Array<any>>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [tabs, setTabs] = useState<any>([])
  const [showListExhibits, setShowListExhibits] = useState(false)
  const [showListRequirement, setShowLisRequirement] = useState(false)
  const dropUpRef = useRef(null)
  const dropUpRequire = useRef(null)
  useClickOutside({
    ref: dropUpRef,
    callback: () => setShowListExhibits(false),
  })
  useClickOutside({
    ref: dropUpRequire,
    callback: () => setShowLisRequirement(false),
  })

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
        // if (!arr.includes('calculator')) {
        arr.push({ id: 'calculator', type: 'calculator' })
        // }
      }
      return arr
    })
  }
  const handleFlagQuestion = (tab: any) => {
    setTabs((prev: any) => {
      const newData = prev.map((item: any) => {
        if (tab === item.id) {
          return { ...item, flaged: true }
        }
        return item
      })
      return newData
    })
  }
  const handleCloseScratchPad = (pad: any) => {
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      const newArr = arr.filter((e) => e.id !== pad.id)
      if (pad.type === 'exhibits') {
        setValueExhibits(
          'exhibits',
          getValuesExhibits('exhibits').filter((e: string) => e !== pad.id),
        )
      }
      return newArr
    })
  }

  const OptionShowAll = () => {
    return (
      <div className="w-max">
        <HookFormCheckBoxGroup
          multiple
          control={controlFilter}
          name={'filter'}
          options={[
            { label: 'Unattempted', value: 'unattempted' },
            { label: 'Attempted', value: 'attempted' },
            { label: 'Flag to Review', value: 'flag' },
          ]}
        />
      </div>
    )
  }
  const ref = useRef(null) as any

  const getValueFillText = () => {
    let value = []
    const inputs = document.querySelectorAll('input[stringHTML="true"]') as any
    for (let e of inputs) {
      value.push(e.value)
    }
    return value
  }
  const getValueSelectText = () => {
    let value = [] as any
    const inputs = document.querySelectorAll(
      'select.sapp-select--selectword-preview',
    ) as any

    for (let e of inputs) {
      value.push(e.value)
    }
    return value
  }
  const getAnswerMatching = () => {
    let value = [] as any
    const inputs = document.querySelectorAll('.sapp-match-result') as any
    for (let e of inputs) {
      value.push(e.innerText)
    }
    return value
  }
  const getAnswerDragNDrop = () => {
    let value = [] as any
    const inputs = document.querySelectorAll('.sapp-input-dragNDrop') as any
    for (let e of inputs) {
      const idAnswer = e.querySelector('span')
      value.push({ id: e.id, value: e.innerText, idAnswer: idAnswer?.id })
    }
    return value
  }
  const handleChangeTab = (e: any) => {
    handleSaveAnswer(getValues(`${currentPage}_answer`), currentPage)
    setCurrentPage(e)
    setOpenScratchPad([])
  }
  const handleSaveAnswer = (data: any, tabId: any) => {
    setTabs((prev: any) => {
      const newData = prev.map((item: any) => {
        if (tabId === item.id) {
          return { ...item, answer: data }
        }
        return item
      })
      return newData
    })
  }
  const handleClearSelection = (data: any) => {
    if (
      data.qType === QUESTION_TYPES.DRAG_DROP ||
      data.qType === QUESTION_TYPES.MATCHING
    ) {
      ref.current?.handleReset()
    }
  }

  useEffect(() => {
    if (currentTabContent?.data?.requirements) {
      setEssayData({ req: currentTabContent?.data?.requirements[0], index: 0 })
    }
  }, [currentTabContent])
  useEffect(() => {
    if (questions?.length > 0) {
      const arr = []
      for (let e of questions) {
        arr.push({ ...e, viewed: false, flaged: false, done: false })
      }
      setTabs(arr)
    }
    setCurrentPage(questions?.[0]?.id)
  }, [questions])
  useEffect(() => {
    async function getDetail() {
      const res = await CourseTestApi.getQuestionsDetail(currentPage)
      setTabs((prev: any) => {
        const newData = prev.map((item: any) => {
          if (currentPage === item.id) {
            if (item.viewed) {
              return { ...item }
            } else {
              return { ...item, viewed: true, data: res.data[0] }
            }
          }
          return item
        })
        // const currentTabContent =

        setCurrentTabContent(
          newData[newData.findIndex((e: any) => e.id === currentPage)],
        )
        return newData
      })
    }
    if (currentPage) {
      getDetail()
    }
  }, [currentPage])
  const exhibits = useMemo(() => {
    let exhibitsOptions = []
    for (let e in currentTabContent?.data?.exhibits) {
      exhibitsOptions.push({
        label: `Exhibits ${e + 1}`,
        value: currentTabContent?.data?.exhibits[e].id,
      })
    }
    return exhibitsOptions
  }, [currentTabContent])
  useEffect(() => {
    if (watch('exhibits')) {
      setOpenScratchPad((prev) => {
        let arr = [...prev]
        const newArr = arr.filter((e) => {
          return e.type !== 'exhibits'
        })
        for (let e of watch('exhibits')) {
          newArr.push({ id: e, type: 'exhibits' })
        }
        return newArr
      })
    }
  }, [watch('exhibits')])
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <div>
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
              onClick: () => {},
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
        <div className="px-6 bg-gray-4 shadow-solution py-4 relative">
          <TabSlide
            data={tabs}
            currentTab={currentPage}
            setCurrentTab={setCurrentPage}
            optionShowAll={<OptionShowAll />}
            handleChangeTab={(e: any) => {
              handleChangeTab(e)
            }}
          />
          {/* </div> */}
        </div>
      </div>
      {/* <div className=''> */}
      {currentTabContent?.data === DISPLAY_TYPE.VERTICAL ? (
        <div
          // onDoubleClick={(e) => {
          //   const element = e.target as any;
          //   if (element.localName === "video") {
          //     const content = element.currentSrc;
          //     if (content) {
          //       setOpenVideo({ status: true, src: content });
          //     }
          //   }
          // }}
          className="flex gap-5 h-[calc(100%-240px)] bg-gray-3"
          id={'preview-question'}
        >
          <div className="w-1/2 h-full overflow-auto bg-white p-6">
            <div
              className="editor-wrap"
              dangerouslySetInnerHTML={{ __html: 'topicDescription' || '' }}
            ></div>
          </div>
          <div className="w-1/2 h-full overflow-auto bg-white py-6 ">
            <div className="px-6">
              {/* {type !== QUESTION_TYPES.ESSAY ? ( */}
              {checkType(
                currentTabContent?.data,
                currentTabContent?.data?.qType,
                currentTabContent?.id,
                currentTabContent?.answer,
              )}
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
      ) : (
        <div
          // style={{ maxWidth: "948px", width: "100%", margin: "auto" }}
          // onDoubleClick={(e) => {
          //   const element = e.target as any;
          //   if (element.localName === "video") {
          //     const content = element.currentSrc;
          //     if (content) {
          //       setOpenVideo({ status: true, src: content });
          //     }
          //   }
          // }}
          className="max-w-screen-2md w-full m-auto h-[calc(100%-240px)] overflow-auto py-6 px-6"
          id={'preview-question'}
        >
          <div>
            <div
              className="editor-wrap"
              dangerouslySetInnerHTML={{ __html: 'topicDescription' || '' }}
            ></div>
          </div>

          {/* {type !== QUESTION_TYPES.ESSAY ? ( */}
          {checkType(
            currentTabContent?.data,
            currentTabContent?.data?.qType,
            currentTabContent?.id,
            currentTabContent?.answer,
          )}
          {/* ) : (
                <EssayQuestionPreview
                  data={essayData?.req}
                  question_content={data.question_content}
                  index={essayData?.index}
                  question_data={data}
                />
              )}
            <OneChoiceQuestion data={data} control={control} /> */}
        </div>
      )}
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
                onFocusingPad === e.id ? openScratchPad.length + 10 : index + 10
              }
            >
              <div className="absolute h-full w-full  top-0 left-0 border">
                <div className="flex w-6 items-center bg-gray-2 w-full h-[40px] justify-between px-5">
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
                onFocusingPad === e.id ? openScratchPad.length + 10 : index + 10
              }
            >
              <div className="absolute h-full w-full  top-0 left-0 border">
                <div className="flex w-6 items-center bg-gray-2 w-full h-[40px] justify-between px-5">
                  <div>Scratch Pad</div>
                  {/* <CloseIcon */}
                  <button onClick={() => handleCloseScratchPad(e)}>
                    <CloseIcon />
                  </button>
                </div>
                {/* <div className='flex flex-'> */}
                <HookFormTextArea
                  placeholder="Take a note..."
                  control={control}
                  name={e.id}
                  className="w-full h-[calc(100%-40px)] sapp-text-area"
                />
                {/* </div> */}
              </div>
            </MovableWindow>
          )
        } else if (e.type === 'exhibits') {
          const exhibitsDes = currentTabContent?.data?.exhibits?.find(
            (el: any) => el.id === e.id,
          )
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
                onFocusingPad === e ? openScratchPad.length + 10 : index + 10
              }
            >
              <div className="absolute h-full w-full  top-0 left-0 border">
                <div className="flex w-6 items-center bg-gray-2 w-full h-[40px] justify-between px-5">
                  <div>Exhibit</div>
                  <button onClick={() => handleCloseScratchPad(e)}>
                    <CloseIcon />
                  </button>
                </div>
                {/* <div className='flex flex-'> */}
                {/* <div
                  className="bg-white h-[calc(100%-40px)] w-full overflow-auto"
                  id={'preview-question'}
                  dangerouslySetInnerHTML={{ __html: exhibitsDes?.description }}
                ></div>{' '} */}
                {/* </div> */}
                <EditorReader
                  text_editor_content={exhibitsDes?.description}
                  className="bg-white h-[calc(100%-40px)] w-full overflow-auto"
                />
              </div>
            </MovableWindow>
          )
        }
      })}
      {/* </div> */}
      <div className=" bg-gray-3 flex items-center flex-1 justify-between shadow-question-footer">
        <div className="flex items-center h-full">
          <button className="h-full">
            <div className="flex items-center gap-3 ps-6 ">
              <HelpIcon />
              <div className="font-normal text-sm pe-6 border-r">Help</div>
            </div>
          </button>
          <button className="h-full">
            <div className="flex items-center gap-3 ps-6 ">
              <HighlightIcon />
              <div className="font-normal text-sm pe-6 border-r">Highlight</div>
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
          {currentTabContent?.data?.qType === QUESTION_TYPES.ESSAY && (
            <button className="h-full relative" ref={dropUpRef}>
              <div
                className="flex items-center gap-3 ps-6 "
                onClick={() => {
                  setShowListExhibits(!showListExhibits)
                }}
              >
                <ExhibitsIcon />
                <div className="font-normal flex text-sm pe-6 border-r items-center gap-3">
                  {`Exhibits (${currentTabContent?.data?.exhibits?.length})`}
                  <ArrowUpIcon />
                </div>
              </div>
              {showListExhibits && (
                <div className="bg-gray-3 absolute h-fit w-full bottom-full max-h-40 shadow-questions-exhibits p-4 justify-center">
                  <HookFormCheckBoxGroup
                    control={controlExhibits}
                    name="exhibits"
                    options={exhibits}
                    multiple
                  />
                </div>
              )}
            </button>
          )}
          {currentTabContent?.data?.qType === QUESTION_TYPES.ESSAY && (
            <button className="h-full relative" ref={dropUpRequire}>
              <div
                className="flex items-center gap-3 ps-6 "
                onClick={() => {
                  setShowLisRequirement(!showListRequirement)
                }}
              >
                <ExhibitsIcon />
                <div className="font-normal flex text-sm pe-6 border-r items-center gap-3">
                  {`Requirement (${currentTabContent?.data?.requirements?.length})`}
                  <ArrowUpIcon />
                </div>
              </div>
              {showListRequirement && (
                <div className="bg-gray-3 absolute h-fit w-full bottom-full max-h-40 shadow-questions-exhibits  justify-center">
                  {currentTabContent?.data?.requirements?.map(
                    (e: any, index: number) => {
                      return (
                        <button
                          key={e.id}
                          className="p-3"
                          onClick={() => {
                            setEssayData({ req: e, index: index })
                          }}
                        >{`Requirement (${index + 1})`}</button>
                      )
                    },
                  )}
                </div>
              )}
            </button>
          )}
        </div>
        <div className="flex items-center h-full gap-3 pe-6">
          <button
            className="flex items-center gap-3 border border-gray-1 justify-center p-3"
            onClick={() => handleFlagQuestion(currentPage)}
          >
            <FlagIcon />
            <div className="font-normal text-sm">Flag to Review</div>
          </button>
          <button
            className="flex items-center gap-3 border border-gray-1 justify-center p-3"
            onClick={() => handleClearSelection(currentTabContent?.data)}
          >
            <div className="font-normal text-sm">Clear Selection</div>
          </button>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default TestDetail
TestDetail.layout = LAYOUT.FULLSCREEN_LAYOUT

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
    const questions = await CourseTestApi.getQuestionTabsById(
      context?.query?.id,
      cookies.accessToken,
    )
    return {
      props: { questions },
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
        const newApiResponse = await axios.get(
          `${apiURL}/courses?page_index=1&page_size=10&name=${query.name}&type=${query.type}`,
          {
            headers: {
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
          },
        )

        // Xử lý dữ liệu từ API
        const courses = newApiResponse.data?.data

        // Trả về props cho trang
        return {
          props: {
            courses: courses,
          },
        }
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
            destination: '/test',
            permanent: false,
          },
        }
    }
  }
}
