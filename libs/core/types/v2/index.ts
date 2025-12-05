import { IButtonBaseProps } from '../common'

export interface ISubjectItem {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  course_category_id?: string;
  name: string;
  code: string;
}
export type IButtonSize = 'small' | 'medium' | 'large' | 'extra'

export type IButtonCancelSubmitProps = {
  submit: IButtonBaseProps
  cancel: IButtonBaseProps
  className?: string
  showOkButton?: boolean
  showCancelButton?: boolean
  size?: IButtonSize
  revertFunction?: boolean
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
