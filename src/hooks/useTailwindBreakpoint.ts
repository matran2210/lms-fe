import { useEffect, useLayoutEffect, useState } from 'react'

const TAILWIND_BREAKPOINTS = {
  sm: 640, // Mobile
  md: 768, // Tablet
  lg: 1024, // Laptop
  xl: 1280, // Large Desktop
  '2xl': 1536,
  '3xl': 1728,
  '4xl': 1920,
}

export const useTailwindBreakpoint = () => {
  const getBreakpointFromWidth = (width: number) => {
    if (width >= TAILWIND_BREAKPOINTS['4xl']) return '4xl' as const
    if (width >= TAILWIND_BREAKPOINTS['3xl']) return '3xl' as const
    if (width >= TAILWIND_BREAKPOINTS['2xl']) return '2xl' as const
    if (width >= TAILWIND_BREAKPOINTS['xl']) return 'xl' as const
    if (width >= TAILWIND_BREAKPOINTS['lg']) return 'lg' as const
    if (width >= TAILWIND_BREAKPOINTS['md']) return 'md' as const
    if (width >= TAILWIND_BREAKPOINTS['sm']) return 'sm' as const
    return 'base' as const
  }

  const [breakpoint, setBreakpoint] = useState<
    'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'base'
  >(() => {
    if (typeof window === 'undefined') return 'base'
    return getBreakpointFromWidth(window.innerWidth)
  })

  useLayoutEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setBreakpoint((prev) => {
        const next = getBreakpointFromWidth(width)
        return prev === next ? prev : next
      })
    }

    // Ensure the value is correct before first paint
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isAlwaysShowSidebar = ['lg', 'xl', '2xl', '3xl', '4xl'].includes(
    breakpoint,
  )
  const isShowMenuContent = ['base', 'sm', 'md'].includes(breakpoint)
  const isMobileView = ['base', 'sm'].includes(breakpoint)
  const isTabletView = ['md'].includes(breakpoint)
  const isLargeDesktopView = ['xl', '2xl', '3xl', '4xl'].includes(breakpoint)
  const isDesktopView = ['2xl', '3xl', '4xl'].includes(breakpoint)
  return {
    isAlwaysShowSidebar,
    isShowMenuContent,
    breakpoint,
    isMobileView,
    isTabletView,
    isLargeDesktopView,
    isDesktopView,
  }
}
