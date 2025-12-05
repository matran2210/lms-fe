import { createContext, useContext, useEffect, useRef, useState } from 'react'

const sectionPath = '/courses/[id]/section/[course_section_id]'
interface PreviousSectionRouteContextProps {
  previousSection: string | null
}

const PreviousSectionRouteContext =
  createContext<PreviousSectionRouteContextProps>({
    previousSection: null,
  })

export const PreviousSectionRouteProvider: React.FC<{
  children: React.ReactNode
  router: any
}> = ({ children, router }) => {
  const previousSectionPathRef = useRef<string | null>(null)
  const [previousSection, setPreviousSectionPath] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (router.pathname === sectionPath) {
        previousSectionPathRef.current = router.asPath // Lưu URL hiện tại
        setPreviousSectionPath(router.asPath)
      }
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router])

  return (
    <PreviousSectionRouteContext.Provider value={{ previousSection }}>
      {children}
    </PreviousSectionRouteContext.Provider>
  )
}

export const usePreviousSectionRoute = () =>
  useContext(PreviousSectionRouteContext)
