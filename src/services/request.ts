import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { PageLink } from 'src/constants'

import {
  getActToken,
  getRefreshToken,
  removeJwtToken,
  setCookieActToken,
  setCookieRefreshToken,
} from 'src/utils'
// import {toast} from 'react-hot-toast'

// Variable to track whether the refresh token API has been called
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.REACT_APP_API_PUBLIC
  }

  return process.env.REACT_APP_API_PUBLIC
}

export const request = axios.create({
  baseURL: getBaseUrl(),
})

export const fetcher = (url: string, config: AxiosRequestConfig = {}) =>
  request(url, config)
    .then((res) => res?.data)
    .catch((err) => {
      throw err
    })

request.interceptors.request.use(
  (config: any) => {
    config.headers['Content-Type'] = 'application/json' // Change to your preferred content type
    return config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error)
  },
)

request.interceptors.request.use((config: any) => {
  config.headers = {
    Authorization: 'Bearer ' + getActToken(),
    ...config.headers,
  }

  return config
})

request.interceptors.response.use(
  function (response) {
    return response
  },
  async (error: any) => {
    const originalRequest = error.config

    if (error.response && error.response.status !== 401) {
      return Promise.reject(error)
    }

    if (
      error.response &&
      error.response.status === 401 &&
      error.config.url !== PageLink.AUTH_LOGIN &&
      error.config.url !== PageLink.AUTH_CHANGE_PASSWORD
    ) {
      if (!isRefreshing) {
        isRefreshing = true

        axios(`${process.env.REACT_APP_API_PUBLIC}/auth/rotate`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + getRefreshToken(),
          },
        })
          .then((res: any) => {
            const userInfo = res?.data?.data?.tokens
            setCookieActToken(userInfo?.act)
            setCookieRefreshToken(userInfo?.rft)

            // update new token to axios
            request.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${getActToken()}`

            // Callback to unauth API calls
            refreshSubscribers.forEach((callback) => callback(getActToken()))
            refreshSubscribers = []
            isRefreshing = false
          })
          .catch(() => {
            removeJwtToken()
            window.location.href = PageLink.AUTH_LOGIN
          })
      }

      // Return a Promise to wait for the initial API callback
      const retryOriginalRequest = new Promise((resolve) => {
        const subscribeTokenRefresh = (token: string) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          resolve(axios(originalRequest))
        }
        refreshSubscribers.push(subscribeTokenRefresh)
      })

      return retryOriginalRequest
    }
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  function (response: any): any {
    return response
  },
  function (error: any) {
    return Promise.reject(error)
  },
)
