import { useStory } from '@contexts/StorylineContext'
import { FlagIcon } from '@lms/assets'
import { ButtonPrimary } from '@lms/ui'
import clsx from 'clsx'
import React from 'react'

const StoryFooter = ({ onClick }: { onClick: () => void }) => {
  const { hasNextBlock, hasNextStep } = useStory()
  return (
    <div className="flex w-full justify-center bg-[#D9D9D9] px-8 py-7">
      <div className="w-80"></div>
      <div
        className={clsx('mx-auto flex w-full max-w-4xl items-center', {
          'justify-between': hasNextStep,
          'justify-end': !hasNextStep,
        })}
      >
        {hasNextStep && (
          <div className="justify-start text-base font-semibold leading-6 text-gray-800">
            You have finished this section!
          </div>
        )}
        <div className="flex items-center justify-start gap-3">
          <div className="flex items-center justify-center gap-2 overflow-hidden rounded-lg">
            <div className="justify-center text-center text-base font-semibold leading-6 text-gray-800">
              Keep Learning
            </div>
          </div>
          <ButtonPrimary onClick={onClick}>
            {hasNextBlock ? 'Continue' : 'Next Section'}
          </ButtonPrimary>
          <FlagIcon />
        </div>
      </div>
    </div>
  )
}

export default StoryFooter
