import { UploadAPI } from '@pages/api/upload'
import axios from 'axios'
import toast from 'react-hot-toast'
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

// Hàm xử lý tải ảnh lên và nhận URL từ API S3
export const handleUploadFileToS3 = async (
  convertedFile: File,
  location = 'sapp-editor',
  getProgress?: (progress: number) => void,
  abortSignal?: AbortSignal,
): Promise<{ url: string } | undefined> => {
  const source = axios.CancelToken.source()

  // Nếu signal bị abort thì cancel axios
  abortSignal?.addEventListener('abort', () => {
    source.cancel('Upload cancelled')
  })

  try {
    await UploadAPI.startUpload({
      content_type: convertedFile.type,
      blob: convertedFile,
      size: convertedFile.size.toString(),
      description: '',
      name: convertedFile.name,
      getProgress: getProgress ? getProgress : () => {},
      location: location,
    })
    return {
      url: 'https://images.pexels.com/photos/31333122/pexels-photo-31333122.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
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
