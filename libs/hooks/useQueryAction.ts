import { useQueryClient } from 'react-query'

/**
 * Hàm dùng chung để refetch hoặc invalidate các queries trong React Query
 * @param queryKey: Key của query mà bạn muốn refetch hoặc invalidate
 * @param action: 'refetch' hoặc 'invalidate' - hành động cần thực hiện
 */
const useQueryAction = () => {
  const queryClient = useQueryClient()

  const queryAction = (
    queryKey: string | unknown[],
    action: 'refetch' | 'invalidate',
  ) => {
    if (action === 'refetch') {
      queryClient.refetchQueries(queryKey) // Gọi lại query ngay lập tức
    } else if (action === 'invalidate') {
      queryClient.invalidateQueries(queryKey) // Đánh dấu query là stale
    }
  }

  return queryAction
}

export default useQueryAction
