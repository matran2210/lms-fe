import { ISection } from '@lms/core'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { CoursesAPI } from 'src/app/api/courses/route'

export const useSectionData = (sectionId: string | null, type: string) => {
  const [sections, setSections] = useState<ISection[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const params = useParams()

  const fetchSections = async (page_size: number) => {
    try {
      if (sectionId) {
        const class_id = params.courseId || params.id
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
