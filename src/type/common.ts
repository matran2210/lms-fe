import { FixedType } from 'rc-table/lib/interface'

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
