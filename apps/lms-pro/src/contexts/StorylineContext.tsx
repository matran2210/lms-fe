'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CoursesAPI } from 'src/api/courses'
import {
  IStoryline,
  IStorylineItem,
  IStorylineProgressResponse,
} from '@lms/core'
import { useStorylineSidebar } from './StorylineSidebarContext'

interface StorylineContextValue {
  currentStepIndex: number
  currentStep: IStorylineItem | null
  stepRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  /** document control */
  visibleDocumentCount: number
  setVisibleDocumentCount: React.Dispatch<React.SetStateAction<number>>
  continueAction: (storyline_item_document_id: string) => void
  isCompleted: boolean
}

export const StorylineContext = createContext<StorylineContextValue | null>(
  null,
)

export function useStoryline() {
  const ctx = useContext(StorylineContext)
  if (!ctx) throw new Error('useStory must be used inside StoryProvider')
  return ctx
}

interface Props {
  storylineData: IStoryline | undefined
  children: React.ReactNode
}

export function StorylineProvider({ storylineData, children }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setListStorylines, setLearningProgress, listStorylines } =
    useStorylineSidebar()

  const storylineItemId = searchParams.get('storylineItemId')
  const class_id = searchParams.get('class_id')
  const course_section_id = searchParams.get('course_section_id')
  const status = searchParams.get('status')
  const params = useParams()
  const { section_storyline_id } = params

  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [visibleDocumentCount, setVisibleDocumentCount] = useState(1)
  const [isCompleted, setIsCompleted] = useState(
    storylineData
      ? storylineData?.learning_progress?.total_course_sections_completed ===
      storylineData?.learning_progress?.total_course_sections
      : false,
  )
  const storylineItemsHasDocs = storylineData?.storyline?.items || []
  const steps: IStorylineItem[] = useMemo(() => {
    if (!listStorylines) return []

    return [...listStorylines].sort((a, b) => a.position - b.position)
  }, [listStorylines])
  /* ----------------------------- */
  /* ID → INDEX MAP                */
  /* ----------------------------- */
  const stepIdToIndexMap = useMemo(() => {
    const map: Record<string, number> = {}
    steps.forEach((step, index) => {
      map[step.id] = index
    })
    return map
  }, [steps])

  useEffect(() => {
    setListStorylines(storylineItemsHasDocs)
    setLearningProgress(
      storylineData?.learning_progress || {
        total_course_sections: 1,
        total_course_sections_completed: 0,
        time_spent: 0,
        duration: 0,
      },
    )
  }, [storylineData])
  /* ----------------------------- */
  /* SYNC URL → CURRENT STEP       */
  /* ----------------------------- */
  useEffect(() => {
    if (!storylineItemId) return
    if (!steps.length) return

    const index = stepIdToIndexMap[storylineItemId]
    if (index === undefined) return

    setCurrentStepIndex(index)
  }, [storylineItemId, stepIdToIndexMap, steps.length])

  const currentStep = steps[currentStepIndex] ?? null
  useEffect(() => {
    if (!currentStep) return

    const completed = currentStep.item_progress?.total_document_completed ?? 0
    setVisibleDocumentCount(completed + 1)
  }, [currentStep?.id])

  const continueAction = async (storyline_item_document_id: string) => {
    if (!currentStep) return

    const totalDocs = currentStep.total_document
    // Reveal document
    if (storyline_item_document_id && status !== 'Review') {
      const res = await CoursesAPI.learningOutcomeProgress(
        class_id as string,
        section_storyline_id as string,
        {
          storyline_item_document_id,
        },
      )
      const progressRes: IStorylineProgressResponse = res.data
      const storylineItemsHasDocs =
        progressRes?.storyline_section?.storyline.items || []
      setIsCompleted(
        progressRes?.storyline_section.learning_progress
          .total_course_sections_completed ===
        progressRes?.storyline_section.learning_progress
          .total_course_sections,
      )
      setListStorylines(storylineItemsHasDocs)
      setLearningProgress(progressRes?.storyline_section.learning_progress)
    }
    if (visibleDocumentCount < totalDocs) {
      setVisibleDocumentCount((prev) => {
        const nextCount = prev + 1
        return nextCount
      })
      return
    }

    // Next step
    const nextIndex = currentStepIndex + 1
    const next = steps[nextIndex]
    if (!next) return

    router.replace(
      `?class_id=${class_id}&course_section_id=${course_section_id}&storylineItemId=${next.id}&status=${status}`,
      {
        scroll: false,
      },
    )
  }
  return (
    <StorylineContext.Provider
      value={{
        currentStepIndex,
        currentStep,
        stepRefs,
        visibleDocumentCount,
        setVisibleDocumentCount,
        continueAction,
        isCompleted,
      }}
    >
      {children}
    </StorylineContext.Provider>
  )
}
