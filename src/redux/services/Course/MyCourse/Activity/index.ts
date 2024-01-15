import axios from 'axios'
import { IResponse, IResponseMeta } from 'src/redux/types'
import {
  ICreateDiscussionRepReact,
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  ICreateDiscussionUploadRequest,
  IDiscussion,
} from 'src/redux/types/Course/MyCourse/Activity/activity'
import { IQuestion } from 'src/type/course/Question'
import {
  IActivity,
  IBreadcrumb,
  ITab,
} from 'src/type/course/my-course/Activity'
import { apiURL, httpService } from '../../../httpService'
import url from './url'
import CourseTestApi from '../Test'

/**
 * @description CourseActivityApi cung cấp các phương thức để tương tác với các hoạt động khóa học.
 * @namespace CourseActivityApi
 */
const CourseActivityApi = {
  /**
   * @description Lấy thông tin hoạt động bằng ID.
   * @async
   * @param {string} id - ID của hoạt động.
   * @param {string} accessToken - Token truy cập của người dùng.
   * @returns {Promise<IActivity>} - Dữ liệu hoạt động.
   */
  getActivityById: async (
    id: string,
    course_id: string,
    accessToken: string,
  ): Promise<IActivity> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }

    const responseActivity = await axios.get<
      {},
      IResponse<{ data: IActivity }>
    >(`${apiURL}/courses/${course_id}/activity/${id}`, {
      headers,
    })
    const responseTabs = await axios.get<{}, IResponse<{ data: ITab[] }>>(
      `${apiURL}/course-sections/activity/${id}/tabs`,
      {
        headers,
      },
    )

    if (responseActivity.data && responseTabs?.data.data?.[0]) {
      responseActivity.data.data.tabs = responseTabs.data.data

      const responseTab = await axios.get<{}, IResponse<{ data: ITab }>>(
        `${apiURL}/course-sections/tab/${responseTabs.data?.data?.[0].id}`,
        {
          headers,
        },
      )

      if (responseTab.data?.data) {
        responseActivity.data.data.tabs[0] = responseTab.data.data
      }
    }
    return responseActivity.data.data
  },

  /**
   * @description Lấy Breadcrumb ID.
   * @async
   * @param {string} id - ID của activity.
   * @returns {Promise<IResponse<ITab>>} - Dữ liệu tab.
   */
  setBreadcrumb: async (id: string): Promise<IResponse<IBreadcrumb>> => {
    const response = await httpService.GET<any, any>({
      uri: `course-sections/tab/${id}`,
    })
    return response
  },

  /**
   * @description Lấy thông tin tab hoạt động theo ID.
   * @async
   * @param {string} id - ID của tab.
   * @returns {Promise<IResponse<ITab>>} - Dữ liệu tab.
   */
  getCourseActivityTapById: async (id: string): Promise<IResponse<ITab>> => {
    const response = await httpService.GET<any, any>({
      uri: `course-sections/tab/${id}`,
    })
    return response
  },

  /**
   * @description Lấy danh sách câu hỏi của một bài kiểm tra.
   * @async
   * @param {string} id - ID của bài kiểm tra.
   * @returns {Promise<IResponse<{ questions: IQuestion[] }>>} - Dữ liệu câu hỏi.
   */
  getQuestions: async (
    id: string,
  ): Promise<IResponse<{ questions: IQuestion[] }>> => {
    const response = await httpService.GET<any, any>({
      uri: `quiz/${id}/questions?page_index=1&page_size=99999 `,
    })
    return response
  },

  /**
   * @description Lấy thông tin câu hỏi theo ID.
   * @async
   * @param {string[]} question_ids - Mảng chứa các ID của câu hỏi.
   * @returns {Promise<IResponse<IQuestion[]>>} - Dữ liệu câu hỏi.
   */
  getQuestionsById: async (
    question_ids: string[],
  ): Promise<IResponse<IQuestion[]>> => {
    const response = await httpService.GET<any, any>({
      uri: `question?question_ids=${question_ids?.join(',')}`,
    })
    return response
  },

  /**
   * @description Lấy kết quả câu hỏi theo ID.
   * @async
   * @param {string} id - ID của câu hỏi.
   * @returns {Promise<IResponse<IQuestion[]>>} - Dữ liệu kết quả câu hỏi.
   */
  getQuestionResults: async (id: string): Promise<IResponse<IQuestion[]>> => {
    const response = await httpService.GET<any, any>({
      uri: `question/results?question_ids=${id}`,
    })
    return response
  },

  /**
   * @description Lấy thông tin cuộc thảo luận theo ID.
   * @async
   * @param {string} id - ID của cuộc thảo luận.
   * @returns {Promise<IResponseMeta<IDiscussion, 'discussions'>>} - Dữ liệu cuộc thảo luận.
   */
  getDiscussion: async (
    class_id: string,
    course_section_id: string,
  ): Promise<IResponseMeta<IDiscussion, 'discussions'>> => {
    const uri = url.createDiscussion
    const response = await httpService.GET<
      {},
      IResponseMeta<IDiscussion, 'discussions'>
    >({
      uri,
      params: {
        page_index: 1,
        page_size: 9999,
        class_id,
        course_section_id,
      },
    })
    return response
  },

  /**
   * @description Tạo mới một cuộc thảo luận.
   * @async
   * @param {ICreateDiscussionRequest} request - Dữ liệu yêu cầu tạo cuộc thảo luận.
   * @returns {Promise<IResponse<IDiscussion>>} - Dữ liệu cuộc thảo luận đã tạo.
   */
  createDiscussion: async (
    request: ICreateDiscussionRequest,
  ): Promise<IResponse<IDiscussion>> => {
    const uri = url.createDiscussion
    const response = await httpService.POST<
      ICreateDiscussionRequest,
      IResponse<IDiscussion>
    >({
      uri,
      request,
    })
    return response
  },

  /**
   * @description upload ảnh cho cuộc thảo luận.
   * @async
   * @param {ICreateDiscussionUploadRequest} request - Dữ liệu yêu cầu upload cuộc thảo luận.
   * @returns {Promise<IResponse<IDiscussion>>} - Dữ liệu cuộc thảo luận đã upload.
   */
  uploadImagesDiscussion: async ({
    discussion_id,
    new_discussion_file,
    discussion_file_ids,
  }: ICreateDiscussionUploadRequest): Promise<IResponse<IDiscussion>> => {
    const uri = url.uploadImageDiscussion
    const formData = new FormData()

    formData.append('discussion_id', discussion_id)

    new_discussion_file?.forEach((file, index) => {
      formData.append(`discussion_images[${index}]`, file)
    })

    discussion_file_ids?.forEach((discussion_file_id, index) => {
      formData.append(`discussion_file_ids[${index}]`, discussion_file_id)
    })

    // Sử dụng httpService để gửi yêu cầu POST_FORM_DATA
    return httpService.POST_FORM_DATA<any, any>({
      uri,
      request: formData,
    })
  },

  /**
   * @description Phản ứng vào một cuộc thảo luận.
   * @async
   * @param {ICreateDiscussionResReact} request - Dữ liệu yêu cầu phản ứng.
   * @returns {Promise<IResponse<ICreateDiscussionRepReact>>} - Dữ liệu phản ứng.
   */
  reactDiscussion: async (
    request: ICreateDiscussionResReact,
  ): Promise<IResponse<ICreateDiscussionRepReact>> => {
    const uri = url.reactDiscussion
    const response = await httpService.POST<
      ICreateDiscussionResReact,
      IResponse<ICreateDiscussionRepReact>
    >({
      uri,
      request,
    })
    return response
  },

  /**
   * Submit câu hỏi.
   *
   * @param {string} id - id câu hỏi.
   * @param {any} data - Dữ liệu sẽ được gửi kèm theo câu hỏi.
   * @returns {Promise<IResponse<any>>} Một Promise nhận phản hồi từ máy chủ.
   */
  submitQuiz: async (id: string, data: any): Promise<IResponse<any>> => {
    const quizAttemptResponse = await CourseTestApi.createQuizAttempt(id)

    const quizAttemptId = quizAttemptResponse.data?.id
    if (quizAttemptId) {
      const uri = url.submitQuiz + `/${quizAttemptId}` + '/submit'
      const response = await httpService.POST<any, any>({
        uri,
        request: data,
      })
      return { ...response, quizAttemptId }
    }
    throw new Error('')
  },

  /**
   * Bắt đầu tiến độ cho một phần của khóa học cụ thể.
   *
   * @param {string} courseId - id của khóa học.
   * @param {string} sectionId - id của section.
   * @returns {Promise<IResponse<any>>} Một Promise nhận phản hồi về tiến độ.
   */
  startCourseSectionProgress: async (
    courseId: string,
    sectionId: string,
  ): Promise<IResponse<any> | undefined> => {
    const uri = `${url.courseSections}/${courseId}/section/${sectionId}/progress`
    try {
      const response = await httpService.GET<any, any>({
        uri,
      })
      return response
    } catch (error) {}
  },

  /**
   * Kết thúc tiến độ cho một phần của khóa học cụ thể.
   *
   * @param {string} courseId - id của khóa học.
   * @param {string} sectionId - id của section.
   * @returns {Promise<IResponse<any>>} Một Promise nhận phản hồi về tiến độ.
   */
  finishedCourseSectionProgress: async (
    courseId: string,
    sectionId: string,
  ): Promise<IResponse<any> | undefined> => {
    const uri = `${url.courseSections}/${courseId}/section/${sectionId}/progress`
    try {
      const response = await httpService.PUT<any, any>({
        uri,
        request: { status: 'FINISHED' },
      })
      return response
    } catch (error) {}
  },

  getQuizAttemptsTable: (
    id: string,
    { page_index, page_size }: { page_index: number; page_size: number },
  ) => {
    return httpService.GET<any, any>({
      uri: `quiz-attempts/table/${id}`,
      params: {
        page_index: page_index || 1,
        page_size: page_size || 10,
      },
    })
  },

  getQuizAttemptsAnswer: (id: string) => {
    return httpService.GET<any, any>({
      uri: `quiz-attempts/answers//${id}`,
    })
  },
}

export default CourseActivityApi
