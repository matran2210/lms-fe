import { IVideo } from '@lms/core'
import { SAPPRadio } from '@lms/ui'

type Props = {
  videos: IVideo[]
  currentVideoId: string
  onSelectVideo: (v: IVideo) => void
}

export default function VideoSelector({
  videos,
  currentVideoId,
  onSelectVideo,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
      {videos?.map((v, i) => (
        <label
          key={v?.file?.id ?? i}
          className="flex cursor-pointer select-none items-center gap-2"
        >
          <SAPPRadio
            onChange={() => onSelectVideo(v)}
            checked={v?.file?.id === currentVideoId}
            size={'small'}
          />
          <span
            className={`radio-item-label ${v?.file?.id === currentVideoId ? 'text-gray-800' : 'text-gray'}`}
          >
            Video {i + 1}
          </span>
        </label>
      ))}
    </div>
  )
}
