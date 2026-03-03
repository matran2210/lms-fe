import { animate } from 'framer-motion'

let currentAnimation: ReturnType<typeof animate> | null = null

export function scrollToY(
  targetY: number,
  options?: {
    offset?: number
    duration?: number
  },
) {
  const startY = window.scrollY
  const finalY = Math.max(0, targetY - (options?.offset ?? 0))

  // Stop animation cũ nếu đang chạy
  if (currentAnimation) {
    currentAnimation.stop()
  }

  currentAnimation = animate(startY, finalY, {
    duration: 1.5,
    ease: [0.25, 0.1, 0.25, 1], // easeInOutCubic
    onUpdate: (v) => {
      window.scrollTo(0, Math.round(v))
    },
  })
}
