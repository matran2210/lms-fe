import { formatTime, htmlToRaw } from '@components/common/timer'
import SappIcon from 'src/common/SappIcon'

type Props = {
  timeLine: any[]
  onGoTimeline: (time: number) => void
}

export default function VideoTimeline({ timeLine, onGoTimeline }: Props) {
  if (!timeLine?.length) return null

  return (
    <div className="group relative z-30 flex cursor-pointer select-none items-center">
      <span className="mr-2 text-bw-1 group-hover:text-primary">Timeline</span>
      <SappIcon
        className="fill-bw-1 group-hover:fill-primary"
        icon="course_video_timeline"
      />
      <div className="max-w-[100px]: absolute bottom-0 right-0 hidden w-[412px] translate-y-full animate-fade-in-overlay overflow-hidden rounded-lg border border-gray-17 bg-white py-4 shadow-search group-hover:block">
        <div className="flex h-full max-h-[412px] flex-1 snap-y flex-col gap-2 overflow-y-auto bg-white">
          {timeLine?.map((e, i) => (
            <div
              key={i}
              className="mx-4 grid grid-cols-[1.3fr,6fr] gap-3 p-2 text-sm leading-5.5 text-bw-15 hover:bg-gray-4"
              onClick={() => onGoTimeline(e?.time)}
            >
              <div className="mim-w-[62px] text-state-info">
                {formatTime(e?.time)}
              </div>
              <div className="text-inherit line-clamp-2 text-bw-1">
                {htmlToRaw(e?.text)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
