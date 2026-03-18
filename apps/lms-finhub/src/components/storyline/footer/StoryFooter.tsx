import { useStory } from '@contexts/StorylineContext'
import { FlagIcon } from '@lms/assets'
import { ButtonPrimary } from '@lms/ui'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

const StoryFooter = ({ onClick }: { onClick: () => void }) => {
  const { hasNextBlock, hasNextStep } = useStory()
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const viewportHeight = window.innerHeight
      const totalHeight = document.documentElement.scrollHeight

      const reached90Percent = scrollTop + viewportHeight >= totalHeight * 0.9

      setIsVisible((prev) =>
        prev !== reached90Percent ? reached90Percent : prev,
      )
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Gọi khi mount

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <div
      className={clsx('flex w-full justify-center bg-[#D9D9D9] px-8 py-7', {
        hidden: !isVisible || !hasNextStep,
      })}
    >
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
