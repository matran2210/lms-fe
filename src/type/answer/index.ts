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
}
