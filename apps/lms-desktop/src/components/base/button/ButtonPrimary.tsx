import { IButtonProps } from 'src/type'

const ButtonPrimary = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  disabled = false,
  loading = false,
  type,
}: IButtonProps) => {
  let textSizeClass =
    size === 'small'
      ? 'text-[0.875rem] leading-4'
      : size === 'medium'
        ? 'text-[1rem] leading-6'
        : 'text-lg leading-6.5'
  let paddingVerticalClass =
    size === 'small' ? 'py-2' : size === 'medium' ? 'py-2' : 'py-2.8'
  let paddingHorizontalClass =
    size === 'small' ? 'px-7' : size === 'medium' ? 'px-8' : 'px-9'
  let fullWidthClass = full ? 'block w-full' : 'inline-block'
  let disabledClass =
    disabled || loading
      ? 'cursor-not-allowed opacity-60 bg-primary-2'
      : 'cursor-pointer'
  let componentClass = `${className} relative text-center text-white ${fullWidthClass} ${paddingVerticalClass} ${paddingHorizontalClass} ${disabledClass} ${textSizeClass} font-medium bg-primary hover:bg-primary-2`
  if (link)
    return (
      <a href={link} className={componentClass} aria-disabled={disabled}>
        {title}
      </a>
    )
  return (
    <button
      className={componentClass}
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span className={loading ? 'invisible' : ''}> {title}</span>
      {loading && (
        <div className="w-100 h-100 absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center space-x-2 bg-none dark:invert">
          <span className="sr-only">Loading...</span>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
        </div>
      )}
    </button>
  )
}

export default ButtonPrimary
