import Tooltip from 'src/common/Tooltip'
import { IButtonProps } from 'src/type'

const SIZES = {
  small: 'text-[0.875rem] leading-4',
  medium: 'text-[1rem] leading-6',
  lager: 'text-lg leading-[27px]',
  extra: 'text-lg leading-[27px]',
}

const COLORS = {
  primary:
    'bg-black text-white rounded-lg hover:bg-[#404041] disabled:text-ink-300 disabled:bg-[#99A1B70D]',
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
    'bg-none text-[#050505] hover:text-[#A1A1A1] disabled:text-[#DCDDDD] underline-offset-2 underline font-medium',
  quizActivity:
    'bg-[#A1A1A1] hover:bg-[#DCDDDD] disabled:bg-[#DCDDDD] text-white',
  okPopup: 'bg-error text-white',
  cancelPopup: 'bg-[#F9F9F9] text-[#99A1B7]',
}

const PADDINGS = {
  small: 'px-4 py-2',
  medium: 'px-6 py-3',
  lager: 'px-9 py-2.8',
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
  type,
  color = 'primary',
  isUnderLine,
  isPadding = true,
  childClass = '',
  classNameLoading = '',
  showTooltip = false,
  toolTipTitle = '',
}: IButtonProps) => {
  let fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'
  let paddingClass = isPadding ? PADDINGS[size] : PADDINGS['none']
  let componentClass = `${className} relative text-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed font-medium box-border ${SIZES[size]} ${COLORS[color]} ${fullWidthClass} ${paddingClass}`

  isUnderLine = isUnderLine ?? color === 'text'
  componentClass += ` ${isUnderLine ? 'hover:underline' : ''}`

  if (link)
    return (
      <a href={link} className={componentClass} aria-disabled={disabled}></a>
    )
  return (
    <button
      className={`${componentClass} ${classNameLoading}`}
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
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
      ) : (
        <Tooltip title={toolTipTitle} showTooltip={showTooltip}>
          <span className={`${loading ? 'invisible' : ''} ${childClass}`}>
            {title}
          </span>
        </Tooltip>
      )}
    </button>
  )
}

export default SappButton
