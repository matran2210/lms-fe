import { useStory } from '@contexts/StorylineContext'
import { StoryStep } from 'src/type/storyline'

export default function LessonItem({
  step,
  active,
}: {
  step: StoryStep
  active: boolean
}) {
  // const { setSceneIndex, setBlockIndex } = useStory()
  // const goToScene = (index: number) => {
  //     setSceneIndex(index)
  //     setBlockIndex(0)

  //     requestAnimationFrame(() => {
  //         canvasRef.current?.scrollTo({ top: 0 })
  //     })
  // }
  return (
    <li className={`text-sm ${active ? 'font-semibold' : 'opacity-60'}`}>
      {step.id}
    </li>
  )
}
