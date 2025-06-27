import { useInfiniteQuery } from 'react-query'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from 'src/constants'
import { ClassAPI } from 'src/pages/api/class'
import { ClassKey } from 'src/pages/api/queryKey'

const useSelectExams = (courseId: string | undefined) => {
  const getExams = async ({ pageParam = DEFAULT_PAGE_NUMBER }) => {
    if (!courseId) return undefined // Không gọi nếu chưa có courseId
    const res = await ClassAPI.getExams(courseId, {
      page_index: pageParam,
      page_size: DEFAULT_PAGE_SIZE,
    })
    return res
  }

  const { data, hasNextPage, fetchNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: [ClassKey.ExamList, courseId],
      queryFn: getExams,
      enabled: !!courseId, // Vẫn cần, để ngăn không khởi động truy vấn
      getNextPageParam: (lastPage) => {
        if (!lastPage) return undefined
        return lastPage?.metadata?.page_index < lastPage?.metadata?.total_pages
          ? lastPage?.metadata.page_index + 1
          : undefined
      },
      refetchOnWindowFocus: false,
      retry: false,
    })

  return {
    exams: data?.pages?.[0],
    hasNextPage,
    fetchNextPage,
    isLoading,
    refetch,
  }
}

export default useSelectExams
