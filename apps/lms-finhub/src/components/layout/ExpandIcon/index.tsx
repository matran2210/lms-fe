import LogoDefault from './LogoDefault'
import LogoFull from './LogoFull'

type ExpandIconPros = {
  isExpanded?: boolean
  handleClick?: () => void | undefined
  type: string
  className?: string
}

export default function ExpandIcon({ type, className }: ExpandIconPros) {
  return (
    <>
      {type === 'logo-default' && <LogoDefault className={`${className}`} />}
      {type === 'logo-full' && <LogoFull className={`${className}`} />}
    </>
  )
}
