"use client"
import { useEffect, useRef, useState } from 'react'

export function useScrollShadows<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const updateShadows = () => {
    const el = ref.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    setShowLeft(scrollLeft > 0)
    setShowRight(scrollLeft + clientWidth < scrollWidth)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    updateShadows() // Initial check

    el.addEventListener('scroll', updateShadows)
    window.addEventListener('resize', updateShadows)

    return () => {
      el.removeEventListener('scroll', updateShadows)
      window.removeEventListener('resize', updateShadows)
    }
  }, [])

  return { ref, showLeft, showRight }
}
