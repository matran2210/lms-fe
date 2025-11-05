import Link from 'next/link'
import Tooltip from 'src/common/Tooltip'
import { IButtonProps } from 'src/type'

const SIZES = {
  small: 'text-[0.875rem] leading-4',
  medium: 'text-[1rem] leading-6',
  large: 'text-lg leading-[27px]',
  extra: 'text-lg leading-[27px]',
}

const COLORS = {
  primary:
    'bg-black text-white rounded-lg hover:bg-[#404041] disabled:text-gray-300 disabled:bg-[#99A1B7]',
  info: 'bg-info hover:bg-info-2 disabled:bg-info-2 text-white',
  success: 'bg-success hover:bg-success-2 disabled:bg-success-2 text-white',
  secondary:
    'bg-[#F1F1F1] hover:bg-secondary-4 disabled:bg-secondary-4 text-[#050505]',
  danger: 'bg-[#D35563] hover:bg-[#dd4339] disabled:bg-[#dd4339] text-white',
  warning: 'bg-warning hover:bg-warning-2 disabled:bg-warning-2 text-white',
  light: 'bg-light hover:bg-light-2 disabled:bg-light-2 text-white',
  dark: 'bg-dark hover:bg-dark-2 disabled:bg-dark-2 text-white',
  white:
    'bg-white hover:bg-[#FFC83A] disabled:bg-white text-[#A1A1A1] hover:text-white',
  outline:
    'bg-white border-[#050505] hover:border-[#A1A1A1] hover:text-[#A1A1A1] text-[#050505]',
  text: 'bg-none text-[#050505] hover:text-[#A1A1A1] disabled:text-[#DCDDDD] underline-offset-2 font-medium',
  textUnderline:
    'bg-none text-bw-1 hover:text-gray-1 disabled:text-gray-2 underline-offset-2 underline font-medium',
  quizActivity: 'bg-gray-1 hover:bg-gray-2 disabled:bg-gray-2 text-white',
  okPopup: 'bg-accent-error text-white',
  cancelPopup: 'bg-gray-4 text-accent-default',
  'light-dark':
    'bg-secondary-600 hover:bg-secondary disabled:bg-gray-100 text-white',
  gray: 'bg-white hover:bg-primary-2 disabled:bg-white text-bw-15 hover:text-white',
}

const PADDINGS = {
  small: 'px-4 py-2',
  medium: 'px-6 py-3',
  large: 'px-9 py-2.8',
  extra: 'px-17.5 py-2.8',
  none: '',
}

const COLOR_LOADING = {
  primary: 'bg-white',
  info: 'bg-white',
  success: 'bg-white',
  secondary: 'bg-[#050505]',
  danger: 'bg-white',
  warning: 'bg-white',
  light: 'bg-white',
  dark: 'bg-white',
  white: 'bg-[#A1A1A1]',
  outline: 'bg-[#A1A1A1]',
  text: 'bg-none',
  textUnderline: 'bg-none',
  quizActivity: 'bg-white',
  okPopup: 'bg-white',
  cancelPopup: 'bg-white',
  gray: 'bg-transparent',
  'light-dark': 'bg-white',
}

const SappButton = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  disabled = false,
  loading = false,
  type = 'button',
  color = 'primary',
  isUnderLine,
  isPadding = true,
  childClass = '',
  classNameLoading = '',
  showTooltip = false,
  toolTipTitle = '',
}: IButtonProps) => {
  // const isDisabled = disabled || loading
  const isDisabled = disabled
  const paddingClass = isPadding ? PADDINGS[size] : PADDINGS.none
  const fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'

  const underlineClass =
    isUnderLine !== undefined
      ? isUnderLine
        ? 'hover:underline'
        : ''
      : color === 'text'
        ? 'hover:underline'
        : ''

  const componentClass = `
    ${className}
    ${COLORS[color]}
    ${SIZES[size]}
    ${paddingClass}
    ${fullWidthClass}
    ${underlineClass}
    relative text-center font-medium
    ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
  `.trim()

  const loadingIndicator = (
    <div className={`flex items-center justify-center ${classNameLoading}`}>
      <span className="sr-only">Loading...</span>
      <div
        className={`h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s] ${COLOR_LOADING[color]}`}
      ></div>
      <div
        className={`h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s] ${COLOR_LOADING[color]}`}
      ></div>
      <div
        className={`h-2 w-2 animate-bounce rounded-full ${COLOR_LOADING[color]}`}
      ></div>
    </div>
  )

  const buttonContent = (
    <Tooltip title={toolTipTitle} showTooltip={showTooltip}>
      <span className={`${loading ? 'invisible' : ''} ${childClass}`}>
        {title}
      </span>
    </Tooltip>
  )

  // Use Next.js Link for better routing
  if (link) {
    return (
      <Link href={link} className={componentClass} aria-disabled={isDisabled}>
        {loading ? loadingIndicator : buttonContent}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={`${componentClass} ${classNameLoading}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {loading ? loadingIndicator : buttonContent}
    </button>
  )
}

export default SappButton
