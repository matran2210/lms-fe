import { fetcher } from '@services/requestV2'
import url from 'src/redux/services/Course/MyCourse/Test/url'
import { apiURL } from 'src/redux/services/httpService'
import { IResponse } from 'src/redux/types'
import { IScoreDetails } from 'src/type'
import { ICourseSubjectList } from 'src/type/classes'

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
}
