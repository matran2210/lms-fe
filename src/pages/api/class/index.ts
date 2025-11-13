import { apiURL } from '@components/mycourses/LearningResource'
import { fetcher, fetchFormData } from '@services/requestV2'
import { AxiosPromise } from 'axios'
import { IResponse } from 'src/redux/types'
import { ExaminationsResponse } from 'src/redux/types/Course/MyCourse/ExamInformation'
import { IQuizResultList } from 'src/type'
import { ExamInformation } from 'src/type/course'

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
    data: FormData,
  ): AxiosPromise<IResponse<any>> {
    return fetchFormData({
      url: `${apiURL}/classes/${id}/examination`,
      method: 'PUT',
      formData: data,
    })
  }

  static getExamInfo(id: string): Promise<ExamInformation> {
    return fetcher(`${apiURL}/classes/${id}/exam-info`, { method: 'GET' })
  }

  static sendMailRequestRegrading(
    classId: string,
    quizAttemptId: string,
    reason: string,
  ): Promise<IResponse<void>> {
    return fetcher(
      `/classes/${classId}/result/${quizAttemptId}/request-regrading`,
      {
        data: { reason },
        method: 'POST',
      },
    )
  }
}
