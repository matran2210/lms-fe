import { StoryStep } from 'src/types/storyline'

export function getNextStepLinear(steps: StoryStep[], currentId: string) {
  const index = steps.findIndex((s) => s.id === currentId)
  return steps[index + 1] ?? null
}
