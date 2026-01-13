import { ExaminationsResponse } from '@lms/contexts'
import {
  ExamInformation,
  IClassResourceList,
  IListClassResourceParams,
  IQuizResultList,
  IResponse,
} from '@lms/core'
import { fetcher, fetchFormData } from '@services/requestV2'
import { AxiosPromise } from 'axios'
import { apiURL } from 'src/constants'

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

  static getExamInfo(id?: string): Promise<ExamInformation> {
    return fetcher(`${apiURL}/classes/${id}/exam-info`)
  }

  static getClassSchedule(
    id: string,
    page_index: number,
    page_size: number,
    search_key?: string,
  ): Promise<any> {
    return fetcher(`${apiURL}/class-resource/class-schedule`, {
      params: { class_id: id, page_index, page_size, search_key },
    })
  }

  static sendMailRequestRegrading(
    classId: string,
    quizAttemptId: string,
    reason: string,
  ): Promise<IResponse<any>> {
    return fetcher(
      `${apiURL}/classes/${classId}/result/${quizAttemptId}/request-regrading`,
      {
        data: { reason },
        method: 'POST',
      },
    )
  }

  static getClassResource(
    class_id: string,
    params: IListClassResourceParams,
  ): Promise<IResponse<IClassResourceList>> {
    return fetcher(`class-resource`, { params: { class_id, ...params } })
  }
}
