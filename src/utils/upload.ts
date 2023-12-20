import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'

export const mergeImageToEditor = async (data: string) => {
  const div = document.createElement('div')
  div.innerHTML = data || ''

  const media = div.querySelectorAll(
    'img, video source, video[poster]',
  ) as NodeListOf<HTMLImageElement | HTMLSourceElement | HTMLVideoElement>
  for (const element of media) {
    const src = element.getAttribute('resource_id')
    if (src && element.tagName === 'VIDEO') {
      const res = await CourseTestApi.getResource(src)
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
