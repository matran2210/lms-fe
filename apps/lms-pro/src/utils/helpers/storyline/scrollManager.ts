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
    stiffness: 80,
    damping: 20,
    mass: 1,
    restDelta: 0.5,
    //   // type: 'spring',
    //   // stiffness: 72,
    //   // damping: 32,
    //   // mass: 1.15,
    onUpdate: (v) => window.scrollTo(0, v),
  })
  // animate(window.scrollY, finalY, {
  //   duration: 0.45,
  //   ease: [0.25, 0.1, 0.25, 1], // easeInOut
  //   onUpdate: (v) => window.scrollTo(0, v),
  // })
}
