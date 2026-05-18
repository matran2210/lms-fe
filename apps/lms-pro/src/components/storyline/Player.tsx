'use client'


import { useStoryline } from '@contexts/StorylineContext'
import { useStorylineSidebar } from '@contexts/StorylineSidebarContext'
import { IStoryline } from '@lms/core'
import { SappLoadingGlobal } from '@lms/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
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
  const [openCongratScreen, setOpenCongratScreen] = useState(false)

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
  const { showSidebar } = useStorylineSidebar()

  // Prevent body scroll and horizontal overflow when sidebar is open on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const isTabletOrMobile = window.innerWidth < 1024
    if (isTabletOrMobile && showSidebar) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [showSidebar])


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
  const isFinished = isCompletedProgress >= 100 &&
    currentStepIndex + 1 === storylineItemsHasDocs.length

  return (
    <SappLoadingGlobal loading={false}>
      <AnimatePresence mode="wait">
        {/*  */}
        {openCongratScreen ? (
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
            <div className={clsx("min-h-screen bg-white", {
              "overflow-x-hidden": showSidebar && typeof window !== 'undefined' && window.innerWidth < 1024
            })}>
              <StoryHeader />

              <Sidebar listStorylineData={listStorylineData} />
              <main ref={containerRef} className="flex w-full pb-28">
                <motion.div
                  key="content"
                  initial={{ x: 240 }}
                  animate={{ x: showSidebar ? 150 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  exit={{ x: -240 }}
                  className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 md:px-8 lg:px-0"
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
                    !["QUIZ", "INTERACTION"].includes(lastVisibleDocument?.type as string) &&
                    !!currentVisibleDocument && (
                      <ContinueButton
                        onClick={() => {
                          continueAction(
                            currentVisibleDocument?.id as string,
                            !["QUIZ", "INTERACTION", "VIDEO"].includes(currentVisibleDocument?.type as string)
                          )
                        }}
                      />
                    )}
                </motion.div>
              </main>


              {storylineDocument &&
                visibleDocumentCount >= (storylineDocument?.length ?? 0) &&
                ((status !== 'Review' &&
                  currentStepIndex + 1 <= storylineItemsHasDocs?.length) ||
                  status === 'Review') && (
                  <StoryFooter
                    key={currentStepIndex}
                    storylineItemsHasDocs={storylineItemsHasDocs}
                    onClick={() => {
                      if (isFinished) {
                        setOpenCongratScreen(true)
                      } else {
                        continueAction(
                          currentVisibleDocument?.id as string,
                          false,
                        )
                      }
                    }
                    }
                    isFinished={isFinished}
                  />
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SappLoadingGlobal>
  )
}
