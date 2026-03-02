import { motion } from 'framer-motion'
import { useRef } from 'react'
import { StoryBlockRenderer } from './StoryBlockRenderer'
import { DocumentItem } from '@lms/core'

interface Props {
  documents: DocumentItem[] | undefined
  storylinyeDocument: DocumentItem[] | undefined
  onNewBlockMounted?: (el: HTMLElement) => void
}

export function StepRenderer({
  documents = [],
  storylinyeDocument = [],
  onNewBlockMounted,
}: Props) {
  const blockRefs = useRef<(HTMLElement | null)[]>([])

  return (
    <motion.section
      layout
      transition={{
        layout: {
          type: 'spring',
          stiffness: 85,
          damping: 26,
          mass: 0.9,
        },
      }}
      className="mx-auto"
    >
      {documents.map((doc, index) => {
        const isNew = index === documents.length - 1

        return (
          <motion.div
            key={doc.id}
            ref={(el) => (blockRefs.current[index] = el)}
            layout
            initial={isNew ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              opacity: { duration: 0.25 },
              y: { duration: 0.35, ease: 'easeOut' },
            }}
            onAnimationComplete={() => {
              if (isNew && blockRefs.current[index]) {
                onNewBlockMounted?.(blockRefs.current[index]!)
              }
            }}
            className="mb-12"
          >
            {/* <div className="mb-6 text-lg font-semibold">{doc.name}</div> */}

            <StoryBlockRenderer
              doc={doc}
              docIndex={index + 1}
              storylinyeDocument={storylinyeDocument}
            />
          </motion.div>
        )
      })}
    </motion.section>
  )
}
