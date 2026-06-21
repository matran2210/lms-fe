import { fetcher } from '@services/request'
import url from 'src/redux/services/Course/MyCourse/Test/url'
import {
  IAnswerQuizLastestAttempt,
  IResponse,
  IScoreDetails,
  ISurveyCustom,
} from '@lms/core'
import { CourseDetail } from '@lms/core'
import { apiURL } from 'src/constants'

export class CoursesAPI {
  static getNoteDetail(
    course_section_id: string | number,
    course_id?: string | number,
  ): Promise<any> {
    return fetcher(`course-section-notes/${course_section_id}`, {
      params: {
        course_id: course_id,
      },
    })
  }

  static createNote(params: Object): Promise<any> {
    return fetcher(`course-section-notes`, {
      method: 'POST',
      data: params,
    })
  }

  static activeCourse(params: Object): Promise<any> {
    return fetcher(`courses/active`, {
      method: 'POST',
      data: params,
    })
  }

  static extendCourse(params: Object): Promise<any> {
    return fetcher(`courses/extend`, {
      method: 'POST',
      data: params,
    })
  }

  static caseStudyProgress(
    course_id: string | string[] | undefined,
    section_id: string | string[] | undefined,
    caseStudyId: string | string[] | undefined,
  ): Promise<any> {
    return fetcher(
      `course-sections/course/${course_id}/section/${section_id}/progress?story_topic_id=${caseStudyId}`,
    )
  }

  static userGuideActive(): Promise<any> {
    return fetcher(`guide-active`)
  }

  static deleteCourseNoteList(id: string): Promise<any> {
    return fetcher(`course-section-notes/${id}`, {
      method: 'DELETE',
    })
  }

