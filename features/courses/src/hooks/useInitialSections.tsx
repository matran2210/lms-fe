import { ISection } from '@lms/core'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { DEFAULT_PAGE_SIZE } from '@lms/core'
import { isEmpty } from 'lodash'

export const useInitialSections = (props: {
  getCourseSectionList: (courseId: string, page_size: number) => Promise<any>
}) => {
  const [sections, setSections] = useState<ISection[]>([])
  const isFetchingRef = useRef(false)
  const router = useRouter()

  const fetchInitialSections = async (page_size: number) => {
    try {
      if (
        isEmpty(sections) &&
        (router.query.courseId || router.query.id) &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true
        // const { data } = await CoursesAPI.getCourseSectionList(
        //   router.query.courseId || router.query.id,
        //   page_size || DEFAULT_PAGE_SIZE,
        // )
        // Call API hàm truyền từ ngoài vào
        /*
        Cách dùng:
        const { sections, fetchInitialSections } = useInitialSections({
    getCourseSectionList: CoursesAPI.getCourseSectionList,
  })
        */
        const { data } = await props.getCourseSectionList(
          router.query.courseId || router.query.id as string,
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
