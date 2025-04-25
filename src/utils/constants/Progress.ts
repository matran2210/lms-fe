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
