import { fetcher } from '@services/requestV2'
import {
  BreadcrumbResponse,
  CourseDetailActivity,
} from 'src/type/courses-3-level'
import { CourseDetail } from 'src/type/courses-3-level/course'

export class CoursesAPI {
  /**
   * @description fetch breadcrumb data
   * @async
   * @param {string | string[] | undefined} id - pass class_id.
   * @param {string | string[] | undefined} course_section_id - pass activity_id.
   */
  static getBreadcrumb(
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ): Promise<BreadcrumbResponse> {
    return fetcher(`courses/${id}/section/${course_section_id}/breadcumb`)
  }

  /**
   * @description fetch section content data
   * @async
   * @param {string | string[] | undefined} id - pass class_id.
   * @param {string | string[] | undefined} course_section_id - pass activity_id.
   */
  static getCourseDetail(
    id: string | string[] | undefined,
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<CourseDetail> {
    return fetcher(
      `courses/${id}?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }

  static getCourseDetailActivity(
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ): Promise<CourseDetailActivity> {
    return fetcher(
      `/course-sections/learning-structure/${id}?course_section_id=${course_section_id}`,
    )
  }
}
