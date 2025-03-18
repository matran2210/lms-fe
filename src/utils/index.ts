import {
  deserializeHighlights,
  doHighlight,
  optionsImpl,
  removeHighlights,
  serializeHighlights,
} from '@/../node_modules/@funktechno/texthighlighter/lib/index'
import DOMPurify from 'dompurify'
import { isEmpty, isNull, isUndefined } from 'lodash'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const getLocalStorgeActToken = (): string => {
  return ''
}

export const getLocalStorgeRefreshToken = (): string => {
  return localStorage.getItem('refreshToken') || ''
}

export function truncateString(str: string, maxLength: number) {
  if (str?.length <= maxLength) {
    return str
  } else {
    return str?.slice(0, maxLength) + ' ...' // Add ellipsis to indicate truncation
  }
}
export function runHighlight(
  handleSaveHighLight: any,
  allowHighLight: boolean,
  elementID = 'hightlight_area',
  options?: optionsImpl,
) {
  // run mobile a bit
  const domEle = document.getElementById(elementID)

  if (domEle && allowHighLight) {
    doHighlight(domEle, false, options)
    handleSaveHighLight(serializeHighlights(domEle))
  }
}

export function DeserializeHighlight(
  highlighted: any,
  elementID = 'hightlight_area',
) {
  const domEle = document.getElementById(elementID)
  removeHighlights(domEle as any)
  deserializeHighlights(domEle as any, highlighted)
}

export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  const formattedHours = hours > 0 ? `${hours}h` : ''
  const formattedMinutes = remainingMinutes > 0 ? `${remainingMinutes}m` : ''

  return formattedHours + formattedMinutes || '0h0m'
}

/**
 * Convert millisecond/seconds to readable hh:mm:ss
 *
 * @param   totalTime  time in milliseconds/seconds
 * @param   unit       'milliseconds'(default) | 'seconds'
 * @returns hh:mm:ss
 */
