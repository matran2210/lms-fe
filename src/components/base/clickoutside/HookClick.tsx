import { useEffect } from 'react'

interface ClickOutsideProps {
  ref: React.RefObject<HTMLElement>
  callback: () => void
}

const useClickOutside = ({ ref, callback }: ClickOutsideProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

export default useClickOutside
