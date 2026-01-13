import { ICreateDiscussionUploadRequest } from '@lms/contexts'
import { fetchFormData } from '@services/requestV2'

/**
 * @description CourseActivityApi cung cấp các phương thức để tương tác với các hoạt động khóa học.
 * @namespace CourseActivityApi
 */
const CourseActivityApi = {
  /**
   * @description upload ảnh cho cuộc thảo luận.
   * @async
   * @param {ICreateDiscussionUploadRequest} request - Dữ liệu yêu cầu upload cuộc thảo luận.
   * @returns {Promise<IResponse<IDiscussion>>} - Dữ liệu cuộc thảo luận đã upload.
   */
  uploadImagesDiscussion: ({
    discussion_id,
    new_discussion_file,
    discussion_file_ids,
  }: ICreateDiscussionUploadRequest): Promise<any> => {
    const formData = new FormData()

    formData.append('discussion_id', discussion_id)

    new_discussion_file?.forEach((file, index) => {
      formData.append(`discussion_images[${index}]`, file)
    })

    discussion_file_ids?.forEach((discussion_file_id, index) => {
      formData.append(`discussion_file_ids[${index}]`, discussion_file_id)
    })

    // Sử dụng httpService để gửi yêu cầu POST_FORM_DATA
    return fetchFormData({
      url: `/course-discussions/detail/upload`,
      formData,
    })
  },
}

export default CourseActivityApi
