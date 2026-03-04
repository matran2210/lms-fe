import React from 'react'
import ProgressBar from './ProgressBar'
import { StoryStep } from 'src/type/storyline'
import { HamburgerMenuLargeIcon } from '@assets/icons'
import { CloseModalIcon } from '@lms/assets'
import { useStory } from '@contexts/StorylineContext'
import clsx from 'clsx'

interface Props {
  steps: StoryStep[]
  currentStepId: string
}
const StoryHeader = ({ steps, currentStepId }: Props) => {
  const { showSidebar, setShowSidebar } = useStory()
  const toggleSidebar = () => setShowSidebar(!showSidebar)
  return (
    <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-white px-8 py-4 shadow-md">
      <div
        className={clsx(
          'flex  cursor-pointer items-center justify-start gap-2.5 rounded-lg p-2 transition-all duration-300',
          {
            'bg-inherit': !showSidebar,
            'bg-neutral-200': showSidebar,
          },
        )}
        onClick={toggleSidebar}
      >
        <HamburgerMenuLargeIcon />
      </div>
      <div>
        <ProgressBar steps={steps} currentStepId={currentStepId} />
      </div>
      <div className="flex items-center justify-start gap-2.5 rounded-lg bg-[#E5E7EB] p-2">
        <CloseModalIcon />
      </div>
    </div>
  )
}

export default StoryHeader
