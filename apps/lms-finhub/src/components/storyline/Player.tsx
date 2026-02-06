'use client'

import { useStory } from '@contexts/StorylineContext'
import { StepRenderer } from './blocks/StepRenderer'
import { useEffect, useRef } from 'react'
import Sidebar from './sidebar'
import StoryHeader from './header/StoryHeader'
import StoryFooter from './footer/StoryFooter'
import { Select } from '@lms/ui'
import { SelectArrow } from '@components/courses/icons'
import clsx from 'clsx'

export default function Player() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const {
    steps,
    stepRefs,
    currentStepIndex,
    hasNextStep,
    visibleBlocks,
    continueAction,
    goToBlockSmart,
    maxVisibleBlockMap,
    currentStep,
  } = useStory()

  useEffect(() => {
    const el = stepRefs.current[currentStepIndex]
    if (!el) return

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [currentStepIndex])

  return (
    <div>
      <StoryHeader steps={steps} currentStepId={currentStep.id} />

      <main ref={containerRef} className="relative flex w-full pl-8 pt-3">
        <Sidebar />

        <div className="mx-auto flex min-h-screen max-w-4xl flex-1 flex-col">
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
        </div>
      </main>

      <StoryFooter onClick={continueAction} />
    </div>
  )
}
