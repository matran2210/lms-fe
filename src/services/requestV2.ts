import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import exceptions from './en.exceptions.json'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import Router from 'next/router'
import {
  CERTIFICATE_DETAIL,
  ENTRANCE_TEST_RESULT,
  ENTRANCE_TEST_TABLE_RESULT,
} from 'src/constants'

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

  if (true) {
    config.headers = {
      Authorization: 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmUTU0REE1Zm50b3M2RUxqdWJCWGdSRG1WbmJKbEFjUEdrVWpyV21icmV3In0.eyJleHAiOjE3MzczNTA0NzcsImlhdCI6MTczNzM0ODY3NywiYXV0aF90aW1lIjoxNzM3MzQ2ODQ3LCJqdGkiOiIzODAyM2RkNi04M2Y5LTQwNjMtODU0OC01MTY3ZmE2MWRjMGEiLCJpc3MiOiJodHRwczovL3VhdC1hY2NvdW50cy5zYXBwLmVkdS52bi9yZWFsbXMvbG1zLXVhdCIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwibWFzdGVyLXJlYWxtIiwiYWNjb3VudCJdLCJzdWIiOiI4YjAzYTg5My0zMWQxLTQ2OTAtODE4OC1jY2MyNDBkMTVjYjMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsbXMtZnJvbnRlbmQiLCJub25jZSI6IjllZjlhN2EwLTI0ZDItNDljNC05MzExLTllNjMwOGRlZDliZSIsInNlc3Npb25fc3RhdGUiOiI5YWM3MDFiZC1lMTBlLTRiNTQtOGU2MC02MTViNmUxMjk2MGYiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vdWF0LWxtcy5zYXBwLmVkdS52biJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJvZmZsaW5lX2FjY2VzcyIsImFkbWluIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1vcmdhbml6YXRpb25zIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJyZWFsbS1hZG1pbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJwdWJsaXNoLWV2ZW50cyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LW9yZ2FuaXphdGlvbnMiLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsidmlldy1yZWFsbSIsInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwibWFuYWdlLW9yZ2FuaXphdGlvbnMiLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJwdWJsaXNoLWV2ZW50cyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LW9yZ2FuaXphdGlvbnMiLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiOWFjNzAxYmQtZTEwZS00YjU0LThlNjAtNjE1YjZlMTI5NjBmIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJuZ0h1eVQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJodXl0dTIwIiwiZ2l2ZW5fbmFtZSI6Im5nSHV5VCIsImVtYWlsIjoidHVkaEBzYXBwLmVkdS52biJ9.QVD9iZXKeqPljyEIeeASuvNNQV-LtN1sB-HXvP7coxxzi18SEvjkEp6eil_R5AD6paRKshET40C3RHc_s35GuCqeAlvX40BrMqjih6LYJsvTaFsY9wWqtIG4azbel3LRFyq6Rl542Jw84DF4tk6eVr3hSrqpSZ-E7X2h7TXR9klI7t6-arcrDmd8A6tSdiSlMFceKOijr8PnIJrIzIolouLPBSrjVAI1zagmDpSFK1X9hWfJ39183EAY9wR5zOnou9K0Rnd8is3arZEU2yKR3uScy0uZTzrkBjfYyAbQmPAagwMTEVHKWltasGxFfe1tpKU1XGhJutHwO8aHwuIdqQ',
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
