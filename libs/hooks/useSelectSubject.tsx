import { useFeature } from '@lms/contexts';
import { CourseKey } from '@lms/core'
import { useInfiniteQuery } from 'react-query'; 

const useSelectSubject = (
  program_name?: string,
  enabled = false,
) => {
  const { courseActivationAPI } = useFeature()
  const fetchClasses = async (
    program_name?: string,
  ) => {
    const res = await courseActivationAPI.getSubjectByProgram(
    program_name
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
    queryKey: [CourseKey.SubjetcList, program_name],
    queryFn: () => {
      return fetchClasses(program_name)
    },
    enabled: enabled,
  })

  return {
    data: data?.pages.flatMap((page) => page.data) ?? [],
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    refetch,
  }
}

export default useSelectSubject
