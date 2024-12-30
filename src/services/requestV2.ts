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

  const checkRouteCertificate =
    (Router?.router as any)?.state?.pathname === CERTIFICATE_DETAIL

  if (true) {
    config.headers = {
      Authorization:
        'Bearer ' +
        'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJBSE12cGRWRGZGT0hFdUl4MzBkcmpVLTg5Nl9sam1lTHlzbVZUdElYVkEwIn0.eyJleHAiOjE3MzUyOTk0NzgsImlhdCI6MTczNTI5NzY3OCwiYXV0aF90aW1lIjoxNzM1Mjk2NDkyLCJqdGkiOiIwMWE1N2EwMC0xOTUwLTQ3OWItODBkNS00YzNhOWQyNTE4NjIiLCJpc3MiOiJodHRwczovL2Rldi1hY2NvdW50cy5zYXBwLmVkdS52bi9yZWFsbXMvbG1zLWRldiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwibWFzdGVyLXJlYWxtIiwiYWNjb3VudCJdLCJzdWIiOiJlYzFlNjk0Yi03ZjFkLTQzNDUtYmI3OC1iOGU5N2ZkMWFkNDAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsbXMtZnJvbnRlbmQiLCJub25jZSI6ImE0NTM5M2YwLWZjM2EtNDEzYS1iYjdjLTIxZDBmM2Y2NzcxZSIsInNlc3Npb25fc3RhdGUiOiJmYmE2NTFmYy0wOTVhLTQzZDItYjQ4Ny04MzQ4YTRlMWIzMTAiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC8qIiwiaHR0cHM6Ly9kZXYtbG1zLnNhcHAuZWR1LnZuIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJjcmVhdGUtcmVhbG0iLCJkZWZhdWx0LXJvbGVzLW1hc3RlciIsIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJ2aWV3LXJlYWxtIiwibWFuYWdlLW9yZ2FuaXphdGlvbnMiLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsInJlYWxtLWFkbWluIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInB1Ymxpc2gtZXZlbnRzIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctb3JnYW5pemF0aW9ucyIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sIm1hc3Rlci1yZWFsbSI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIiwidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJtYW5hZ2Utb3JnYW5pemF0aW9ucyIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInB1Ymxpc2gtZXZlbnRzIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctb3JnYW5pemF0aW9ucyIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiJmYmE2NTFmYy0wOTVhLTQzZDItYjQ4Ny04MzQ4YTRlMWIzMTAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkhvbmduIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYW5kbmgxMjMiLCJnaXZlbl9uYW1lIjoiSG9uZ24iLCJlbWFpbCI6ImFuZG5oQHNhcHAuZWR1LnZuIn0.HMxPmJqmn989E2K-nHevOrGf-WwKMl2dqPxq4VhpqS6Icjc9MD2gXAV-kuBWdMJ1WJLSn2hwV66BnHPA10gf-iq8MYiIQyOH7Q4x0E1NSDH3epmjUoIpkopdmHXc50dSezmDgud5hJfnmVssOf3xgeorO3DwynR9aRmJ0v_a92Z146kdTRor_xLV3wvCNMxsb61rXuyq6CVzOq_Py07tuBcPAKm64ROUy7IQcmzuruUvTnVREwYaE4ZXukSqmjtbIkMUG2f3KJYX3z6-slSO0VGNSzkyRXl1OTH1CDTCL14ah523i0LNlEqP6oi4vJojUocLu_xA9U8WZ0rvyYOfSA',
      ...config.headers,
    }
    return config
  }

  // await new Promise((resolve) => {
  //   let interval = null as any
  //   interval = setInterval(() => {
  //     if (authenticationManager.getToken() || checkRouteCertificate) {
  //       config.headers = {
  //         Authorization: 'Bearer ' + authenticationManager.getToken(),
  //         ...config.headers,
  //       }
  //       clearInterval(interval)
  //       resolve(config)
  //     }
  //   }, 100)
  // })

  // return config
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
