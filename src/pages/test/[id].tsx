import {
  removeHighlights,
  serializeHighlights,
} from '@/../node_modules/@funktechno/texthighlighter/lib/index'
import {
  ArrowUpIcon,
  CalculatorIcon,
  CloseIcon,
  ExhibitsIcon,
  FlagIcon,
  HelpIcon,
  HighlightIcon,
  ScratchPadIcon,
  TextSquareIcon,
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
import { DeserializeHighlight, runHighlight } from '@utils/index'
import axios from 'axios'
import { parse } from 'cookie'
import { uniqueId } from 'lodash'
import { useRouter } from 'next/router'
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
    corrects?: any,
    highlighted?: any,
    solution?: any,
    done?: boolean,
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
            corrects={corrects}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
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
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
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
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            corrects={corrects}
          />
        )
      case QUESTION_TYPES.MATCHING:
        return (
          <MatchingQuestion
            data={data}
            action={getAnswerMatching}
            ref={ref}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            done={done}
            corrects={corrects?.corrects}
          />
        )
      case QUESTION_TYPES.FILL_WORD:
        return (
          <AddWordPreview
            data={data}
            action={getValueFillText}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
          />
        )
      case QUESTION_TYPES.DRAG_DROP:
        return (
          <DragNDropPreivew
            data={data}
            action={getAnswerDragNDrop}
            ref={ref}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
          />
        )
      case QUESTION_TYPES.SELECT_WORD:
        return (
          <SelectWord
            data={data}
            action={getValueSelectText}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
            defaultAnswer={defaultValue}
            corrects={corrects?.corrects}
          />
        )
      case QUESTION_TYPES.ESSAY:
        return (
          <EssayQuestionPreview
            data={essayData?.req}
            question_content={currentTabContent?.data?.question_content}
            index={essayData?.index}
            question_data={currentTabContent?.data}
            control={control}
            handleSaveHighLight={handleSaveHighLight}
            highlighted={highlighted}
            removeHighlight={removeHighlight}
            allowHighLight={allowHighLight}
          />
        )
      default:
        return <div></div>
    }
  }
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState<any>(questions?.[0]?.id)
  const [filteredTabs, setFilterdTabs] = useState<any>([])
  // const [currentTabContent, setCurrentTabContent] = useState<any>()
  const { control, handleSubmit, getValues, setValue } = useForm()
  const { control: controlFilter, watch: watchFilter } = useForm()
  const {
    control: controlExhibits,
    getValues: getValuesExhibits,
    setValue: setValueExhibits,
    watch,
    reset,
  } = useForm()
  const [essayData, setEssayData] = useState<any>()
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [openExhibits, setOpenExhibits] = useState<Array<any>>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const [tabs, setTabs] = useState<any>([])
  const [showListExhibits, setShowListExhibits] = useState(false)
  const [showListRequirement, setShowLisRequirement] = useState(false)
  const [allowHighLight, setAllowHighLight] = useState(false)
  const dropUpRef = useRef(null)
  const dropUpRequire = useRef(null)
  const [quizAttempId, setQuizAttempId] = useState('')
  useClickOutside({
    ref: dropUpRef,
    callback: () => setShowListExhibits(false),
  })
  useClickOutside({
    ref: dropUpRequire,
    callback: () => setShowLisRequirement(false),
  })
  const currentTabContent = useMemo(() => {
    if (tabs && tabs.length > 0) {
      return tabs.find((e: any) => e.id === currentPage)
    }
  }, [currentPage, tabs])
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
  function removeHighlight() {
    const domEle = document.getElementById('hightlight_area')
    removeHighlights(domEle as any)
    handleSaveHighLight(serializeHighlights(domEle))
  }
  const OptionShowAll = () => {
    return (
      <div className="w-max">
        <HookFormCheckBoxGroup
          toggle
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
  useEffect(() => {
    setFilterdTabs((prev: any) => {
      const filter = watchFilter('filter')
      if (filter === 'attempted') {
        return tabs.filter((e: any) => e.viewed === true)
      } else if (filter === 'unattempted') {
        return tabs.filter((e: any) => e.viewed === false)
      } else if (filter === 'flag') {
        return tabs.filter((e: any) => e.flaged === true)
      } else return tabs
    })
  }, [tabs, watchFilter('filter')])
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
      const childId = e.querySelector('.sapp-notched-container')
      value.push({ question_id: e.id, answer_id: childId?.id || undefined })
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
  const getResult = async (currentTabContent: any) => {
    const res = await CourseTestApi.getQuestionAnswer(currentTabContent.id)
    let corrects = {} as any
    if (
      currentTabContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentTabContent.qType === QUESTION_TYPES.TRUE_FALSE ||
      currentTabContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
    ) {
      corrects = res.data[0].answers?.reduce(
        (previousValue: any, currentValue: any) => {
          return {
            ...previousValue,
            [currentValue.id]: currentValue.is_correct,
          }
        },
        {} as { [key: string]: boolean },
      )
    } else if (
      currentTabContent.qType === QUESTION_TYPES.FILL_WORD ||
      currentTabContent.qType === QUESTION_TYPES.SELECT_WORD
    ) {
      corrects = { corrects: [...res.data[0].answers] }
    } else if (currentTabContent.qType === QUESTION_TYPES.MATCHING) {
      corrects = { corrects: [...res.data[0].question_matchings] }
    } else if (currentTabContent.qType === QUESTION_TYPES.DRAG_DROP) {
      corrects = {
        corrects: [
          ...res.data[0].answers.sort(
            (a: any, b: any) => a.answer_position - b.answer_position,
          ),
        ],
      }
    }
    setTabs((prev: any) => {
      const newData = prev.map((item: any) => {
        if (currentPage === item.id) {
          // setCurrentTabContent({
          //   ...item,
          //   done: true,
          //   corrects: corrects,
          //   solution: res.data[0].solution,
          //   answer: getCurrentAnswer(item),
          // })
          ref.current?.handleReset()
          return {
            ...item,
            done: true,
            corrects: corrects,
            solution: res.data[0].solution,
          }
        }
        return item
      })
      return handleSaveCurrentAnswer(newData, currentTabContent)
    })
  }
  const getResultAll = async (currentTabContent: any) => {
    const res = await CourseTestApi.getQuestionAnswer(currentTabContent.id)
    let corrects = {} as any
    if (
      currentTabContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentTabContent.qType === QUESTION_TYPES.TRUE_FALSE ||
      currentTabContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
    ) {
      corrects = res.data[0].answers?.reduce(
        (previousValue: any, currentValue: any) => {
          return {
            ...previousValue,
            [currentValue.id]: currentValue.is_correct,
          }
        },
        {} as { [key: string]: boolean },
      )
    } else if (
      currentTabContent.qType === QUESTION_TYPES.FILL_WORD ||
      currentTabContent.qType === QUESTION_TYPES.SELECT_WORD
    ) {
      corrects = { corrects: [...res.data[0].answers] }
    }
    return {
      ...currentTabContent,
      done: true,
      corrects: corrects,
      solution: res.data[0].solution,
    }
  }
  const handleSaveCurrentAnswer = (tabs: any, currentContent: any) => {
    if (!currentContent.done) {
      if (
        currentContent.qType === QUESTION_TYPES.ONE_CHOICE ||
        currentContent.qType === QUESTION_TYPES.TRUE_FALSE ||
        currentContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
      ) {
        return handleSaveAnswer(
          getValues(`${currentPage}_answer`),
          currentPage,
          tabs,
        )
      } else if (currentContent.qType === QUESTION_TYPES.MATCHING) {
        return handleSaveAnswer(getAnswerMatching(), currentPage, tabs)
      } else if (currentContent.qType === QUESTION_TYPES.DRAG_DROP) {
        return handleSaveAnswer(getAnswerDragNDrop(), currentPage, tabs)
      } else if (currentContent.qType === QUESTION_TYPES.SELECT_WORD) {
        return handleSaveAnswer(getValueSelectText(), currentPage, tabs)
      } else if (currentContent.qType === QUESTION_TYPES.FILL_WORD) {
        return handleSaveAnswer(getValueFillText(), currentPage, tabs)
      } else return tabs
    } else {
      return tabs
    }
  }
  const getCurrentAnswer = (currentTabContent: any) => {
    if (
      currentTabContent.qType === QUESTION_TYPES.ONE_CHOICE ||
      currentTabContent.qType === QUESTION_TYPES.TRUE_FALSE ||
      currentTabContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
    ) {
      return getValues(`${currentPage}_answer`)
    } else if (currentTabContent.qType === QUESTION_TYPES.MATCHING) {
      return getAnswerMatching()
    } else if (currentTabContent.qType === QUESTION_TYPES.DRAG_DROP) {
      return getAnswerDragNDrop()
    } else if (currentTabContent.qType === QUESTION_TYPES.SELECT_WORD) {
      return getValueSelectText()
    } else if (currentTabContent.qType === QUESTION_TYPES.FILL_WORD) {
      return getValueFillText()
    }
  }
  async function getDetail(currentPage: string) {
    try {
      const topicDescription = await CourseTestApi.getTopicDescription(
        questions[questions.findIndex((e: any) => e.id === currentPage)]
          .question_topic_id,
      )
      const res = await CourseTestApi.getQuestionsDetail(currentPage)
      return { topicDescription, res }
    } catch (err) {
      return { topicDescription: { data: {} }, res: { data: [] } }
    }
  }
  const handleChangeTab = async (currentTab: any) => {
    const currentContent = tabs.find((e: any) => e.id === currentTab)
    if (!currentContent?.viewed) {
      const { topicDescription, res } = await getDetail(currentTab)

      setTabs((prev: any) => {
        const newData = prev.map((item: any) => {
          if (currentTab === item.id) {
            if (item.viewed) {
              // setCurrentTabContent({ ...item })
              return { ...item }
            } else {
              // setCurrentTabContent({
              //   ...item,
              //   viewed: true,
              //   data: res.data[0],
              //   topicDescription: topicDescription.data,
              // })
              return {
                ...item,
                viewed: true,
                data: res.data[0],
                topicDescription: topicDescription.data,
              }
            }
          }
          return item
        })
        ref.current?.handleReset()
        const savedAnswer = handleSaveCurrentAnswer(newData, currentTabContent)
        setCurrentPage(currentTab)
        setOpenScratchPad([])
        setAllowHighLight(false)
        // reset()
        return savedAnswer
      })
    } else {
      setTabs((prev: any) => {
        // for (let e of prev) {
        //   if (currentTab === e.id) {
        //     setCurrentTabContent(() => {
        //       ref.current?.handleReset()
        //       return e
        //     })
        //   }
        // }
        ref.current?.handleReset()
        const savedAnswer = handleSaveCurrentAnswer(prev, currentTabContent)
        setCurrentPage(currentTab)
        setOpenScratchPad([])
        setAllowHighLight(false)
        // reset()
        return savedAnswer
      })
    }

    // if (currentPage) {
    //   getDetail()
    // }
    // setTabs((prev: any) => {
    //   return handleSaveCurrentAnswer(tabs)
    // })
  }
  const handleSaveAnswer = (data: any, tabId: any, tabs: any) => {
    // setTabs((prev: any) => {
    const newData = tabs.map((item: any) => {
      if (tabId === item.id) {
        return { ...item, answer: data }
      }
      return item
    })
    return newData
    // })
  }

  const handleSubmitQuestion = async () => {
    let allQuest = handleSaveCurrentAnswer(tabs, currentTabContent)
    let quiz_position_mapping = []
    let answers = []
    let reformTabs: any[] = []
    for (let e of allQuest) {
      reformTabs.push({ ...e, done: true })
      if (e.answer) {
        if (
          e.qType === QUESTION_TYPES.ONE_CHOICE ||
          e.qType === QUESTION_TYPES.TRUE_FALSE
        ) {
          answers.push({ question_id: e.id, question_answer_id: e.answer })
        } else if (e.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
          let answer = []
          for (let el of e.answer) {
            answer.push({ answer_id: el })
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
        }
      }
      quiz_position_mapping.push({
        question_id: e.id,
        answers: e.data?.answers,
      })
    }
    setTabs(() => {
      handleChangeTab(tabs[0].id)
      return reformTabs
    })
    await CourseTestApi.submitQuestion(quizAttempId as string, {
      answers: answers,
      quiz_position_mapping: quiz_position_mapping,
    })
    return
  }
  const handleClearSelection = (currentTabContent: any) => {
    const data = currentTabContent.data
    if (!currentTabContent.done) {
      setTabs((prev: any) => {
        const arr = [...prev]
        const currentIndex = arr.findIndex((e) => e.id === data.id)
        arr[currentIndex] = { ...arr[currentIndex], answer: undefined }
        return arr
      })
      if (
        data.qType === QUESTION_TYPES.DRAG_DROP ||
        data.qType === QUESTION_TYPES.MATCHING
      ) {
        ref.current?.handleReset()
      }
    }
  }
  const handleSaveHighLight = (e: any) => {
    setTabs((prev: any) => {
      const newData = prev.map((item: any) => {
        if (currentPage === item.id) {
          // setCurrentTabContent({ ...item, hightlight: e })

          return { ...item, hightlight: e }
        }
        return item
      })
      return newData
    })
  }
  const handleSaveHighLightTopic = (e: any) => {
    setTabs((prev: any) => {
      const newData = prev.map((item: any) => {
        if (currentPage === item.id) {
          // setCurrentTabContent({ ...item, hightlightTopic: e })

          return { ...item, hightlightTopic: e }
        }
        return item
      })
      return newData
    })
  }
  useEffect(() => {
    if (currentTabContent?.data?.requirements) {
      setEssayData({ req: currentTabContent?.data?.requirements[0], index: 0 })
    }
    if (currentTabContent?.hightlightTopic) {
      DeserializeHighlight(
        currentTabContent?.hightlightTopic,
        'hightlight_area_topic',
      )
    }
  }, [currentTabContent])
  useEffect(() => {
    async function fetchTabs() {
      if (questions?.length > 0) {
        const arr = []

        for (let i in questions) {
          if (+i === 0) {
            const { topicDescription, res } = await getDetail(questions[0].id)
            arr.push({
              ...questions[i],
              viewed: true,
              flaged: false,
              done: false,
              index: +i,
              data: res.data[0],
              topicDescription: topicDescription.data,
            })
          } else {
            arr.push({
              ...questions[i],
              viewed: false,
              flaged: false,
              done: false,
              index: +i,
            })
          }
        }
        // setCurrentTabContent(arr[0])
        setTabs(arr)
      }
      setCurrentPage(questions?.[0]?.id)
    }
    if (questions) {
      fetchTabs()
    }
  }, [questions])

  // useEffect(() => {

  // }, [currentPage])
  const exhibits = useMemo(() => {
    let exhibitsOptions = []
    for (let e in currentTabContent?.data?.exhibits) {
      exhibitsOptions.push({
        label: `Exhibit ${+e + 1}`,
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
  useEffect(() => {
    async function createQuizAttempt() {
      const res = await CourseTestApi.createQuizAttempt(
        router.query.id as string,
      )
      setQuizAttempId(res.data.id)
    }
    if (router.query.id) {
      createQuizAttempt()
    }
  }, [router.query.id])
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
              onClick: () => {
                handleSubmitQuestion()
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
        <div className="px-6 bg-gray-4 shadow-solution py-4 relative">
          <TabSlide
            data={filteredTabs}
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
          className="flex gap-5 h-[calc(100%-240px)] bg-gray-3"
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
                    handleSaveHighLightTopic,
                    allowHighLight || false,
                    'hightlight_area_topic',
                  )
                }
              }
            }}
          >
            <EditorReader
              className="editor-wrap"
              text_editor_content={
                currentTabContent?.topicDescription?.description
              }
            />
          </div>
          <div className="w-1/2 h-full overflow-auto bg-white py-6 ">
            <div className="px-6">
              {/* {type !== QUESTION_TYPES.ESSAY ? ( */}
              {checkType(
                currentTabContent?.data,
                currentTabContent?.data?.qType,
                currentTabContent?.id,
                currentTabContent?.answer,
                currentTabContent?.corrects,
                currentTabContent?.hightlight,
                currentTabContent?.solution,
                currentTabContent?.done,
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
          className="max-w-screen-2md w-full m-auto h-[calc(100%-240px)] overflow-auto py-6 px-6"
          id={'preview-question'}
        >
          <div
            id="hightlight_area_topic"
            onMouseUp={(e: any) => {
              if (
                e.target.tagName.charAt(0) !== 'm' &&
                e.target.firstChild?.tagName !== 'math'
              ) {
                if (e) {
                  runHighlight(
                    handleSaveHighLightTopic,
                    allowHighLight || false,
                    'hightlight_area_topic',
                  )
                }
              }
            }}
          >
            <EditorReader
              className="editor-wrap mb-3"
              text_editor_content={
                currentTabContent?.topicDescription?.description
              }
            />
          </div>

          {/* {type !== QUESTION_TYPES.ESSAY ? ( */}
          {checkType(
            currentTabContent?.data,
            currentTabContent?.data?.qType,
            currentTabContent?.id,
            currentTabContent?.answer,
            currentTabContent?.corrects,
            currentTabContent?.hightlight,
            currentTabContent?.solution,
            currentTabContent?.done,
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
                onFocusingPad === e.id ? openScratchPad.length + 10 : index + 10
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
                  control={control}
                  name={e.id}
                  className="w-full h-[calc(100%-40px)] sapp-text-area"
                />
                {/* </div> */}
              </div>
            </MovableWindow>
          )
        } else if (e.type === 'exhibits') {
          const i = currentTabContent?.data?.exhibits?.findIndex(
            (el: any) => el.id === e.id,
          )
          const exhibitsDes = currentTabContent?.data?.exhibits?.[i]
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
                <div className="flex w-6-percent items-center bg-white w-full h-10 justify-between px-5">
                  <div>
                    <span className="font-semibold text-base text-bw-1">{`Exhibit ${
                      i + 1
                    }: `}</span>
                    {exhibitsDes?.name}
                  </div>
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
                  className="bg-white h-[calc(100%-40px)] w-full overflow-auto p-5"
                />
              </div>
            </MovableWindow>
          )
        }
      })}
      {/* </div> */}
      <div className=" bg-gray-3 flex items-center flex-1 justify-between shadow-question-footer min-h-[96px]">
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
                <div className="bg-gray-3 absolute h-fit w-full bottom-full max-h-40 shadow-questions-exhibits p-4 justify-center z-[1400]">
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
                <TextSquareIcon />
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
            onClick={() => handleClearSelection(currentTabContent)}
          >
            <div className="font-normal text-sm">Clear Selection</div>
          </button>
          <button
            className="flex items-center gap-3 border border-gray-1 justify-center p-3"
            onClick={() => {
              getResult(currentTabContent)
            }}
          >
            <div className="font-normal text-sm">Confirm Answer</div>
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
    // Parse cookies from the request headers
    const cookies = parse(req.headers.cookie || '')

    if (!context?.query?.id) {
      return {
        notFound: true,
      }
    }
    const questions = (await CourseTestApi.getQuestionTabsById(
      context?.query?.id,
      cookies.accessToken,
    )) as any

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
        const questions = (await CourseTestApi.getQuestionTabsById(
          context?.query?.id,
          refreshResponse.data.accessToken,
        )) as any

        return {
          props: { questions },
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
