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
  size?: IButtonSize
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
export type IButtonSize = 'small' | 'medium' | 'lager' | 'extra'
export type IButtonVariant = 'primary' | 'secondary' | 'custom'
export interface IButtonIconProps extends IButtonProps {
  variant?: IButtonVariant
  icon?: 'plus' | 'search' | 'arrow'
  position?: 'start' | 'end'
  iconColorProps?: string
}
export interface ITabs {
  link: string
  title: string
  disable?: boolean
}
export interface ITabsTeacher {
  id: number
  title: string
}
export type IButtonCancelSubmitProps = {
  submit: IButtonProps
  cancel: IButtonProps
  className?: string
  color?: IButtonColors
  colorCancel?: IButtonColors
  showOkButton?: boolean
  showCancelButton?: boolean
  size?: IButtonSize
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
export enum EDateTime {
  dateFormat = 'DD/MM/YYYY',
  weekFormat = 'MM/DD',
  monthFormat = 'MM/YYYY',
  fullDate = 'DD/MM/YYYY HH:mm',
  backendFormat = 'yyyy-MM-dd',
}
export * from './common'
export * from './courses'
// export * from './exhibit'
export * from './Icon'
export * from './notification'
export * from './quiz'
export * from './request'
export * from './test'
