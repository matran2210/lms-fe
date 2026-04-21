import { scrollToYFramer } from '@utils/helpers/storyline/engine'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Block } from 'src/type/storyline'
import { StoryBlockRenderer } from './StoryBlockRenderer'
import { scrollToY } from '@utils/helpers/storyline/scrollManager'

interface Props {
  visibleBlocks: Block[]
  stepIndex: number
}

export function StepRenderer({ visibleBlocks, stepIndex }: Props) {
  const blockRefs = useRef<(HTMLElement | null)[]>([])
  const prevCount = useRef(visibleBlocks.length)

  useEffect(() => {
    if (visibleBlocks.length <= prevCount.current) return
    prevCount.current = visibleBlocks.length

    const lastIndex = visibleBlocks.length - 1
    const el = blockRefs.current[lastIndex]
    if (!el) return

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const y = el.getBoundingClientRect().top + window.scrollY
        scrollToY(y, { duration: 0.6, offset: 80 })
      })
    })
  }, [visibleBlocks.length])

  return (
    <section className="mx-auto">
      <AnimatePresence initial={false}>
        {visibleBlocks.map((block, index) => (
          <motion.div
            key={block.id}
            id={`block-${stepIndex}-${index}`}
            ref={(el) => (blockRefs.current[index] = el)}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.03,
              ease: 'easeOut',
            }}
            className="mb-16"
          >
            <StoryBlockRenderer block={block} />
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  )
}
