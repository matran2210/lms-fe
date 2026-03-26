import { fetcher } from '@services/request'
import { IQuestion, IResponse } from '@lms/core'

type QuestionDetailQueryDTO = {
  after_test: boolean
}

const baseURL = 'question'

export class QuestionAPI {}
