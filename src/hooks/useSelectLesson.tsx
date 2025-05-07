import { MyRequestAPI } from '@pages/api/my-request'
import { useEffect } from 'react'
import { useInfiniteQuery } from 'react-query' // Import useInfiniteQuery

const useLesson = (teacher_id: string, class_id: string) => {
  const fetchLesson = async (
    page_index: number,
    page_size: number,
    teacher_id: string,
    class_id: string,
  ) => {
    const res = await MyRequestAPI.getLesson(
      page_index,
      page_size,
      teacher_id,
      class_id,
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
    // Query key
    queryFn: ({ pageParam = 1 }) => {
      return fetchLesson(pageParam, 10, teacher_id, class_id) // Fetch with pageParam and a fixed page size
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.data.meta_data?.page_index <
        lastPage?.data.meta_data?.total_pages
        ? lastPage?.data.meta_data?.page_index + 1
        : undefined
    },
    enabled: Boolean(teacher_id && class_id),
    refetchOnWindowFocus: false,
  })
  useEffect(() => {
    // This will manually trigger a refetch once the component is mounted
    if (teacher_id && class_id) {
      refetch()
    }
  }, [teacher_id, class_id, refetch])
  return {
    lessons: data?.pages?.flatMap((page) => page?.data?.schedules) ?? [], // Flatten subjects from all pages
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    refetch,
  }
}

export default useLesson
