import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'

export class CaseStudyAPI {
  static getTopicQuiz(id: string | string[] | undefined, quiz_id: string | string[] | undefined): Promise<any> {
    return fetcher(`${apiURL}/question-topic/${id}?quiz_id=${quiz_id}`)
  }
}
