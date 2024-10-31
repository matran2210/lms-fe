import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import { apiURL } from 'src/redux/services/httpService'
import exceptions from './en.exceptions.json'
import { AuthenticationManager } from '@utils/helpers/keycloak'

type ApiConfig<T = any> = {
  uri: string
  params?: Object
  data?: Object
  request?: any
  token?: String
}

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

request.interceptors.request.use(async (config: any) => {
  const authenticationManager = new AuthenticationManager()
  if (authenticationManager.getToken() !== '') {
    config.headers = {
      Authorization: 'Bearer ' + authenticationManager.getToken(),
      ...config.headers,
    }
    return config
  }
  await new Promise((resolve) => {
    let interval = null as any
    interval = setInterval(() => {
      if (authenticationManager.getToken()) {
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

request.interceptors.response.use(
  function (response: AxiosResponse) {
    return response
  },
  async (error: any) => {
    const originalRequest = error.config

    if (error.response && error.response.status !== 401) {
      return Promise.reject(error)
    }

    if (error.response && error.response.status === 401) {
      const authenticationManager = new AuthenticationManager()

      await authenticationManager.refreshToken()
      originalRequest.headers['Authorization'] =
        'Bearer ' + authenticationManager.getToken()
      return axios(originalRequest)
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

const formatedExceptions = exceptions.reduce(
  (acc: { [key: string]: string }, { code, message }) => {
    acc[code] = message
    return acc
  },
  {},
)

request.interceptors.response.use(
  function (response: any) {
    return response
  },
  async function (error: any) {
    const errorCode: string = error?.response?.data?.error?.code
    const errorMessage =
      formatedExceptions[errorCode as keyof typeof formatedExceptions]
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
