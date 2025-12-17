import { ClassKey } from '@lms/core'
import { ClassAPI } from '@pages/api/class'
import { useInfiniteQuery } from 'react-query' // Import useInfiniteQuery

const useSelectClassSchedule = (id?: string, search_key?: string) => {
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
    getNextPageParam: (lastPage) => {
      return lastPage?.data.meta_data?.page_index <
        lastPage?.data.meta_data?.total_pages
        ? lastPage?.data.meta_data?.page_index + 1
        : undefined
    },
    enabled: true,
    refetchOnWindowFocus: false,
  })

  console.log('classschedule', data)
  return {
    classSchedule: data?.pages.flatMap((page) => page.data) ?? [], // Flatten subjects from all pages
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    refetch,
  }
}

export default useSelectClassSchedule
