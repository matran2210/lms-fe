import { fetcher } from '@services/request'
import { buildQueryString } from '@lms/utils'
import {
  APIDetailScheduleRequestResponse,
  APIListScheduleRequestResponse,
  RequestScheduleParams,
  StatusMultipleRequestScheduleParams,
  StatusRequestScheduleParams,
} from '@lms/core/types/teachers/request-schedule.interface'

export class TeacherAPI {
  static getListClass(
    page_index: number,
    page_size: number,
    params?: Object,
  ): Promise<any> {
    return fetcher(
      `/classes/teacher?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }
  static getClassById(id: string): Promise<any> {
    return fetcher(`/classes/${id}/teacher`)
  }
  static getStudentById(
    id: string,
    page_index: number,
    page_size: number,
    params?: Object,
  ): Promise<any> {
    return fetcher(
      `/classes/${id}/teacher/student?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }
  static getListTestQuiz(
    id: string,
    page_index: number,
    page_size: number,
    params?: Object,
  ): Promise<any> {
    return fetcher(
      `/classes/${id}/teacher/class-quiz?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }
  static getDetailTestQuiz(
    id: string,
    chapter_test_id: string,
    page_index: number,
    page_size: number,
    params?: Object,
  ): Promise<any> {
    return fetcher(
      `/classes/${id}/teacher/class-quiz/${chapter_test_id}?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }
  static getSubjects(
    page_index: number,
    page_size: number,
    params?: Object,
  ): Promise<any> {
    return fetcher(
      `/subjects?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }
  static getCourseCategory(
    page_index: number,
    page_size: number,
    params?: Object,
  ): Promise<any> {
    return fetcher(
      `/course_categories?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }

  /**
   * Hàm này lấy danh sách yêu cầu thực hành
   * @param page_index: number - biến xác định trang
   * @param page_size: number - biến xác định số request một trang
   * @param fromDate: string - biến xác định ngày tạo tài liệu,
   * @param toDate: string - biến xác định ngày tạo tài liệu,
   * @param dateField: string - biến xác định ngày tạo tài liệu,
   * @param search: string - biến xác định tìm kiếm theo tài liệu,
   * @param course_category_id: string - biến xác định tìm kiếm theo tài liệu,
   * @param status: string - biến xác định tìm kiếm theo tài liệu,
   * @returns danh sách yêu cầu thực hành
   */

  static getListRequestSchedule(
    payload: RequestScheduleParams,
  ): Promise<APIListScheduleRequestResponse> {
    const queryString = buildQueryString(payload)
    return fetcher(`/request-schedules/teachings?${queryString}`)
  }

  /**
   * Hàm này lấy chi tiết yêu cầu thực hành
   * @param id: string - biến xác định id yêu cầu thực hành
   * @returns chi tiết yêu cầu thực hành
   */
  static getRequestScheduleById(
    id: string,
  ): Promise<APIDetailScheduleRequestResponse> {
    return fetcher(`/request-schedules/teaching/${id}`)
  }

  /**
   * Hàm này cập nhật trang thai yêu cầu thực hành
   * @param id: string - biến xác định id yêu cầu thực hành
   * @param payload: StatusRequestScheduleParams
   * @returns chi tiết yêu cầu thực hành
   */

  static updateStatusRequestSchedule(
    id: string,
    payload: StatusRequestScheduleParams,
  ): Promise<void> {
    return fetcher(`/request-schedules/teaching/${id}`, {
      data: payload,
      method: 'PUT',
    })
  }

  static updateMultipleStatusRequestSchedules(
    payload: StatusMultipleRequestScheduleParams,
  ): Promise<void> {
    return fetcher(`/request-schedules/teachings`, {
      data: payload,
      method: 'PUT',
    })
  }
}
