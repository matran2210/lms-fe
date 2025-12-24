import { useEffect, useMemo, useState } from 'react'

export enum BreakpointType {
  BASE = 'base',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl',
}

const TAILWIND_BREAKPOINTS: Record<Exclude<BreakpointType, BreakpointType.BASE>, number> = {
  [BreakpointType.SM]: 640, // Mobile
  [BreakpointType.MD]: 768, // Tablet
  [BreakpointType.LG]: 1024, // Laptop
  [BreakpointType.XL]: 1280, // Large Desktop
  [BreakpointType.XXL]: 1536,
}

export const useTailwindBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<BreakpointType>(BreakpointType.BASE)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width >= TAILWIND_BREAKPOINTS[BreakpointType.XXL]) setBreakpoint(BreakpointType.XXL)
      else if (width >= TAILWIND_BREAKPOINTS[BreakpointType.XL]) setBreakpoint(BreakpointType.XL)
      else if (width >= TAILWIND_BREAKPOINTS[BreakpointType.LG]) setBreakpoint(BreakpointType.LG)
      else if (width >= TAILWIND_BREAKPOINTS[BreakpointType.MD]) setBreakpoint(BreakpointType.MD)
      else if (width >= TAILWIND_BREAKPOINTS[BreakpointType.SM]) setBreakpoint(BreakpointType.SM)
      else setBreakpoint(BreakpointType.BASE)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isDesktopView = [BreakpointType.LG, BreakpointType.XL, BreakpointType.XXL].includes(breakpoint)
  const isTabletView = [BreakpointType.MD].includes(breakpoint)
  const isMobileView = [BreakpointType.BASE, BreakpointType.SM].includes(breakpoint)

  return useMemo(
    () => ({
      breakpoint,
      isDesktopView,
      isTabletView,
      isMobileView,
    }),
    [breakpoint]
  )
}
