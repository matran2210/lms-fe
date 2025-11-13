import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios'
import { toast } from 'react-hot-toast'
import exceptions from './en.exceptions.json'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import Router from 'next/router'
import {
  CERTIFICATE_DETAIL,
  COOKIE_INFO,
  ENTRANCE_TEST_RESULT,
  ENTRANCE_TEST_TABLE_RESULT,
  PageLink,
} from 'src/constants'
import { apiURL } from 'src/redux/services/httpService'
import { deleteCookie, getCookie, setCookie } from '@utils/index'

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_API_URL
  }
}

// Initialize Axios instance
export const request: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetcher = (url: string, config: AxiosRequestConfig = {}) =>
  request(url, config)
    .then((res) => res?.data)
    .catch((err) => {
      throw err
    })

// Request Interceptor
request.interceptors.request.use(async (config: any) => {
  const authenticationManager = new AuthenticationManager()

  const checkRouteCertificate = [
    ENTRANCE_TEST_RESULT,
    CERTIFICATE_DETAIL,
    ENTRANCE_TEST_TABLE_RESULT,
  ].includes((Router?.router as any)?.state?.pathname)

  if (authenticationManager.getToken() || checkRouteCertificate) {
    config.headers = {
      Authorization: 'Bearer ' + authenticationManager.getToken(),
      ...config.headers,
    }
    return config
  }

  await new Promise((resolve) => {
    let interval = null as any
    interval = setInterval(() => {
      if (authenticationManager.getToken() || checkRouteCertificate) {
        config.headers = {
          Authorization: 'Bearer ' + authenticationManager.getToken(),
          ...config.headers,
        }
        clearInterval(interval)
        resolve(config)
      }
    }, 100)
  })

  return config
})
// Variable to track whether the refresh token API has been called
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// Response Interceptor
request.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle token expiration (401 error)
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true

        axios(`${apiURL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + getCookie(COOKIE_INFO.KEYCLOAK_TOKEN),
          },
          data: {
            refresh_token: getCookie(COOKIE_INFO.KEYCLOAK_REFRESH_TOKEN) ?? '',
            is_short_course: true,
          },
        })
          .then(
            (
              res: AxiosResponse<{
                access_token: string
                refresh_token: string
                session_state: string
              }>,
            ) => {
              const userInfo = res?.data
              setCookie(COOKIE_INFO.KEYCLOAK_TOKEN, userInfo?.access_token)
              setCookie(
                COOKIE_INFO.KEYCLOAK_REFRESH_TOKEN,
                userInfo?.refresh_token,
              )
              setCookie(COOKIE_INFO.SESSION_ID, userInfo?.session_state ?? '')

              // update new token to axios
              request.defaults.headers.common['Authorization'] =
                `Bearer ${getCookie(COOKIE_INFO.KEYCLOAK_TOKEN) ?? ''}`

              // Callback to unauth API calls
              refreshSubscribers.forEach((callback) =>
                callback(getCookie(COOKIE_INFO.KEYCLOAK_TOKEN) ?? ''),
              )
              refreshSubscribers = []
              isRefreshing = false
            },
          )
          .catch(() => {
            deleteCookie(COOKIE_INFO.KEYCLOAK_TOKEN)
            deleteCookie(COOKIE_INFO.KEYCLOAK_REFRESH_TOKEN)
            deleteCookie(COOKIE_INFO.KEYCLOAK_USER_ID)
            deleteCookie(COOKIE_INFO.SESSION_ID)
            window.location.reload()
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

    // Handle other errors
    return Promise.reject(error)
  },
)

// Toast for specific exceptions
const toastExceptions = [
  '400|060915',
  '400|060904',
  '403|000010',
  '400|010833',
  '400|010433',
  '400|010008',
]

// Map exceptions
const formattedExceptions: { [key: string]: string } = exceptions.reduce(
  (acc: any, { code, message }) => {
    acc[code] = message
    return acc
  },
  {},
)

// Global error handler
request.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorCode: string = error?.response?.data?.error?.code
    const errorMessage =
      formattedExceptions[errorCode] ||
      error?.response?.statusText ||
      error?.message ||
      'Unknown error!'

    if (!toastExceptions.includes(errorCode)) {
      toast.error(errorMessage)
    }
    if (
      errorCode?.startsWith('403') // Forbidden các loại
    ) {
      Router.replace('/')
    }

    return Promise.reject(error)
  },
)

export const fetchFormData = async ({
  url,
  formData,
  method = 'POST',
}: {
  url: string
  formData: FormData
  method?: Method
}) => {
  if (!formData || [...formData.entries()].length === 0) {
    throw new Error('FormData cannot be empty.')
  }

  return request({
    url,
    method,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export default request
