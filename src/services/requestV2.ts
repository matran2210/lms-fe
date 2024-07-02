import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { PageLink } from 'src/constants'
import { toast } from 'react-hot-toast'
import exceptions from './en.exceptions.json'
import {
  getLocalStorgeActToken,
  getLocalStorgeRefreshToken,
  removeLocalStorageJwtToken,
  setActToken,
  setRefreshToken,
} from '@utils/index'
import { apiURL } from 'src/redux/services/httpService'

type ApiConfig<T = any> = {
  uri: string
  params?: Object
  data?: Object
  request?: any
  token?: String
}

// Variable to track whether the refresh token API has been called
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return apiURL
  }
}

export const request: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
})

export const fetcher = (url: string, config: AxiosRequestConfig = {}) =>
  request(url, config)
    .then((res) => res?.data)
    .catch((err) => {
      throw err
    })

request.interceptors.request.use(
  (config) => {
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
    Authorization: 'Bearer ' + getLocalStorgeActToken(),
    ...config.headers,
  }

  return config
})

request.interceptors.response.use(
  function (response: AxiosResponse) {
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
      error.config.url !== `${apiURL}${PageLink.AUTH_LOGIN}`
    ) {
      if (!isRefreshing) {
        isRefreshing = true

        axios(`${apiURL}/auth/rotate`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + getLocalStorgeRefreshToken(),
          },
        })
          .then((res: any) => {
            const userInfo = res?.data?.data?.tokens
            setActToken(userInfo?.act)
            setRefreshToken(userInfo?.rft)

            // update new token to axios
            request.defaults.headers.common['Authorization'] =
              `Bearer ${getLocalStorgeActToken()}`

            // Callback to unauth API calls
            refreshSubscribers.forEach((callback) =>
              callback(getLocalStorgeActToken()),
            )
            refreshSubscribers = []
            isRefreshing = false
          })
          .catch(() => {
            removeLocalStorageJwtToken()
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

const toastException = [
  '400|060915',
  '400|060904',
  '403|000010',
  '400|010833',
  '400|010433',
  '400|010008',
]
request.interceptors.response.use(
  function (response: any) {
    return response
  },
  function (error: any) {
    const errorCode: string = error?.response?.data?.error?.code
    const errorMessage = exceptions[errorCode as keyof typeof exceptions]
    if (!toastException.includes(errorCode)) {
      toast.error(
        errorMessage ||
          error?.response?.statusText ||
          error?.message ||
          'Unknown error!',
      )
    }
    return Promise.reject(error)
  },
)
