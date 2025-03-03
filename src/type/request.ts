import { REQUEST_STATUS, REQUEST_TYPE } from 'src/constants'
import { IUserDetail } from 'src/redux/types/User/urser'

type RequestType = keyof typeof REQUEST_TYPE

type RequestStatus = keyof typeof REQUEST_STATUS

export interface Request {
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

export interface IRequestFilterForm {
  search: string
  requestType: string
  requestStatus: string
  rangeDate: {
    fromDate: Date
    toDate: Date
  }
}
