'use client'
import React, { createContext, useContext, useState } from 'react'
import { IStorylineItem } from 'src/type/storyline'

interface StorySidebarContextValue {
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
  listStorylines: IStorylineItem[]
  setListStorylines: (list: IStorylineItem[]) => void
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

  return (
    <StorylineSidebarContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        listStorylines,
        setListStorylines,
      }}
    >
      {children}
    </StorylineSidebarContext.Provider>
  )
}
