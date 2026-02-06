'use client'

import { useStory } from '@contexts/StorylineContext'
import clsx from 'clsx'

export default function ContinueButton({ onClick }: { onClick: () => void }) {
  const { hasNextStep, currentStepIndex } = useStory()
  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={onClick}
        className={clsx(
          'bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800',
          {
            'w-full': hasNextStep,
            'rounded-full': !hasNextStep,
          },
        )}
      >
        {hasNextStep ? `Module ${currentStepIndex + 1}` : 'Continue'}
      </button>
    </div>
  )
}
