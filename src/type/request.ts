import { REQUEST_STATUS, REQUEST_TYPE } from 'src/constants'
import { IUserDetail } from 'src/redux/types/User/urser'
import { IMetaData } from '.'

type RequestType = keyof typeof REQUEST_TYPE

type RequestStatus = keyof typeof REQUEST_STATUS

export interface IRequest {
  id: string
  requestName: string
  requestType: RequestType
  requestStatus: RequestStatus
  time: string[]
  reason: string[]
  quantity: number[]
  approver: Partial<IUserDetail>
  creator: Partial<IUserDetail>
  createDate: string[]
  updateDate?: string
  classCode?: string
}

export interface IRequestList {
  meta_data: IMetaData
  results: IRequest[]
}

export interface IRequestFilterForm {
  search: string
  requestType: string
  requestStatus: string
  rangeDate: {
    fromDate: Date
    toDate: Date
  }
}
