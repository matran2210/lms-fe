"use client"
import { createContext, useContext, useEffect, useRef, useState } from 'react'

const sectionPath = /^\/courses\/[^/]+\/section\/[^/]+$/
interface PreviousSectionRouteContextProps {
  previousSection: string | null
}

const PreviousSectionRouteContext =
  createContext<PreviousSectionRouteContextProps>({
    previousSection: null,
  })

export const PreviousSectionRouteProvider: React.FC<{
  children: React.ReactNode
  pathname: string | null
}> = ({ children, pathname }) => {
  const previousSectionPathRef = useRef<string | null>(null)
  const [previousSection, setPreviousSectionPath] = useState<string | null>(
    null,
  )
  useEffect(() => {
    // Nếu route hiện tại là section
    if (sectionPath.test(pathname || '')) {
      previousSectionPathRef.current = pathname
      setPreviousSectionPath(pathname)
    }
  }, [pathname])

  return (
    <PreviousSectionRouteContext.Provider value={{ previousSection }}>
      {children}
    </PreviousSectionRouteContext.Provider>
  )
}

export const usePreviousSectionRoute = () =>
  useContext(PreviousSectionRouteContext)
