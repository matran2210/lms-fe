import { IResponse } from 'src/redux/types'
import url from './url'
import { apiURL, httpService } from '../httpService'
import axios from 'axios'

const EntranceApi = {
  getListUnivers: async (): Promise<IResponse<any>> => {
    const uri = url.getListUnivers
    const res = await httpService.GET<any, any>({
      uri,
    })
    return res
  },
  getListUniversProgram: async (): Promise<IResponse<any>> => {
    const uri = url.getListUniversProgram
    const res = await httpService.GET<any, any>({
      uri,
    })
    return res
  },
  getListMajors: async (): Promise<IResponse<any>> => {
    const uri = url.getListMajors
    const res = await httpService.GET<any, any>({
      uri,
    })
    return res
  },
  getListEngLevel: async (): Promise<IResponse<any>> => {
    const uri = url.getListEngLevel
    const res = await httpService.GET<any, any>({
      uri,
    })
    return res
  },
  putLevel: async (data: any): Promise<IResponse<any>> => {
    const uri = url.putLevel
    const res = await httpService.PUT<any, any>({
      uri,
      request: data,
    })
    return res
  },
  getListEntranceTest: async (accessToken: string): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}${url.getListEntranceTest}`,
      {
        headers,
      },
    )
    return response?.data?.data
  },
  getEntranceCount: async (): Promise<IResponse<any>> => {
    const uri = url.getEntranceCount
    const res = await httpService.GET<any, any>({
      uri,
    })
    return res
  },
}
export default EntranceApi
