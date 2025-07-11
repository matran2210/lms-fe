import { UploadAPI } from '@pages/api/upload'
import axios from 'axios'
import toast from 'react-hot-toast'
import { convertHumanReadableToSnakeCase } from 'src/utils/index'
// Hàm chuyển base64 thành File
export function base64ToFile(
  base64String: string,
  fileName = 'image.png',
): File {
  const [header, base64Data] = base64String.split(',')
  const mimeType = header.match(/data:(.*);base64/)?.[1]
  const byteString = atob(base64Data)
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }
  return new File([arrayBuffer], fileName, { type: mimeType || 'image/png' })
}

//  // Chuyển base64 thành File để tải lên S3
//  const convertedFile = base64ToFile(base64String as string, 'image.png')

/**
 * @param description Hàm xử lý tải ảnh lên và nhận URL từ API S3
 * @param {File} convertedFile - File đã được chuyển đổi.
 * @param {string} location - Vị trí lưu trữ file trên S3 (mặc định là 'library-editor').
 * @param {function} getProgress - Hàm callback để cập nhật tiến trình tải lên (không bắt buộc).
 * @param {AbortSignal} abortSignal - Signal để hủy tải lên (không bắt buộc).
 * @returns {Promise<{ url: string } | undefined>} - Promise trả về URL của file sau khi tải lên hoặc undefined nếu tải lên thất bại.
 */
export const handleUploadFileToS3 = async (
  convertedFile: File,
  location: string,
  getProgress?: (progress: number) => void,
  abortSignal?: AbortSignal,
): Promise<{ url: string } | undefined> => {
  const source = axios.CancelToken.source()

  // Nếu signal bị abort thì cancel axios
  abortSignal?.addEventListener('abort', () => {
    source.cancel('Upload cancelled')
  })

  try {
    const response = await UploadAPI.startUpload({
      content_type: convertedFile.type,
      blob: convertedFile,
      size: convertedFile.size.toString(),
      description: '',
      name: convertHumanReadableToSnakeCase(convertedFile.name),
      getProgress: getProgress ? getProgress : () => {},
      location: location,
    })

    const uploadUrlRes = await UploadAPI.getUrlFile(response.data.file_key)

    return {
      url: uploadUrlRes.data?.url,
    }
  } catch (uploadError) {
    if (axios.isCancel(uploadError)) {
      toast.error('Upload cancelled')
    } else {
      toast.error(uploadError as string)
    }
    throw uploadError
  }
}

// Hàm chuyển file thành base64
export function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
