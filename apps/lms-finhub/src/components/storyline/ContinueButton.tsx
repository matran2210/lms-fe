'use client'
import { motion } from 'framer-motion'
import { useStory } from '@contexts/StorylineContext'
import clsx from 'clsx'
import { ButtonPrimary } from '@lms/ui'

export default function ContinueButton({ onClick }: { onClick: () => void }) {
  const { hasNextBlock, currentStepIndex } = useStory()
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: hasNextBlock ? 1 : 0,
        height: hasNextBlock ? 'auto' : 0,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
      className="flex w-full justify-center py-10 pl-80"
    >
      <ButtonPrimary onClick={onClick}>Continue</ButtonPrimary>
    </motion.div>
  )
}
