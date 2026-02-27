'use client'

import { useStoryline } from '@contexts/StorylineContext'
import { scrollToY } from '@utils/helpers/storyline/scrollManager'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import { StorylineAPI } from 'src/api/storyline'
import { IStoryline } from '@lms/core'
import { StepRenderer } from './blocks/StepRenderer'
import ContinueButton from './ContinueButton'
import StoryHeader from './header/StoryHeader'
import Sidebar from './sidebar'
import StoryFooter from './footer/StoryFooter'
import { SappLoadingGlobal } from '@lms/ui'
import CompleteStoryline from './blocks/CompleteStoryline'

interface IProps {
  listStorylineData: IStoryline | undefined
}
export default function Player({ listStorylineData }: IProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const class_id = searchParams.get('class_id')
  const status = searchParams.get('status')
  const params = useParams()
  const storylineItemsHasDocs = listStorylineData?.storyline?.items || []

  const {
    stepRefs,
    currentStepIndex,
    currentStep,
    continueAction,
    updateProgress,
    visibleDocumentCount,
    isCompletedProgress,
  } = useStoryline()

  const useGetStorylineDocument = (queryKey: string) => {
    const fetchData = async () => {
      const { data } = await StorylineAPI.getStorylineDocument({
        class_id: class_id as string,
        item_id: currentStep?.id as string,
      })
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled: class_id !== undefined && currentStep?.id !== undefined,
      retry: false,
    })
  }

  const { data: storylinyeDocument, isLoading } = useGetStorylineDocument(
    `storyline-document-${currentStep?.id}`,
  )
  useEffect(() => {
    if (visibleDocumentCount > 1) return
    if (storylinyeDocument?.length === 0) return
    const firstDocument = storylinyeDocument?.[0]
    if (!firstDocument) return

    updateProgress(firstDocument?.id as string)
  }, [storylinyeDocument])

  if (!currentStep) return null

  const lastVisibleDocument = storylinyeDocument?.[visibleDocumentCount - 1]
  const currentVisibleDocument = storylinyeDocument?.[visibleDocumentCount]

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
                <motion.div
                  layout="position"
                  transition={{
                    layout: {
                      type: 'spring',
                      stiffness: 72,
                      damping: 32,
                      mass: 1.15,
                      restDelta: 0.0008,
                    },
                  }}
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
                        storylinyeDocument?.slice(0, visibleDocumentCount) ?? []
                      }
                      storylinyeDocument={storylinyeDocument}
                      onNewBlockMounted={(el) => {
                        const rect = el.getBoundingClientRect()
                        const targetY = rect.top + window.scrollY

                        scrollToY(targetY, {
                          offset: 100,
                          duration: 0.3,
                        })
                      }}
                    />
                  </section>
                  {visibleDocumentCount < (storylinyeDocument?.length ?? 0) &&
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
                </motion.div>
              </main>

              {storylinyeDocument &&
                visibleDocumentCount >= (storylinyeDocument?.length ?? 0) &&
                ((status !== 'Review' &&
                  (currentStepIndex + 1 < storylineItemsHasDocs?.length ||
                    (currentStepIndex + 1 === storylineItemsHasDocs?.length &&
                      isCompletedProgress === 100))) ||
                  (status === 'Review' &&
                    currentStepIndex + 1 < storylineItemsHasDocs?.length)) && (
                  <StoryFooter
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
