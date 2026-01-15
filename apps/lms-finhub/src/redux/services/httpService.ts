import { ExceptionErrorCode } from '@lms/core'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'


let store: any
export const injectStore = (_store: any) => {
  store = _store
}

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_API_URL
  }
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
})

// Add a request interceptor to the Axios instance
axiosInstance.interceptors.request.use(
  async (config: any) => {
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
  },
  (error: AxiosError) => {
    // If there is an error, return the Promise.reject() method
    return Promise.reject(error)
  },
)

// Add a response interceptor to the Axios instance
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // If the response is successful,
    return response
  },

  async (error: any) => {
    // If the error is not an authentication error, return the Promise.reject() method
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

const formatedExceptions = ExceptionErrorCode.reduce(
  (acc: { [key: string]: string }, { code, message }) => {
    acc[code] = message
    return acc
  },
  {},
)

axiosInstance.interceptors.response.use(
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
