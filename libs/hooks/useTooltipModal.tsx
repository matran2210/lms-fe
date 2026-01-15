"use client"
import { useEffect, useRef } from 'react'

export const useTooltipModal = () => {
  const portalRef = useRef<HTMLDivElement | null>(null)

  const showTooltip = (target: HTMLElement, content: string) => {
    if (!portalRef.current) {
      const div = document.createElement('div')
      div.className = 'tooltip-modal' // dùng class chung
      document.body.appendChild(div)
      portalRef.current = div
    }

    const tooltip = portalRef.current
    tooltip.textContent = content
    tooltip.style.display = 'block'
    tooltip.classList.add('show')

    // position
    requestAnimationFrame(() => {
      const selectContainer = target.closest(
        '.sapp-select--question',
      ) as HTMLElement
      const rect =
        selectContainer?.getBoundingClientRect() ||
        target.getBoundingClientRect()

      const top = rect.bottom + 8
      const left = rect.left

      tooltip.style.top = `${top}px`
      tooltip.style.left = `${left}px`
      tooltip.style.width = `${rect.width}px`
      tooltip.style.transform = 'none'
    })
  }

  const hideTooltip = () => {
    if (portalRef.current) {
      portalRef.current.classList.remove('show')
      portalRef.current.style.display = 'none'
    }
  }

  useEffect(() => {
    return () => {
      if (portalRef.current) {
        portalRef.current.remove()
        portalRef.current = null
      }
    }
  }, [])

  return { showTooltip, hideTooltip }
}
