import { useEffect } from 'react'

interface UseResizeMouseParams {
  startResize: boolean
  setMousePosition: (pos: { x: number; y: number }) => void
  setCurrentMousePos: (x: number) => void
}

export default function useResizeMouse({
  startResize,
  setMousePosition,
  setCurrentMousePos,
}: UseResizeMouseParams) {
  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent | TouchEvent) => {
      const clientX =
        ev instanceof TouchEvent ? ev.touches[0].clientX : ev.clientX
      const clientY =
        ev instanceof TouchEvent ? ev.touches[0].clientY : ev.clientY

      setMousePosition({ x: clientX, y: clientY })
    }

    const clickPosition = (ev: MouseEvent | TouchEvent) => {
      const clientX =
        ev instanceof TouchEvent ? ev.touches[0].clientX : ev.clientX

      setCurrentMousePos(clientX)
    }

    if (startResize) {
      document.body.style.userSelect = 'none'

      window.addEventListener('mousemove', updateMousePosition)
      window.addEventListener('mousedown', clickPosition)
      window.addEventListener('touchmove', updateMousePosition, {
        passive: false,
      })
      window.addEventListener('touchstart', clickPosition, { passive: false })
    }

    return () => {
      document.body.style.userSelect = 'unset'

      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousedown', clickPosition)
      window.removeEventListener('touchmove', updateMousePosition)
      window.removeEventListener('touchstart', clickPosition)
    }
  }, [startResize, setMousePosition, setCurrentMousePos])
}
