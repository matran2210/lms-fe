import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import getConfig from 'next/config'

import toast from 'react-hot-toast'
import exceptions from 'src/services/en.exceptions.json'
import { AuthenticationManager } from '@utils/helpers/keycloak'

const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig

type ApiConfig<T = any> = {
  uri: string
  params?: Object
  data?: Object
  request?: any
  token?: String
}
let store: any
export const injectStore = (_store: any) => {
  store = _store
}
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return apiURL
  }
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiURL,
})

export const fetcher = (url: string, config: AxiosRequestConfig = {}) =>
  axiosInstance(url, config)
    .then((res) => res?.data)
    .catch((err) => {
      throw err
    })

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json' // Change to your preferred content type
    return config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.request.use(async (config: any) => {
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

axiosInstance.interceptors.response.use(
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

export const httpService = {
  async GET<T, O>(apiConfig: ApiConfig<T>) {
    const { uri, params, ...rest } = apiConfig
    try {
      const res = await axiosInstance.get<O>(uri, {
        params,
        ...rest,
      })
      return res?.data
    } catch (error) {
      throw error
    }
  },

  async POST<T, O>(apiConfig: ApiConfig<T>) {
    const { uri, request, params, ...rest } = apiConfig
    try {
      const res = await axiosInstance.post<O>(uri, request, {
        params,
        ...rest,
      })
      return res.data
    } catch (error) {
      throw error
    }
  },

  async PUT<T, O>(apiConfig: ApiConfig<T>) {
    const { uri, request, params, ...rest } = apiConfig
    try {
      const res = await axiosInstance.put<O>(uri, request, {
        params,
        ...rest,
      })
      return res.data
    } catch (error) {
      throw error
    }
  },
  async PATCH<T, O>(apiConfig: ApiConfig<T>) {
    const { uri, request, params, ...rest } = apiConfig
    try {
      const res = await axiosInstance.patch<O>(uri, request, {
        params,
        ...rest,
      })
      return res.data
    } catch (error) {
      throw error
    }
  },
  async DELETE<T, O>(apiConfig: ApiConfig<T>) {
    const { uri, params, request, ...rest } = apiConfig
    try {
      const res = await axiosInstance.delete<O>(uri, {
        data: request,
        params,
        ...rest,
      })
      return res.data
    } catch (error) {
      throw error
    }
  },

  async POST_ENCODED<T, O>(apiConfig: ApiConfig<T>) {
    const { uri, request, params } = apiConfig
    const body = JSON.stringify(request)
    try {
      const res = await axiosInstance.post<O>(uri, body, {
        ...params,
        headers: {
          ...(params as any)?.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      return res.data
    } catch (error) {
      throw error
    }
  },

  async PUT_ENCODED<T, O>(apiConfig: ApiConfig<T>) {
    const { uri, request, params } = apiConfig

    const body = JSON.stringify(request)
    try {
      const res = await axiosInstance.put<O>(uri, body, {
        ...params,
        headers: {
          ...(params as any)?.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      return res.data
    } catch (error) {
      throw error
    }
  },

  async POST_FORM_DATA<T, O>(apiConfig: ApiConfig<T>) {
    const { uri, request, params } = apiConfig

    try {
      const res = await axiosInstance.post<O>(uri, request, {
        ...params,
        headers: {
          ...(params as any)?.headers,
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data
    } catch (error) {
      throw error
    }
  },

  async PUT_FORM_DATA<T, O>(apiConfig: ApiConfig<T>) {
    const { uri, request, params } = apiConfig

    try {
      const res = await axiosInstance.put<O>(uri, request, {
        ...params,
        headers: {
          ...(params as any)?.headers,
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data
    } catch (error) {
      throw error
    }
  },
}
