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
}

export interface ITabs {
  link: string
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

export interface ICert {
  user_id: string
  payload: {
    content: string
    created_at: Date
    id: string
    title: string
    certificate_id: string
  }
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

export * from './course'
export * from './courses'
export * from './exhibit'
export * from './notification'
export * from './quiz'
export interface ISVG {
  width?: number
  height?: number
  className?: string
}
