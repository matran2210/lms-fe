import { fetcher } from '@services/requestV2'

export class TestAPI {
  static getQuestionAnswer(id: string) {
    return fetcher(`question/results`, {
      params: {
        question_ids: id,
      },
    })
  }

  static getResource(id: string) {
    return fetcher(`resource/${id}`)
  }
}
