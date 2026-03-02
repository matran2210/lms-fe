export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div>
      <div className="h-1 w-full bg-[#D9D9D9]">
        <div
          className="h-1 rounded bg-success transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
