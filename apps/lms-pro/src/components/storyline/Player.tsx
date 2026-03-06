'use client'

import { useStoryline } from '@contexts/StorylineContext'
import { IStoryline } from '@lms/core'
import { SappLoadingGlobal } from '@lms/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import CompleteStoryline from './blocks/CompleteStoryline'
import { StepRenderer } from './blocks/StepRenderer'
import ContinueButton from './ContinueButton'
import StoryFooter from './footer/StoryFooter'
import StoryHeader from './header/StoryHeader'
import Sidebar from './sidebar'

interface IProps {
  listStorylineData: IStoryline | undefined
}
export default function Player({ listStorylineData }: IProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const storylineItemsHasDocs = listStorylineData?.storyline?.items || []

  const {
    stepRefs,
    currentStepIndex,
    currentStep,
    continueAction,
    updateProgress,
    visibleDocumentCount,
    isCompletedProgress,
    storylineDocument,
  } = useStoryline()

  useEffect(() => {
    if (visibleDocumentCount > 1) return
    if (storylineDocument?.length === 0) return
    const firstDocument = storylineDocument?.[0]
    if (!firstDocument) return

    updateProgress(firstDocument?.id as string)
  }, [storylineDocument, visibleDocumentCount])

  if (!currentStep) return null

  const lastVisibleDocument = storylineDocument?.[visibleDocumentCount - 1]
  const currentVisibleDocument = storylineDocument?.[visibleDocumentCount]

  return (
    <SappLoadingGlobal loading={false}>
      <AnimatePresence mode="wait">
        {status !== 'Review' && isCompletedProgress === 101 ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <CompleteStoryline listStorylineData={listStorylineData} />
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-h-screen bg-white">
              <StoryHeader />

              <Sidebar listStorylineData={listStorylineData} />
              <main ref={containerRef} className="flex w-full flex-col pb-28">
                <div
                  // layout="position"
                  // transition={{
                  //   layout: {
                  //     type: 'spring',
                  //     stiffness: 72,
                  //     damping: 32,
                  //     mass: 1.15,
                  //     restDelta: 0.0008,
                  //   },
                  // }}
                  className="mx-auto flex w-full max-w-5xl flex-1 flex-col"
                >
                  <section
                    ref={(el) =>
                      (stepRefs.current[currentStepIndex] =
                        el as HTMLDivElement | null)
                    }
                    data-storyline-id={currentStep.id}
                  >
                    <h2 className="mb-8 mt-12 text-3xl font-semibold">
                      {currentStep.name}
                    </h2>

                    {/* Render blocks của step hiện tại */}

                    <StepRenderer
                      documents={
                        storylineDocument?.slice(0, visibleDocumentCount) ?? []
                      }
                      storylineDocument={storylineDocument}
                    />
                  </section>
                  {visibleDocumentCount < (storylineDocument?.length ?? 0) &&
                    lastVisibleDocument?.type !== 'QUIZ' &&
                    !!currentVisibleDocument && (
                      <ContinueButton
                        onClick={() =>
                          continueAction(
                            currentVisibleDocument?.id as string,
                            currentVisibleDocument?.type !== 'QUIZ',
                          )
                        }
                      />
                    )}
                </div>
              </main>

              {storylineDocument &&
                visibleDocumentCount >= (storylineDocument?.length ?? 0) &&
                ((status !== 'Review' &&
                  (currentStepIndex + 1 < storylineItemsHasDocs?.length ||
                    (currentStepIndex + 1 === storylineItemsHasDocs?.length &&
                      isCompletedProgress === 100))) || status === 'Review') && (
                  <StoryFooter
                    key={currentStepIndex}
                    listStorylineData={listStorylineData}
                    onClick={() =>
                      continueAction(
                        currentVisibleDocument?.id as string,
                        false,
                        isCompletedProgress === 100,
                      )
                    }
                  />
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SappLoadingGlobal>
  )
}
