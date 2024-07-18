import { fetcher } from '@services/requestV2'
import url from 'src/redux/services/Course/MyCourse/Test/url'
import { apiURL, httpService } from 'src/redux/services/httpService'

const CourseAPI = {
  downloadResource: async (data: {
    files: { name: string; file_key: string }[]
  }): Promise<any> => {
    const uri = '/resource/get-token-download'
    const res = await httpService.POST<any, any>({
      uri,
      request: data,
    })
    if (res?.success) {
      const link = document.createElement('a')
      link.href = `${apiURL}/resource/download?token=${res?.data}`
      link.download = data.files[0].name
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
}

export default CourseAPI

export class CoursesAPI {
  static getNoteDetail(
    course_section_id: string | number,
    course_id?: string | number,
  ): Promise<any> {
    return fetcher(`${apiURL}/course-section-notes/${course_section_id}`, {
      params: {
        course_id: course_id,
      },
    })
  }

  static createNote(params: Object): Promise<any> {
    return fetcher(`${apiURL}/course-section-notes`, {
      method: 'POST',
      data: params,
    })
  }

  static activeCourse(params: Object): Promise<any> {
    return fetcher(`${apiURL}/courses/active`, {
      method: 'POST',
      data: params,
    })
  }

  static extendCourse(params: Object): Promise<any> {
    return fetcher(`${apiURL}/courses/extend`, {
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
      `${apiURL}/course-sections/course/${course_id}/section/${section_id}/progress?story_topic_id=${caseStudyId}`,
    )
  }

  static userGuideActive(): Promise<any> {
    return fetcher(`${apiURL}/guide-active`)
  }

  static deleteCourseNoteList(id: string): Promise<any> {
    return fetcher(`${apiURL}/course-section-notes/${id}`, {
      method: 'DELETE',
    })
  }

  static get(
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/courses?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }

  static getCourseDetail(
    id: string | string[] | undefined,
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/courses/${id}?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }

  static getQuestionTabsById(id: string | string[] | undefined): Promise<any> {
    return fetcher(`${apiURL}${url.getQuestionTabs}/${id}/shuffle`)
  }

  static getDetailQuizById(id: string | string[] | undefined): Promise<any> {
    return fetcher(`${apiURL}${url.getQuestionTabs}/${id}`)
  }

  static createQuizAttempt(
    id: string | string[] | undefined,
    class_user_id: string | undefined,
  ): Promise<any> {
    return fetcher(`${apiURL}${url.createQuizAttemp}`, {
      method: 'POST',
      data: {
        quiz_id: id,
        class_user_id: class_user_id || undefined,
      },
    })
  }

  static CACHE_GET_TOPIC_DESCRIPTION = {} as { [key: string]: any }

  static async getTopicDescription(
    id: string | string[] | undefined,
    quiz_id?: string,
    cache = false,
  ): Promise<any> {
    const uri =
      apiURL +
      url.getTopicDescription +
      `/${id}?quiz_id=${quiz_id}&include_questions=false`

    if (!cache) return fetcher(uri)

    if (!this.CACHE_GET_TOPIC_DESCRIPTION[uri]) {
      this.CACHE_GET_TOPIC_DESCRIPTION[uri] = await fetcher(uri)
    }

    return this.CACHE_GET_TOPIC_DESCRIPTION[uri]
  }

  static startCourseSectionProgress(
    courseId: string | string[] | undefined,
    sectionId: string | string[] | undefined,
  ): Promise<any> {
    const uri = `/course-sections/course/${courseId}/section/${sectionId}/progress`
    return fetcher(`${apiURL}${uri}`)
  }

  static learningOutcomeProgress(
    course_id: string | string[] | undefined,
    section_id: string | string[] | undefined,
    params?: Object,
  ): Promise<any> {
    const uri = `course-sections/course/${course_id}/section/${section_id}/progress`
    return fetcher(`${apiURL}/${uri}`, {
      params: params,
    })
  }

  /**
   * @deprecated use QuestionAPI.getQuestionDetail (cached api)
   */
  static getQuestionsDetail(id: string): Promise<any> {
    const uri = url.getQuestionDetail
    return fetcher(`${apiURL}${uri}`, {
      params: {
        question_ids: id,
      },
    })
  }

  static getQuizAttemptsChartData(
    id: string | string[] | undefined,
  ): Promise<any> {
    const uri = url.getQuestionDetail
    return fetcher(`${apiURL}${url.getQuizAttemptsChartData}/${id}`)
  }

  static getPartDetail(
    id: string | string[] | undefined,
    course_section_id: string | string[] | undefined,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/course-sections/${id}?course_section_id=${course_section_id}`,
    )
  }

  static getQuizAttemptsTable(
    id: string,
    { page_index, page_size }: { page_index: number; page_size: number },
  ): Promise<any> {
    return fetcher(`${apiURL}/quiz-attempts/table/${id}`, {
      params: {
        page_index: page_index || 1,
        page_size: page_size || 10,
      },
    })
  }

  static getQuizAttempts(id: string | string[] | undefined): Promise<any> {
    return fetcher(`${apiURL}${url.getQuizAttempts}/${id}`)
  }

  static submitQuestion(id: string, data: any): Promise<any> {
    const uri = url.submitQuestion + `/${id}` + '/submit'
    return fetcher(`${apiURL}${uri}`, {
      data: data,
      method: 'POST',
    })
  }

  static submitCaseStudy(id: string, data: any): Promise<any> {
    const uri = url.submitCaseStudy + `/${id}` + '/submit'
    return fetcher(`${apiURL}${uri}`, {
      data: data,
      method: 'POST',
    })
  }

  static getCaseStudyAttemptsTable(
    id: string,
    page_index: number,
    page_size: number,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/quiz-attempts/case-study/table/${id}?page_index=${page_index}&page_size=${page_size}`,
    )
  }

  static getTopicAttemptsDetail(id: string): Promise<any> {
    return fetcher(`${apiURL}/quiz-attempts/topic/${id}/score`)
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
    return fetcher(`${apiURL}/course-discussions`, {
      params: {
        page_index: 1,
        page_size: 9999,
        class_id,
        course_section_id,
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
  static async getCourseActivityTapById(id: string): Promise<any> {
    if (!this.CACHE_GET_TOPIC_DESCRIPTION[id]) {
      this.CACHE_GET_TOPIC_DESCRIPTION[id] = await fetcher(
        `${apiURL}/course-sections/tab/${id}`,
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
    return fetcher(`${apiURL}/question/results?question_ids=${id}`)
  }

  static getCourseLearningOutcome(id: string): Promise<any> {
    return fetcher(`${apiURL}/course_learning_outcomes/${id}`)
  }

  static getCourse(page_size: number, queryString?: string): Promise<any> {
    return fetcher(
      `${apiURL}/courses?page_index=1&page_size=${page_size}${queryString}`,
    )
  }

  static getCourseSectionList(
    id: string | string[] | undefined,
    page_size: number,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/course-sections/short/list?page_index=1&page_size=${page_size}&classId=${id}&type=PART`,
    )
  }

  static getCourseSubsectionList(
    page_size: number,
    type: 'CHAPTER' | 'UNIT' | 'ACTIVITY',
    parentId?: string,
    classId?: string,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/course-sections/short/list?page_index=1&page_size=${
        page_size || 10
      }&type=${type}&parentId=${parentId ?? ''}${
        classId ? `&classId=${classId}` : ''
      }`,
    )
  }

  static getCourseResource(
    id: string | string[] | undefined,
    params?: Object,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/courses/${id}/resources?&attachment_type=attached`,
      {
        params: params,
      },
    )
  }

  static getCourseResults(
    id: string | string[] | undefined,
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<any> {
    return fetcher(
      `${apiURL}/courses/${id}/quizzes?page_index=${page_index}&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }

  static getCourseNotesList(page_size: number, params?: Object): Promise<any> {
    return fetcher(
      `${apiURL}/course-section-notes?page_index=1&page_size=${page_size}`,
      {
        params: params,
      },
    )
  }

  static updateCourseNotesList(
    id: string | undefined,
    params?: Object,
  ): Promise<any> {
    return fetcher(`${apiURL}/course-section-notes/${id}`, {
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
    return fetcher(
      `${apiURL}/courses/${id}/section/${course_section_id}/breadcumb`,
    )
  }

  /**
   * @description lấy thông tin Certificate
   */
  static getCertificate(id: string | string[] | undefined): Promise<any> {
    return fetcher(`${apiURL}/certificate/public/${id}`)
  }
}

/**
 * @deprecated
 */
export const getQuestionsById = async (
  question_ids: string[],
): Promise<any> => {
  const response = await fetcher(
    `${apiURL}/question?question_ids=${question_ids?.join(',')}`,
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

export const submitQuizTest = async (
  id: string,
  data: any,
  class_user_id?: string,
): Promise<any> => {
  const quizAttemptResponse = await CoursesAPI.createQuizAttempt(
    id,
    class_user_id,
  )

  const quizAttemptId = quizAttemptResponse.data?.id
  if (quizAttemptId) {
    const uri = '/quiz' + `/${quizAttemptId}` + '/submit'
    const response = await fetcher(`${apiURL}${uri}`, {
      data: data,
      method: 'POST',
    })
    return { ...response, quizAttemptId }
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
  const responseActivity = await fetcher(
    `${apiURL}/courses/${course_id}/activity/${id}`,
  )
  const responseTabs = await fetcher(
    `${apiURL}/course-sections/activity/${id}/tabs`,
  )

  if (responseActivity?.data && responseTabs?.data?.[0]) {
    responseActivity.data.tabs = responseTabs.data

    const responseTab = await fetcher(
      `${apiURL}/course-sections/tab/${responseTabs.data?.[0].id}`,
    )

    if (responseTab.data) {
      responseActivity.data.tabs[0] = responseTab.data
    }
  }
  return responseActivity.data
}
