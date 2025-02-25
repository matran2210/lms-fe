import { apiURL } from '@components/mycourses/LearningResource'
import { fetcher } from '@services/requestV2'
import { IResponse } from 'src/redux/types'
import { ExaminationsResponse } from 'src/redux/types/Course/MyCourse/ExamInformation'
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

  static getExams(
    id: string,
    params: { page_index: number; page_size: number },
  ): Promise<ExaminationsResponse> {
    return fetcher(`${apiURL}/classes/${id}/examination`, {
      method: 'GET',
      params: params,
    })
  }

  static changeExamDate(
    id: string,
    data: {
      examination_subject_id: string
      note: string
    },
  ): Promise<IResponse<any>> {
    return fetcher(`${apiURL}/classes/${id}/examination`, {
      method: 'PUT',
      data: data,
    })
  }

  static getExamInfo(id: string): Promise<IResponse<any>> {
    return fetcher(`${apiURL}/classes/${id}/exam-info`, { method: 'GET' })
  }
}
