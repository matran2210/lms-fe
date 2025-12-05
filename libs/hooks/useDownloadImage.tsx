import { message } from 'antd'

const useDownloadImage = () => {
  const downloadImage = async (url: string) => {
    try {
      const originalImage = url
      const image = await fetch(originalImage)

      if (!image.ok) {
        message.error('Tải ảnh thất bại. Vui lòng thử lagi!')
      }

      // Split image name
      const nameSplit = originalImage.split('/')
      const duplicateName = nameSplit.pop() || 'downloaded-image'

      const imageBlob = await image.blob()
      const imageURL = URL.createObjectURL(imageBlob)

      const link = document.createElement('a')
      link.href = imageURL
      link.download = '' + duplicateName + ''
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up object URL
      URL.revokeObjectURL(imageURL)
    } catch (error: any) {
      message.error('Tải ảnh thất bại. Vui lòng thử lại!')
    }
  }

  return { downloadImage }
}

export default useDownloadImage
