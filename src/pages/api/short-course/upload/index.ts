import { IResponse } from 'src/redux/types'
import request, { getBaseUrl } from '@services/requestV2'

export class UploadAPI {
  static downloadFile = async (data: {
    files: { name: string; file_key: string }[]
  }) => {
    try {
      const responseToken: IResponse<{
        data: string
        success: boolean
      }> = await request('resource/get-token-download', {
        data: data,
        method: 'POST',
      })
      if (responseToken?.data?.success) {
        const link = document.createElement('a')
        link.href = `${getBaseUrl()}/resource/download?token=${responseToken?.data?.data}`
        link.download = data.files[0].name
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      throw new Error('Download file not found')
    }
  }
}
