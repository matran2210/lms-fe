import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import getConfig from 'next/config'
import { PageLink } from 'src/constants'
import { getLogoutUser } from '../slice/Login/Login'
import url from './Authen/url'

import toast from 'react-hot-toast'
import { exceptions } from './en.exceptions'
import { setCookieActToken, setCookieRefreshToken } from '@utils/index'
import { removeJwtToken } from '@utils/helpers/authen'
import { capitalize } from 'lodash'

const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig

const BASE_URL = process.env.REACT_APP_API_PUBLIC

const TIME_OUT = 5000

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
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiURL,
})

let isRefreshing = false
let refreshSubscribers: any[] = []

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken')

    const response = await axios.post(
      `${apiURL}/auth/rotate`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + refreshToken,
        },
      },
    )

    const userInfo = response?.data?.data?.tokens
    const act = userInfo?.act
    const rft = userInfo?.rft
    // Save the new access token to the AsyncStorage
    await AsyncStorage.setItem('accessToken', act)
    await AsyncStorage.setItem('refreshToken', rft)
    setCookieActToken(act)
    setCookieRefreshToken(rft)
    // Resolve all the subscribers with the new access token
    refreshSubscribers.forEach((callback) => callback(act))

    // Reset the refresh flag and subscribers array
    isRefreshing = false
    refreshSubscribers = []

    // Return the new access token
    return act
  } catch (error) {
    removeJwtToken()
    window.location.href = PageLink.AUTH_LOGIN

    // If there is an error, return null
    return null
  }
}
// Set the authorization header for the Axios instance
const setAuthorizationHeader = async (config: any) => {
  // Get the access token from the AsyncStorage
  const accessToken = await AsyncStorage.getItem('accessToken')
  // If there is an access token, set the authorization header
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
}

// Add a request interceptor to the Axios instance
axiosInstance.interceptors.request.use(
  async (config: any) => {
    // Set the authorization header
    await setAuthorizationHeader(config)

    // If the request is a refresh token request, return the config
    if (config.url === url.refreshToken) {
      return config
    }

    // If the access token is not present, return the config
    if (!config.headers.Authorization) {
      return config
    }

    // If the access token is present and the refresh flag is false, return the config
    if (!isRefreshing) {
      return config
    }

    // If the access token is present and the refresh flag is true, block the request and add it to the subscribers array
    await new Promise((resolve) => refreshSubscribers.push(resolve))
    config.headers.Authorization = `Bearer ${await AsyncStorage.getItem(
      'accessToken',
    )}`
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
    const errorCode: string = error?.response?.data?.error?.code
    const errorMessage = exceptions[errorCode as keyof typeof exceptions]

    const isLoginPage = window.location.pathname === PageLink.AUTH_LOGIN

    // if (error.response && error.response.status === 404) {
    //   store.dispatch(getLogoutUser())
    //   window.location.href = PageLink.AUTH_LOGIN
    // }
    // If the error is an authentication error and the refresh flag is false, set the refresh flag and refresh the access token
    if (
      error.response &&
      error.response.status === 401 &&
      !isRefreshing &&
      !isLoginPage
    ) {
      isRefreshing = true
      const accessToken = await refreshAccessToken()

      // If the access token is refreshed, retry the original request
      if (accessToken) {
        const originalRequest = error.config
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      }
    }

    // If the error is an authentication error and the refresh flag is true, block the request and add it to the subscribers array
    if (
      error.response &&
      error.response.status === 401 &&
      isRefreshing &&
      !isLoginPage
    ) {
      return new Promise((resolve) => {
        refreshSubscribers.push((accessToken: string) => {
          error.config.headers.Authorization = `Bearer ${accessToken}`
          resolve(axiosInstance(error.config))
        })
      })
    }

    if (isLoginPage && error.response?.config?.url !== '/me') {
      if (
        error?.response?.status !== 422 &&
        error?.response?.data?.error?.code !== '403|0001' &&
        error?.response?.data?.error?.code !== '400|060710'
      ) {
        toast.error(
          capitalize(
            errorMessage ||
              error?.response?.statusText ||
              error?.message ||
              'Unknown error!',
          ),
        )
      }
      return Promise.reject(error)
    }

    if (error.response && errorCode === '400|2001') {
      return Promise.reject(error)
    }

    if (error.response && error.response.status !== 401) {
      if (
        error?.response?.status !== 422 &&
        error?.response?.data?.error?.code !== '403|0001' &&
        error?.response?.data?.error?.code !== '400|060710'
      ) {
        toast.error(
          errorMessage ||
            error?.response?.statusText ||
            error?.response?.data?.message ||
            error?.message ||
            'Unknown error!',
        )
      }
      return Promise.reject(error)
    }

    // If there is an error that is not related to authentication, return the Promise.reject() method
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
