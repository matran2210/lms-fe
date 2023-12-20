import { httpService } from 'src/redux/services/httpService'

const CourseAPI = {
  getCourseLearningOutcome: async (id: string): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `course_learning_outcomes/${id}`,
    })
    return response
  },
  getCoursePartDetail: async (
    id: string | undefined,
    course_section_id: string | string[] | undefined,
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `course-sections/${id}?course_section_id=${course_section_id}`,
    })
    return response
  },

  getCourseDetail: async (
    id: string | string[] | undefined,
    page_size: number,
    queryString?: string
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `courses/${id}?page_index=1&page_size=${page_size}${queryString}`,
    })
    return response
  },
  getCourse: async (
    page_size: number,
    queryString?: string
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `courses?page_index=1&page_size=${page_size}${queryString}`,
    })
    return response
  },
}

export default CourseAPI
