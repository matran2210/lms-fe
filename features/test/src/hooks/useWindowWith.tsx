import { useEffect, useState } from 'react'

export default function useWindowWidth() {
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    const updateWindowWidth = () => {
      setWidth(window.innerWidth)
    }

    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)

    return () => {
      window.removeEventListener('resize', updateWindowWidth)
    }
  }, [])

  return width
}
