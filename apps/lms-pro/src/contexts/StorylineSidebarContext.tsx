'use client'
import React, { createContext, useContext, useState } from 'react'

interface StorySidebarContextValue {
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
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

  return (
    <StorylineSidebarContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
      }}
    >
      {children}
    </StorylineSidebarContext.Provider>
  )
}
