import Cookies from 'js-cookie'

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
