import { ICoursesAPI, ISection } from '@lms/core'
import { useRef, useState } from 'react'
import { DEFAULT_PAGE_SIZE } from '@lms/core'
import { isEmpty } from 'lodash'
import { useFeature } from '@lms/contexts'

export const useInitialSections = (api: ICoursesAPI) => {
  const [sections, setSections] = useState<ISection[]>([])
  const isFetchingRef = useRef(false)
  const {router} = useFeature()

  const fetchInitialSections = async (page_size: number) => {
    try {
      if (
        isEmpty(sections) &&
        (router.query.courseId || router.query.id) &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true
        const { data } = await api.getCourseSectionList(
          router.query.courseId || router.query.id,
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
