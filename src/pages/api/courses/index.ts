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
    page_index: number,
    page_size: number,
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `courses/${id}?page_index=${page_index}&page_size=${page_size}`,
    })
    return response
  },
  getCourse: async (
    page_index: number,
    page_size: number,
    name?: string | string[] | undefined,
    type?: string | string[] | undefined
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `courses?page_index=${page_index}&page_size=${page_size}&name=${name}&type=${type}`,
    })
    return response
  },
}

export default CourseAPI
