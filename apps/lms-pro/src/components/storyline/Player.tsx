'use client'

import { useStoryline } from '@contexts/StorylineContext'
import { useStorylineSidebar } from '@contexts/StorylineSidebarContext'
import { scrollToY } from '@utils/helpers/storyline/scrollManager'
import { motion } from 'framer-motion'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import { StorylineAPI } from 'src/api/storyline'
import { IStoryline } from 'src/type/storyline'
import { StepRenderer } from './blocks/StepRenderer'
import ContinueButton from './ContinueButton'
import StoryHeader from './header/StoryHeader'
import Sidebar from './sidebar'
import StoryFooter from './footer/StoryFooter'
import { SappLoadingGlobal } from '@lms/ui'

interface IProps {
  listStorylineData: IStoryline | undefined
}
export default function Player({ listStorylineData }: IProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const class_id = searchParams.get('class_id')
  const params = useParams()
  const {
    stepRefs,
    currentStepIndex,
    currentStep,
    continueAction,
    visibleDocumentCount,
  } = useStoryline()
  const { setListStorylines } = useStorylineSidebar()

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
    setListStorylines(listStorylineData?.storyline?.items || [])
  }, [listStorylineData])

  if (!currentStep) return null

  const lastVisibleDocument = storylinyeDocument?.[visibleDocumentCount - 1]
  return (
    <SappLoadingGlobal loading={isLoading}>
      <div className="min-h-screen bg-white">
        <StoryHeader listStorylineData={listStorylineData} />

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
                onNewBlockMounted={(el) => {
                  const rect = el.getBoundingClientRect()
                  const targetY = rect.top + window.scrollY

                  scrollToY(targetY, {
                    offset: 100,
                    duration: 0.6,
                  })
                }}
              />
            </section>
            {visibleDocumentCount < (storylinyeDocument?.length ?? 0) &&
              lastVisibleDocument?.type !== 'QUIZ' && (
                <ContinueButton
                  onClick={() =>
                    continueAction(lastVisibleDocument?.id as string)
                  }
                />
              )}
          </motion.div>
        </main>

        {visibleDocumentCount === (storylinyeDocument?.length ?? 0) && (
          <StoryFooter
            onClick={() => continueAction(lastVisibleDocument?.id as string)}
          />
        )}
      </div>
    </SappLoadingGlobal>
  )
}
