import { IDataQuestion, Requirement } from "@lms/core";
import { isEmpty } from "lodash";

  // Validate các câu hỏi xem đã trả lời chưa
 export const validateAnswer = (item: {
    answer: string | Object[] | string[]
    answer_file?: { file_key?: string; file_name?: string }
  }) => {
    if (item?.answer_file?.file_key) return true
    if (typeof item?.answer === 'string' && !item?.answer) {
      return false
    }
    if (!item?.answer?.length) return false
    if (Array.isArray(item?.answer)) {
      const emptyAnswer = item?.answer?.filter(
        (el: { idAnswer?: string; answer_id?: string }) => {
          if (el.hasOwnProperty('idAnswer') && !el?.idAnswer) {
            return el
          }
          if (el.hasOwnProperty('answer_id') && !el?.answer_id) {
            return el
          }
        },
      )
      const emptyEl = item.answer.filter((el) => typeof el === 'string' && !el)
      if (emptyAnswer?.length || emptyEl.length) {
        return false
      }
    }
    return true
  }

    // validate essay question with requirement
  export const validateEssayAnswerWithRequirement = (data: IDataQuestion) => {
    if (data?.requirements?.length > 0) {
      return data?.requirements?.some(
        (el: Requirement) => !!el?.answer_text || !!el?.answer_file?.file_key,
      )
    } else {
      return false
    }
  }
