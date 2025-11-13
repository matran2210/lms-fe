import { ISubjectItem } from 'src/redux/types/User/urser'
import { IButtonBaseProps } from '../common'

export type IButtonSize = 'small' | 'medium' | 'large' | 'extra'

export interface UserAgent {
  browserName: string
  browserVersion: string
  osName: string
  osVersion: string
  deviceType: any
}

export interface IDeviceItem {
  id: string
  created_at: string
  updated_at: string
  ip: string
  location: string
  user_agent: UserAgent
  user_id: string
  is_current: boolean
}

export type IButtonCancelSubmitProps = {
  submit: IButtonBaseProps
  cancel: IButtonBaseProps
  className?: string
  showOkButton?: boolean
  showCancelButton?: boolean
  size?: IButtonSize
  revertFunction?: boolean
  startIcon?: React.ReactNode
}

export interface UserHubspotExaminationSubjectItem {
  id: string
  examination_subject_id: string
  result: string
  examination_subject: {
    id: string
    subject_id: string
    examination_id: string
    subject: ISubjectItem
    examination: {
      id: string
      name: string
    }
  }
  is_final_examination_subject: boolean
}
