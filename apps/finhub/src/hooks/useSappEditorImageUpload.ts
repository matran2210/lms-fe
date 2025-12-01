import {
  base64ToFile,
  fileToBase64,
  handleUploadFileToS3,
} from 'src/utils/helpers/tiptap'

export const useSappEditorImageUpload = () => {
  const handleImageUpload = async (
    file: File,
    location: string,
  ): Promise<string> => {
    try {
      // Đọc file dưới dạng base64
      const base64String = (await fileToBase64(file)) as string
      // Chuyển base64 thành File để tải lên S3
      const convertedFile = base64ToFile(
        base64String as string,
        file.name || 'image.png',
      )
      const response = await handleUploadFileToS3(convertedFile, location)

      if (!response?.url) {
        throw new Error('Upload failed: No URL returned')
      }
      return response.url
    } catch (err) {
      throw new Error(`Image upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return {
    handleImageUpload,
  }
}
