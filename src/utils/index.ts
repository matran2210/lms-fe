import Cookies from 'js-cookie'
import {
  deserializeHighlights,
  doHighlight,
  optionsImpl,
  removeHighlights,
  serializeHighlights,
} from '@/../node_modules/@funktechno/texthighlighter/lib/index'
export const getActToken = (): string => {
  return Cookies.get('accessToken') || ''
}

export const getRefreshToken = (): string => {
  return Cookies.get('refreshToken') || ''
}

export const setCookieActToken = (accToken: string) => {
  Cookies.set('accessToken', accToken)
}

export const setCookieRefreshToken = (refreshToken: string) => {
  Cookies.set('refreshToken', refreshToken)
}

export const removeJwtToken = () => {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
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
  tempElement.innerHTML = htmlContent
  return tempElement.textContent || tempElement.innerText
}
