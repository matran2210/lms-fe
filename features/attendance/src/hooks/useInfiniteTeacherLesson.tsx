import { useFeature } from '@lms/contexts'
import { debounce } from 'lodash'
import { useState } from 'react'
import { useInfiniteQuery } from 'react-query'; // Import useInfiniteQuery
const PAGE_SIZE = 20
const useInfiniteTeacherLesson = (enabled = true, queryParams?: { class_ids?: string[], fromDate?: string; toDate?: string }) => {
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const { classApi } = useFeature()
  const debounceSearch = debounce((e: string) => {
    setSearchText(e)
  }, 350)

  const fetchTeacherSchedule = async (
    page_index: number,
    page_size: number,
    search?: string,
    queryParams?: { class_ids?: string[], fromDate?: string; toDate?: string }
  ) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await classApi.getTeacherLearningSchedule({
        page_index: page_index,
        page_size: page_size,
        ...queryParams,
        search,
      })
      return res
    } catch (error) {
      throw error
    }
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isSuccess, refetch } =
    useInfiniteQuery({
      queryKey: ['getStudentLearningSchedule', searchText, JSON.stringify(queryParams)], // Query key
      queryFn: ({ pageParam = 1 }) => {
        return fetchTeacherSchedule(pageParam, PAGE_SIZE, searchText, queryParams)
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.success) {
          return lastPage.data.metadata.page_index < lastPage.data.metadata.total_pages
            ? lastPage.data.metadata.page_index + 1
            : false
        }
      },
      enabled: enabled,
      refetchOnWindowFocus: false,
    })

  return {
    data: data?.pages.flatMap((page) => page?.data?.data), // Flatten subjects from all pages
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    refetch,
    debounceSearch,
  }
}

export default useInfiniteTeacherLesson
