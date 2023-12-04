import { httpService } from 'src/redux/services/httpService'

const CourseAPI = {
  getCourseLearningOutcome: async (id: string): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `course_learning_outcomes/${id}`,
    })
    return response
  },
  getCoursePartDetail: async (id: string | undefined): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `course-sections/${id}`,
    })
    return response
  }
}

export default CourseAPI
