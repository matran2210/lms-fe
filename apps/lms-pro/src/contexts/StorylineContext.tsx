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
  DocumentItem,
  IMultiChoiceQuestion,
  IStoryline,
  IStorylineItem,
  IStorylineProgressResponse,
  IStorylineQuestion,
} from '@lms/core'
import { useStorylineSidebar } from './StorylineSidebarContext'
import { TestServiceAPI } from 'src/api/test-api'
import { StorylineAPI } from 'src/api/storyline'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from 'react-query'


interface StorylineContextValue {
  currentStepIndex: number
  currentStep: IStorylineItem | null
  stepRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  /** document control */
  visibleDocumentCount: number
  setVisibleDocumentCount: React.Dispatch<React.SetStateAction<number>>
  continueAction: (
    storyline_item_document_id: string,
    isUpdateProgress?: boolean,
    isFinish?: boolean,
  ) => void
  updateProgress: (
    storyline_item_document_id: string,
    isUpdateProgress?: boolean,
  ) => void
  isCompletedProgress: number
  setIsCompletedProgress: React.Dispatch<React.SetStateAction<number>>
  storylineDocument: DocumentItem[] | undefined
  question: IStorylineQuestion | null
  setQuestion: React.Dispatch<React.SetStateAction<IStorylineQuestion | null>>
  topicDescription: any
  class_user_id: string
  refetchStorylineDocument: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<DocumentItem[], unknown>>
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
  const [question, setQuestion] = useState<IStorylineQuestion | null>(null)
  const [topicDescription, setTopicDescription] = useState<any>()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [visibleDocumentCount, setVisibleDocumentCount] = useState(1)
  const [isCompletedProgress, setIsCompletedProgress] = useState(
    storylineData
      ? (storylineData?.learning_progress?.total_course_sections_completed /
        storylineData?.learning_progress?.total_course_sections) *
      100
      : 0,
  )
  const [isProcessing, setIsProcessing] = useState(false)


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
  const currentStep = steps[currentStepIndex] ?? null
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


  const {
    data: storylineDocument,
    isLoading,
    refetch,
  } = useGetStorylineDocument(`storyline-document-${currentStep?.id}`)
  const currentDocument = storylineDocument?.[visibleDocumentCount - 1]


  const updateProgress = async (
    storyline_item_document_id: string,
    isUpdateProgress = false,
  ) => {
    if (!currentStep) return
    // Reveal document
    if (
      (storyline_item_document_id && status !== 'Review') ||
      isUpdateProgress
    ) {
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
      setIsCompletedProgress(
        (progressRes?.storyline_section.learning_progress
          .total_course_sections_completed /
          progressRes?.storyline_section.learning_progress
            .total_course_sections) *
        100,
      )
      setListStorylines(storylineItemsHasDocs)
      setLearningProgress(progressRes?.storyline_section.learning_progress)
    }
  }
  const continueAction = async (
    storyline_item_document_id: string,
    isUpdateProgress = true,
    isFinish = false,
  ) => {
    if (!currentStep) return
    if (isProcessing) return
    setIsProcessing(true)
    const totalDocs = currentStep.total_document
    // Reveal document
    if (isFinish) {
      setIsCompletedProgress(isCompletedProgress + 1)
    } else {
      if (isUpdateProgress && currentDocument?.type !== 'VIDEO')
        await updateProgress(storyline_item_document_id)
    }
    if (visibleDocumentCount < totalDocs) {
      setVisibleDocumentCount((prev) => {
        const nextCount = prev + 1
        return nextCount
      })
      setIsProcessing(false)
      return
    }
    setIsProcessing(false)
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


  useEffect(() => {
    if (!storylineData) return
    setListStorylines(storylineItemsHasDocs)
    setLearningProgress(
      storylineData?.learning_progress || {
        total_course_sections: 1,
        total_course_sections_completed: 0,
        time_spent: 0,
        duration: 0,
      },
    )
    setIsCompletedProgress(
      (storylineData?.learning_progress?.total_course_sections_completed /
        storylineData?.learning_progress?.total_course_sections) *
      100,
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


  useEffect(() => {
    if (!currentStep) return
    const completed = currentStep.item_progress?.total_document_completed ?? 0
    setVisibleDocumentCount(!completed ? completed + 1 : completed)
  }, [currentStep?.id])


  return (
    <StorylineContext.Provider
      value={{
        currentStepIndex,
        currentStep,
        stepRefs,
        visibleDocumentCount,
        setVisibleDocumentCount,
        continueAction,
        updateProgress,
        isCompletedProgress,
        setIsCompletedProgress,
        storylineDocument,
        question,
        setQuestion,
        topicDescription,
        class_user_id: storylineData?.class_user_id as string,
        refetchStorylineDocument: refetch,
      }}
    >
      {children}
    </StorylineContext.Provider>
  )
}
