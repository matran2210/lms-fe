'use client'
import React, { createContext, useContext, useState } from 'react'
import { IStorylineItem, LearningProgress } from '@lms/core'

interface StorySidebarContextValue {
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
  listStorylines: IStorylineItem[]
  setListStorylines: (list: IStorylineItem[]) => void
  learning_progress: LearningProgress
  setLearningProgress: (progress: LearningProgress) => void
}

export const StorylineSidebarContext =
  createContext<StorySidebarContextValue | null>(null)

export function useStorylineSidebar() {
  const ctx = useContext(StorylineSidebarContext)
  if (!ctx) throw new Error('useStory must be used inside StoryProvider')
  return ctx
}

export function StorylineSidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [showSidebar, setShowSidebar] = useState(true)
  const [listStorylines, setListStorylines] = useState<IStorylineItem[]>([])
  const [learning_progress, setLearningProgress] = useState<LearningProgress>({
    total_course_sections: 1,
    total_course_sections_completed: 0,
    time_spent: 0,
    duration: 0,
  })

  return (
    <StorylineSidebarContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        listStorylines,
        setListStorylines,
        learning_progress,
        setLearningProgress,
      }}
    >
      {children}
    </StorylineSidebarContext.Provider>
  )
}
