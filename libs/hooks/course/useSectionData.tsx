"use client"
import { ICoursesAPI, ISection } from '@lms/core'
import { useFeature } from '@lms/contexts'
import { useState } from 'react'

export const useSectionData = (sectionId: string | null, type: string, api: ICoursesAPI) => {
  const [sections, setSections] = useState<ISection[]>([])
  const { router, params, query } = useFeature()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchSections = async (page_size: number) => {
    try {
      if (sectionId) {
        const class_id = params?.courseId || params?.id || query.courseId || query.id
        setIsLoading(true)
        const res = await api.getCourseSubsectionList(
          page_size,
          type as 'CHAPTER' | 'UNIT' | 'ACTIVITY',
          sectionId,
          class_id as string,
        )
        setSections([...(res?.data?.sections || [])].reverse())
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { sections, setSections, fetchSections, isLoading }
}
