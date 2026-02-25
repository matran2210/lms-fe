import { animate } from 'framer-motion'

export function scrollToY(
  targetY: number,
  options?: {
    offset?: number
    duration?: number
  },
) {
  const finalY = targetY - (options?.offset ?? 0)

  animate(window.scrollY, finalY, {
    type: 'spring',
    stiffness: 150,
    damping: 24,
    mass: 0.7,
    // type: 'spring',
    // stiffness: 72,
    // damping: 32,
    // mass: 1.15,
    onUpdate: (v) => window.scrollTo(0, v),
  })
  // animate(window.scrollY, finalY, {
  //   duration: options?.duration ?? 0.6,
  //   ease: [0.22, 1, 0.36, 1],
  //   onUpdate: (v) => window.scrollTo(0, v),
  // })
}
