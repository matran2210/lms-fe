import { QUESTION_TYPES } from 'src/constants'

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
  answer_file: string
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
      return (answer as IMatchingAnswer[])?.[0].answer?.length > 0
    case QUESTION_TYPES.MATCHING:
      value = (answer as IMatchingAnswer[])?.[0].answer?.filter(
        (item) => !!item.answer_id,
      )
      return !!value?.length
    case QUESTION_TYPES.FILL_WORD:
      value = (answer as IFillWordAnswer[])?.[0].answer?.filter(
        (item) => !!item.answer_text,
      )
      return !!value?.length
    case QUESTION_TYPES.DRAG_DROP:
      value = (answer as IDragAndDropAnswer[])?.[0].answer?.filter(
        (item) => !!item.answer_id,
      )
      return !!value?.length
    case QUESTION_TYPES.ESSAY:
      value = (answer as IEssayAnswer[])?.filter(
        (item) => !!item.answer_file || !!item.short_answer,
      )
      return !!value?.length
    default:
      return false
  }
}
