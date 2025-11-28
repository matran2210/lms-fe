// packages/feature/section/useSectionData.ts
import { useState } from 'react'
import { ISection } from '@lms/core'

export const useSectionData = ({
  sectionId,
  type,
  api,
  router,
}: {
  sectionId: string | null
  type: 'CHAPTER' | 'UNIT' | 'ACTIVITY'
  api: {
    getCourseSubsectionList: (
      page_size: number,
      type: 'CHAPTER' | 'UNIT' | 'ACTIVITY',
      sectionId: string,
      classId: string,
    ) => Promise<any>
  }
  router: any
}) => {
  const [sections, setSections] = useState<ISection[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSections = async (page_size: number) => {
    try {
      if (!sectionId) return

      const classId = router.query.courseId || router.query.id
      if (!classId) return

      setIsLoading(true)
      const res = await api.getCourseSubsectionList(
        page_size,
        type,
        sectionId,
        classId as string,
      )

      setSections([...(res?.data?.sections ?? [])].reverse())
    } finally {
      setIsLoading(false)
    }
  }

  return { sections, setSections, fetchSections, isLoading }
}
/**
 * Cách dùng
 * const { sections, isLoading, fetchSections } = useSectionData({
    sectionId,
    type,
    router,
    api: {
      getCourseSubsectionList: CoursesAPI.getCourseSubsectionList,
    },
  })
 */