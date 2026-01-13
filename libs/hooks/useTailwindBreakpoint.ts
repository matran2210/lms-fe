"use client"
import { useCallback, useLayoutEffect, useState } from 'react'

const TAILWIND_BREAKPOINTS = {
  sm: 640, // Mobile
  md: 768, // Tablet
  'md-middle': 896, // Middle Tablet
  lg: 1024, // Laptop
  xl: 1280, // Large Desktop
  'xl-middle': 1408, // Middle Desktop
  '2xl': 1536,
  '3xl': 1728,
  '4xl': 1920,
}

export const useTailwindBreakpoint = ({
  isMktInApp = false,
}: { isMktInApp?: boolean } = {}) => {
  const getBreakpointFromWidth = useCallback(
    (width: number) => {
      if (width >= TAILWIND_BREAKPOINTS['4xl']) return '4xl'
      if (width >= TAILWIND_BREAKPOINTS['3xl']) return '3xl'
      if (width >= TAILWIND_BREAKPOINTS['2xl']) return '2xl'
      if (width >= TAILWIND_BREAKPOINTS['xl-middle'] && isMktInApp)
        return 'xl-middle'
      if (width >= TAILWIND_BREAKPOINTS['xl']) return 'xl'
      if (width >= TAILWIND_BREAKPOINTS['lg']) return 'lg'
      if (width >= TAILWIND_BREAKPOINTS['md-middle'] && isMktInApp)
        return 'md-middle'
      if (width >= TAILWIND_BREAKPOINTS['md']) return 'md'
      if (width >= TAILWIND_BREAKPOINTS['sm']) return 'sm'
      return 'base'
    },
    [isMktInApp],
  )

  const initialBreakpoint =
    typeof window !== 'undefined'
      ? getBreakpointFromWidth(window.innerWidth)
      : 'base'
  const [isShortScreen, setIsShortScreen] = useState(false)
  const [breakpoint, setBreakpoint] = useState<
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | 'base'
    | 'xl-middle'
    | 'md-middle'
  >(initialBreakpoint)

  useLayoutEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setIsShortScreen(height < 700 && width > 700)
      setBreakpoint(getBreakpointFromWidth(width))
    }

    // Sync immediately in layout to avoid paint flicker
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getBreakpointFromWidth])

  const isAlwaysShowSidebar = ['lg', 'xl', '2xl', '3xl', '4xl'].includes(
    breakpoint,
  )
  const isShowMenuContent = ['base', 'sm', 'md'].includes(breakpoint)
  const isMobileView = ['base', 'sm'].includes(breakpoint)
  const isTabletView = ['md'].includes(breakpoint)
  const isLargeDesktopView = ['xl', '2xl', '3xl', '4xl'].includes(breakpoint)
  const is4XLView = ['4xl'].includes(breakpoint)
  const is3XLView = ['3xl'].includes(breakpoint)
  const is2XLView = ['2xl'].includes(breakpoint)
  const isXLMiddleView = ['xl-middle'].includes(breakpoint)
  const isMDMiddleView = ['md-middle'].includes(breakpoint)
  const isDesktopView = ['2xl', '3xl', '4xl'].includes(breakpoint)
  return {
    isAlwaysShowSidebar,
    isShowMenuContent,
    breakpoint,
    isMobileView,
    isTabletView,
    isLargeDesktopView,
    is4XLView,
    is3XLView,
    is2XLView,
    isXLMiddleView,
    isMDMiddleView,
    isDesktopView,
    isShortScreen,
  }
}
