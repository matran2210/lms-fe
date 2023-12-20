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

      if (element.hasAttribute('src')) {
        element.setAttribute('src', res.data.url || '')
      } else if (element.hasAttribute('poster')) {
        element.setAttribute('poster', res.data.thumbnail || '')
      }

      const source = element.querySelector('source')
      source?.setAttribute('resource_status', res.data?.status || '')
      if (source?.hasAttribute('src')) {
        source?.setAttribute('src', res.data.url || '')
      } else if (source?.hasAttribute('poster')) {
        source?.setAttribute('poster', res.data.thumbnail || '')
      }
    }
  }
  return div.innerHTML
}
