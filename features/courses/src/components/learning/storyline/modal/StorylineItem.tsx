import clsx from 'clsx'
import { motion } from 'framer-motion'
import { ProgressIcon } from '@lms/assets'
import { Tooltip } from '@lms/ui'
import CircularProgress from '../header/CircularProgress'

const StorylineItem = ({
  name,
  progress,
  active = false,
  onClick,
  disabled = false,
  isShowProgress = false,
  className
}: {
  name: string
  progress: number
  active?: boolean
  onClick?: () => void
  disabled?: boolean
  isShowProgress?: boolean
  className?: string
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        'flex w-full cursor-pointer items-center justify-between rounded-xl p-3 transition-colors duration-200',
        active ? 'bg-primary-100' : '',
        disabled && 'cursor-not-allowed opacity-50',
        className,
        {
          'hover:bg-primary-100': !active && !disabled,
        })}
    >
      <div className="flex flex-1 items-center gap-2">
        {isShowProgress && (
          <div className="font-medium text-gray">
            {progress === 100 ? (
              <ProgressIcon />
            ) : (
              <CircularProgress progress={progress} />
            )}
          </div>
        )}
        <Tooltip title={name}>
          <div className="line-clamp-1 max-w-32 justify-start overflow-ellipsis text-base font-normal leading-6 text-gray-800">
            {name}
          </div>
        </Tooltip>
      </div>

      <div className="font-medium text-gray">
        {progress === 100 && !isShowProgress ? <ProgressIcon /> : `${progress}%`}
      </div>
    </motion.div>
  )
}

export default StorylineItem
