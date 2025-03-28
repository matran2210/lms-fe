import {
  PlusOutlined,
  SearchOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'

interface IButtonProps {
  title: string
  onClick?: () => void
  className?: string
  link?: string
  size?: 'small' | 'medium' | 'large'
  full?: boolean
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'custom'
  icon?: 'plus' | 'search' | 'arrow'
  position?: 'start' | 'end'
}

const ButtonIconSapp = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary',
  icon,
  position,
}: IButtonProps) => {
  const isPrimary = variant === 'primary'
  const isSecondary = variant === 'secondary'

  const btnClass = `
    relative text-center font-medium rounded-lg transition-all flex items-center justify-center h-10
    ${isPrimary ? 'bg-[#FFB400] text-white hover:bg-[#E6A200] hover:text-white' : ''}
    ${isSecondary ? 'bg-white text-[#374151] hover:bg-[#E6A200] hover:text-white' : ''}
    ${full ? 'w-full' : 'inline-flex'} 
    ${size === 'small' ? 'px-4 py-2 text-sm' : size === 'medium' ? 'px-5 py-2.5 text-base' : 'px-6 py-3 text-lg'}
    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    ${className}
  `

  const IconComponent =
    icon === 'plus' ? (
      <PlusOutlined />
    ) : icon === 'search' ? (
      <SearchOutlined />
    ) : icon === 'arrow' ? (
      <ArrowRightOutlined />
    ) : null

  if (link) {
    return (
      <a href={link} className={btnClass} aria-disabled={disabled}>
        {position === 'start' && IconComponent}
        {title}
        {position === 'end' && IconComponent}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={btnClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {position === 'start' && IconComponent}
      <span className="mx-2">{title}</span>
      {position === 'end' && IconComponent}
    </button>
  )
}

export default ButtonIconSapp
