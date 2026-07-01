'use client'

// docx-preview ~500KB — lazy load, chỉ dùng khi user upload/view file Word
async function getRenderAsync() {
  const { renderAsync } = await import('docx-preview')
  return renderAsync
}

export const cleanWordHtml = (html: string) => {
  let cleaned = html
  cleaned = cleaned.replace(/<!--\[if.*?endif\]-->/gis, '')
  cleaned = cleaned.replace(/\s*mso-[^:]+:[^;"]+;?/gi, '')
  cleaned = cleaned.replace(/\s*class=("|\')?Mso[a-zA-Z0-9]+("|\')?/gi, '')
  cleaned = cleaned.replace(/\s*style=("|\')\s*("|\')/gi, '')
  cleaned = cleaned.replace(/<xml>.*?<\/xml>/gis, '')
  return cleaned
}
export const cleanWordHtmlExceptBackground = (html: string) => {
  let cleaned = html

  cleaned = cleaned.replace(/<!--\[if.*?endif\]-->/gis, '')
  cleaned = cleaned.replace(/<xml>.*?<\/xml>/gis, '')

  // Convert mso background → css
  cleaned = cleaned
    .replace(/mso-highlight:\s*([^;"]+)/gi, 'background-color:$1')
    .replace(/mso-shading:\s*([^;"]+)/gi, 'background-color:$1')

  // Remove mso-* except background-related
  cleaned = cleaned.replace(
    /\s*mso-(?!highlight|shading|background)[^:]+:[^;"]+;?/gi,
    '',
  )

  // Remove useless Mso class
  cleaned = cleaned.replace(/\s*class=("|\')?Mso[a-zA-Z0-9]+("|\')?/gi, '')

  return cleaned
}

export const handleDocUploadFromBlob = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer()
  const renderAsync = await getRenderAsync()

  const container = document.createElement('div')
  await renderAsync(arrayBuffer, container, undefined, {
    inWrapper: false,
    ignoreWidth: false,
    ignoreHeight: false,
    ignoreFonts: false,
  })

  let htmlContent = container.innerHTML
  htmlContent = cleanWordHtml(htmlContent)
  return htmlContent
}
