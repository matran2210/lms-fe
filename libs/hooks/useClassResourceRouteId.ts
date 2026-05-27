'use client'

import { useParams } from 'next/navigation'

/** Student: `courseId` — Teacher class detail: `id` */
export function useClassResourceRouteId(): string {
  const p = useParams<{ courseId?: string; id?: string }>()
  return String(p.courseId ?? p.id ?? '')
}
