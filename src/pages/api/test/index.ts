import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'

export class TestAPI {
  static createTopicAttempt(
    quiz_id: string,
    question_topic_id: string,
    class_user_id?: string,
  ) {
    return fetcher(`${apiURL}/quiz/case-study/topic-attempt`, {
      method: 'POST',
      data: {
        quiz_id,
        question_topic_id,
        class_user_id,
      },
    })
  }

  static getQuestionAnswer(id: string) {
    return fetcher(`${apiURL}/question/results`, {
      params: {
        question_ids: id,
      },
    })
  }
  
  static getResource(id: string) {
    return fetcher(`${apiURL}/resource/${id}`)
  }
}
