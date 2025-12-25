import { QUESTION_TYPES, Sheet, TEST_TYPE } from '@lms/core'
import { TestServiceAPI } from 'src/app/api/test-api/route'
import dayjs from 'dayjs'
import { FieldValues, UseFormGetValues } from 'react-hook-form'

export const getResult = async (currentTabContent: any) => {
  const res = await TestServiceAPI.getQuestionAnswer(currentTabContent.id)
  let corrects = {} as any
  if (
    currentTabContent.qType === QUESTION_TYPES.ONE_CHOICE ||
    currentTabContent.qType === QUESTION_TYPES.TRUE_FALSE ||
    currentTabContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
  ) {
    corrects = res?.data?.[0].answers?.reduce(
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
    corrects = { corrects: [...res?.data?.[0]?.answers] }
  } else if (currentTabContent.qType === QUESTION_TYPES.MATCHING) {
    corrects = { corrects: [...res?.data?.[0]?.question_matchings] }
  } else if (currentTabContent.qType === QUESTION_TYPES.DRAG_DROP) {
    corrects = {
      corrects: [
        ...res?.data?.[0]?.answers?.sort(
          (a: any, b: any) => a?.answer_position - b?.answer_position,
        ),
      ],
    }
  }
  return {
    corrects: corrects,
    solution: res?.data?.[0]?.solution,
    isSelfReflection: res?.data?.[0]?.is_self_reflection,
    requirements: res?.data?.[0]?.requirements,
  }
}

export const checkTypeAndRenderTitle = (type: string) => {
  let pageTitle = ''
  switch (type) {
    case TEST_TYPE.MID_TERM_TEST:
      return (pageTitle = 'Midterm Test')
    case TEST_TYPE.FINAL_TEST:
      return (pageTitle = 'Final Test')
    case TEST_TYPE.TOPIC_TEST:
      return (pageTitle = 'Topic Test')
    case TEST_TYPE.CHAPTER_TEST:
      return (pageTitle = 'Chapter Test')
    case TEST_TYPE.PART_TEST:
      return (pageTitle = 'Part Test')
    case TEST_TYPE.ENTRANCE_TEST:
      return (pageTitle = 'Entrance Test')
    case TEST_TYPE.EVENT_TEST:
      return (pageTitle = 'Event Test')
    default:
      return pageTitle
  }
}

// Get Value Answer

/**
 * @description Get fill text answers from form
 * @return {void}
 */
export const getValueFillText = () => {}

/**
 * @description Get select word answers from DOM elements
 * @return {Array} Array of selected values
 */
const getValueSelectText = () => {
  let value = [] as any
  const inputs = document.querySelectorAll('div.sapp-select--question') as any

  for (let e of inputs) {
    value.push(e?.dataset.value)
  }
  return value
}
/**
 * @description Get drag and drop answers from DOM elements
 * @return {Array<Object>} Array of objects containing id, value and idAnswer
 */
export const getAnswerDragNDrop = () => {
  let value = [] as any
  const inputs = document.querySelectorAll('.sapp-input-dragNDrop') as any
  inputs.forEach((e: HTMLElement, index: number) => {
    const idAnswer = e.querySelector('.answer-box') as HTMLElement | null
    value.push({
      id: e?.id,
      value: e?.innerText,
      idAnswer: idAnswer?.id,
      position: index,
    })
  })
  return value
}

/**
 * @description Process and encode answer data to base64
 * @param {any} data Data to be processed (File, Array, Object, or primitive)
 * @return {Promise<string>} Base64 encoded string of processed data
 */
export const processDataAnswer = async (data: any): Promise<string> => {
  const encodeBase64 = (str: string) => {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)))
  }

  if (Array.isArray(data) || typeof data === 'object') {
    // Nếu là array hoặc object, stringify rồi mã hóa
    return encodeBase64(JSON.stringify(data))
  } else {
    // Nếu là text hoặc số, convert thành chuỗi và mã hóa
    return encodeBase64(String(data))
  }
}

