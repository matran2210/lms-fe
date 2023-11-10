interface Props {
  className?: string
  active?: boolean
  disabled?: boolean
  children?: any
  onClick?: () => void
}

const PageLink = ({
  className,
  active,
  disabled,
  children,
  ...otherProps
}: Props) => {
  if (disabled) {
    return <li className={`${className}`}>{children}</li>
  }

  return (
    <li
      className={`min-w-default min-h-default cursor-pointer border flex items-center justify-center text-sm leading-8.5 font-normal ${className} ${
        active
          ? 'bg-primary text-white border-active'
          : 'text-gray-1 border-gray-1'
      }`}
      aria-current={active ? 'page' : undefined}
      {...otherProps}
    >
      {children}
    </li>
  )
}

export default PageLink
