import { useFeature } from '@lms/contexts'
import { showPopupActivatedCourse } from '@lms/contexts/redux/slice/Popup/ActivatedCourse'
import { ApiError, ClassKey } from '@lms/core'
import { extractNotActivatedData } from '@lms/utils'
import { useInfiniteQuery } from 'react-query'; // Import useInfiniteQuery

const useSelectClassSchedule = (
  id?: string,
  search_key?: string,
  enabled = false,
) => {
  const { dispatch } = useFeature()
  const { classApi } = useFeature()
  const fetchClasses = async (
    page_index: number,
    page_size: number,
    id?: string,
  ) => {
    const res = await classApi.getClassSchedule?.(
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
    onError: (error: ApiError) => {
      const data = extractNotActivatedData(error)
      if (data) {
        dispatch?.(showPopupActivatedCourse(data))
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
