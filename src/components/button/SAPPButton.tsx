import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string
  className?: string
  suffixIcon?: React.ReactNode
}

const SAPPButton = ({ title, className, suffixIcon, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(
        'flex items-center gap-2 rounded-md border !border-shade-secondary bg-white px-4 py-2 text-sm font-semibold text-shade-secondary',
        className
      )}
      {...props}
    >
      <span className="flex-1">{title}</span>
      {suffixIcon}
    </button>
  )
}

export default SAPPButton
