import { IResponse } from 'src/redux/types'
import url from './url'
import { httpService } from '../httpService'

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
}
export default EntranceApi
