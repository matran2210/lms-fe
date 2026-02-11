import { animate } from 'framer-motion'

export function scrollToY(
  targetY: number,
  options?: {
    duration?: number
    offset?: number
  },
) {
  const finalY = targetY - (options?.offset ?? 0)

  animate(window.scrollY, finalY, {
    type: 'spring',
    stiffness: 140,
    damping: 22,
    mass: 1,
    onUpdate: (v) => window.scrollTo(0, v),
  })
}
export function scrollWithBounce(
  targetY: number,
  options?: {
    duration?: number
    offset?: number
    bounce?: number
  },
) {
  const finalY = targetY - (options?.offset ?? 0)
  const bounce = options?.bounce ?? 20

  // Phase 1: scroll chính
  animate(window.scrollY, finalY, {
    duration: options?.duration ?? 0.6,
    ease: 'easeOut',
    onUpdate: (v) => window.scrollTo(0, v),
    // onComplete: () => {
    //   // Phase 2: nhún nhẹ xuống rồi quay lại
    //   animate(finalY, finalY + bounce, {
    //     duration: 0.15,
    //     ease: 'easeOut',
    //     onUpdate: (v) => window.scrollTo(0, v),
    //     onComplete: () => {
    //       animate(finalY + bounce, finalY, {
    //         duration: 0.2,
    //         ease: 'easeOut',
    //         onUpdate: (v) => window.scrollTo(0, v),
    //       })
    //     },
    //   })
    // },
  })
}
