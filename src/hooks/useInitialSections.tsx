import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { CoursesAPI } from 'src/pages/api/courses'
import { ISection } from 'src/type'
import { DEFAULT_PAGE_SIZE } from 'src/constants'

export const useInitialSections = (pageSize: number = DEFAULT_PAGE_SIZE) => {
  const router = useRouter()
  const classId = (router.query.courseId || router.query.id) as string

  const enabled = Boolean(classId)

  const {
    data: sections = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<ISection[]>(
    ['initialSections', classId],
    async () => {
      const { data } = await CoursesAPI.getCourseSectionList(classId, pageSize)
      return data?.sections?.reverse() || []
    },
    {
      enabled,
      retry: false,
    },
  )

  return {
    sections,
    isLoading,
    isError,
    refetch,
  }
}
