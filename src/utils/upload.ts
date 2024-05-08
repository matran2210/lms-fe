import toast from 'react-hot-toast'
import { TestAPI } from 'src/pages/api/test'

export const mergeImageToEditor = async (data: string) => {
  const div = document.createElement('div')
  div.innerHTML = data || ''

  const media = div.querySelectorAll(
    'img, video source, video[poster]',
  ) as NodeListOf<HTMLImageElement | HTMLSourceElement | HTMLVideoElement>
  for (const element of media) {
    const src = element.getAttribute('resource_id')
    if (src && element.tagName === 'VIDEO') {
      const res = await TestAPI.getResource(src)
      const source = element.querySelector('source')
      const linkVideo = source?.getAttribute('src')
      var iframe = document.createElement('iframe')
      iframe.src = res.data.url.replace(
        '/manifest/video.m3u8',
        `/iframe?poster:${res.data.thumbnail}`,
      )
      iframe.id = element.id
      iframe.className = element.className
      iframe.style.cssText = element.style.cssText
      iframe.allow =
        'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
      iframe.allowFullscreen = true
      element?.parentNode?.replaceChild(iframe, element)
    }
  }
  return div.innerHTML
}
export const validateFile = (
  file: any,
  acceptFiles?: { type?: string; size?: number }[],
  toastId?: string,
): boolean => {
  const fileType = file.contentType || file.type
  const fileSize = file.size

  if (!acceptFiles) return true
  const acceptedTypes = acceptFiles.map((file) => file.type)

  if (acceptedTypes.length > 0) {
    if (
      !acceptedTypes.some((type) =>
        type?.endsWith('*')
          ? fileType.startsWith(type.split('/')[0])
          : fileType === type,
      )
    ) {
      toast.error('File không hỗ trợ')
      return false
    }
  }

  const maxFileSize =
    acceptFiles.find((acceptFile) =>
      acceptFile?.type?.endsWith('*')
        ? fileType.startsWith(acceptFile.type.split('/')[0])
        : fileType === acceptFile.type,
    )?.size || 0

  if (maxFileSize > 0 && fileSize > maxFileSize) {
    toast.error('File quá lớn')
    return false
  }

  return true
}
