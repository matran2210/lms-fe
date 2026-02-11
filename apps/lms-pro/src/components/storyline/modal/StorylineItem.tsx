import clsx from 'clsx'
import { motion } from 'framer-motion'
import CircularProgress from '../header/CircularProgress'
import { ProgressIcon } from '@lms/assets'
import { Tooltip } from '@lms/ui'

const StorylineItem = ({
  name,
  progress,
  active = false,
  onClick,
  disabled = false,
  isShowProgress = false,
}: {
  name: string
  progress: number
  active?: boolean
  onClick?: () => void
  disabled?: boolean
  isShowProgress?: boolean
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        'flex w-full cursor-pointer items-center justify-between rounded-xl p-3 transition-colors',
        active ? 'bg-[#FFF1CC]' : '',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <div className="flex items-center gap-2">
        <div className="font-medium text-gray">
          {progress === 100 ? (
            <ProgressIcon />
          ) : (
            <CircularProgress progress={progress} />
          )}
        </div>
        <Tooltip title={name}>
          <div className="line-clamp-1 max-w-[160px] justify-start overflow-ellipsis text-base font-normal leading-6 text-gray-800">
            {name}
          </div>
        </Tooltip>
      </div>

      <div className="font-medium text-gray">
        {progress === 100 ? (
          <ProgressIcon />
        ) : isShowProgress ? (
          <CircularProgress progress={progress} />
        ) : (
          `${progress}%`
        )}
      </div>
    </motion.div>
  )
}

export default StorylineItem
