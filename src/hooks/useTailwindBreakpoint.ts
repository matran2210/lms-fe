import { useEffect, useState } from 'react'

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
  const [breakpoint, setBreakpoint] = useState<
    'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'base'
  >('base')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width >= TAILWIND_BREAKPOINTS['4xl']) setBreakpoint('4xl')
      else if (width >= TAILWIND_BREAKPOINTS['3xl']) setBreakpoint('3xl')
      else if (width >= TAILWIND_BREAKPOINTS['2xl']) setBreakpoint('2xl')
      else if (width >= TAILWIND_BREAKPOINTS['xl']) setBreakpoint('xl')
      else if (width >= TAILWIND_BREAKPOINTS['lg']) setBreakpoint('lg')
      else if (width >= TAILWIND_BREAKPOINTS['md']) setBreakpoint('md')
      else if (width >= TAILWIND_BREAKPOINTS['sm']) setBreakpoint('sm')
      else setBreakpoint('base')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isAlwaysShowSidebar = ['lg', 'xl', '2xl', '3xl', '4xl'].includes(
    breakpoint,
  )
  const isShowMenuContent = ['base', 'sm', 'md'].includes(breakpoint)
  const isMobileView = ['base', 'sm'].includes(breakpoint)
  return { isAlwaysShowSidebar, isShowMenuContent, breakpoint, isMobileView }
}
