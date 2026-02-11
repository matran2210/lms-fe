import { useStoryline } from '@contexts/StorylineContext'
import {
  scrollToY,
  scrollWithBounce,
} from '@utils/helpers/storyline/scrollManager'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { DocumentItem } from 'src/type/storyline'
import { StoryBlockRenderer } from './StoryBlockRenderer'

interface Props {
  documents: DocumentItem[] | undefined
}

export function StepRenderer({ documents = [] }: Props) {
  const blockRefs = useRef<(HTMLElement | null)[]>([])
  const prevCount = useRef(0)
  const lastRevealedIndex = useRef<number | null>(null)
  const { currentStepIndex, currentStep } = useStoryline()

  // useLayoutEffect(() => {
  //   console.log("vo day", documents.length, prevCount.current)
  //   prevCount.current = documents.length
  //   lastRevealedIndex.current = null
  // }, [currentStep?.id])

  /* Detect document reveal        */
  useEffect(() => {
    if (documents.length <= prevCount.current) return

    lastRevealedIndex.current = documents.length - 1
    prevCount.current = documents.length
    return () => {
      prevCount.current = 0
    }
  }, [documents.length])

  /* Scroll after animation done   */
  const handleAnimationComplete = (index: number) => {
    if (lastRevealedIndex.current !== index) return

    const el = blockRefs.current[index]
    if (!el) return

    const rect = el.getBoundingClientRect()
    const y = rect.top + window.scrollY

    scrollWithBounce(y, {
      duration: 1.5,
      offset: 100,
    })

    lastRevealedIndex.current = null
  }

  return (
    <section className="mx-auto" key={currentStep?.id}>
      <AnimatePresence initial={false}>
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            ref={(el) => (blockRefs.current[index] = el)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // transition={{
            //   duration: 0.2,
            //   ease: 'easeOut',
            // }}
            onAnimationComplete={() => handleAnimationComplete(index)}
            className="mb-16"
          >
            <div className="mb-2 text-lg font-semibold">{doc.name}</div>

            <StoryBlockRenderer doc={doc} />
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  )
}
