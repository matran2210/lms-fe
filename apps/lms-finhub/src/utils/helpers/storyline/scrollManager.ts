import { animate, AnimationPlaybackControls } from 'framer-motion'

let currentAnimation: AnimationPlaybackControls | null = null
let scrollLocked = false

export function lockScroll() {
  scrollLocked = true
}

export function unlockScroll() {
  scrollLocked = false
}
let scrollingProgrammatically = false

export function scrollToY(
  targetY: number,
  options?: {
    duration?: number
    offset?: number
  },
) {
  scrollingProgrammatically = true

  animate(window.scrollY, targetY, {
    duration: options?.duration ?? 0.6,
    ease: 'easeOut',
    onUpdate: (v) => window.scrollTo(0, v),
    onComplete: () => {
      scrollingProgrammatically = false
    },
  })
}
export function isAutoScrolling() {
  return scrollingProgrammatically
}
