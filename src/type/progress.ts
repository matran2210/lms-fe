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
export interface IExplorerNode {
  id: string
  name: string
  code: string
  is_original: boolean
  is_excepted: boolean
  checked: boolean
  parent_id?: string
  process?: number
  children?: IExplorerNode[]
}
