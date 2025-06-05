interface IProps {
  title: string
  percent?: number
}
const ClassProgress = ({ title, percent = 0 }: IProps) => {
  return (
    <div className="sm:w-72 flex w-48 flex-col items-center">
      <div className="mt-auto flex w-full justify-between">
        <span className="text-sm text-[#a1a1aa]">{title}</span>
        <span className="text-sm font-bold">{percent}%</span>
      </div>
      <div className="bg-gray-200 mb-3 h-1.5 w-full rounded">
        <div
          className="h-1.5 rounded bg-primary"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ClassProgress
