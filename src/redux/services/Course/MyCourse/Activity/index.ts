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

/**
 * @description CourseActivityApi cung cấp các phương thức để tương tác với các hoạt động khóa học.
 * @namespace CourseActivityApi
 */
const CourseActivityApi = {

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
   * Bắt đầu tiến độ cho một phần của khóa học cụ thể.
   *
   * @param {string} courseId - id của khóa học.
   * @param {string} sectionId - id của section.
   * @returns {Promise<IResponse<any>>} Một Promise nhận phản hồi về tiến độ.
   */

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

  getQuizAttemptsAnswer: (id: string) => {
    return httpService.GET<any, any>({
      uri: `quiz-attempts/answers/${id}`,
    })
  },
}

export default CourseActivityApi
