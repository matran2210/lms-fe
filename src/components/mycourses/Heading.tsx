import { truncateString } from '@utils/index'
import clsx from 'clsx'
import React from 'react'
import Tooltip from 'src/common/Tooltip'
import wavingHandAnimationIcon from 'public/animations/WavingHand.json'
import Lottie from 'lottie-react'
interface IProps {
  greeting: string
  title: string
  des?: string | React.ReactNode
  showShadow?: boolean
  className?: string
  showWavingHand?: boolean
}

const Heading = ({
  greeting,
  title,
  des,
  className,
  showShadow = true,
  showWavingHand = false,
}: IProps) => {
  return (
    <div
      className={clsx('w-full rounded-xl', className, {
        'shadow-medium': showShadow === true,
      })}
    >
      <div className="mb-1 text-xl font-medium md:text-[28px] lg:text-3xl">
        <div className="flex items-center gap-2">
          <h1 className="text-center text-gray-800 md:text-left">
            {greeting}
            <span className="ml-1.5 text-primary">
              <Tooltip title={title}>{truncateString(title, 80)}</Tooltip>
            </span>
          </h1>
          {showWavingHand && (
            <Lottie
              animationData={wavingHandAnimationIcon}
              loop={2}
              autoplay
              className={'before-icon inline-block h-10 w-10'}
            />
          )}
        </div>
      </div>
      {des && (
        <div className="hidden w-full md:flex">
          <div className="w-full text-sm text-gray-800">{des}</div>
        </div>
      )}
    </div>
  )
}

export default Heading
