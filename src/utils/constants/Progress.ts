import { DefaultOptionType } from 'antd/es/select'

export const OPTIONS_PROGRESS_CLASS: DefaultOptionType[] = [
  {
    label: 'Lớn hơn hoặc bằng 90%',
    value: 'gte_90',
  },
  {
    label: 'Nhỏ hơn 90%',
    value: 'lt_90',
  },
]

export enum PROGRAM {
  'ACCA' = 'ACCA',
  'CMA' = 'CMA',
  'CFA' = 'CFA',
  'CD' = 'Cert/Dip',
}
export enum CONSTRUCTION {
  'OFFLINE' = 'OFFLINE',
  'BLENDED' = 'BLENDED',
  'ONLINE' = 'ONLINE',
}
