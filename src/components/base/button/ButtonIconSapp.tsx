import { Button } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

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
  variant?: 'primary' | 'secondary'
  icon?: 'plus' | 'search'
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
  type,
  variant = 'primary',
  icon,
}: IButtonProps) => {
  const isPrimary = variant === 'primary'

  const btnClass = `relative text-center font-medium rounded-lg transition-all
    ${isPrimary ? 'bg-[#FFB400] hover:bg-[#E6A200] text-white' : 'bg-gray-200 text-black'}
    ${full ? 'w-full' : 'inline-flex'} items-center justify-center
    ${size === 'small' ? 'px-4 py-2 text-sm' : size === 'medium' ? 'px-5 py-2.5 text-base' : 'px-6 py-3 text-lg'}
    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`

  const IconComponent =
    icon === 'plus' ? (
      <PlusOutlined />
    ) : icon === 'search' ? (
      <SearchOutlined />
    ) : null

  if (link) {
    return (
      <a href={link} className={btnClass} aria-disabled={disabled}>
        {IconComponent} {title}
      </a>
    )
  }

  return (
    <Button
      type={isPrimary ? 'primary' : 'default'}
      className={btnClass}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      icon={IconComponent}
    >
      {title}
    </Button>
  )
}

export default ButtonIconSapp
