import { CoursesAPI } from '@pages/api/courses'
import { ISection } from 'src/type'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { DEFAULT_PAGE_SIZE } from 'src/constants'
import { isEmpty } from 'lodash'

export const useInitialSections = () => {
  const [sections, setSections] = useState<ISection[]>([])
  const isLoadMore = useRef(true)
  const isFetchingRef = useRef(false)
  const router = useRouter()

  const fetchInitialSections = async (page_size: number) => {
    try {
      if (
        (router.query.courseId || router.query.id) &&
        !isFetchingRef.current &&
        isLoadMore.current
      ) {
        isFetchingRef.current = true
        const { data } = await CoursesAPI.getCourseSectionList(
          router.query.courseId || router.query.id,
          page_size || DEFAULT_PAGE_SIZE,
        )
        if (!isEmpty(data?.sections)) {
          isLoadMore.current =
            data?.meta?.total_records >= page_size &&
            data?.sections.length !== data?.meta?.total_records
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
