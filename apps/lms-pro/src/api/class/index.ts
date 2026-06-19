import { ExaminationsResponse } from '@lms/contexts'
import {
  DEFAULT_PAGE_NUMBER,
  ExamInformation,
  IAttendanceStatistics,
  IClassResourceList,
  IClassResourcePreview,
  ILessonListParams,
  IListClassResourceParams,
  IQuizResultList,
  IResponse,
  IStudentAttendanceHistoryResponse,
  IStudentAttendanceListParams,
  IStudentAttendanceListResponse,
  IStudentLessonListResponse,
  ITeacherTeachingClassListResponse,
  ITeacherTeachingLessonListResponse
} from '@lms/core'
import { fetcher, fetchFormData } from '@services/request'
import { AxiosPromise } from 'axios'

export class ClassAPI {
  static getAllResultOfQuiz(
    id: string,
    quiz_id: string,
    params?: { page_index: number; page_size: number },
  ): Promise<IResponse<IQuizResultList>> {
    return fetcher(`/classes/${id}/result/${quiz_id}`, {
      params: params,
    })
  }

  static getExams(
    id: string,
    params: { page_index: number; page_size: number },
  ): Promise<ExaminationsResponse> {
    return fetcher(`/classes/${id}/examination`, {
      method: 'GET',
      params: params,
    })
  }

  static changeExamDate(
    id: string,
    data: FormData,
  ): AxiosPromise<IResponse<any>> {
    return fetchFormData({
      url: `/classes/${id}/examination`,
      method: 'PUT',
      formData: data,
    })
  }

  static getExamInfo(id?: string): Promise<ExamInformation> {
    return fetcher(`/classes/${id}/exam-info`)
  }

  static getClassSchedule(
    id: string,
    page_index: number,
    page_size: number,
    search_key?: string,
  ): Promise<any> {
    return fetcher(`/class-resource/class-schedule`, {
      params: { class_id: id, page_index, page_size, search_key },
    })
  }

  static sendMailRequestRegrading(
    classId: string,
    quizAttemptId: string,
    reason: string,
  ): Promise<IResponse<any>> {
    return fetcher(
      `/classes/${classId}/result/${quizAttemptId}/request-regrading`,
      {
        data: { reason },
        method: 'POST',
      },
    )
  }

  static getClassResource(
    class_id: string,
    params: IListClassResourceParams,
  ): Promise<IClassResourceList> {
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
    return fetcher(`/classes/students/${class_id}/attendances`, {
      params: params,
    })
  }

  // student attendance summary: get summary of attendance of a class
  static getStudentAttendanceSummary(
    class_id: string, 
  ): Promise<IResponse<IAttendanceStatistics>> {
    return fetcher(`/classes/${class_id}/student-attendances/summary`)
  }

  // class attendance history: get attendance history of a class
  static getClassAttendanceHistory(
    class_id: string, lesson_id: string
  ): Promise<IResponse<IStudentAttendanceHistoryResponse>> {
    return fetcher(`/classes/${class_id}/students/${lesson_id}/attendance-history?page_index=${DEFAULT_PAGE_NUMBER}&page_size=100`)
  }

  // student learning-schedule: get learning-schedule of a student in a class
  static getStudentLearningSchedule(
    params: ILessonListParams,
  ): Promise<IResponse<IStudentLessonListResponse>> {
    return fetcher(`/classes/student/learning-schedule`, {
      params: params,
    })
  }

  // teacher learning-schedule: get learning-schedule of a teacher in a class
  static getTeacherLearningSchedule(
    params: ILessonListParams,
  ): Promise<IResponse<ITeacherTeachingLessonListResponse>> {
    return fetcher(`/classes/teacher/teaching-schedule`, {
      params: params,
    })
  }
  // get teacher teaching class
  static getTeacherTeachingClass(
    params: Omit<ILessonListParams, "class_ids">,
  ): Promise<IResponse<ITeacherTeachingClassListResponse>> {
    return fetcher(`/classes/teacher/teaching-schedule`, {
      params: params,
    })
  }
}
