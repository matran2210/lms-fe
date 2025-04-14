import { fetcher } from '@services/requestV2'
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
}
