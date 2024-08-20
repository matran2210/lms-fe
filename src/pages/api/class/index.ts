import { apiURL } from '@components/mycourses/LearningResource'
import { fetcher } from '@services/requestV2'
import { IResponse } from 'src/redux/types'
import { IQuizResultList } from 'src/type'

export class ClassAPI {
  static getAllResultOfQuiz(
    id: string,
    quiz_id: string,
    params?: { page_index: number; page_size: number },
  ): Promise<IResponse<IQuizResultList>> {
    return fetcher(`${apiURL}/classes/${id}/result/${quiz_id}`, {
      params: params,
    })
  }
}
