import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import LearningItem from '../modal/LearningItem'
import { useStory } from '@contexts/StorylineContext'
import { StoryStep } from 'src/type/storyline'
import { Divider } from 'antd'
import { CloseDetailIcon } from '@lms/assets'

export default function Sidebar() {
  const {
    maxVisibleBlockMap,
    stepRefs,
    showSidebar,
    setCurrentStepIndex,
    maxUnlockedStepIndex,
    steps,
    currentStep,
    setShowSidebar,
  } = useStory()
  const toggleSidebar = () => setShowSidebar(!showSidebar)

  const getStepProgress = (index: number) => {
    const total = steps[index].blocks.length
    const maxVisible = maxVisibleBlockMap[index]

    // Chưa reveal block nào
    if (maxVisible === undefined) return 0

    // Số block đã mở = maxVisible + 1
    const opened = Math.min(maxVisible + 1, total)

    return Math.round((opened / total) * 100)
  }

  return (
    <AnimatePresence mode="wait">
      {showSidebar && (
        <motion.aside
          key="sidebar"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-0 top-0 z-10 h-full w-80 bg-white p-6 shadow-md"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-lg font-semibold text-gray-800">
              Case Study — Applying the HR Value Chain at Telline | Strategic HR
              Metrics
            </div>
            <div className="cursor-pointer" onClick={toggleSidebar}>
              <CloseDetailIcon className="shrink-0 rotate-180" />
            </div>
          </div>
          <Divider className="my-4" />
          <div className="flex h-full flex-col gap-4 overflow-auto">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep.id
              const isUnlocked = index <= maxUnlockedStepIndex

              return (
                <div
                  key={step.id}
                  className={`transition-opacity ${!isUnlocked ? 'pointer-events-none opacity-40' : ''}`}
                >
                  <LearningItem
                    name={step.title ?? ''}
                    active={isActive}
                    progress={getStepProgress(index)}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (!isUnlocked) return

                      stepRefs.current[index]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      })
                      setCurrentStepIndex(index)
                    }}
                  />
                </div>
              )
            })}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
