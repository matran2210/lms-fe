import { ExaminationsResponse } from '@lms/contexts'
import {
  ExamInformation,
  IAttendanceStatistics,
  IClassAttendanceHistoryResponse,
  IClassResourceList,
  IClassResourcePreview,
  ILessonListParams,
  IListClassResourceParams,
  IQuizResultList,
  IResponse,
  IStudentAttendanceListParams,
  IStudentAttendanceListResponse,
  IStudentLessonListResponse
} from '@lms/core'
import { fetcher, fetchFormData } from '@services/request'
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

  static previewClassFile(
    class_id: string,
    resource_id: string,
  ): Promise<IClassResourcePreview> {
    return fetcher(`class-resource/${class_id}/preview/${resource_id}`)
  }

    // attendance
  // student attendance: get attendance of a class
  static getStudentAttendance(
    class_id: string, 
    params: IStudentAttendanceListParams,
  ): Promise<IResponse<IStudentAttendanceListResponse>> {
    return fetcher(`${apiURL}/classes/${class_id}/student-attendances`, {
      params: params,
    })
  }

  // student attendance summary: get summary of attendance of a class
  static getStudentAttendanceSummary(
    class_id: string, 
  ): Promise<IResponse<IAttendanceStatistics>> {
    return fetcher(`${apiURL}/classes/${class_id}/student-attendances/summary`)
  }

  // class attendance history: get attendance history of a class
  static getClassAttendanceHistory(
    lesson_id: string
  ): Promise<IResponse<IClassAttendanceHistoryResponse>> {
    return fetcher(`${apiURL}/classes/attendances-history/${lesson_id}`)
  }

  // student learning-schedule: get learning-schedule of a student in a class
  static getStudentLearningSchedule(
    params: ILessonListParams,
  ): Promise<IResponse<IStudentLessonListResponse>> {
    return fetcher(`${apiURL}/classes/student/learning-schedule`, {
      params: params,
    })
  }

  // teacher learning-schedule: get learning-schedule of a teacher in a class
  static getTeacherLearningSchedule(
    params: { page_index: number; page_size: number, fromDate?: string, toDate?: string, class_ids?: string[] },
  ): Promise<IResponse<any>> {
    return fetcher(`${apiURL}/classes/teacher/teaching-schedule`, {
      params: params,
    })
  }
}
