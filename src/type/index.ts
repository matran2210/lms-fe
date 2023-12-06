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
export interface IButtonProps {
  title: string
  onClick?: (e: any) => void
  className?: string
  link?: string
  disabled?: boolean
  loading?: boolean
  size?: 'small' | 'medium' | 'lager'
  full?: boolean
  name?: string
  type?: 'button' | 'reset' | 'submit'
  isPadding?: boolean
  isPaddingHorizontal?: boolean
  color?: IButtonColors
  isUnderLine?: boolean
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
}
