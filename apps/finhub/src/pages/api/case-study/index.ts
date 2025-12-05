import { fetcher } from '@services/requestV2'

export class CaseStudyAPI {
  static getTopicQuiz(
    id: string | string[] | undefined,
    quiz_id: string | string[] | undefined,
  ): Promise<any> {
    return fetcher(`question-topic/${id}?quiz_id=${quiz_id}`)
  }
}
