import { IResponse } from 'src/redux/types'
import {
  ICreateDiscussionUploadRequest,
  IDiscussion,
} from 'src/redux/types/Course/MyCourse/Activity/activity'
import { IBreadcrumb } from 'src/type/course/my-course/Activity'
import { httpService } from '../../../httpService'
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

    if(discussion_id) {
      console.log('chay vào day 1', discussion_id)
      formData.append('discussion_id', discussion_id)
    }
    if(new_discussion_file) {
      console.log('chay vào day 2', new_discussion_file)
      new_discussion_file?.forEach((file, index) => {
        formData.append(`discussion_images[${index}]`, file)
      })
      console.log('chay vào day 2', formData.get(`discussion_images[0]`))
    }

    if(discussion_file_ids) {
      console.log('chay vào day 3')
      discussion_file_ids?.forEach((discussion_file_id, index) => {
        formData.append(`discussion_file_ids[${index}]`, discussion_file_id)
      })
    }

    // Sử dụng httpService để gửi yêu cầu POST_FORM_DATA
    return httpService.POST_FORM_DATA<any, any>({
      uri,
      request: formData,
    })
  },
}

export default CourseActivityApi
