import { ClassKey } from '@lms/core'
import { ClassAPI } from 'src/api/class'
import { useInfiniteQuery } from 'react-query' // Import useInfiniteQuery
import { handleCheckIsNotActivated } from '@lms/utils'
import { useFeature } from '@lms/contexts'
import { showPopupActivatedCourse } from '@lms/contexts/redux/slice/Popup/ActivatedCourse'


const useSelectClassSchedule = (
  id?: string,
  search_key?: string,
  enabled = false,
) => {
  const { dispatch } = useFeature()
  const fetchClasses = async (
    page_index: number,
    page_size: number,
    id?: string,
  ) => {
    const res = await ClassAPI.getClassSchedule(
      id as string,
      page_index,
      page_size,
      search_key,
    )
    return res
  }
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    refetch,
  } = useInfiniteQuery({
    queryKey: [ClassKey.ClassSchedule, id, search_key],
    queryFn: ({ pageParam = 1 }) => {
      return fetchClasses(pageParam, 10, id) // Fetch with pageParam and a fixed page size
    },
    onError: (error: any) => {
      console.log('Error fetching class schedule:', error)
      const errResponse = error?.response?.data?.error
      const isNotActivated = handleCheckIsNotActivated(errResponse?.code)
      if (isNotActivated) {
        dispatch?.(
          showPopupActivatedCourse({
            timeActive: errResponse?.replacements?.FLEXIBLE_DAYS,
            classId: '123213',
            courseType: errResponse?.replacements?.COURSE_TYPE,
          }),
        )
      }
    },
    getNextPageParam: (lastPage) => {
      const { page_index, total_pages } = lastPage.metadata
      return page_index < total_pages ? page_index + 1 : undefined
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  })

  return {
    classSchedule: data?.pages.flatMap((page) => page.data) ?? [],
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    refetch,
  }
}

export default useSelectClassSchedule
