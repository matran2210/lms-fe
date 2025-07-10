import { CoursesAPI } from 'src/pages/api/courses'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { ISection } from 'src/type'
import { DEFAULT_PAGE_SIZE } from 'src/constants'

export const useSectionData = (
  sectionId: string | null,
  type: 'CHAPTER' | 'UNIT' | 'ACTIVITY',
  pageSize: number = DEFAULT_PAGE_SIZE,
) => {
  const router = useRouter()
  const classId = (router.query.courseId || router.query.id) as string

  const queryEnabled = Boolean(sectionId && type && classId)

  const { data, isLoading, isError, refetch } = useQuery<ISection[]>(
    ['sections', sectionId, type, classId],
    async () => {
      const res = await CoursesAPI.getCourseSubsectionList(
        pageSize,
        type,
        sectionId!,
        classId,
      )
      return res?.data?.sections?.reverse() || []
    },
    {
      enabled: queryEnabled,
      retry: false,
    },
  )

  return {
    sections: data ?? [],
    isLoading,
    isError,
    refetch,
  }
}
