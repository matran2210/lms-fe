import { ISection } from '@lms/core'
import { useRef, useState } from 'react'
import { DEFAULT_PAGE_SIZE } from '@lms/core'
import { isEmpty } from 'lodash'
import { useParams, useRouter } from 'next/navigation'
import { CoursesAPI } from 'src/api/courses'

export const useInitialSections = () => {
  const [sections, setSections] = useState<ISection[]>([])
  const isFetchingRef = useRef(false)
  const router = useRouter()
  const params = useParams()

  const fetchInitialSections = async (page_size: number) => {
    try {
      if (
        isEmpty(sections) &&
        (params.courseId || params.id) &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true
        const { data } = await CoursesAPI.getCourseSectionList(
          params.courseId || params.id,
          page_size || DEFAULT_PAGE_SIZE,
        )
        if (!isEmpty(data?.sections)) {
          setSections([...data?.sections].reverse())
        }
      }
    } catch (error) {
    } finally {
      isFetchingRef.current = false
    }
  }

  return {
    sections,
    setSections,
    fetchInitialSections,
    isLoading: isFetchingRef.current,
  }
}
