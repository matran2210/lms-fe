interface IProps {
  title: string
  percent?: number
}
const ClassProgress = ({ title, percent = 0 }: IProps) => {
  return (
    <div className="flex w-48 flex-col items-center sm:w-72">
      <div className="mt-auto flex w-full justify-between">
        <span className="text-sm text-gray-400">{title}</span>
        <span className="text-sm font-bold">{percent.toFixed(2)}%</span>
      </div>
      <div className="mb-3 h-[6px] w-full rounded bg-[#e5e7eb]">
        <div
          className="h-[6px] rounded bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ClassProgress
