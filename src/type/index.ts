export interface IButtonProps {
  title: string
  onClick?: () => void
  className?: string
  link?: string
  disabled?: boolean
  loading?: boolean
  size?: 'small' | 'medium' | 'lager'
  full?: boolean
  name?: string
  type?: 'button' | 'reset' | 'submit'
  isPaddingHorizontal?: boolean
}

export interface ITabs {
  link: string
  title: string
}

export type IButtonCancelSubmitProps = {
  submit: IButtonProps
  cancel: IButtonProps
  className?: string
}
