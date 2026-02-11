import { StoryStep } from 'src/type/storyline'

export default function ProgressBar({
  steps,
  currentStepId,
}: {
  steps: StoryStep[]
  currentStepId: string
}) {
  const index = steps.findIndex((s) => s.id === currentStepId)
  const percent = ((index + 1) / steps.length) * 100

  return (
    <div>
      <div className="h-2 min-w-[650px] rounded bg-[#D9D9D9]">
        <div
          className="h-2 rounded bg-success"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
