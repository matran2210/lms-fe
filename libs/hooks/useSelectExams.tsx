import { useInfiniteQuery } from 'react-query'
import { DEFAULT_PAGE_NUMBER } from '@lms/core'
import { ExaminationsResponse } from '@lms/contexts';

const useSelectExams = ({ classKey, courseId, api}: {
  classKey: string;
  courseId: string | undefined;
  api: {
    getExams: (id: string, params: {
    page_index: number;
    page_size: number;
}) => Promise<ExaminationsResponse>
  }
}) => {
  const getExams = async ({ pageParam = DEFAULT_PAGE_NUMBER }) => {
    if (!courseId) return undefined // Không gọi nếu chưa có courseId
    const res = await api.getExams(courseId, {
      page_index: pageParam,
      page_size: 20,
    })
    return res
  }

  const { data, hasNextPage, fetchNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: [classKey, courseId],
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
