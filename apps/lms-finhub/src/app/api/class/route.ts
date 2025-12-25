import { fetcher, fetchFormData } from '@services/requestV2'
import { AxiosPromise } from 'axios'
import { ExaminationsResponse } from 'src/redux/types/Course/MyCourse/ExamInformation'
import { IQuizResultList, ExamInformation, IResponse} from '@lms/core'

export class ClassAPI {
  static getAllResultOfQuiz(
    id: string,
    quiz_id: string,
    params?: { page_index: number; page_size: number },
  ): Promise<IResponse<IQuizResultList>> {
    return fetcher(`paramsclasses/${id}/result/${quiz_id}`, {
      params: params,
    })
  }

  static getExams(
    id: string,
    params: { page_index: number; page_size: number },
  ): Promise<ExaminationsResponse> {
    return fetcher(`paramsclasses/${id}/examination`, {
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
