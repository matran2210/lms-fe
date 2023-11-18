export const getaccessToken = (): string => {
  return localStorage.getItem('accessToken') || ''
}

export const getRefreshToken = (): string => {
  return localStorage.getItem('refreshToken') || ''
}

export const setAccessToken = (accToken: string) => {
  localStorage.setItem('accessToken', accToken)
}

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const removeJwtToken = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
