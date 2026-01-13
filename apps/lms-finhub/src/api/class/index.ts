import { fetcher, fetchFormData } from '@services/requestV2'
import { AxiosPromise } from 'axios'
import { IQuizResultList, ExamInformation, IResponse } from '@lms/core'
import { ExaminationsResponse } from '@lms/contexts'

export class ClassAPI {
  static getAllResultOfQuiz(
    id: string,
    quiz_id: string,
    params?: { page_index: number; page_size: number },
  ): Promise<IResponse<IQuizResultList>> {
    return fetcher(`classes/${id}/result/${quiz_id}`, {
      params: params,
    })
  }

  static getExams(
    id: string,
    params: { page_index: number; page_size: number },
  ): Promise<ExaminationsResponse> {
    return fetcher(`classes/${id}/examination`, {
      method: 'GET',
      params: params,
    })
  }

  static changeExamDate(
    id: string,
    data: FormData,
  ): AxiosPromise<IResponse<any>> {
    return fetchFormData({
      url: `paramsclasses/${id}/examination`,
      method: 'PUT',
      formData: data,
    })
  }

  static getExamInfo(id: string): Promise<ExamInformation> {
    return fetcher(`paramsclasses/${id}/exam-info`, { method: 'GET' })
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
