'use client'

import { SelectArrow } from '@components/courses/icons'
import { useStory } from '@contexts/StorylineContext'
import { ButtonPrimary, Select } from '@lms/ui'
import { scrollToYFramer } from '@utils/helpers/storyline/engine'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { StepRenderer } from './blocks/StepRenderer'
import StoryFooter from './footer/StoryFooter'
import StoryHeader from './header/StoryHeader'
import Sidebar from './sidebar'
import ContinueButton from './ContinueButton'
import {
  lockScroll,
  scrollToY,
  unlockScroll,
} from '@utils/helpers/storyline/scrollManager'

export default function Player() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const {
    steps,
    stepRefs,
    currentStepIndex,
    hasNextBlock,
    visibleBlocks,
    continueAction,
    goToBlockSmart,
    maxVisibleBlockMap,
    currentStep,
    showSidebar,
  } = useStory()

  const prevStepRef = useRef(currentStepIndex)

  useEffect(() => {
    if (prevStepRef.current === currentStepIndex) return
    prevStepRef.current = currentStepIndex

    const el = stepRefs.current[currentStepIndex]
    if (!el) return

    lockScroll()

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const y = el.getBoundingClientRect().top + window.scrollY
        scrollToY(y, { duration: 0.6, offset: 0 })
        unlockScroll()
      })
    })
  }, [currentStepIndex])

  return (
    <div>
      <StoryHeader steps={steps} currentStepId={currentStep.id} />

      <Sidebar />
      <main ref={containerRef} className="flex w-full flex-col">
        <motion.div
          layout
          animate={{
            paddingLeft: showSidebar ? 320 : 0,
          }}
          transition={{
            duration: 0.25,
            ease: 'easeOut',
          }}
          className="mx-auto flex min-h-screen w-full max-w-5xl flex-1 flex-col"
        >
          {steps.map((step, stepIndex) => {
            const isActive = stepIndex === currentStepIndex

            return (
              <section
                key={step.id}
                ref={(el) => {
                  stepRefs.current[stepIndex] = el as HTMLDivElement | null
                }}
                data-step-index={stepIndex}
                className={clsx(
                  'transition-opacity duration-300',
                  isActive ? 'opacity-100' : 'opacity-60',
                )}
              >
                {isActive && (
                  <>
                    <div className="pt-16">
                      <Select
                        className="custom-select-v2 h-8 rounded-full bg-[#EEEEEE] p-[10px]"
                        variant="borderless"
                        value={visibleBlocks.length - 1}
                        options={step.blocks.map((_, index) => {
                          const max = maxVisibleBlockMap[stepIndex] ?? 0
                          return {
                            label: `Module ${index + 1} of ${step.blocks.length}`,
                            value: index,
                            disabled: index > max + 1,
                          }
                        })}
                        suffixIcon={<SelectArrow />}
                        onChange={(value) => goToBlockSmart(value)}
                      />
                    </div>

                    <div className="py-8">
                      <h2 className="text-3xl font-semibold text-secondary-600">
                        {step.title}
                      </h2>
                    </div>
                  </>
                )}

                <StepRenderer
                  stepIndex={stepIndex}
                  visibleBlocks={isActive ? visibleBlocks : []}
                />
              </section>
            )
          })}
        </motion.div>
        <ContinueButton onClick={continueAction} />
      </main>

      <StoryFooter onClick={continueAction} />
    </div>
  )
}
