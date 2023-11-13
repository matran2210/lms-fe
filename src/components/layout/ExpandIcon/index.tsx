type ExpandIconPros = {
  isExpanded?: boolean
  handleClick?: () => void | undefined
  type: string
}

export default function ExpandIcon({
  isExpanded,
  handleClick,
  type,
}: ExpandIconPros) {
  return (
    <>
      {isExpanded && type === 'ontoggle' ? (
        <div onClick={handleClick}>show</div>
      ) : (
        <div onClick={handleClick}>hidden</div>
      )}
      {type === 'logo-default' && <div>Logo default</div>}
    </>
  )
}
