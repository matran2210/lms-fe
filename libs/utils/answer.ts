import { checkSheetAnswered } from './helpers/quiz-test/index';
import { DEFAULT_EDITOR_VALUE, ESSAY_TYPE, QUESTION_TYPES } from '@lms/core'
interface IOneChoiceAnswer {
  question_id?: string
  question_answer_id?: string
}

interface IMultiChoiceAnswer {
  question_id: string
  answer: any[]
}

interface IMatchingAnswer {
  question_id: string
  answer: {
    question_id?: string
    answer_id?: string
  }[]
}

interface IFillWordAnswer {
  question_id: string
  answer: {
    answer_text?: string
    answer_position: number
  }[]
}

interface IDragAndDropAnswer {
  question_id: string
  answer: {
    answer_id?: string
    answer_position: number
  }[]
}

interface IEssayAnswer {
  active: string
  answer_file?: {
    file_key: string
    file_name: string
  }
  question_id: string
  response_option: string
  short_answer: string
}

export const isValidatedAnswer = (
  answer: unknown,
  questionType: string,
): boolean => {
  let value: any[] = []
  switch (questionType) {
    case QUESTION_TYPES.ONE_CHOICE:
    case QUESTION_TYPES.TRUE_FALSE:
      value = (answer as IOneChoiceAnswer[])?.filter(
        (item) => !!item.question_answer_id,
      )
      return !!value?.length
    case QUESTION_TYPES.MULTIPLE_CHOICE:
      value = (answer as IMultiChoiceAnswer[])?.filter(
        (item) => item.answer?.length > 0,
      )
      return !!value?.length
    case QUESTION_TYPES.SELECT_WORD:
      return (answer as IMatchingAnswer[])?.[0]?.answer?.length > 0
    case QUESTION_TYPES.MATCHING:
      value = (answer as IMatchingAnswer[])?.[0]?.answer?.filter(
        (item) => !!item.answer_id,
      )
      return !!value?.length
    case QUESTION_TYPES.FILL_WORD:
      value = (answer as IFillWordAnswer[])?.[0]?.answer?.filter(
        (item) => !!item.answer_text,
      )
      return !!value?.length
    case QUESTION_TYPES.DRAG_DROP:
      value = (answer as IDragAndDropAnswer[])?.[0]?.answer?.filter(
        (item) => !!item.answer_id,
      )
      return !!value?.length
    case QUESTION_TYPES.ESSAY:
      value = (answer as IEssayAnswer[])?.filter((item) => {
        if (
          item?.short_answer &&
          item.response_option === ESSAY_TYPE.SHEET &&
          !item.answer_file
        ) {
          let hasAnswer = false
          const data = JSON.parse(item?.short_answer)
          //** check qua từng cell của excel để xem có đáp án không  */
          for (let el of data) {
            if (el.celldata && el.celldata.length > 0) {
              hasAnswer = true
              break
            }
            if (hasAnswer) return item
          }
        }
        if (!!item?.answer_file?.file_key
          || (item.response_option === ESSAY_TYPE.SHEET && !!checkSheetAnswered(item.short_answer))
          || (item.response_option === ESSAY_TYPE.WORD && item.short_answer !== DEFAULT_EDITOR_VALUE)) {
          return item;
        }
      })
      return !!value?.length
    default:
      return false
  }
}

export interface Correct {
  id: string;
  is_correct: boolean;
  answer: string;
  answer_position: number;
}