/**
 * @description Compare two values by converting them to base64 and comparing
 * @param {any} oldValue Previous value
 * @param {any} newValue Current value
 * @return {Promise<boolean>} True if values are equal, false otherwise
 */
export const compareValues = async (oldValue: any, newValue: any) => {
  const hashOldValue = await processDataAnswer(oldValue)
  const hashNewValue = await processDataAnswer(newValue)
  return hashOldValue === hashNewValue
}

/**
 * @description Compare current and previous values based on question type
 * @param {Object} currentTabContent Current question content
 * @param {Object} oldCurrentTabData Previous question data
 * @param {UseFormGetValues<FieldValues>} getValues Function to get form values
 * @return {Promise<boolean>} True if values are equal, false otherwise
 */
export const isValuesEqual = async (
  currentTabContent: any,
  oldCurrentTabData: any,
  getValues: UseFormGetValues<FieldValues>,
) => {
  const { qType } = currentTabContent

  if ([QUESTION_TYPES.TRUE_FALSE, QUESTION_TYPES.ONE_CHOICE].includes(qType)) {
    const oldValue = oldCurrentTabData?.answer
    const newValue = getValues(`${currentTabContent?.id}_answer`)
    return oldValue === newValue
  }

  if (
    [
      QUESTION_TYPES.MATCHING,
      QUESTION_TYPES.DRAG_DROP,
      QUESTION_TYPES.SELECT_WORD,
      QUESTION_TYPES.FILL_WORD,
      QUESTION_TYPES.MULTIPLE_CHOICE,
    ].includes(qType)
  ) {
    const oldValue = oldCurrentTabData?.answer
    let newValue: any

    switch (qType) {
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        newValue = getValues(`${currentTabContent?.id}_answer`)
        break
      case QUESTION_TYPES.MATCHING:
        newValue = getValues(`${currentTabContent?.id}_answer`)
        break
      case QUESTION_TYPES.DRAG_DROP:
        newValue = getValues(`${currentTabContent?.id}_drag_drop_answer`)
        break
      case QUESTION_TYPES.SELECT_WORD:
        newValue = getValues(`${currentTabContent?.id}_answer`)
        break
      case QUESTION_TYPES.FILL_WORD:
        newValue = getValues(`${currentTabContent?.id}_fillword`)
        break
      default:
        return false
    }
    return await compareValues(oldValue, newValue)
  }

  // if (qType === QUESTION_TYPES.ESSAY) {
  //   if (oldCurrentTabData?.data?.requirements?.length) {
  //     return false
  //   } else {
  //     const oldValue =
  //       (oldCurrentTabData?.answer_file?.file_key || '') +
  //       (oldCurrentTabData?.answer || '')
  //     const newValue =
  //       (currentTabContent?.answer_file?.file_key || '') +
  //       (getValues(`${currentTabContent?.id}_0_answer`) ||
  //         currentTabContent?.answer ||
  //         '')
  //     return await compareValues(oldValue, newValue)
  //   }
  // }

  return false
}

const calculateEndTime = (createdAt: Date, quizTimed: number): Date => {
  return dayjs(createdAt).add(quizTimed, 'minutes').toDate()
}

export const isQuizExpired = (createdAt: Date, quizTimed: number): boolean => {
  const endTime = calculateEndTime(createdAt, quizTimed)
  return dayjs().isAfter(endTime)
}

export const isWorkbookEmpty = (sheets: Sheet[] | undefined): boolean => {
  if (!sheets || sheets.length === 0) return true
  return sheets?.every((s) => !s.celldata || s.celldata.length === 0)
}

export function hasEditorValueFromHtml(
  html: string | null | undefined,
): boolean {
  if (!html) return false

  // Xoá hết thẻ HTML và khoảng trắng
  const text = html.replace(/<[^>]*>/g, '').trim()

  return text.length > 0
}