export const getTimeFromInput = (
  totalTime: number,
  unit: 'milliseconds' | 'seconds' = 'milliseconds',
) => {
  if (totalTime || totalTime === 0) {
    let totalSeconds

    if (unit === 'milliseconds') {
      totalSeconds = Math.floor(totalTime / 1000)
    } else {
      totalSeconds = totalTime
    }

    const totalMinutes = Math.floor(totalSeconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)

    const formattedHours =
      totalHours > 0 ? ('0' + totalHours).slice(-2) + ':' : ''
    const formattedMinutes = ('0' + (totalMinutes % 60)).slice(-2)
    const formattedSeconds = ('0' + (totalSeconds % 60)).slice(-2)

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`
  }
  return '-'
}

export const countWords = (text: string) => {
  const words = text.trim().split(/\s+/)
  return words.length
}

export const convertSnakeCaseToHumanReadable = (str: string) => {
  const words = str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))

  return words.join(' ')
}

export const buildQueryString = (params: Object) => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== '' && value !== undefined) // Exclude empty parameters
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&')

  return queryParams ? `&${queryParams}` : ''
}

export const bytesToKilobyte = (bytes: number) => {
  return `${(bytes / 1024).toFixed(2)}Kb` // 1 kilobyte = 1024 bytes
}

export const cleanParamsAPI = (params: Object) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== '',
    ),
  )
}

export const buildOneChoiceQueryString = (params: Object) => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== '' && value !== undefined) // Exclude empty parameters
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&')

  return queryParams ? `${queryParams}` : ''
}

export const parseHTMLToString = (htmlContent: string) => {
  const tempElement = document.createElement('div')
  tempElement.innerHTML = DOMPurify.sanitize(htmlContent)
  return tempElement.textContent || tempElement.innerText
}

// Hàm thay thế style text-align: center thành style text-align: -webkit-center trong chuỗi HTML
export const replaceTextAlignCenterToWebKitCenter = (htmlString: string) => {
  // Sử dụng biểu thức chính quy để thay thế
  return htmlString.replace(
    /text-align:\s*center/g,
    'text-align: -webkit-center',
  )
}

export const useGetData = (
  queryKey: string,
  params: Object,
  fetchData: any,
) => {
  return useQuery([queryKey, params], () => fetchData(params), { retry: false })
}

export const useGetDataQuery = (
  queryKey: string,
  params: Object,
  fetchFunction: () => Promise<any>,
  enabled?: boolean,
  onError?: ((err: unknown) => void) | undefined,
) => {
  const fetchData = async () => {
    const { data } = await fetchFunction()
    return data
  }

  return useQuery([queryKey, params], fetchData, {
    enabled: enabled,
    onError: onError,
    retry: false,
  })
}

export const convertFractionToPercentage = (fraction: string) => {
  const [numerator, denominator] = fraction.split('/').map(Number)
  if (denominator === 0) return 0 // Tránh chia cho 0
  const percentage = (numerator / denominator) * 100
  return percentage
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  // @ts-ignore: Unreachable code error
  window.gtag(
    'config',
    `${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}` as string,
    {
      page_path: url,
    },
  )
}

/**
 * @description function này để link social
 */
export const onLinkSocial = (link: string) => {
  window.open(link, '_blank')
}

export const getUppercaseByNumber = (num: number): string => {
  let result = ''
  while (num > 0) {
    let remainder = num % 26
    if (remainder === 0) {
      remainder = 26
      num--
    }
    let char = String.fromCharCode(remainder + 64)
    result = char + result
    num = Math.floor(num / 26)
  }
  return result
}

export const removeLocalStorageItem = (item: string) => {
  localStorage.removeItem(item)
}

export const getLocalStorageItem = (name: string) => {
  return localStorage.getItem(name) || ''
}

export const setLocalStorageItem = (name: string, value: string) => {
  localStorage.setItem(name, value)
}

export const removeStyleAttributes = (htmlString?: string) => {
  if (!htmlString) return
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const elementsWithStyle = doc.querySelectorAll('[style]')
  elementsWithStyle.forEach((element) => {
    element.removeAttribute('style')
  })
  return doc.body.innerHTML
}

export const capitalizeFirstLetter = (str?: string) => {
  if (!str) return
  str = str?.toLocaleLowerCase()
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const truncateBySpace = (
  text: string,
  maxWords: number,
  isSlash: boolean = false,
): string => {
  if (isEmpty(text) || isUndefined(text) || isNull(text)) return ''
  const words = text?.split(' ')
  if (words?.length <= maxWords) {
    return text + (isSlash ? ' /' : '')
  }
  return words?.slice(0, maxWords).join(' ') + `...${isSlash ? '/' : ''}`
}

export const truncateTextOnly = (htmlString: string, limit: number) => {
  if (isEmpty(htmlString) || isUndefined(htmlString) || isNull(htmlString))
    return
  const div = document.createElement('div')
  div.innerHTML = htmlString

  let totalTextLength = 0
  let truncatedText = ''
  let lastSpacePosition = -1
  function walkNodes(node: any) {
    if (totalTextLength >= limit) return

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue
      for (let i = 0; i < text.length; i++) {
        if (totalTextLength >= limit) break
        truncatedText += text[i]
        totalTextLength++
        if (text[i] === ' ') {
          lastSpacePosition = truncatedText.length
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      truncatedText += `<${node.nodeName.toLowerCase()}>`
      for (let i = 0; i < node.childNodes.length; i++) {
        walkNodes(node.childNodes[i])
        if (totalTextLength >= limit) break
      }
      truncatedText += `</${node.nodeName.toLowerCase()}>`
    }
  }
  walkNodes(div)
  if (lastSpacePosition !== -1) {
    truncatedText = truncatedText.substring(0, lastSpacePosition) + '...'
  }
  return truncatedText
}

export const truncateHTML = (limit: number, html?: string) => {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  let wordCount = 0
  function traverse(node: any): string {
    const nodeType = node.nodeType

    if (wordCount >= limit) {
      return ''
    }

    if (nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      const words = text.split(/(\s+)/)
      let truncatedText = ''
      for (let i = 0; i < words.length && wordCount < limit; i++) {
        if (/\S/.test(words[i])) {
          truncatedText += words[i]
          wordCount++
        } else {
          truncatedText += words[i]
        }
      }

      return truncatedText + (wordCount >= limit ? '...' : '')
    } else if (nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase()
      const attributes = Array.from(node.attributes)
        .map((attr: any) => `${attr.name}="${attr.value}"`)
        .join(' ')

      const openTag = `<${tagName}${attributes ? ' ' + attributes : ''}>`
      const closeTag = `</${tagName}>`

      const childNodes = Array.from(node.childNodes)
      let innerHTML = ''
      childNodes.forEach((child: any) => {
        if (wordCount < limit) {
          const childContent = traverse(child)
          if (
            child?.nodeType === Node.ELEMENT_NODE &&
            innerHTML &&
            !/\s$/.test(innerHTML)
          ) {
            innerHTML += ' ' + childContent
          } else {
            innerHTML += childContent
          }
        }
      })
      return `${openTag}${innerHTML}${closeTag}`
    }
    return ''
  }
  return traverse(div)
}

export const removeHtmlTags = (htmlString?: string) => {
  if (!htmlString) return ''
  return htmlString.replace(/<[^>]*>/g, '') // Xóa tất cả thẻ HTML
}

export * from './formatNumber'

export const containsKeyword = (
  input: unknown,
  keyword: string = 'data-time=',
): boolean => {
  if (typeof input !== 'string' || typeof keyword !== 'string') return false
  return input.includes(keyword)
}

/**
 * @description Chuyển đổi chuỗi HTML chứa thẻ <strong> với thuộc tính data-time thành định dạng ngày tháng có thể đọc được.
 * @param {string} input - Chuỗi HTML đầu vào.
 * @return {string} - Chuỗi HTML đã được định dạng lại với ngày tháng hiển thị theo định dạng DD/MM/YYYY.
 */
export const formatNotificationHTML = (input: string): string => {
  return input.replace(
    /<strong\s+data-time\s*=\s*["']([^"']+)["']\s*><\/strong>/g,
    (match, dateTime) => {
      const formattedDate = dayjs.utc(dateTime).local().format('DD/MM/YYYY')
      return `<strong>${formattedDate}</strong>`
    },
  )
}
