import { CoursesAPI } from '@pages/api/courses'
import { ISection } from 'src/type'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const useSectionData = (sectionId: string | null, type: string) => {
  const [sections, setSections] = useState<ISection[]>([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchSections = async (page_size: number) => {
    try {
      if (sectionId) {
        const class_id = router.query.courseId || router.query.id
        setIsLoading(true)
        const res = await CoursesAPI.getCourseSubsectionList(
          page_size,
          type as 'CHAPTER' | 'UNIT' | 'ACTIVITY',
          sectionId,
          class_id as string,
        )
        setSections([...res?.data?.sections].reverse())
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  return { sections, setSections, fetchSections, isLoading }
}
