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
  if (str.length <= maxLength) {
    return str
  } else {
    return str.slice(0, maxLength) + ' ...' // Add ellipsis to indicate truncation
  }
}
export function runHighlight(
  handleSaveHighLight: any,
  allowHighLight: boolean,
) {
  // run mobile a bit
  const domEle = document.getElementById('hightlight_area')

  const options: optionsImpl = {}
  if (domEle && allowHighLight) {
    const highlightMade = doHighlight(domEle, true, options)
    handleSaveHighLight(serializeHighlights(domEle))
  }
}

export function DeserializeHighlight(highlighted: any) {
  const domEle = document.getElementById('hightlight_area')
  removeHighlights(domEle as any)
  deserializeHighlights(domEle as any, highlighted)
}
