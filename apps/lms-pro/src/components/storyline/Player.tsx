'use client'

import { useStoryline } from '@contexts/StorylineContext'
import { useStorylineSidebar } from '@contexts/StorylineSidebarContext'
import {
  scrollToY,
  scrollWithBounce,
} from '@utils/helpers/storyline/scrollManager'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { IStoryline } from 'src/type/storyline'
import { StepRenderer } from './blocks/StepRenderer'
import ContinueButton from './ContinueButton'
import StoryFooter from './footer/StoryFooter'
import StoryHeader from './header/StoryHeader'
import Sidebar from './sidebar'
import { StorylineAPI } from 'src/api/storyline'
import { useQuery } from 'react-query'

interface IProps {
  listStorylineData: IStoryline | undefined
}
export default function Player({ listStorylineData }: IProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const storylineItemId = searchParams.get('storylineItemId')
  const class_id = searchParams.get('class_id')
  const params = useParams()
  const { section_storyline_id } = params
  const {
    steps,
    stepRefs,
    currentStepIndex,
    currentStep,
    continueAction,
    visibleDocumentCount,
  } = useStoryline()
  const { showSidebar } = useStorylineSidebar()
  const lastScrollRef = useRef<number | null>(null)
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

  const { data: storylinyeDocument } = useGetStorylineDocument(
    `storyline-document-${currentStep?.id}`,
  )

  useEffect(() => {
    if (lastScrollRef.current === currentStepIndex) return
    lastScrollRef.current = currentStepIndex

    const el = stepRefs.current[currentStepIndex]
    if (!el) return

    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const y = rect.top + window.scrollY

      scrollWithBounce(y, { duration: 1.5, offset: 100, bounce: 10 })
    })
  }, [currentStepIndex])

  if (!currentStep) return null

  return (
    <div>
      <StoryHeader listStorylineData={listStorylineData} />

      <Sidebar listStorylineData={listStorylineData} />
      <main
        ref={containerRef}
        className="flex w-full flex-col"
        style={{ overflowAnchor: 'none' }}
      >
        <motion.div
          layout
          initial={{ paddingLeft: 0 }}
          animate={
            showSidebar
              ? {
                  paddingLeft: 320,
                }
              : {}
          }
          transition={{
            layout: {
              duration: 0.3,
              ease: 'easeOut',
            },
            duration: 0.3,
            ease: 'easeOut',
          }}
          className="mx-auto flex w-full max-w-5xl flex-1 flex-col"
        >
          <section
            ref={(el) =>
              (stepRefs.current[currentStepIndex] = el as HTMLDivElement | null)
            }
            data-storyline-id={currentStep.id}
          >
            <h2 className="mb-8 text-3xl font-semibold">{currentStep.name}</h2>

            {/* Render blocks của step hiện tại */}
            <StepRenderer
              key={currentStep?.id}
              documents={
                storylinyeDocument?.slice(0, visibleDocumentCount) ?? []
              }
            />
          </section>
        </motion.div>
        <ContinueButton
          onClick={() =>
            continueAction(
              storylinyeDocument?.[visibleDocumentCount - 1]?.id as string,
            )
          }
        />
      </main>

      {/* <StoryFooter onClick={() => continueAction(storylinyeDocument?.[visibleDocumentCount]?.id as string)} /> */}
    </div>
  )
}
