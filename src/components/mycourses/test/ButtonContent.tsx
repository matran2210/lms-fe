const ButtonContent = ({
  icon,
  content,
}: {
  icon: JSX.Element
  content: string
}) => (
  <div className="flex items-center gap-3 border-l px-4 3xl:pe-6 3xl:ps-6 ">
    {icon}
    <div className="hidden text-sm font-normal lg:inline-block">{content}</div>
  </div>
)

export default ButtonContent
