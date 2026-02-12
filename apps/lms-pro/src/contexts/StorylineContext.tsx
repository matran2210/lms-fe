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
import { IStoryline, IStorylineItem } from 'src/type/storyline'

interface StorylineContextValue {
  steps: IStorylineItem[]
  currentStepIndex: number
  currentStep: IStorylineItem | null
  stepRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  /** document control */
  visibleDocumentCount: number
  setVisibleDocumentCount: React.Dispatch<React.SetStateAction<number>>
  continueAction: (storyline_item_document_id: string) => void
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

  const storylineItemId = searchParams.get('storylineItemId')
  const class_id = searchParams.get('class_id')
  const params = useParams()
  const { section_storyline_id } = params

  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [visibleDocumentCount, setVisibleDocumentCount] = useState(1)

  /* ----------------------------- */
  /* NORMALIZE STEPS FROM BE       */
  /* ----------------------------- */
  const steps: IStorylineItem[] = useMemo(() => {
    if (!storylineData?.storyline?.items) return []

    return [...storylineData.storyline.items].sort(
      (a, b) => a.position - b.position,
    )
  }, [storylineData])

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
    // if (storyline_item_document_id) {
    //   await CoursesAPI.learningOutcomeProgress(
    //     class_id as string,
    //     section_storyline_id as string,
    //     {
    //       storyline_item_document_id
    //     }
    //   )
    // }
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

    router.replace(`?class_id=${class_id}&storylineItemId=${next.id}`, {
      scroll: false,
    })
  }
  return (
    <StorylineContext.Provider
      value={{
        steps,
        currentStepIndex,
        currentStep,
        stepRefs,
        visibleDocumentCount,
        setVisibleDocumentCount,
        continueAction,
      }}
    >
      {children}
    </StorylineContext.Provider>
  )
}
