import {
  getLocalStorgeActToken,
  setActToken,
  setRefreshToken,
} from '@utils/index'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import { apiURL } from 'src/redux/services/httpService'
import { getKeycloakInstance } from 'src/utils/helpers/keycloak'
import exceptions from './en.exceptions.json'

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

    if (error.response && error.response.status === 401) {
      const keycloak = await getKeycloakInstance()
      await keycloak.updateToken(30)
      const newAccessToken = keycloak.token ?? ''
      const newRefreshToken = keycloak.refreshToken ?? ''
      setActToken(newAccessToken)
      setRefreshToken(newRefreshToken)
      originalRequest.headers['Authorization'] =
        'Bearer ' + getLocalStorgeActToken()
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
