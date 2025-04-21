import clsx from 'clsx'

interface SAPPLabelProps {
  title: string
  required?: boolean
  className?: string
}

const SAPPLabel = ({ title, required, className }: SAPPLabelProps) => {
  return (
    <label className={clsx('mb-2.5 block text-sm font-medium', className)}>
      <span className={clsx({ required })}>{title}</span>
    </label>
  )
}

export default SAPPLabel
