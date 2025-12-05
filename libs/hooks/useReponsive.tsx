import { useState, useEffect } from 'react'

const useReponsive = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkMobile()
    checkTablet()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('resize', checkTablet)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('resize', checkTablet)
    }
  }, [])

  return { isMobile, isTablet }
}

export default useReponsive
