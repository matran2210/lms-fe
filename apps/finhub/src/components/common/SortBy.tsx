import { CollapseArrowIcon, EssentialIcon } from '@assets/icons'
import { ANIMATION } from 'src/constants'

const SortBy = ({ action }: { action: () => void }) => {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-3 py-2 outline outline-1 outline-offset-[-1px] outline-gray-300"
      onClick={action}
      data-aos={ANIMATION.DATA_AOS}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
          <EssentialIcon />
        </div>
        <div className="text-sm text-gray-400">Sort by...</div>
      </div>
      <div>
        <CollapseArrowIcon className="rotate-[270deg]" />
      </div>
    </div>
  )
}

export default SortBy
