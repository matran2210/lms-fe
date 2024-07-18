import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'
import {
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  ICreateDiscussionUploadRequest,
} from 'src/redux/types/Course/MyCourse/Activity/activity'

export class ActivityAPI {
  /**
   * @description Tạo mới một cuộc thảo luận.
   * @async
   * @param {ICreateDiscussionRequest} request - Dữ liệu yêu cầu tạo cuộc thảo luận.
   * @returns {Promise<IResponse<IDiscussion>>} - Dữ liệu cuộc thảo luận đã tạo.
   */
  static createDiscussionComment(
    request: ICreateDiscussionRequest,
  ): Promise<any> {
    return fetcher(`${apiURL}/course-discussions`, {
      data: request,
      method: 'POST',
    })
  }

  static getQuizAttemptsAnswer(id: string): Promise<any> {
    return fetcher(`${apiURL}/quiz-attempts/answers/${id}`)
  }

  /**
   * @description Lấy danh sách câu hỏi của một bài kiểm tra.
   * @async
   * @param {string} id - ID của bài kiểm tra.
   * @returns {Promise<IResponse<{ questions: IQuestion[] }>>} - Dữ liệu câu hỏi.
   */
  static getQuestions(id: string): Promise<any> {
    return fetcher(
      `${apiURL}/quiz/${id}/questions?page_index=1&page_size=99999`,
    )
  }

  /**
   * @description Phản ứng vào một cuộc thảo luận.
   * @async
   * @param {ICreateDiscussionResReact} request - Dữ liệu yêu cầu phản ứng.
   * @returns {Promise<IResponse<ICreateDiscussionRepReact>>} - Dữ liệu phản ứng.
   */
  static reactDiscussion(data: ICreateDiscussionResReact): Promise<any> {
    return fetcher(`${apiURL}/course-discussions/react`, {
      data: data,
    })
  }

  /**
   * Kết thúc tiến độ cho một phần của khóa học cụ thể.
   *
   * @param {string} courseId - id của khóa học.
   * @param {string} sectionId - id của section.
   * @returns {Promise<IResponse<any>>} Một Promise nhận phản hồi về tiến độ.
   */
  // static finishedCourseSectionProgress(
  //   courseId: string,
  //   sectionId: string,
  // ): Promise<any> {
  //   return fetcher(
  //     `${apiURL}/course-sections/course/${courseId}/section/${sectionId}/progress`,
  //     {
  //       params: {
  //         status: 'FINISHED',
  //       },
  //     },
  //   )
  // }

  static uploadImageDiscussion = ({
    discussion_id,
    new_discussion_file,
    discussion_file_ids,
  }: ICreateDiscussionUploadRequest) => {
    const formData = new FormData()

    formData.append('discussion_id', discussion_id)

    new_discussion_file?.forEach((file, index) => {
      formData.append(`discussion_images[${index}]`, file)
    })

    discussion_file_ids?.forEach((discussion_file_id, index) => {
      formData.append(`discussion_file_ids[${index}]`, discussion_file_id)
    })

    return fetcher(`${apiURL}/course-discussions/detail/upload`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      method: 'POST',
    })
  }

  /**
   * @description Cập nhật một cuộc thảo luận.
   * @async
   */
  static updateDiscussionComment(
    id: string | undefined,
    params?: Object,
  ): Promise<any> {
    return fetcher(`${apiURL}/course-discussions/${id}`, {
      data: params,
      method: 'PUT',
    })
  }

  /**
   * @description Xóa cuộc thảo luận.
   * @async
   */
  static deleteDiscussion(id: string): Promise<any> {
    return fetcher(`${apiURL}/course-discussions/${id}`, {
      method: 'DELETE',
    })
  }
}

/**
 * @description upload ảnh cho cuộc thảo luận.
 * @async
 * @param {ICreateDiscussionUploadRequest} request - Dữ liệu yêu cầu upload cuộc thảo luận.
 * @returns {Promise<IResponse<IDiscussion>>} - Dữ liệu cuộc thảo luận đã upload.
 */

// export const downloadResource = async (data: {
//   files: { name: string; file_key: string }[]
// }): Promise<any> => {
//   const res = await fetcher(`${apiURL}/resource/get-token-download`, {
//     method: 'POST',
//     data: data,
//   })
//   if (res?.success) {
//     const link = document.createElement('a')
//     link.href = `${apiURL}/resource/download?token=${res?.data}`
//     link.download = data.files[0].name
//     link.style.display = 'none'
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }
// }
