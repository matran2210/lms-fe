interface IProps {
  total: number
  className?: string
}

const TotalResullt = ({ total, className = '' }: IProps) => {
  return (
    <div
      className={`border-r border-[#A1A1A1] pr-6 font-normal text-[#A1A1A1] ${className}`}
    >
      {`${total} ${total > 1 ? 'Results' : 'Result'}`}
    </div>
  )
}

export default TotalResullt
