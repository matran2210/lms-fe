import { animate } from 'framer-motion'

export function scrollToYFramer(targetY: number, duration = 0.6) {
  const startY = window.scrollY

  animate(startY, targetY, {
    duration,
    ease: 'easeOut',
    onUpdate: (v) => window.scrollTo(0, v),
  })
}
