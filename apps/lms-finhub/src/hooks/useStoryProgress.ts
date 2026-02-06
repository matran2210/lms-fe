import { useState } from 'react'

export function useStoryProgress(total: number) {
  const [current, setCurrent] = useState(0)

  return {
    current,
    percent: ((current + 1) / total) * 100,
    next: () => setCurrent((c) => Math.min(c + 1, total - 1)),
  }
}
