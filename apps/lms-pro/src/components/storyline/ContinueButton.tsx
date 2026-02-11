'use client'
import { motion } from 'framer-motion'
import { ButtonPrimary } from '@lms/ui'
import clsx from 'clsx'
import { useStorylineSidebar } from '@contexts/StorylineSidebarContext'

export default function ContinueButton({ onClick }: { onClick: () => void }) {
  const { showSidebar } = useStorylineSidebar()
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: 1,
        height: 'auto',
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
      className={clsx('flex w-full justify-center py-10', {
        'pl-80': showSidebar,
      })}
    >
      <ButtonPrimary onClick={onClick}>Continue</ButtonPrimary>
    </motion.div>
  )
}
