import { QUESTION_TYPES, Sheet } from '@lms/core'
import { FieldValues, UseFormGetValues } from 'react-hook-form'

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
