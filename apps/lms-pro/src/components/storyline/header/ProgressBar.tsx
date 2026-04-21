export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="h-[3px] w-full bg-[#D9D9D9]">
        <div
          className="h-[3px] rounded bg-success transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
