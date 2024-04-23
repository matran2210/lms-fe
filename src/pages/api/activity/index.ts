import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'
import { ICreateDiscussionRequest } from 'src/redux/types/Course/MyCourse/Activity/activity'

export class ActivityAPI {
  /**
   * @description Tạo mới một cuộc thảo luận.
   * @async
   * @param {ICreateDiscussionRequest} request - Dữ liệu yêu cầu tạo cuộc thảo luận.
   * @returns {Promise<IResponse<IDiscussion>>} - Dữ liệu cuộc thảo luận đã tạo.
   */
  static createDiscussionComment(request: ICreateDiscussionRequest): Promise<any> {
    return fetcher(`/course-discussions`, {
      data: request,
      method: 'POST',
    })
  }
}

export const downloadResource = async (data: {
  files: { name: string; file_key: string }[]
}): Promise<any> => {
  const res = await fetcher('/resource/get-token-download', {
    method: 'POST',
    data: data,
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
}
