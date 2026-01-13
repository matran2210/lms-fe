import { MyRequestAPI } from 'src/api/my-request'
import { useInfiniteQuery } from 'react-query' // Import useInfiniteQuery

const useSelectClassCode = (teacher_id?: string) => {
  const fetchClasses = async (
    page_index: number,
    page_size: number,
    teacher_id?: string,
  ) => {
    const res = await MyRequestAPI.getClass(page_index, page_size, teacher_id)
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
      return fetchClasses(pageParam, 10, teacher_id) // Fetch with pageParam and a fixed page size
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
  return {
    classes: data?.pages.flatMap((page) => page.data.classes) ?? [], // Flatten subjects from all pages
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    refetch,
  }
}

export default useSelectClassCode
