import {
  deserializeHighlights,
  doHighlight,
  optionsImpl,
  removeHighlights,
  serializeHighlights,
} from '@/../node_modules/@funktechno/texthighlighter/lib/index'
import DOMPurify from 'dompurify'
import Cookies from 'js-cookie'
import { useQuery } from 'react-query'

export const getActToken = (): string => {
  return Cookies.get('accessToken') || ''
}

export const getRefreshToken = (): string => {
  return Cookies.get('refreshToken') || ''
}

export const setCookieActToken = (accToken: string) => {
  Cookies.set('accessToken', accToken, { path: '/' })
}

export const setCookieRefreshToken = (refreshToken: string) => {
  Cookies.set('refreshToken', refreshToken, { path: '/' })
}

export const removeJwtToken = () => {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
}

export const removeLocalStorageJwtToken = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export const setActToken = (accToken: string) => {
  localStorage.setItem('accessToken', accToken)
}

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const getLocalStorgeActToken = (): string => {
  return localStorage.getItem('accessToken') || ''
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
  if (totalTime !== null) {
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
  return useQuery([queryKey, params], () => fetchData(params))
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
