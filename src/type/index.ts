import { FixedType } from 'rc-table/lib/interface'
import { ReactNode } from 'react'
import { IMeta } from './courses'

export type IButtonColors =
  | 'primary'
  | 'info'
  | 'success'
  | 'secondary'
  | 'danger'
  | 'warning'
  | 'light'
  | 'dark'
  | 'white'
  | 'outline'
  | 'text'
  | 'textUnderline'
  | 'quizActivity'
export interface IButtonProps {
  title: string
  onClick?: (e: any) => void
  className?: string
  link?: string
  disabled?: boolean
  loading?: boolean
  size?: 'small' | 'medium' | 'lager' | 'extra'
  full?: boolean
  name?: string
  type?: 'button' | 'reset' | 'submit'
  isPadding?: boolean
  isPaddingHorizontal?: boolean
  color?: IButtonColors
  isUnderLine?: boolean
  childClass?: string
  classNameLoading?: string
  showTooltip?: boolean
  toolTipTitle?: string
  icon?: React.ReactNode
}

export interface ITabs {
  link: string
  title: string
  disable?: boolean
}

export type IButtonCancelSubmitProps = {
  submit: IButtonProps
  cancel: IButtonProps
  className?: string
  color?: IButtonColors
  colorCancel?: IButtonColors
  showOkButton?: boolean
  showCancelButton?: boolean
  size?: 'small' | 'medium' | 'lager' | 'extra'
  revertFunction?: boolean
}
declare global {
  interface Window {
    luckysheet: any
  }
}

interface IPinned {
  action: string
  content: string
  created_at: string
  created_by: string
  created_from: string
  deleted_at: string
  id: string
  mode: string
  send_finish_time: string
  send_time: string
  status: string
  title: string
  type: string
  updated_at: string
}

export interface PinnedNotifications {
  data: IPinned
}

export enum NOTIFICATION_STATUS {
  SENT = 'SENT',
  CANCEL = 'CANCEL',
  RETRIEVE = 'RETRIEVE',
  TIMER = 'TIMER',
  SHOWING = 'SHOWING',
  ENDED = 'ENDED',
}

export interface IMetaData {
  total_pages: number
  total_records: number
  page_index: number
  page_size: number
}
export interface ISVG {
  width?: number
  height?: number
  className?: string
}

export interface ITabs {
  link: string
  title: string
}

export interface IResponse<T> {
  error: any
  status: number
  success: boolean
  data: T
}
export interface ITable {
  headers:
    | {
        key?: string | undefined
        label: any
        className?: string
        onClick?: () => void
      }[]
    | undefined
  dataResponse?:
    | {
        metadata: IMeta
        meta: IMeta
        [key: string]: any
      }
    | undefined
    | any
  children: ReactNode
  loading: boolean
  handlePaginationChange?: (page_index: number, page_size: number) => void
  onChange?: ((e: React.ChangeEvent<any>) => void | undefined) | undefined
  hasCheck?: boolean
  isCheckedAll?: boolean | undefined
  data?: Array<any> | undefined
  totalItems?: number | undefined
  className?: string
  classNameTable?: string | undefined
  showHashtag?: boolean
}

export interface IBreadcrumb {
  title: string
  link: string
}

export type Placement =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'top'
  | 'bottom'

export interface OtherColumn {
  index: string | number
  method: React.ReactNode
}

export interface TableColumn<T, O = OtherColumn> {
  title: React.ReactNode
  dataIndex: keyof T | keyof O
  key?: string | number
  width?: number | string
  render?: (value: any) => React.ReactNode
  fixed?: FixedType
}

export * from './course'
export * from './courses'
// export * from './exhibit'
export * from './Icon'
export * from './notification'
export * from './quiz'
export * from './test'
