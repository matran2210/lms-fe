import { apiURL, httpService } from 'src/redux/services/httpService'

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
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `course-sections/short/list?page_index=1&page_size=10&courseId=${id}&type=PART`,
    })
    return response
  },
  getCourseSubsectionList: async (
    page_index: number,
    page_size: number,
    type: 'CHAPTER' | 'UNIT' | 'ACTIVITY',
    parentId?: string,
  ): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `/course-sections/short/list?page_index=${
        page_index || 1
      }&page_size=${page_size || 10}&type=${type}&parentId=${parentId ?? ''}`,
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
}

export default CourseAPI
