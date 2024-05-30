import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'

type QuestionDetailQueryDTO = {
  after_test: boolean
}

const baseURL = `${apiURL}/question`

export class QuestionAPI {
  static getQuestionDetail(questionId: string, query?: QuestionDetailQueryDTO) {
    return fetcher(`${baseURL}/${questionId}`, {
      params: query,
    })
  }
}
