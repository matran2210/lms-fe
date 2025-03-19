interface IProps {
  title: string
  percent?: any
}
const ClassProgress = ({ title, percent }: IProps) => {
  return (
    <div className="my-3 flex w-48 flex-col items-center sm:w-72">
      <div className="mt-auto flex w-full justify-between">
        <span className="text-sm text-gray-400">{title}</span>
        <span className="text-sm font-bold">{percent}%</span>
      </div>
      <div className="mb-3 h-1.5 w-full rounded bg-gray-200">
        <div
          className="h-1.5 rounded bg-primary"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ClassProgress
