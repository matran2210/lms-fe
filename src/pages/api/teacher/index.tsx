import { fetcher } from '@services/requestV2'
import { buildQueryString } from '@utils/index'
import url from 'src/redux/services/Course/MyCourse/Test/url'
import { apiURL } from 'src/redux/services/httpService'
import { IResponse } from 'src/redux/types'
import { IScoreDetails } from 'src/type'
import { ICourseSubjectList } from 'src/type/classes'
import {
  RequestScheduleParams,
  StatusRequestScheduleParams,
} from 'src/type/teachers/request-schedule.interface'

export class TeacherAPI {
  static getListClass(
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/classes/teacher?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }
  static getClassById(id: string): Promise<any> {
    return fetcher(`${apiURL}/classes/${id}/teacher`)
  }
  static getStudentById(
    id: string,
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/classes/${id}/teacher/student?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }
  static getListTestQuiz(
    id: string,
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/classes/${id}/teacher/class-quiz?page_index=${page_index}&page_size=${page_size}`,
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
    params: Object,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/classes/${id}/teacher/class-quiz/${chapter_test_id}?page_index=${page_index}&page_size=${page_size}`,
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

  static getListRequestSchedule(payload: RequestScheduleParams): Promise<any> {
    const queryString = buildQueryString(payload)
    return fetcher(`${apiURL}/request-schedules/teachings?${queryString}`)
  }

  /**
   * Hàm này lấy chi tiết yêu cầu thực hành
   * @param id: string - biến xác định id yêu cầu thực hành
   * @returns chi tiết yêu cầu thực hành
   */
  static getRequestScheduleById(id: string): Promise<any> {
    return fetcher(`${apiURL}/request-schedules/teaching/${id}`)
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
  ): Promise<any> {
    return fetcher(`${apiURL}/request-schedules/teaching/${id}`, {
      data: payload,
      method: 'PUT',
    })
  }
}
