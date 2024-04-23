import { IResponse } from 'src/redux/types'
import url from './url'
import { apiURL, httpService } from '../httpService'
import axios from 'axios'

const EntranceApi = {
  putLevel: async (data: any): Promise<IResponse<any>> => {
    const uri = url.putLevel
    const res = await httpService.PUT<any, any>({
      uri,
      request: data,
    })
    return res
  },
  getListEntranceTest: async (
    accessToken: string,
    queryString?: string,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}${url.getListEntranceTest}?${queryString}`,
      {
        headers,
      },
    )
    return response?.data?.data
  },
}
export default EntranceApi
