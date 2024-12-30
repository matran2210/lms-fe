import { fetcher } from '@services/requestV2'
import { IResponse } from 'src/redux/types'
import { IQuestion } from 'src/type/course/Question'

type QuestionDetailQueryDTO = {
  after_test: boolean
}

const baseURL = 'question'

export class QuestionAPI {
  static getQuestionDetail(
    questionId: string,
    query?: QuestionDetailQueryDTO,
  ): Promise<IResponse<IQuestion>> {
    return fetcher(`${baseURL}/${questionId}`, {
      params: query,
    })
  }
}
