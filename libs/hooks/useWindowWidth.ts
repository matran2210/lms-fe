"use client"
import { useEffect, useState } from 'react'

const DEFAULT_WINDOW_WIDTH = 1280

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : DEFAULT_WINDOW_WIDTH,
  )

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }

    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)

    return () => {
      window.removeEventListener('resize', updateWindowWidth)
    }
  }, [])

  return windowWidth
}

export default useWindowWidth