  static get(
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<any> {
    return fetcher(`courses?page_index=${page_index}&page_size=${page_size}`, {
      params: params,
    })
  }

  static getCourseDetail(
    id: string | string[] | undefined,
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<IResponse<CourseDetail>> {
    return fetcher(
      `courses/${id}?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }

  static getShortCourseDetail(
    id: string | string[] | undefined,
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<IResponse<any>> {
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
  ): Promise<any> {
    return fetcher(
      `/course-sections/learning-structure/${id}?course_section_id=${course_section_id}`,
    )
  }

  static CACHE_GET_TOPIC_DESCRIPTION = {} as { [key: string]: any }

  static startCourseSectionProgress(
    courseId: string | string[] | undefined,
    sectionId: string | string[] | undefined,
  ): Promise<any> {
    const uri = `/course-sections/course/${courseId}/section/${sectionId}/progress`
    return fetcher(`${uri}`)
  }

  static startShortCourseSectionProgress(
    courseId: string | string[] | undefined,
    sectionId: string | string[] | undefined,
  ): Promise<any> {
    const uri = `/course-sections/course/${courseId}/section/${sectionId}/progress?is_progress_sc=true`
    return fetcher(`${uri}`)
  }

  static learningOutcomeProgress(
    course_id: string | string[] | undefined,
    section_id: string | string[] | undefined,
    params?: Object,
  ): Promise<any> {
    const uri = `course-sections/course/${course_id}/section/${section_id}/progress`
    return fetcher(`${uri}`, {
      params: params,
    })
  }

  static getQuizAttemptsChartData(
    id: string | string[] | undefined,
  ): Promise<any> {
    return fetcher(`${url.getQuizAttemptsChartData}/${id}`)
  }

  static getQuizAttemptsEntranceTestChartData(
    id: string | string[] | undefined,
  ): Promise<any> {
    return fetcher(`${apiURL}/entrance-test/chart-data/${id}`)
  }

  static getPartDetail(
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ): Promise<any> {
    return fetcher(
      `/course-sections/${id}?course_section_id=${course_section_id}`,
    )
  }

  static getQuizAttemptsTable(
    id: string,
    {
      page_index,
      page_size,
      no_group_view,
    }: { page_index: number; page_size: number; no_group_view?: boolean },
  ): Promise<{
    success: boolean
    data: IScoreDetails
  }> {
    return fetcher(`/quiz-attempts/${id}/answers`, {
      params: {
        page_index: page_index || 1,
        page_size: page_size || 10,
        ...(no_group_view && { no_group_view }),
      },
    })
  }
  static getQuizAttemptsAnswer({
    attempt_id,
    question_id,
  }: {
    attempt_id: string
    question_id: string
  }): Promise<{
    success: boolean
    data: IAnswerQuizLastestAttempt
  }> {
    return fetcher(`/quiz-attempts/${attempt_id}/answer/${question_id}`)
  }
  

  static getQuizAttemptsTableEntranceTest(
    id: string,
    { page_index, page_size }: { page_index: number; page_size: number },
  ): Promise<{
    success: boolean
    data: IScoreDetails
  }> {
    return fetcher(`${apiURL}/entrance-test/quiz-attempts/${id}/answers`, {
      params: {
        page_index: page_index || 1,
        page_size: page_size || 10,
      },
    })
  }

  static getQuizAttempts(id: string | string[] | undefined): Promise<any> {
    return fetcher(`${url.getQuizAttempts}/${id}`)
  }

  static getCaseStudyAttemptsTable(
    id: string,
    page_index: number,
    page_size: number,
  ): Promise<any> {
    return fetcher(
      `quiz-attempts/case-study/table/${id}?page_index=${page_index}&page_size=${page_size}`,
    )
  }

  static getTopicAttemptsDetail(id: string): Promise<any> {
    return fetcher(`quiz-attempts/topic/${id}/score`)
  }

  /**
   * @description Lấy thông tin cuộc thảo luận theo ID.
   * @async
   * @param {string} id - ID của cuộc thảo luận.
   * @returns {Promise<IResponseMeta<IDiscussion, 'discussions'>>} - Dữ liệu cuộc thảo luận.
   */
  static getDiscussion(
    class_id: string,
    course_section_id: string,
  ): Promise<any> {
    return fetcher(`course-discussions`, {
      params: {
        page_index: 1,
        page_size: 9999,
        class_id,
        course_section_id,
      },
    })
  }

  static getDiscussionStudentInfo(
    course_section_id: string,
    class_id: string,
    user_id: string,
  ): Promise<any> {
    return fetcher(`${url.getDiscussionStudentInfo}`, {
      params: {
        course_section_id,
        class_id,
        user_id,
      },
    })
  }

  CACHE_GET_COURSE_ACTIVITY_TAP_BY_ID = {}

  /**
   * @description Lấy thông tin tab hoạt động theo ID.
   * @async
   * @param {string} id - ID của tab.
   * @returns {Promise<IResponse<ITab>>} - Dữ liệu tab.
   */
  static async getCourseActivityTapById(
    courseId: string,
    id: string,
  ): Promise<any> {
    if (!this.CACHE_GET_TOPIC_DESCRIPTION[id]) {
      this.CACHE_GET_TOPIC_DESCRIPTION[id] = await fetcher(
        `course-sections/${courseId}/tab/${id}`,
      )
    }
    return this.CACHE_GET_TOPIC_DESCRIPTION[id]
  }

  /**
   * @description Lấy kết quả câu hỏi theo ID.
   * @async
   * @param {string} id - ID của câu hỏi.
   * @returns {Promise<IResponse<IQuestion[]>>} - Dữ liệu kết quả câu hỏi.
   * @deprecated replace by replace by QuestionAPI.getQuestionDetail with query after-test = true
   */
  static getQuestionResults(id: string): Promise<any> {
    return fetcher(`question/results?question_ids=${id}`)
  }

  static getCourseLearningOutcome(
    id: string,
    class_id: string | string[] | undefined,
  ): Promise<any> {
    return fetcher(`course_learning_outcomes/${id}/class/${class_id}`)
  }

  static getCourse(page_size: number, queryString?: string): Promise<any> {
    return fetcher(`courses?page_index=1&page_size=${page_size}${queryString}`)
  }

  static getCourseSectionList(
    id: string | string[] | undefined,
    page_size: number,
    page_index?: number,
  ): Promise<any> {
    return fetcher(
      `course-sections/short/list?page_index=${page_index ? page_index : 1}&page_size=${page_size}&classId=${id}&type=PART`,
    )
  }

  static getCourseSubsectionList(
    page_size: number,
    type: 'CHAPTER' | 'UNIT' | 'ACTIVITY',
    parentId?: string,
    classId?: string,
    page_index?: number,
    params?: Object,
  ): Promise<any> {
    return fetcher(
      `course-sections/short/list?page_index=${page_index ? page_index : 1}&page_size=${
        page_size || 10
      }&type=${type}${parentId ? `&parentId=${parentId}` : ''}${
        classId ? `&classId=${classId}` : ''
      }`,
      { params: params },
    )
  }

  static getCourseResource(
    id: string | string[] | undefined,
    params?: Object,
  ): Promise<any> {
    return fetcher(`courses/${id}/resources?&attachment_type=attached`, {
      params: params,
    })
  }

  static getCourseSectionTest(
    id: string | string[] | undefined,
    params?: Object,
  ): Promise<any> {
    return fetcher(`courses/${id}/section-test`, {
      params: params,
    })
  }

  static getCourseResults(id: string | string[], params: Object): Promise<any> {
    return fetcher(`courses/${id}/quizzes`, {
      params: params,
    })
  }

  static getCourseNotesList(
    page_index: number,
    page_size: number,
    params?: Object,
  ): Promise<any> {
    return fetcher(
      `course-section-notes?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }

  static updateCourseNotesList(
    id: string | undefined,
    params?: Object,
  ): Promise<any> {
    return fetcher(`course-section-notes/${id}`, {
      data: params,
      method: 'PUT',
    })
  }

  /**
   * @description Lấy thông tin của breadcrumb
   * @async
   * @param {string | string[] | undefined} id - truyền class_id.
   * @param {string | string[] | undefined} course_section_id - truyền activity_id.
   */
  static getBreadcumb(
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ): Promise<any> {
    return fetcher(`courses/${id}/section/${course_section_id}/breadcumb`)
  }

  /**
   * @description lấy thông tin Certificate
   */
  static getCertificate(id: string | string[] | undefined): Promise<any> {
    return fetcher(`certificate/public/${id}`)
  }

  static getResource(id: string) {
    return fetcher(`/resource/${id}`)
  }

  static getQuizAttempt(id: string | string[] | undefined): Promise<any> {
    return fetcher(`/quiz-attempts/answers/${id}`)
  }

  static upgradeNowTrial(id: string | string[] | undefined): Promise<any> {
    return fetcher(`courses/${id}/trial/upgrade-now`, {
      method: 'POST',
    })
  }

  static changeSurvey(
    class_id: string | string[] | undefined,
    data: {
      is_disabled?: boolean
      remind_late?: boolean
    },
  ): Promise<any> {
    return fetcher(`/courses/${class_id}/change-survey-popup-status`, {
      method: 'POST',
      data: data,
    })
  }

  static skipFoundation(
    class_id: string | undefined,
  ): Promise<{ success: boolean }> {
    return fetcher(`courses/${class_id}/skip-foundation`, {
      method: 'PUT',
    })
  }

  static getSurveyCustom(
    class_id: string,
  ): Promise<IResponse<ISurveyCustom[]>> {
    return fetcher(`courses/${class_id}/survey-custom`)
  }

  static confirmSurvey(
    class_id: string,
    params: { survey_id: string },
  ): Promise<{ success: boolean }> {
    return fetcher(`courses/${class_id}/confirm-survey`, {
      method: 'POST',
      data: params,
    })
  }
}

/**
 * @deprecated
 */
export const getQuestionsById = async (
  question_ids: string[],
): Promise<any> => {
  const response = await fetcher(
    `question?question_ids=${question_ids?.join(',')}`,
  )

  return {
    ...response,
    data: response.data?.map((e: { id: string }) => {
      return {
        ...e,
        quiz_position_mapping: [
          {
            question_id: e.id,
          },
        ],
      }
    }),
  }
}

/**
 * @description Lấy thông tin hoạt động bằng ID.
 * @async
 * @param {string} id - ID của hoạt động.
 * @param {string} accessToken - Token truy cập của người dùng.
 * @returns {Promise<IActivity>} - Dữ liệu hoạt động.
 */

export const getActivityById = async (
  id: string | string[] | undefined,
  course_id: string | string[] | undefined,
): Promise<any> => {
  const responseActivity = await fetcher(`courses/${course_id}/activity/${id}`)
  const responseTabs = await fetcher(`course-sections/activity/${id}/tabs`)

  if (responseActivity?.data && !responseTabs?.data?.length) {
    return responseActivity.data
  }
  responseActivity.data.tabs = []
  const promises = responseTabs.data.map(async (tab: any) => {
    const responseTab = await fetcher(
      `course-sections/${course_id}/tab/${tab.id}`,
    )
    if (responseTab?.data) {
      return responseTab.data
    }
    throw new Error('Tab Not Found')
  })
  responseActivity.data.tabs = await Promise.all(promises)
  return responseActivity.data
}
