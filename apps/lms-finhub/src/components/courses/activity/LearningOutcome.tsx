import { useState } from 'react'
import LearningOutcomeDesktop from '@components/courses/activity/LearningOutcomeDesktop'
import LearningOutcomeMobile from '@components/courses/activity//LearningOutcomeMobile'
import { ILearningOutcomeProps } from '@lms/core'

export default function LearningOutcome({
  title,
  items,
  visible,
  onClose,
}: ILearningOutcomeProps) {
  const [show, setShow] = useState<boolean>(true)

  return (
    <>
      <LearningOutcomeDesktop
        title={title}
        items={items}
        visible={show}
        onClose={() => setShow(!show)}
      />
      <LearningOutcomeMobile
        title={title}
        items={items}
        visible={visible}
        onClose={onClose}
      />
    </>
  )
}
