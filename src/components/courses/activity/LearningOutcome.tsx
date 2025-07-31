import { useState } from 'react'
import { ILearningOutcomeProps } from 'src/type/courses-3-level'
import LearningOutcomeDesktop from '@components/courses/activity/LearningOutcomeDesktop';
import LearningOutcomeMobile from '@components/courses/activity//LearningOutcomeMobile';

export default function LearningOutcome({ title, items, visible, onClose }: ILearningOutcomeProps) {
  const [show, setShow] = useState<boolean>(true);

  return (
    <>
      <LearningOutcomeDesktop title={title} items={items} visible={show} onClose={() => setShow(!show)} />
      <LearningOutcomeMobile title={title} items={items} visible={visible} onClose={onClose} />
    </>
  )
}

