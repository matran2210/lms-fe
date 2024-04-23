import { fetcher } from '@services/requestV2'
import url from 'src/redux/services/Course/MyCourse/Test/url'
import { apiURL, httpService } from 'src/redux/services/httpService'

const CourseAPI = {
  getCourseLearningOutcome: async (id: string): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `course_learning_outcomes/${id}`,
    })
    return response
  },

  getCourseDetail: async (
    id: string | string[] | undefined,
    page_size: number,
    queryString?: string,
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `courses/${id}?page_index=1&page_size=${page_size}${queryString}`,
    })
    return response
  },
  getCourse: async (page_size: number, queryString?: string): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `courses?page_index=1&page_size=${page_size}${queryString}`,
    })
    return response
  },
  getCourseSectionList: async (
    id: string | string[] | undefined,
    page_size: number,
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `course-sections/short/list?page_index=1&page_size=${page_size}&classId=${id}&type=PART`,
    })
    return response
  },
  getCourseSubsectionList: async (
    page_size: number,
    type: 'CHAPTER' | 'UNIT' | 'ACTIVITY',
    parentId?: string,
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `/course-sections/short/list?page_index=1&page_size=${
        page_size || 10
      }&type=${type}&parentId=${parentId ?? ''}`,
    })
    return response
  },
  getCourseResource: async (
    id: string | string[] | undefined,
    page_size: number,
    params?: Object,
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `courses/${id}/resources?page_index=1&page_size=${page_size}&attachment_type=attached`,
      params: params,
    })
    return response
  },
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
  getCourseNotesList: async (
    page_size: number,
    params?: Object,
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `course-section-notes?page_index=1&page_size=${page_size}`,
      params: params,
    })
    return response
  },
  updateCourseNotesList: (
    id: string | undefined,
    params?: Object,
  ): Promise<any> => {
    const response = httpService.PUT<any, any>({
      uri: `course-section-notes/${id}`,
      request: params,
    })
    return response
  },
  deleteCourseNoteList: (id: string): Promise<any> => {
    const response = httpService.DELETE<any, any>({
      uri: `course-section-notes/${id}`,
    })
    return response
  },
  getNoteDetail: async (
    course_section_id: string | number,
    course_id?: string | number,
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `course-section-notes/${course_section_id}`,
      params: {
        course_id: course_id,
      },
    })
    return response
  },
  createNote: (params: Object): Promise<any> => {
    const response = httpService.POST<any, any>({
      uri: `course-section-notes`,
      request: params,
    })
    return response
  },
  activeCourse: (params: Object): Promise<any> => {
    const response = httpService.POST<any, any>({
      uri: `courses/active`,
      request: params,
    })
    return response
  },
  extendCourse: (params: Object): Promise<any> => {
    const response = httpService.POST<any, any>({
      uri: `courses/extend`,
      request: params,
    })
    return response
  },
  caseStudyProgress: (
    course_id: string | string[] | undefined,
    section_id: string | string[] | undefined,
    caseStudyId: string | string[] | undefined,
  ): Promise<any> => {
    const response = httpService.GET<any, any>({
      uri: `course-sections/course/${course_id}/section/${section_id}/progress?story_topic_id=${caseStudyId}`,
    })
    return response
  },
  userGuideActive: async (): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `guide-active`,
    })
    return response
  },
}

export default CourseAPI

export class CoursesAPI {
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

  static getQuestionTabsById( id: string | string[] | undefined): Promise<any> {
    return fetcher(`${apiURL}${url.getQuestionTabs}/${id}/shuffle`)
  }

  static getDetailQuizById( id: string | string[] | undefined): Promise<any> {
    return fetcher(`${apiURL}${url.getQuestionTabs}/${id}`)
  }

  static createQuizAttempt( id: string | string[] | undefined, class_user_id : string | undefined): Promise<any> {
    return fetcher(`${apiURL}${url.createQuizAttemp}`, {
      method: 'POST',
      data: {
        quiz_id: id,
        class_user_id: class_user_id || undefined,
      }
    })
  }

  static getTopicDescription( id: string | string[] | undefined, quiz_id? : string): Promise<any> {
    const uri = url.getTopicDescription + `/${id}?quiz_id=${quiz_id}`
    return fetcher(`${apiURL}${uri}`,)
  }

  static startCourseSectionProgress(courseId: string, sectionId: string,): Promise<any> {
    const uri = `/course-sections/course/${courseId}/section/${sectionId}/progress`
    return fetcher(`${apiURL}${uri}`)
  }

  static learningOutcomeProgress(course_id: string | string[] | undefined, section_id: string | string[] | undefined, params?: Object,): Promise<any> {
    const uri = `course-sections/course/${course_id}/section/${section_id}/progress`
    return fetcher(`${apiURL}/${uri}`, {
      params: params
    })
  }

  static getQuestionsDetail(id: string): Promise<any> {
    const uri = url.getQuestionDetail
    return fetcher(`${apiURL}${uri}`, {
      params: {
        question_ids: id,
      },
    })
  }

  static getQuizAttemptsChartData(id: string | string[] | undefined): Promise<any> {
    const uri = url.getQuestionDetail
    return fetcher(`${apiURL}${url.getQuizAttemptsChartData}/${id}`)
  }

  static getPartDetail(id: string | string[] | undefined, course_section_id: string | string[] | undefined): Promise<any> {
    return fetcher(`${apiURL}/course-sections/${id}?course_section_id=${course_section_id}`)
  }
}

export const getQuestionsById = async (
  question_ids: string[],
): Promise<any> => {
  const response =  await fetcher(`question?question_ids=${question_ids?.join(',')}`)

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
