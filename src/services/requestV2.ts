import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import { apiURL } from 'src/redux/services/httpService'
import exceptions from './en.exceptions.json'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import Router from 'next/router'
import { CERTIFICATE_DETAIL } from 'src/constants'

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return apiURL
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
request.interceptors.request.use(
  async (config) => {
    const authenticationManager = new AuthenticationManager()

    const isCertificateRoute =
      (Router?.router as any)?.state?.pathname === CERTIFICATE_DETAIL

    const token = authenticationManager.getToken()
    if (token || isCertificateRoute) {
      config.headers.Authorization = `Bearer ${token}`
      return config
    }

    // Handle token availability with a delay if necessary
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (authenticationManager.getToken() || isCertificateRoute) {
          config.headers.Authorization = `Bearer ${authenticationManager.getToken()}`
          clearInterval(interval)
          resolve(config)
        }
      }, 100)
    })

    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor
request.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle token expiration (401 error)
    if (error.response?.status === 401) {
      const authenticationManager = new AuthenticationManager()

      try {
        await authenticationManager.refreshToken()
        originalRequest.headers.Authorization = `Bearer ${authenticationManager.getToken()}`
        return axios(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
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

    return Promise.reject(error)
  },
)

export const fetchFormData = async ({
  url,
  formData,
}: {
  url: string
  formData: FormData
}) => {
  if (!formData || [...formData.entries()].length === 0) {
    throw new Error('FormData cannot be empty.')
  }

  return request.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export default request
