const ButtonContent = ({
  icon,
  content,
}: {
  icon: JSX.Element
  content: string
}) => (
  <div className="flex items-center p-2">
    {icon}
    <div className="hidden text-sm font-normal lg:inline-block">{content}</div>
  </div>
)

export default ButtonContent
