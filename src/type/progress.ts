import { IMetaData } from './index'
import { Dayjs } from 'dayjs'

export interface IProgressList {
  meta_data: IMetaData
  results: IProgress[]
}

export interface IProgress {
  id: string
  lesson: string
  time: string
  section?: string
  progress: string
  creator?: string
  createDate?: string
  note: string
}
export interface IProgressFilterForm {
  progress: string
  rangeDate: [Dayjs, Dayjs]
}
export interface IDefaultFormAddProgress {
  lesson: string
  section?: string
  note: string
}
