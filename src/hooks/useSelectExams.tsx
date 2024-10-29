import { useInfiniteQuery } from 'react-query'
import { ClassAPI } from 'src/pages/api/class'
import { ClassKey } from 'src/pages/api/queryKey'

const useSelectExams = (courseId: string) => {
  const DEFAULT_PAGESIZE = 10
  const DEFAULT_PAGEINDEX = 1
  const getExams = async () => {
    const res = await ClassAPI.getExams(courseId, {
      page_index: DEFAULT_PAGEINDEX,
      page_size: DEFAULT_PAGESIZE,
    })

    return res
  }
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [ClassKey.ExamList],
    queryFn: getExams,
    enabled: !!courseId,
    getNextPageParam: (lastPage) => {
      return lastPage?.metadata?.page_index < lastPage?.metadata?.total_pages
        ? lastPage?.metadata.page_index + 1
        : undefined
    },
    retry: false,
  })

  return { exams: data?.pages?.[0], hasNextPage, fetchNextPage }
}

export default useSelectExams
