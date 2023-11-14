export interface IButtonProps {
  title: string
  onClick?: () => void
  className?: string
  link?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'lager'
  full?: boolean
  name?: string
  type?: 'button' | 'reset' | 'submit'
}
