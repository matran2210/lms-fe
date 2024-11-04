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
  if (true) {
    config.headers = {
      Authorization: 'Bearer ' + "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJCRVRyQXZwc3NwT1dYd192cXByczBtVnhidlYxSnA5TWozY1dkdkpqTG1NIn0.eyJleHAiOjE3MzA3MjE1NTMsImlhdCI6MTczMDcxOTc1MywiYXV0aF90aW1lIjoxNzMwNzE3OTAyLCJqdGkiOiI1NGRlZTBhYi1iNWRkLTQzNWItOTdjNC1hN2RiNzczNWZjMmYiLCJpc3MiOiJodHRwczovL3VhdC1hY2NvdW50cy5zYXBwLmVkdS52bi9yZWFsbXMvbG1zLXVhdCIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwibWFzdGVyLXJlYWxtIiwiYWNjb3VudCJdLCJzdWIiOiI3MmVjMjI1Mi03ODZiLTQ0NDEtOTgyNi05NmJhMjhhYzU2NDQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsbXMtZnJvbnRlbmQiLCJub25jZSI6ImRjNzllNzNmLWEwMTctNGRiOC04MzgwLWRmYzdkNzAyM2Y3YSIsInNlc3Npb25fc3RhdGUiOiJkZDFhMWI5NS1mYWRmLTRlMTQtYTY3Mi01NTczZTVmOTAyZWQiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vdWF0LWxtcy5zYXBwLmVkdS52biJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJvZmZsaW5lX2FjY2VzcyIsImFkbWluIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1vcmdhbml6YXRpb25zIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJyZWFsbS1hZG1pbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJwdWJsaXNoLWV2ZW50cyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LW9yZ2FuaXphdGlvbnMiLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsidmlldy1yZWFsbSIsInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwibWFuYWdlLW9yZ2FuaXphdGlvbnMiLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJwdWJsaXNoLWV2ZW50cyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LW9yZ2FuaXphdGlvbnMiLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiZGQxYTFiOTUtZmFkZi00ZTE0LWE2NzItNTU3M2U1ZjkwMmVkIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiLEkOG6t25nIEh1eSBUw7oiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJodXl0dTIwIiwiZ2l2ZW5fbmFtZSI6IsSQ4bq3bmcgSHV5IFTDuiIsImVtYWlsIjoidHVkaEBzYXBwLmVkdS52biJ9.fYk8a1QPBmyJZCfh-7OdT0fY7BJvk1nJHYF-ZTXDIPGBJ70A8gMgcANUY5CMZz7GAxigwbl99jjWSPcO3KhEMffNbi9oB9J51Um9WUgaaQBHo1k18SXvDBK9pmyLWbWD7wBaqHuuLRH1Iyz72lq7f_UsppdLEfC04XvFAS2XLTWX-KW4xODty7H0q9IxZ3aC5fJY2fnd71dLpgTtSY9tTvyed8gTs5Tq0AHCmDAY1f2OWcd762kj4Dp-Ct2KpmtIb_nVfkLNb-hwo6nWX1YQUEVCJ0Rc7KQvm7QeMpOBhKd3-0mIrtdSPOOmWPu4c6pLLF4TsV8eYhbmhzRZTI2n4w",
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
