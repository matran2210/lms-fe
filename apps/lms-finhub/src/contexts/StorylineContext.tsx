'use client'
import { useRouter } from 'next/navigation'
import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { steps } from 'src/data/storyline/linear'
import { Block, StoryStep } from 'src/type/storyline'

interface StoryContextValue {
  // sidebar
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
  steps: StoryStep[]
  currentStepIndex: number
  currentStep: StoryStep
  visibleBlocks: Block[]
  canContinue: boolean
  continueAction: () => void
  backToPreviousStep: () => void
  setCurrentStepIndex: (index: number) => void
  stepRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  hasNextStep: boolean
  hasNextBlock: boolean
  goToBlockSmart: (index: number) => void
  maxVisibleBlockMap: Record<number, number>
  maxUnlockedStepIndex: number
}

export const StoryContext = createContext<StoryContextValue | null>(null)

export function useStory() {
  const ctx = useContext(StoryContext)
  if (!ctx) throw new Error('useStory must be used inside StoryProvider')
  return ctx
}

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showSidebar, setShowSidebar] = useState(true)
  const [maxVisibleBlockMap, setMaxVisibleBlockMap] = useState<
    Record<number, number>
  >({})
  const [maxUnlockedStepIndex, setMaxUnlockedStepIndex] = useState(0)

  const [activeBlockMap, setActiveBlockMap] = useState<Record<number, number>>(
    {},
  )
  const maxVisibleBlockIndex = maxVisibleBlockMap[currentStepIndex] ?? 0

  const activeBlockIndex = activeBlockMap[currentStepIndex] ?? 0

  const router = useRouter()
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentStep = steps[currentStepIndex]

  const visibleBlocks = useMemo(() => {
    return currentStep.blocks.slice(0, maxVisibleBlockIndex + 1)
  }, [currentStep, maxVisibleBlockIndex])
  const totalBlocks = currentStep.blocks.length
  const isLastBlockRevealed = maxVisibleBlockIndex >= totalBlocks - 1
  const isNotLastStep = currentStepIndex < steps.length - 1

  const hasNextBlock = !isLastBlockRevealed
  const hasNextStep = isNotLastStep && isLastBlockRevealed

  const canContinue = hasNextBlock || hasNextStep

  const continueAction = () => {
    if (hasNextBlock) {
      setMaxVisibleBlockMap((prev) => ({
        ...prev,
        [currentStepIndex]: maxVisibleBlockIndex + 1,
      }))

      setActiveBlockMap((prev) => ({
        ...prev,
        [currentStepIndex]: maxVisibleBlockIndex + 1,
      }))
      return
    }

    if (hasNextStep) {
      setCurrentStepIndex((i) => i + 1)
    }
  }

  const goToBlockSmart = (index: number) => {
    const currentMax = maxVisibleBlockMap[currentStepIndex] ?? 0

    // Nếu block chưa được reveal → mở tới đó
    if (index > currentMax) {
      setMaxVisibleBlockMap((prev) => ({
        ...prev,
        [currentStepIndex]: index,
      }))
    }

    // Active block
    setActiveBlockMap((prev) => ({
      ...prev,
      [currentStepIndex]: index,
    }))

    requestAnimationFrame(() => {
      document
        .getElementById(`block-${currentStepIndex}-${index}`)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    })
  }

  const backToPreviousStep = () => {
    if (currentStepIndex === 0) {
      // router.push('/home')
    }

    const previousIndex = currentStepIndex - 1
    setCurrentStepIndex(previousIndex)
  }
  useEffect(() => {
    setMaxUnlockedStepIndex((prev) => Math.max(prev, currentStepIndex))
  }, [currentStepIndex])
  return (
    <StoryContext.Provider
      value={{
        steps,
        currentStepIndex,
        currentStep,
        canContinue,
        continueAction,
        stepRefs,
        backToPreviousStep,
        hasNextStep,
        hasNextBlock,
        setCurrentStepIndex,
        showSidebar,
        setShowSidebar,
        goToBlockSmart,
        visibleBlocks,
        maxVisibleBlockMap,
        maxUnlockedStepIndex,
      }}
    >
      {children}
    </StoryContext.Provider>
  )
}
