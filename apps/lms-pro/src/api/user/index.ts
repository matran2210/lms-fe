import { DEFAULT_PAGE_NUMBER, IClassAttendanceHistoryResponse, IResponse, ITeacherTeachingAttendanceListParams, ITeacherTeachingAttendanceListResponse, ITeachingStatistics, UserExamInformation } from '@lms/core'
import { fetcher } from '@services/request'

export class UserApi {
  static getExamination(
    page_index: number,
    page_size: number,
  ): Promise<UserExamInformation> {
    return fetcher(
      `/users/examination?page_index=${page_index}&page_size=${page_size}&template=4`,
    )
  }

  static getUserPrograms(course_category_id: string | undefined): Promise<any> {
    return fetcher(`users/programs?course_category_id=${course_category_id}`)
  }

  /**
   * Gửi yêu cầu đăng xuất người dùng thông qua refresh token.
   *
   * Hàm này gọi API `auth/logout` với phương thức POST và gửi refresh token
   * để yêu cầu hệ thống hủy phiên đăng nhập hiện tại. Sau khi logout thành công,
   * API sẽ trả về `user_id_init` — ID của người dùng đã khởi tạo phiên đăng nhập.
   *
   * @param {string} refresh_token - Refresh token của người dùng dùng để xác thực và hủy phiên.
   * @returns {Promise<{user_id_init: string}>} - Trả về Promise chứa ID người dùng đã đăng xuất.
   *
   * @example
   * AuthService.logout('your-refresh-token')
   *   .then(response => console.log(response.user_id_init))
   *   .catch(error => console.error(error));
   */
  static logout(
    session_id: string,
    keycloak_user_id: string,
  ): Promise<{ success: boolean }> {
    return fetcher('auth/logout', {
      method: 'POST',
      data: {
        session_id: session_id,
        keycloak_user_id: keycloak_user_id,
      },
    })
  }

  // user attendances
  // teacher:
  //  get teaching attendances
  static getTeacherTeachingAttendance(params: ITeacherTeachingAttendanceListParams): Promise<IResponse<ITeacherTeachingAttendanceListResponse>> {
    return fetcher(`/user-attendances/teacher/teaching-attendance`, {
      params: params,
    })
  }
  
  // get teaching attendance history
  static getTeacherTeachingAttendanceHistory(teacher_schedule_id : string): Promise<IResponse<IClassAttendanceHistoryResponse[]>> {
    return fetcher(`/user-attendances/teacher/teaching-attendance/${teacher_schedule_id}/history?page_index=${DEFAULT_PAGE_NUMBER}&page_size=100`)
  }

  // get teaching attendance summary
  static getTeacherTeachingAttendanceSummary(params?: {
    fromDate?: string
    toDate?: string
  }): Promise<IResponse<ITeachingStatistics>> {
    return fetcher(`/user-attendances/teacher/teaching-attendance/summary`, {
      params: params,
    })
  }

  // get learning attendance
  static getTeacherLearningAttendance(params: {
    page_index: number
    page_size: number
    fromDate?: string
    toDate?: string
    class_ids?: string[]
    lesson_ids?: string[]
    attendance_status?: string[]
  }): Promise<IResponse<any>> {
    return fetcher(`/user-attendances/teacher/learning-attendance`, {
      params: params,
    })
  }
}
