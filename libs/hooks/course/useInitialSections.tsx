import { useFeature } from '@lms/contexts'
import { DEFAULT_PAGE_SIZE, ICoursesAPI, ISection } from '@lms/core'
import { isEmpty } from 'lodash'
import { useRef, useState } from 'react'

export const useInitialSections = (api: ICoursesAPI) => {
  const [sections, setSections] = useState<ISection[]>([])
  const isFetchingRef = useRef(false)
  const { params } = useFeature()

  const fetchInitialSections = async (page_size: number) => {
    try {
      if (
        isEmpty(sections) &&
        (params?.courseId || params?.id) &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true
        const { data } = await api.getCourseSectionList(
          params?.courseId || params?.id,
          page_size || DEFAULT_PAGE_SIZE,
        )
        if (!isEmpty(data?.sections)) {
          setSections([...(data?.sections || [])].reverse())
        }
      }
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
