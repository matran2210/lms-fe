export interface IEssayAnswer {
  active: string
  answer_file?: {
    file_key: string
    file_name: string
  }
  question_id: string
  requirement_id: string
  response_option: string
  short_answer?: string
  answer_template?: string
}

export interface myAnswerOneChoice {
  question_id: string | undefined
  question_answer_id: string | undefined
  time_spent: number
}
export interface myAnswerMultipleChoice {
  question_id: string
  answer: {
    answer_id: string
  }[]
  time_spent: number
}
export interface myAnswerFillWord {
  question_id: string
  answer: {
    answer_text: string
    answer_position: number
  }[]
  time_spent: number
}
export interface myAnswerSelectWord {
  question_id: string
  answer: string[]
  time_spent: number
}
export interface myAnswerMatching {
  question_id: string
  answer: {
    question_id: string
    answer_id: string
  }[]
  time_spent: number
}
export interface myAnswerDragDrop {
  question_id: string
  answer: {
    answer_id: string
    answer_position: number
  }[]
  time_spent: number
}
export interface myAnswerEssay extends IEssayAnswer {
  time_spent: number
}

export type myAnswer = myAnswerOneChoice | myAnswerMultipleChoice | myAnswerFillWord | myAnswerSelectWord | myAnswerMatching | myAnswerDragDrop | myAnswerEssay;